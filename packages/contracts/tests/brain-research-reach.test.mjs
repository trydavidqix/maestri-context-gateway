import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const brainRequest = {
  request_id: 'request-1', project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1',
  operation: 'brain_context', input: { query: 'current task context' },
};
const brainResponse = {
  request_id: 'request-1', project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1',
  status: 'OK', source: 'nexus.brain', provenance: { task_id: 'task-17' },
  coverage: 'FULL', trust_level: 'VERIFIED',
};
const researchRequest = {
  research_id: 'research-1', project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1',
  query: 'Nexus release notes', time_window: {}, source_budget: {},
  limits: { max_queries: 3, max_providers: 2, max_results_per_provider: 5, max_browser_escalations: 1, max_wall_time_seconds: 30 },
  budget: {},
};
const researchResult = {
  run_id: 'run-3', project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1', status: 'PARTIAL',
  evidence_ids: ['evidence-1'], warnings: ['One provider timed out'],
};
const reachRequest = {
  project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1',
  capability: 'web.search', input: { query: 'Nexus release notes' }, policy: {},
};
const reachOutcome = {
  project_id: 'nexus-brain', task_id: 'task-17', agent_id: 'agent-codex-1',
  status: 'OK', provider: 'search-api', capability: 'web.search', output: { results: [] }, evidence_ids: ['evidence-1'],
};

test('validates provider-neutral Brain requests and evidence-bearing responses', () => {
  assert.equal(validateContract('brain-request', brainRequest).valid, true);
  assert.equal(validateContract('brain-response', brainResponse).valid, true);
  const unscoped = validateContract('brain-request', { ...brainRequest, agent_id: '' });
  assert.equal(unscoped.valid, false);
});

test('validates bounded Research requests and typed results', () => {
  assert.equal(validateContract('research-request', researchRequest).valid, true);
  assert.equal(validateContract('research-result', researchResult).valid, true);
  const unbounded = validateContract('research-request', { ...researchRequest, limits: { ...researchRequest.limits, max_queries: -1 } });
  assert.equal(unbounded.valid, false);
});

test('validates Reach request policy and only known outcome states', () => {
  assert.equal(validateContract('reach-request', reachRequest).valid, true);
  assert.equal(validateContract('reach-outcome', reachOutcome).valid, true);
  const unknownStatus = validateContract('reach-outcome', { ...reachOutcome, status: 'STEALTH_ESCALATION' });
  assert.equal(unknownStatus.valid, false);
});
