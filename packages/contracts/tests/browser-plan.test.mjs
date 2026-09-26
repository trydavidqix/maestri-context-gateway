import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const plan = {
  browser_task_id: 'browser-task-4',
  project_id: 'nexus-brain',
  task_id: 'task-17',
  agent_id: 'agent-codex-1',
  engineering_plan_id: 'engineering-plan-17',
  intent: 'Read public release notes',
  risk_level: 'R0',
  autonomy_level: 'A1',
  allowed_origins: ['https://example.test'],
  allowed_redirect_origins: [],
  blocked_origins: [],
  download_origins: [],
  upload_origins: [],
  interaction_mode: 'http',
  observation_mode: 'structured',
  backend_preference: ['scrapling'],
  host_requirements: {},
  profile_policy: {},
  secret_policy: {},
  tool_profile: ['browser.read'],
  context_budget: { input_tokens: 2000 },
  max_actions: 10,
  max_pages: 5,
  max_runtime: 60,
  max_browser_seconds: 30,
  max_cost: 0,
  approval_gates: [],
  success_assertions: ['A release date is present'],
  stop_conditions: ['An approval gate is reached'],
};

test('accepts BrowserPlan scoped beneath project task and agent', () => {
  const result = validateContract('browser-plan', plan);

  assert.equal(result.valid, true, result.errors.join(', '));
  assert.equal(result.schema_id, 'nexus.browser-plan.v1');
});

test('rejects BrowserPlan without task authority scope', () => {
  const { task_id: _taskId, ...unscopedPlan } = plan;

  const result = validateContract('browser-plan', unscopedPlan);

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.task_id: required'));
});

test('rejects negative BrowserPlan budgets', () => {
  const result = validateContract('browser-plan', { ...plan, max_actions: -1 });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.max_actions: below minimum'));
});

test('requires at least one authorized origin for browser work', () => {
  const result = validateContract('browser-plan', { ...plan, allowed_origins: [] });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('$.allowed_origins: fewer than minItems'));
});
