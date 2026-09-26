import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const registryEntry = {
  skill_id: 'tdd', purpose: 'Test-first changes', task_types: ['FEATURE', 'BUG'], risk_levels: ['R1', 'R2'],
  dependencies: ['core-discipline'], conflicts: [], precedence_owner: 'correctness',
  estimated_context_cost: 1800, version: '1.0.0', status: 'ACTIVE',
};
const skillSet = {
  task_id: 'task-17', agent_id: 'agent-codex-1', required: ['core-discipline'], optional: ['tdd'],
  forbidden: [], loaded: ['core-discipline', 'tdd'], completed: [], context_budget: { input_tokens: 2000 },
};
const skillEvent = {
  event_id: 'skill-event-1', task_id: 'task-17', agent_id: 'agent-codex-1',
  event_type: 'LOADED', skill_ids: ['tdd'], occurred_at: '2026-09-26T12:00:00.000Z',
};

test('validates compact Skill Registry metadata', () => {
  assert.equal(validateContract('skill-registry-entry', registryEntry).valid, true);
  const missingOwner = validateContract('skill-registry-entry', { ...registryEntry, precedence_owner: '' });
  assert.equal(missingOwner.valid, false);
  const injectedBody = validateContract('skill-registry-entry', { ...registryEntry, body: 'full skill instructions' });
  assert.equal(injectedBody.valid, false);
});

test('requires task and agent scope for each TaskSkillSet', () => {
  assert.equal(validateContract('task-skill-set', skillSet).valid, true);
  const unscopedSet = validateContract('task-skill-set', { ...skillSet, agent_id: '' });
  assert.equal(unscopedSet.valid, false);
  const fullCatalog = validateContract('task-skill-set', { ...skillSet, catalog: ['every-skill'] });
  assert.equal(fullCatalog.valid, false);
});

test('records skill load and compaction events by task and agent', () => {
  assert.equal(validateContract('skill-event', skillEvent).valid, true);
  const invalidEvent = validateContract('skill-event', { ...skillEvent, event_type: 'INJECT_FULL_CATALOG' });
  assert.equal(invalidEvent.valid, false);
});
