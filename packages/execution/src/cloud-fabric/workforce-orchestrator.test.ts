import { describe, expect, it } from 'vitest';
import { createMasterPlan } from './master-plan.js';
import { ResourceRouter } from './resource-router.js';
import { ModelRegistry } from './model-registry.js';
import { WorkforceOrchestrator } from './workforce-orchestrator.js';
import { InMemoryWorkforcePersistence } from './durable-stores.js';
import type { ExecutionPort, ExecutionResult, TaskContract } from './execution-port.js';

function executionPort(name: string, status: ExecutionResult['status'], received: TaskContract[]): ExecutionPort {
  return {
    name,
    async execute(contract) {
      received.push(contract);
      return { task_id: contract.task_id, provider: name, model: contract.preferred_model, status, summary: 'verified', files_changed: status === 'success' ? ['packages/core/file.ts'] : [], commands: [], tests: [{ name: 'unit', passed: true, report: '1 passed' }], evidence: ['artifact://test-report'], usage: { input_tokens: 12, cached_tokens: 3, output_tokens: 4, duration_ms: 20, cost_usd: 0, measurement_type: 'unavailable' } };
    },
    async resume() { throw new Error('not used'); },
    async cancel() { throw new Error('not used'); },
    async health() { return { ok: true, status: 'healthy' }; },
    async capabilities() { return ['execute', 'read_only']; },
    async usage() { return { input_tokens: 0, cached_tokens: 0, output_tokens: 0, duration_ms: 0, cost_usd: 0 }; },
    async quota() { return { provider: name, tokens_used: 0, cost_usd: 0, remaining_budget: 100, remaining_percent: 80, available: true }; },
    async checkQuota() { return this.quota(); },
  };
}

describe('WorkforceOrchestrator provider routing integration', () => {
  it('passes the selected model, enforces scope and persists distinct independent review evidence', async () => {
    const implementerCalls: TaskContract[] = [];
    const reviewerCalls: TaskContract[] = [];
    const codex = executionPort('codex', 'success', implementerCalls);
    const claude = executionPort('claude', 'success', reviewerCalls);
    const router = new ResourceRouter({ codex, claude, modelRegistry: new ModelRegistry([
      { id: 'codex-coding', provider: 'codex', model: 'configured-codex-model', tier: 2, capabilities: ['coding'], preferred_for: ['coding'], max_risk: 'R4', max_complexity: 'EXCLUSIVE', subscription_backed: true, gateway_backed: false, enabled: true, relative_cost: 2, relative_latency: 2, reliability: 0.95 },
      { id: 'claude-review', provider: 'claude', model: 'configured-review-model', tier: 1, capabilities: ['review'], preferred_for: ['review'], max_risk: 'R4', max_complexity: 'EXCLUSIVE', subscription_backed: true, gateway_backed: false, enabled: true, relative_cost: 2, relative_latency: 2, reliability: 0.95 },
    ]) });
    const persistence = new InMemoryWorkforcePersistence();
    const plan = createMasterPlan({ objective: 'Exercise provider selection', tasks: [{ task_id: 'task-1', objective: 'Implement within scope', capabilities: ['coding'], allowed_paths: ['packages/core'], risk: 'R1', acceptance_criteria: ['unit passes'] }] });

    const result = await new WorkforceOrchestrator(router, { resolve: provider => provider === 'codex' ? codex : provider === 'claude' ? claude : undefined }, undefined, persistence).runPlan(plan, 'base-sha');

    expect(result.completed).toEqual(['task-1']);
    expect(implementerCalls[0]?.preferred_provider).toBe('codex');
    expect(implementerCalls[0]?.preferred_model).toBe('configured-codex-model');
    expect(reviewerCalls).toHaveLength(1);
    expect(reviewerCalls[0]?.preferred_model).toBe('configured-review-model');
    expect(persistence.routingTraces.map(trace => trace.phase)).toEqual(['execute', 'verify']);
    expect(persistence.executions).toHaveLength(2);
    expect(persistence.digests).toHaveLength(1);
    expect(persistence.observations[0]?.reviewer_accepted).toBe(true);
  });

  it('blocks changes outside allowed paths before evidence can mark the task complete', async () => {
    const calls: TaskContract[] = [];
    const codex = executionPort('codex', 'success', calls);
    const outOfScope: ExecutionPort = { ...codex, async execute(contract) { calls.push(contract); return { task_id: contract.task_id, provider: 'codex', status: 'success', summary: 'changed another package', files_changed: ['packages/other/file.ts'], commands: [], tests: [{ passed: true, report: 'pass' }], evidence: ['artifact://test'] }; } };
    const plan = createMasterPlan({ objective: 'Enforce scope', tasks: [{ task_id: 'task-scope', objective: 'Stay in package', capabilities: ['coding'], allowed_paths: ['packages/core'], risk: 'R1', acceptance_criteria: [] }] });
    const router = new ResourceRouter({ codex: outOfScope, modelRegistry: new ModelRegistry([
      { id: 'codex-coding', provider: 'codex', model: 'configured-codex-model', tier: 2, capabilities: ['coding'], preferred_for: ['coding'], max_risk: 'R4', max_complexity: 'EXCLUSIVE', subscription_backed: true, gateway_backed: false, enabled: true, relative_cost: 2, relative_latency: 2, reliability: 0.95 },
    ]) });
    const result = await new WorkforceOrchestrator(router, { resolve: () => outOfScope }).runPlan(plan, 'base-sha');
    expect(result.completed).toEqual([]);
    expect(result.blocked).toEqual(['task-scope']);
    expect(result.results[0]?.execution?.error?.code).toBe('execution_scope_violation');
  });
});
