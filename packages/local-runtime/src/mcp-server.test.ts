import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { describe, expect, it } from "vitest";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const serverPath = join(packageRoot, "src", "mcp-server.ts");

async function connect(root: string): Promise<{ client: Client; transport: StdioClientTransport }> {
  const env = Object.fromEntries(Object.entries({
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    WINDIR: process.env.WINDIR,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP,
    MAESTRI_RUNTIME_WORKSPACE_ROOT: root,
  }).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--import", "tsx", serverPath],
    cwd: packageRoot,
    env,
  });
  const client = new Client({ name: "local-runtime-test", version: "1.0.0" });
  await client.connect(transport);
  return { client, transport };
}

describe("Local Runtime MCP read-only batch tool", () => {
  it("exposes one MCP tool and executes a bounded batch without leaking paths", async () => {
    const root = await mkdtemp(join(tmpdir(), "mcg-mcp-readonly-"));
    const outside = await mkdtemp(join(tmpdir(), "mcg-mcp-outside-"));
    const cleanup = async () => {
      await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
      await rm(outside, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    };
    await writeFile(join(root, "notes.md"), "safe note content");
    await writeFile(join(outside, "private.txt"), "outside-secret-marker");
    let client: Client | undefined;
    try {
      ({ client } = await connect(root));
    } catch (error) {
      await cleanup();
      throw error;
    }
    try {
      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name)).toEqual(["mcg_read_batch"]);
      expect(tools[0]?.description).toContain("read-only");

      const result = await client.callTool({
        name: "mcg_read_batch",
        arguments: {
          operations: [
            { id: "read-note", kind: "read", path: "notes.md" },
            { id: "search-note", kind: "search", query: "safe note" },
            { id: "outside", kind: "read", path: join(relative(root, outside), "private.txt") },
          ],
        },
      });
      expect(result.isError).not.toBe(true);
      const text = result.content.find((block) => block.type === "text");
      expect(text?.type).toBe("text");
      if (text?.type !== "text") throw new Error("mcp_tool_text_result_missing");
      const payload = JSON.parse(text.text) as { status: string; results: Array<{ id: string; status: string; errorCode?: string; value?: unknown }> };
      expect(payload.status).toBe("partial");
      expect(payload.results.map((item) => item.id)).toEqual(["read-note", "search-note", "outside"]);
      expect(payload.results[0]).toMatchObject({ status: "succeeded", value: { value: "safe note content" } });
      expect(payload.results[2]).toMatchObject({ status: "failed", errorCode: "runtime_path_denied" });
      expect(text.text).not.toContain(root);
      expect(text.text).not.toContain("outside-secret-marker");
    } finally {
      await client.close();
      await cleanup();
    }
  });

  it("rejects write-like and arbitrary-command arguments at the MCP schema boundary", async () => {
    const root = await mkdtemp(join(tmpdir(), "mcg-mcp-schema-"));
    let client: Client | undefined;
    try {
      ({ client } = await connect(root));
    } catch (error) {
      await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
      throw error;
    }
    try {
      const result = await client.callTool({
        name: "mcg_read_batch",
        arguments: { operations: [{ id: "bad", kind: "read", path: "safe.txt", command: "remove" }] },
      });
      const rootCommandResult = await client.callTool({
        name: "mcg_read_batch",
        arguments: { operations: [{ id: "read", kind: "read", path: "safe.txt" }], command: "remove" },
      });
      expect(result.isError).toBe(true);
      expect(rootCommandResult.isError).toBe(true);
      expect(JSON.stringify(result)).not.toContain(root);
      expect(JSON.stringify(rootCommandResult)).not.toContain(root);
    } finally {
      await client.close();
      await rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  });
});
