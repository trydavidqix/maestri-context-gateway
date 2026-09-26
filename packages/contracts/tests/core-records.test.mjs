import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const memory = {
  memory_id: 'memory-1',
  scope: 'PROJECT',
  scope_id: 'nexus-brain',
  project_id: 'nexus-brain',
  status: 'OBSERVED',
  content: 'A memory candidate requires evidence before promotion.',
  evidence_ids: ['evidence-1'],
  provenance: { source: 'task-17' },
};

const evidence = {
  evidence_id: 'evidence-1',
  project_id: 'nexus-brain',
  run_id: 'run-3',
  source: 'https://example.test/article',
  provider: 'web.read',
  capability: 'web.read',
  fetched_at: '2026-09-26T12:00:00.000Z',
  trust_level: 'UNTRUSTED',
  provenance: { task_id: 'task-17' },
};

const permission = {
  permission_id: 'permission-5',
  project_id: 'nexus-brain',
  task_id: 'task-17',
  agent_id: 'agent-codex-1',
  capability: 'browser.navigate',
  actions: ['navigate'],
  risk_level: 'R1',
  state: 'APPROVED',
  expires_at: '2026-09-26T13:00:00.000Z',
  issued_by: 'policy-engine',
};

test('validates memory lifecycle and explicit scope', () => {
  assert.equal(validateContract('memory', memory).valid, true);
  const unscoped = validateContract('memory', { ...memory, scope_id: '' });
  assert.equal(unscoped.valid, false);
});

test('keeps external evidence untrusted and tied to project and run', () => {
  assert.equal(validateContract('evidence', evidence).valid, true);
  const trustedWebEvidence = validateContract('evidence', { ...evidence, trust_level: 'TRUSTED' });
  assert.equal(trustedWebEvidence.valid, false);
});

test('requires permission grants to carry project, task, and agent scope', () => {
  assert.equal(validateContract('permission', permission).valid, true);
  const { task_id: _taskId, ...unscopedPermission } = permission;
  const result = validateContract('permission', unscopedPermission);
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.task_id: required'));
});
