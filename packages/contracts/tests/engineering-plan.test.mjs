import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const validPlan = {
  task_id: 'task-17',
  agent_id: 'agent-codex-1',
  task_type: 'FEATURE',
  risk_level: 'R1',
  scope_size: 'bounded',
  expected_files: ['packages/contracts/src/engineering/plan.ts'],
  expected_tests: ['packages/contracts/tests/engineering-plan.test.mjs'],
  contract_impact: ['nexus.engineering-plan.v1'],
  testability: 'direct',
  execution_mode: 'write',
  autonomy_level: 'A2',
  skill_policy: {
    required: ['core-discipline'],
    optional: ['lean-engineering'],
    forbidden: [],
    loaded: ['core-discipline'],
    completed: [],
  },
  context_budget: { input_tokens: 4000 },
  tool_profile: ['engineering.default'],
  verification_gates: ['unit-tests'],
  delivery_policy: {},
};

test('accepts EngineeringPlan with scoped task and agent identity', () => {
  const result = validateContract('engineering-plan', validPlan);

  assert.equal(result.valid, true, result.errors.join(', '));
  assert.equal(result.schema_id, 'nexus.engineering-plan.v1');
});

test('rejects EngineeringPlan without agent identity', () => {
  const { agent_id: _agentId, ...unscopedPlan } = validPlan;

  const result = validateContract('engineering-plan', unscopedPlan);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.agent_id: required'));
});

test('rejects EngineeringPlan with risk outside R0–R4', () => {
  const result = validateContract('engineering-plan', { ...validPlan, risk_level: 'R5' });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.risk_level: value is not in enum'));
});

test('requires the complete EngineeringPlan envelope', () => {
  const { expected_files: _expectedFiles, ...incompletePlan } = validPlan;

  const result = validateContract('engineering-plan', incompletePlan);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.expected_files: required'));
});

test('rejects execution modes outside the existing contract vocabulary', () => {
  const result = validateContract('engineering-plan', { ...validPlan, execution_mode: 'unrestricted' });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.execution_mode: value is not in enum'));
});
