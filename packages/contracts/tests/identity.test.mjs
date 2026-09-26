import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const identity = {
  project_id: 'nexus-brain',
  task_id: 'task-17',
  agent_id: 'agent-codex-1',
  session_id: 'session-4',
  trace_id: 'trace-83',
};

test('accepts identity scoped to project, task, and agent', () => {
  const result = validateContract('identity', identity);

  assert.equal(result.valid, true, result.errors.join(', '));
  assert.equal(result.schema_id, 'nexus.identity.v1');
});

test('rejects identity without project scope', () => {
  const { project_id: _projectId, ...unscopedIdentity } = identity;

  const result = validateContract('identity', unscopedIdentity);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.project_id: required'));
});

test('rejects identity without task scope', () => {
  const { task_id: _taskId, ...unscopedIdentity } = identity;

  const result = validateContract('identity', unscopedIdentity);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.task_id: required'));
});

test('rejects identity without agent scope', () => {
  const { agent_id: _agentId, ...unscopedIdentity } = identity;

  const result = validateContract('identity', unscopedIdentity);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.agent_id: required'));
});
