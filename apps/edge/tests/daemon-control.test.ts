import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { probeDaemon, startDaemonControl, stopDaemon } from "../src/daemon/daemon-control.mjs";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("MCG daemon control bridge", () => {
  it("reports offline without a control descriptor", async () => {
    const root = await mkdtemp(join(tmpdir(), "nexus-daemon-control-"));
    roots.push(root);
    expect(await probeDaemon(root)).toBe(false);
  });

  it("probes and gracefully stops only through its authenticated control endpoint", async () => {
    const root = await mkdtemp(join(tmpdir(), "nexus-daemon-control-"));
    roots.push(root);
    let stopped = false;
    const control = await startDaemonControl(root, async () => { stopped = true; });
    try {
      expect(await probeDaemon(root)).toBe(true);
      await stopDaemon(root);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(stopped).toBe(true);
    } finally {
      await control.close();
    }
  });
});
