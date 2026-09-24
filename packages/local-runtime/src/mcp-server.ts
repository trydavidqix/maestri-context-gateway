import { realpath, stat } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { SafeCommandRunner } from "./command-runner.js";
import { ReadOnlyLocalExecutor, type ReadOnlyBatchOperation } from "./read-executor.js";

const operationId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/);
const readOperation = z.object({ id: operationId, kind: z.literal("read"), path: z.string().min(1).max(4_096) }).strict();
const readIfChangedOperation = z.object({
  id: operationId,
  kind: z.literal("read-if-changed"),
  path: z.string().min(1).max(4_096),
  expectedSha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
}).strict();
const searchOperation = z.object({ id: operationId, kind: z.literal("search"), query: z.string().min(1).max(1_000) }).strict();
const readLogOperation = z.object({
  id: operationId,
  kind: z.literal("read-log"),
  path: z.string().min(1).max(4_096),
  maxLines: z.number().int().min(1).max(2_000).optional(),
}).strict();

const mcpBatchInput = z.object({
  operations: z.array(z.discriminatedUnion("kind", [readOperation, readIfChangedOperation, searchOperation, readLogOperation])).min(1).max(20),
  concurrency: z.number().int().min(1).max(8).optional(),
  maxOutputBytes: z.number().int().min(1).max(256_000).optional(),
}).strict();

function safeErrorCode(error: unknown): string {
  const code = error instanceof Error ? error.message.split(":", 1)[0] : "";
  return /^runtime_[a-z0-9_]{1,72}$/i.test(code) ? code : "read_operation_failed";
}

export function createLocalRuntimeMcpServer(executor: ReadOnlyLocalExecutor): McpServer {
  const server = new McpServer({ name: "maestri-local-runtime", version: "0.1.0" });
  server.registerTool("mcg_read_batch", {
    description: "Run up to 20 bounded, read-only workspace inspections in one call. Supports file read/read-if-changed, search, and log read. Paths are restricted to the workspace root; no writes, arbitrary commands, or network operations are exposed.",
    inputSchema: mcpBatchInput,
  }, async ({ operations, concurrency, maxOutputBytes }) => {
    try {
      const result = await executor.batch(operations as ReadOnlyBatchOperation[], { concurrency, maxOutputBytes });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: safeErrorCode(error) }] };
    }
  });
  return server;
}

async function createExecutorFromEnvironment(): Promise<ReadOnlyLocalExecutor> {
  const configuredRoot = process.env.MAESTRI_RUNTIME_WORKSPACE_ROOT;
  if (!configuredRoot || !isAbsolute(configuredRoot)) throw new Error("runtime_workspace_root_required");
  const workspaceRoot = await realpath(configuredRoot);
  if (!(await stat(workspaceRoot)).isDirectory()) throw new Error("runtime_workspace_root_invalid");
  const commandRunner = new SafeCommandRunner({ workspaceRoots: [workspaceRoot], allowedExecutables: [] });
  return new ReadOnlyLocalExecutor({ workspaceRoot, commandRunner });
}

try {
  const executor = await createExecutorFromEnvironment();
  await serveStdio(() => createLocalRuntimeMcpServer(executor));
} catch (error) {
  console.error(safeErrorCode(error));
  process.exitCode = 1;
}
