import { open, readFile, readdir, realpath, stat } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { createConnection } from "node:net";
import { isAbsolute, join, relative, resolve } from "node:path";
import type { RuntimeCommand, RuntimeCorrelation } from "./contracts.js";
import { redactRuntimeText, SafeCommandRunner } from "./command-runner.js";

export interface ExecutorResult<T> {
  capabilityId: string;
  risk: "R0";
  deterministic: true;
  value: T;
}

export type ReadOnlyBatchOperation =
  | { id: string; kind: "read"; path: string }
  | { id: string; kind: "read-if-changed"; path: string; expectedSha256?: string }
  | { id: string; kind: "search"; query: string }
  | { id: string; kind: "git-status"; correlation: RuntimeCorrelation }
  | { id: string; kind: "git-diff"; correlation: RuntimeCorrelation }
  | { id: string; kind: "git-diff-if-changed"; correlation: RuntimeCorrelation; expectedSha256?: string }
  | { id: string; kind: "git-log"; correlation: RuntimeCorrelation; count?: number }
  | { id: string; kind: "read-log"; path: string; maxLines?: number }
  | { id: string; kind: "service-health"; url: string; timeoutMs?: number }
  | { id: string; kind: "port-check"; host: string; port: number; timeoutMs?: number };

export type ReadOnlyBatchItem =
  | { id: string; status: "succeeded"; value: ExecutorResult<unknown>; contentBytes: number }
  | { id: string; status: "failed"; errorCode: string }
  | { id: string; status: "omitted"; errorCode: "batch_output_budget_exceeded"; contentBytes: number };

export interface ReadOnlyBatchResult {
  batchId: string;
  status: "succeeded" | "partial" | "failed";
  total: number;
  succeeded: number;
  failed: number;
  omitted: number;
  outputBytes: number;
  maxOutputBytes: number;
  durationMs: number;
  results: readonly ReadOnlyBatchItem[];
  source: "runtime.read-only-batch";
  measurementType: "exact";
}

const MAX_BATCH_OPERATIONS = 20;
const DEFAULT_BATCH_OUTPUT_BYTES = 64_000;
const MAX_BATCH_OUTPUT_BYTES = 256_000;
const DEFAULT_BATCH_CONCURRENCY = 4;
const MAX_BATCH_CONCURRENCY = 8;
const MAX_BATCH_FIELD_LENGTH = 4_096;
const MAX_BATCH_TIMEOUT_MS = 10_000;

const BATCH_FIELDS: Record<ReadOnlyBatchOperation["kind"], readonly string[]> = {
  read: ["id", "kind", "path"],
  "read-if-changed": ["id", "kind", "path", "expectedSha256"],
  search: ["id", "kind", "query"],
  "git-status": ["id", "kind", "correlation"],
  "git-diff": ["id", "kind", "correlation"],
  "git-diff-if-changed": ["id", "kind", "correlation", "expectedSha256"],
  "git-log": ["id", "kind", "correlation", "count"],
  "read-log": ["id", "kind", "path", "maxLines"],
  "service-health": ["id", "kind", "url", "timeoutMs"],
  "port-check": ["id", "kind", "host", "port", "timeoutMs"],
};

function batchErrorCode(error: unknown): string {
  if (error && typeof error === "object" && "code" in error && typeof error.code === "string" && /^[a-z0-9_]{1,80}$/i.test(error.code)) return error.code;
  if (error instanceof Error) {
    const code = error.message.split(":", 1)[0];
    if (/^runtime_[a-z0-9_]{1,72}$/i.test(code)) return code;
  }
  return "read_operation_failed";
}

function sanitizeBatchValue<T>(value: T, key = ""): T {
  if (typeof value === "string") return (/(token|secret|password|passwd|api[_-]?key|authorization|cookie)/i.test(key) ? "[REDACTED]" : redactRuntimeText(value)) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeBatchValue(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, sanitizeBatchValue(item, name)])) as T;
  }
  return value;
}

function assertBatchOperations(value: readonly ReadOnlyBatchOperation[]): void {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_BATCH_OPERATIONS) throw new Error("runtime_batch_size_invalid");
  const ids = new Set<string>();
  for (const operation of value) {
    if (!operation || typeof operation !== "object" || !Object.hasOwn(BATCH_FIELDS, operation.kind)) throw new Error("runtime_batch_operation_invalid");
    const fields = BATCH_FIELDS[operation.kind as keyof typeof BATCH_FIELDS];
    if (Object.keys(operation).some((field) => !fields.includes(field))) throw new Error("runtime_batch_operation_invalid");
    if (typeof operation.id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(operation.id)) throw new Error("runtime_batch_operation_invalid");
    if (ids.has(operation.id)) throw new Error("runtime_batch_duplicate_id");
    ids.add(operation.id);
    const validText = (text: unknown, maxLength = MAX_BATCH_FIELD_LENGTH): text is string => typeof text === "string" && text.length > 0 && text.length <= maxLength;
    const validTimeout = (timeout: unknown): boolean => timeout === undefined || (Number.isInteger(timeout) && Number(timeout) >= 1 && Number(timeout) <= MAX_BATCH_TIMEOUT_MS);
    if ("path" in operation && !validText(operation.path)) throw new Error("runtime_batch_operation_invalid");
    if ("expectedSha256" in operation && (typeof operation.expectedSha256 !== "string" || !/^[a-f0-9]{64}$/i.test(operation.expectedSha256))) throw new Error("runtime_batch_operation_invalid");
    if ("query" in operation && !validText(operation.query, 1_000)) throw new Error("runtime_batch_operation_invalid");
    if ("url" in operation && (!validText(operation.url, 2_048) || !/^https?:\/\//i.test(operation.url))) throw new Error("runtime_batch_operation_invalid");
    if ("host" in operation && !validText(operation.host, 253)) throw new Error("runtime_batch_operation_invalid");
    if ("port" in operation && (!Number.isInteger(operation.port) || operation.port < 1 || operation.port > 65_535)) throw new Error("runtime_batch_operation_invalid");
    if ("timeoutMs" in operation && !validTimeout(operation.timeoutMs)) throw new Error("runtime_batch_operation_invalid");
    if ("count" in operation && (!Number.isInteger(operation.count) || Number(operation.count) < 1 || Number(operation.count) > 100)) throw new Error("runtime_batch_operation_invalid");
    if ("maxLines" in operation && (!Number.isInteger(operation.maxLines) || Number(operation.maxLines) < 1 || Number(operation.maxLines) > 2_000)) throw new Error("runtime_batch_operation_invalid");
    if ("correlation" in operation) {
      const correlation = operation.correlation as unknown;
      const allowedCorrelationFields = ["organizationId", "traceId", "sessionId", "taskId", "jobId", "stepId"];
      if (!correlation || typeof correlation !== "object" || Array.isArray(correlation)) throw new Error("runtime_batch_operation_invalid");
      const entries = Object.entries(correlation);
      if (entries.some(([key, item]) => !allowedCorrelationFields.includes(key) || !validText(item, 256))) throw new Error("runtime_batch_operation_invalid");
      if (!validText(Reflect.get(correlation, "organizationId"), 256) || !validText(Reflect.get(correlation, "traceId"), 256)) throw new Error("runtime_batch_operation_invalid");
    }
  }
}

export interface ReadExecutorOptions {
  workspaceRoot: string;
  commandRunner: SafeCommandRunner;
  gitExecutable?: string;
  maxFileBytes?: number;
  maxSearchResults?: number;
}

function isContained(root: string, child: string): boolean {
  const rel = relative(root, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

export class ReadOnlyLocalExecutor {
  private readonly gitExecutable: string;
  private readonly maxFileBytes: number;
  private readonly maxSearchResults: number;

  constructor(private readonly options: ReadExecutorOptions) {
    this.gitExecutable = options.gitExecutable ?? "git";
    this.maxFileBytes = options.maxFileBytes ?? 512_000;
    this.maxSearchResults = options.maxSearchResults ?? 100;
  }

  async read(path: string): Promise<ExecutorResult<string>> {
    const file = await this.resolveAllowed(path);
    const info = await stat(file);
    if (!info.isFile()) throw new Error("runtime_not_file");
    if (info.size > this.maxFileBytes) throw new Error("runtime_file_too_large");
    return this.result("fs.read", await readFile(file, "utf8"));
  }

  private async readIfChanged(path: string, expectedSha256?: string): Promise<ExecutorResult<{ sha256: string; unchanged: boolean; content?: string }>> {
    const root = await realpath(this.options.workspaceRoot);
    const file = await this.resolveAllowed(path);
    const handle = await open(file, "r");
    try {
      const opened = await handle.stat();
      if (!opened.isFile()) throw new Error("runtime_not_file");
      const readLimit = Math.min(this.maxFileBytes, MAX_BATCH_OUTPUT_BYTES);
      if (opened.size > readLimit) throw new Error("runtime_file_too_large");

      const currentPath = await realpath(file);
      if (!isContained(root, currentPath)) throw new Error("runtime_path_denied");
      const current = await stat(currentPath);
      if (opened.dev !== current.dev || opened.ino !== current.ino) throw new Error("runtime_path_changed");

      const buffer = Buffer.alloc(readLimit + 1);
      let bytesRead = 0;
      while (bytesRead < buffer.byteLength) {
        const next = await handle.read(buffer, bytesRead, buffer.byteLength - bytesRead, bytesRead);
        if (next.bytesRead === 0) break;
        bytesRead += next.bytesRead;
      }
      const afterRead = await handle.stat();
      if (bytesRead > readLimit || afterRead.size > readLimit) throw new Error("runtime_file_too_large");
      const content = buffer.subarray(0, bytesRead);
      const sha256 = createHash("sha256").update(content).digest("hex");
      const unchanged = expectedSha256 === sha256;
      return this.result("fs.read.digest", {
        sha256,
        unchanged,
        ...(unchanged ? {} : { content: content.toString("utf8") }),
      });
    } finally {
      await handle.close();
    }
  }

  async search(query: string): Promise<ExecutorResult<readonly string[]>> {
    if (!query) throw new Error("runtime_search_query_required");
    const root = await realpath(this.options.workspaceRoot);
    const matches: string[] = [];
    const walk = async (dir: string): Promise<void> => {
      if (matches.length >= this.maxSearchResults) return;
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (matches.length >= this.maxSearchResults) break;
        if (entry.name === ".git" || entry.name === "node_modules") continue;
        const path = join(dir, entry.name);
        if (entry.isDirectory()) { await walk(path); continue; }
        if (!entry.isFile()) continue;
        const info = await stat(path);
        if (info.size > this.maxFileBytes) continue;
        let text: string;
        try { text = await readFile(path, "utf8"); } catch { continue; }
        if (text.includes(query)) matches.push(relative(root, path).replaceAll('\\', '/'));
      }
    };
    await walk(root);
    return this.result("fs.search", matches);
  }

  async gitStatus(correlation: RuntimeCorrelation): Promise<ExecutorResult<string>> {
    return this.git("git.status", correlation, ["status", "--short", "--branch"]);
  }

  async gitDiff(correlation: RuntimeCorrelation): Promise<ExecutorResult<string>> {
    return this.git("git.diff", correlation, ["diff", "--no-ext-diff", "--no-textconv"]);
  }

  private async gitDiffIfChanged(correlation: RuntimeCorrelation, expectedSha256?: string): Promise<ExecutorResult<{ sha256: string; unchanged: boolean; content?: string }>> {
    const diff = (await this.git("git.diff", correlation, ["diff", "HEAD", "--no-ext-diff", "--no-textconv"])).value;
    const sha256 = createHash("sha256").update(diff, "utf8").digest("hex");
    const unchanged = expectedSha256?.toLowerCase() === sha256;
    return this.result("git.diff.digest", { sha256, unchanged, ...(unchanged ? {} : { content: diff }) });
  }

  async gitLog(correlation: RuntimeCorrelation, count = 20): Promise<ExecutorResult<string>> {
    const safeCount = Math.max(1, Math.min(Math.trunc(count), 100));
    return this.git("git.log", correlation, ["log", `-${safeCount}`, "--oneline", "--decorate"]);
  }

  async readLog(path: string, maxLines = 200): Promise<ExecutorResult<string>> {
    const value = (await this.read(path)).value;
    const lines = value.split(/\r?\n/);
    return this.result("logs.read", lines.slice(-Math.max(1, Math.min(maxLines, 2_000))).join("\n"));
  }

  async serviceHealth(url: string, timeoutMs = 3_000): Promise<ExecutorResult<{ ok: boolean; status: number | null }>> {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("runtime_health_protocol_denied");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(parsed, { method: "GET", signal: controller.signal, redirect: "error" });
      return this.result("service.health", { ok: response.ok, status: response.status });
    } catch {
      return this.result("service.health", { ok: false, status: null });
    } finally {
      clearTimeout(timer);
    }
  }

  async portCheck(host: string, port: number, timeoutMs = 1_000): Promise<ExecutorResult<boolean>> {
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("runtime_port_invalid");
    const open = await new Promise<boolean>((resolveResult) => {
      const socket = createConnection({ host, port });
      const done = (value: boolean) => { socket.destroy(); resolveResult(value); };
      socket.setTimeout(timeoutMs);
      socket.once("connect", () => done(true));
      socket.once("timeout", () => done(false));
      socket.once("error", () => done(false));
    });
    return this.result("port.check", open);
  }

  async batch(
    operations: readonly ReadOnlyBatchOperation[],
    { concurrency = DEFAULT_BATCH_CONCURRENCY, maxOutputBytes = DEFAULT_BATCH_OUTPUT_BYTES }: { concurrency?: number; maxOutputBytes?: number } = {},
  ): Promise<ReadOnlyBatchResult> {
    assertBatchOperations(operations);
    if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_BATCH_CONCURRENCY) throw new Error("runtime_batch_concurrency_invalid");
    if (!Number.isInteger(maxOutputBytes) || maxOutputBytes < 1 || maxOutputBytes > MAX_BATCH_OUTPUT_BYTES) throw new Error("runtime_batch_output_budget_invalid");

    const started = Date.now();
    const outcomes = new Array<{ id: string; value: ExecutorResult<unknown> } | { id: string; errorCode: string }>(operations.length);
    let cursor = 0;
    const execute = async (operation: ReadOnlyBatchOperation): Promise<ExecutorResult<unknown>> => {
      switch (operation.kind) {
        case "read": return this.read(operation.path);
        case "read-if-changed": return this.readIfChanged(operation.path, operation.expectedSha256);
        case "search": return this.search(operation.query);
        case "git-status": return this.gitStatus(operation.correlation);
        case "git-diff": return this.gitDiff(operation.correlation);
        case "git-diff-if-changed": return this.gitDiffIfChanged(operation.correlation, operation.expectedSha256);
        case "git-log": return this.gitLog(operation.correlation, operation.count);
        case "read-log": return this.readLog(operation.path, operation.maxLines);
        case "service-health": return this.serviceHealth(operation.url, operation.timeoutMs);
        case "port-check": return this.portCheck(operation.host, operation.port, operation.timeoutMs);
      }
    };
    const worker = async (): Promise<void> => {
      while (true) {
        const index = cursor++;
        if (index >= operations.length) return;
        const operation = operations[index];
        try { outcomes[index] = { id: operation.id, value: sanitizeBatchValue(await execute(operation)) }; }
        catch (error) { outcomes[index] = { id: operation.id, errorCode: batchErrorCode(error) }; }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, operations.length) }, () => worker()));

    let remainingBytes = maxOutputBytes;
    let outputBytes = 0;
    let succeeded = 0;
    let failed = 0;
    let omitted = 0;
    const results = outcomes.map((outcome): ReadOnlyBatchItem => {
      if ("errorCode" in outcome) {
        failed += 1;
        return { id: outcome.id, status: "failed", errorCode: outcome.errorCode };
      }
      const contentBytes = Buffer.byteLength(JSON.stringify(outcome.value.value), "utf8");
      if (contentBytes > remainingBytes) {
        omitted += 1;
        return { id: outcome.id, status: "omitted", errorCode: "batch_output_budget_exceeded", contentBytes };
      }
      remainingBytes -= contentBytes;
      outputBytes += contentBytes;
      succeeded += 1;
      return { id: outcome.id, status: "succeeded", value: outcome.value, contentBytes };
    });
    return {
      batchId: `read-batch-${randomUUID()}`,
      status: failed + omitted === operations.length ? "failed" : failed || omitted ? "partial" : "succeeded",
      total: operations.length,
      succeeded,
      failed,
      omitted,
      outputBytes,
      maxOutputBytes,
      durationMs: Math.max(0, Date.now() - started),
      results,
      source: "runtime.read-only-batch",
      measurementType: "exact",
    };
  }

  private async git(capabilityId: string, correlation: RuntimeCorrelation, args: readonly string[]): Promise<ExecutorResult<string>> {
    const cwd = await realpath(this.options.workspaceRoot);
    const command: RuntimeCommand = {
      id: crypto.randomUUID(),
      correlation,
      capabilityId,
      executable: this.gitExecutable,
      args,
      cwd,
      timeoutMs: 10_000,
      maxOutputBytes: 512_000,
      risk: "R0",
    };
    const output = await this.options.commandRunner.run(command);
    if (output.exitCode !== 0) throw new Error(`runtime_git_failed:${output.stderr}`);
    if (output.truncated) throw new Error("runtime_git_output_too_large");
    return this.result(capabilityId, output.stdout);
  }

  private async resolveAllowed(path: string): Promise<string> {
    const root = await realpath(this.options.workspaceRoot);
    const candidate = await realpath(resolve(root, path));
    if (!isContained(root, candidate)) throw new Error("runtime_path_denied");
    return candidate;
  }

  private result<T>(capabilityId: string, value: T): ExecutorResult<T> {
    return { capabilityId, risk: "R0", deterministic: true, value };
  }
}
