import { describe, expect, it } from "vitest";
import { JOB_EVENT_TYPES, JOB_STATUSES, type Job } from "@nexus-brain/contracts/job";
import { RUNTIME_PROTOCOL_VERSION, assertRuntimeCommand, type RuntimeCommand } from "@nexus-brain/contracts/runtime";

describe("shared TypeScript contracts", () => {
  it("keeps job and runtime protocol definitions importable from contracts", () => {
    const job: Job = {
      id: "job-1",
      organizationId: "org-1",
      kind: "test",
      payload: {},
      status: "queued",
      claimedBy: null,
      attempts: 0,
      evidence: [],
      createdAt: "2026-09-25T00:00:00.000Z",
      updatedAt: "2026-09-25T00:00:00.000Z",
    };
    const command: RuntimeCommand = {
      id: "command-1",
      correlation: { organizationId: "org-1", traceId: "trace-1" },
      capabilityId: "read-file",
      executable: "node",
      args: [],
      cwd: ".",
      timeoutMs: 1000,
      maxOutputBytes: 1024,
      risk: "R1",
    };

    expect(JOB_STATUSES).toContain(job.status);
    expect(JOB_EVENT_TYPES).toContain("job.queued");
    expect(RUNTIME_PROTOCOL_VERSION).toBe(1);
    expect(() => assertRuntimeCommand(command)).not.toThrow();
  });
});
