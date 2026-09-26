import { describe, expect, it } from "vitest";
import { JOB_EVENT_TYPES, JOB_STATUSES, type Job } from "@nexus-brain/contracts/job";
import { RUNTIME_PROTOCOL_VERSION, assertRuntimeCommand, type RuntimeCommand } from "@nexus-brain/contracts/runtime";
import type { EngineeringPlan, NexusIdentity, NexusTask } from "@nexus-brain/contracts";

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
    const plan: EngineeringPlan = {
      task_id: "task-17",
      agent_id: "agent-codex-1",
      task_type: "FEATURE",
      risk_level: "R1",
      scope_size: "bounded",
      expected_files: ["packages/contracts/src/engineering/plan.ts"],
      expected_tests: ["packages/contracts/tests/engineering-plan.test.mjs"],
      contract_impact: ["nexus.engineering-plan.v1"],
      testability: "direct",
      execution_mode: "write",
      autonomy_level: "A2",
      skill_policy: { required: ["core-discipline"], optional: [], forbidden: [], loaded: ["core-discipline"], completed: [] },
      context_budget: { input_tokens: 4000 },
      tool_profile: ["engineering.default"],
      verification_gates: ["unit-tests"],
      delivery_policy: {},
    };
    const identity: NexusIdentity = {
      project_id: "nexus-brain",
      task_id: "task-17",
      agent_id: "agent-codex-1",
    };
    const task: NexusTask = {
      project_id: "nexus-brain",
      task_id: "task-17",
      objective: "Define canonical task contract",
      risk: "R1",
      complexity: "NORMAL",
      acceptance_criteria: ["Contract validates task scope and risk"],
    };
    // @ts-expect-error Risk is limited to R0–R4.
    const invalidRisk: EngineeringPlan["risk_level"] = "R5";

    expect(JOB_STATUSES).toContain(job.status);
    expect(JOB_EVENT_TYPES).toContain("job.queued");
    expect(RUNTIME_PROTOCOL_VERSION).toBe(1);
    expect(() => assertRuntimeCommand(command)).not.toThrow();
    expect(plan.agent_id).toBe("agent-codex-1");
    expect(identity.project_id).toBe("nexus-brain");
    expect(task.task_id).toBe("task-17");
  });
});
