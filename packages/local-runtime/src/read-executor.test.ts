import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SafeCommandRunner } from "./command-runner.js";
import { ReadOnlyLocalExecutor } from "./read-executor.js";

describe("ReadOnlyLocalExecutor", () => {
  it("reads and searches only inside its workspace", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-"));
    await mkdir(join(root, "src"));
    await writeFile(join(root, "src", "a.txt"), "needle");
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: ["git", "git.exe"] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    expect((await executor.read("src/a.txt")).value).toBe("needle");
    expect((await executor.search("needle")).value).toEqual(["src/a.txt"]);
    await expect(executor.read("../outside.txt")).rejects.toThrow();
  });

  it("marks read operations deterministic R0", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-"));
    await writeFile(join(root, "a.txt"), "ok");
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    expect(await executor.read("a.txt")).toMatchObject({ risk: "R0", deterministic: true });
  });

  it("rejects invalid ports", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-"));
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    await expect(executor.portCheck("127.0.0.1", 0)).rejects.toThrow("runtime_port_invalid");
  });

  it("runs bounded typed read-only operations as one ordered batch", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-batch-"));
    await writeFile(join(root, "a.txt"), "needle in evidence");
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    const result = await executor.batch([
      { id: "read-one", kind: "read", path: "a.txt" },
      { id: "search-one", kind: "search", query: "needle" },
      { id: "missing-file", kind: "read", path: "../outside.txt" },
    ]);

    expect(result).toMatchObject({ status: "partial", total: 3, succeeded: 2, failed: 1, source: "runtime.read-only-batch" });
    expect(result.results.map((item) => item.id)).toEqual(["read-one", "search-one", "missing-file"]);
    expect(result.results[0]).toMatchObject({ status: "succeeded", value: { risk: "R0", deterministic: true, value: "needle in evidence" } });
    expect(result.results[1]).toMatchObject({ status: "succeeded", value: { capabilityId: "fs.search", value: ["a.txt"] } });
    expect(result.results[2]).toMatchObject({ status: "failed", errorCode: "ENOENT" });
    expect(JSON.stringify(result)).not.toContain("outside.txt");
  });

  it("rejects duplicate IDs and batches larger than the hard cap before running work", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-batch-limit-"));
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    await expect(executor.batch([
      { id: "duplicate", kind: "read", path: "a.txt" },
      { id: "duplicate", kind: "read", path: "a.txt" },
    ])).rejects.toThrow("runtime_batch_duplicate_id");
    await expect(executor.batch(Array.from({ length: 21 }, (_, index) => ({ id: `read-${index}`, kind: "read" as const, path: "a.txt" }))))
      .rejects.toThrow("runtime_batch_size_invalid");
    await expect(executor.batch([{ id: "read-command", kind: "read", path: "a.txt", command: "remove" } as never]))
      .rejects.toThrow("runtime_batch_operation_invalid");
  });

  it("rejects malformed fields and unbounded network timeouts before starting the batch", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-batch-fields-"));
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    await expect(executor.batch([{ id: "empty-query", kind: "search", query: "" }]))
      .rejects.toThrow("runtime_batch_operation_invalid");
    await expect(executor.batch([{ id: "bad-path", kind: "read", path: 42 } as never]))
      .rejects.toThrow("runtime_batch_operation_invalid");
    await expect(executor.batch([{ id: "slow-health", kind: "service-health", url: "http://127.0.0.1", timeoutMs: 60_000 }]))
      .rejects.toThrow("runtime_batch_operation_invalid");
    await expect(executor.batch([{ id: "slow-port", kind: "port-check", host: "127.0.0.1", port: 80, timeoutMs: 60_000 }]))
      .rejects.toThrow("runtime_batch_operation_invalid");
  });

  it("keeps combined returned content under the explicit byte budget", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-batch-budget-"));
    await writeFile(join(root, "large.txt"), "x".repeat(100));
    await writeFile(join(root, "small.txt"), "ok");
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    const result = await executor.batch([
      { id: "large", kind: "read", path: "large.txt" },
      { id: "small", kind: "read", path: "small.txt" },
    ], { maxOutputBytes: 6 });
    expect(result).toMatchObject({ status: "partial", maxOutputBytes: 6, outputBytes: 4, succeeded: 1, omitted: 1 });
    expect(result.results[0]).toMatchObject({ id: "large", status: "omitted", errorCode: "batch_output_budget_exceeded", contentBytes: 102 });
    expect(result.results[1]).toMatchObject({ id: "small", status: "succeeded", value: { value: "ok" } });
  });

  it("redacts recognizable credentials from batched file results", async () => {
    const root = await mkdtemp(join(tmpdir(), "lumenva-read-batch-redact-"));
    await writeFile(join(root, "settings.txt"), "api_key=very-private-material");
    const runner = new SafeCommandRunner({ workspaceRoots: [root], allowedExecutables: [] });
    const executor = new ReadOnlyLocalExecutor({ workspaceRoot: root, commandRunner: runner });
    const result = await executor.batch([{ id: "settings", kind: "read", path: "settings.txt" }]);
    expect(result.results[0]).toMatchObject({ status: "succeeded", value: { value: "api_key=[REDACTED]" } });
    expect(JSON.stringify(result)).not.toContain("very-private-material");
  });
});
