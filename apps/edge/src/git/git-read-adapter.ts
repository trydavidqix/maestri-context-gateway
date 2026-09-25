import { realpath } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { RuntimeCommand, RuntimeCorrelation } from "@nexus-brain/contracts/runtime";
import { SafeCommandRunner } from "../bridge/command-runner.js";

export interface GitReadAdapterOptions {
  workspaceRoot: string;
  commandRunner: SafeCommandRunner;
  executable?: string;
}

/** Read-only Git operations used by the Edge bridge. */
export class GitReadAdapter {
  private readonly executable: string;

  constructor(private readonly options: GitReadAdapterOptions) {
    this.executable = options.executable ?? "git";
  }

  status(correlation: RuntimeCorrelation): Promise<string> {
    return this.run("git.status", correlation, ["status", "--short", "--branch"]);
  }

  diff(correlation: RuntimeCorrelation): Promise<string> {
    return this.run("git.diff", correlation, ["diff", "--no-ext-diff", "--no-textconv"]);
  }

  diffFromHead(correlation: RuntimeCorrelation): Promise<string> {
    return this.run("git.diff", correlation, ["diff", "HEAD", "--no-ext-diff", "--no-textconv"]);
  }

  log(correlation: RuntimeCorrelation, count = 20): Promise<string> {
    const safeCount = Math.max(1, Math.min(Math.trunc(count), 100));
    return this.run("git.log", correlation, ["log", `-${safeCount}`, "--oneline", "--decorate"]);
  }

  private async run(capabilityId: string, correlation: RuntimeCorrelation, args: readonly string[]): Promise<string> {
    const cwd = await realpath(this.options.workspaceRoot);
    const command: RuntimeCommand = {
      id: randomUUID(),
      correlation,
      capabilityId,
      executable: this.executable,
      args,
      cwd,
      timeoutMs: 10_000,
      maxOutputBytes: 512_000,
      risk: "R0",
    };
    const output = await this.options.commandRunner.run(command);
    if (output.exitCode !== 0) throw new Error(`runtime_git_failed:${output.stderr}`);
    if (output.truncated) throw new Error("runtime_git_output_too_large");
    return output.stdout;
  }
}
