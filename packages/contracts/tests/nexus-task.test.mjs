import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const task = {
  project_id: 'nexus-brain',
  task_id: 'task-17',
  objective: 'Define canonical task contract',
  risk: 'R1',
  complexity: 'NORMAL',
  acceptance_criteria: ['Contract validates task scope and risk'],
};

test('accepts task with project scope and explicit acceptance criteria', () => {
  const result = validateContract('nexus-task', task);

  assert.equal(result.valid, true, result.errors.join(', '));
  assert.equal(result.schema_id, 'nexus.task.v1');
});

test('rejects task without project scope', () => {
  const { project_id: _projectId, ...unscopedTask } = task;

  const result = validateContract('nexus-task', unscopedTask);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.project_id: required'));
});

test('rejects task risk outside R0–R4', () => {
  const result = validateContract('nexus-task', { ...task, risk: 'R5' });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.risk: value is not in enum'));
});
