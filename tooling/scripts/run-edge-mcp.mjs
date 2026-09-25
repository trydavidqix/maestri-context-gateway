import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const edgeRoot = join(workspaceRoot, "apps", "edge");
const tsxCli = join(edgeRoot, "node_modules", "tsx", "dist", "cli.mjs");
const serverPath = join(edgeRoot, "src", "bridge", "mcp-server.ts");
const child = spawn(process.execPath, [tsxCli, serverPath], {
  cwd: workspaceRoot,
  env: { ...process.env, NEXUS_BRAIN_ROOT: workspaceRoot },
  shell: false,
  stdio: "inherit",
});

child.once("error", (error) => {
  process.stderr.write(`nexus_edge_start_failed: ${error.code ?? "unknown"}\n`);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
