import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const command = isWindows ? (process.env.ComSpec ?? "cmd.exe") : "pnpm";
const args = isWindows
  ? ["/d", "/s", "/c", "pnpm --filter @maestri/local-runtime mcp:stdio"]
  : ["--filter", "@maestri/local-runtime", "mcp:stdio"];
const child = spawn(command, args, {
  cwd: workspaceRoot,
  env: { ...process.env, MAESTRI_RUNTIME_WORKSPACE_ROOT: workspaceRoot },
  shell: false,
  stdio: "inherit",
});

child.once("error", (error) => {
  process.stderr.write(`local_runtime_start_failed: ${error.code ?? "unknown"}\n`);
  process.exitCode = 1;
});
child.once("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
