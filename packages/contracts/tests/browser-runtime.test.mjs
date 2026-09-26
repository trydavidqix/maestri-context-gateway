import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateContract } from '../src/index.mjs';

const task = {
  browser_task_id: 'browser-task-4', project_id: 'nexus-brain', task_id: 'task-17',
  agent_id: 'agent-codex-1', plan_id: 'plan-4', intent: 'Read release notes',
  status: 'PLANNED', created_at: '2026-09-26T12:00:00.000Z',
};
const session = {
  session_id: 'browser-session-4', project_id: 'nexus-brain', task_id: 'task-17',
  agent_id: 'agent-codex-1', host_id: 'host-local', backend_id: 'playwright',
  profile_id: 'profile-task-17', lease_expires_at: '2026-09-26T12:10:00.000Z', state: 'OPEN',
};
const observation = {
  observation_id: 'observation-2', session_id: 'browser-session-4', project_id: 'nexus-brain',
  task_id: 'task-17', agent_id: 'agent-codex-1', url: 'https://example.test/releases',
  origin: 'https://example.test', trust_level: 'UNTRUSTED', content_hash: 'sha256:abc',
  provenance: { backend_id: 'playwright' },
};
const action = {
  action_id: 'action-7', session_id: 'browser-session-4', project_id: 'nexus-brain',
  task_id: 'task-17', agent_id: 'agent-codex-1', action_type: 'navigate',
  risk_level: 'R1', target_origin: 'https://example.test', parameters: { url: 'https://example.test/releases' },
};
const backend = { backend_id: 'playwright', backend_type: 'playwright', capabilities: ['navigate', 'observe'], health: 'healthy' };
const host = {
  host_id: 'host-local', host_type: 'WINDOWS_WORKSTATION', online: true,
  resources: { browser_slots: 2 }, browser_slots: 2, active_sessions: 1,
  supported_backends: ['playwright'], profiles: ['profile-task-17'], region: 'local', heartbeat: '2026-09-26T12:00:00.000Z',
};
const profile = {
  profile_id: 'profile-task-17', project_id: 'nexus-brain', allowed_origins: ['https://example.test'],
  credential_refs: ['credential-ref-1'], isolation: 'TASK_AGENT',
};
const recipe = {
  recipe_id: 'recipe-release-read', project_id: 'nexus-brain', version: 1,
  origin: 'https://example.test', actions: [{ action_type: 'navigate', parameters: { path: '/releases' } }],
  evidence_id: 'evidence-1', validated_at: '2026-09-26T12:00:00.000Z', content_hash: 'sha256:def',
};

test('validates BrowserTask and BrowserSession isolation scope', () => {
  assert.equal(validateContract('browser-task', task).valid, true);
  assert.equal(validateContract('browser-session', session).valid, true);
  const sharedSession = validateContract('browser-session', { ...session, agent_id: '' });
  assert.equal(sharedSession.valid, false);
});

test('requires BrowserObservation trust and provenance', () => {
  assert.equal(validateContract('browser-observation', observation).valid, true);
  const trustedContent = validateContract('browser-observation', { ...observation, trust_level: 'TRUSTED' });
  assert.equal(trustedContent.valid, false);
});

test('validates typed BrowserAction and rejects unknown risk levels', () => {
  assert.equal(validateContract('browser-action', action).valid, true);
  const invalidRisk = validateContract('browser-action', { ...action, risk_level: 'R5' });
  assert.equal(invalidRisk.valid, false);
});

test('validates provider-neutral BrowserBackend and BrowserHost records', () => {
  assert.equal(validateContract('browser-backend', backend).valid, true);
  assert.equal(validateContract('browser-host', host).valid, true);
  const invalidCapacity = validateContract('browser-host', { ...host, active_sessions: -1 });
  assert.equal(invalidCapacity.valid, false);
});

test('validates scoped BrowserProfile and versioned BrowserRecipe', () => {
  assert.equal(validateContract('browser-profile', profile).valid, true);
  const rawCredentials = validateContract('browser-profile', { ...profile, password: 'should-not-be-present' });
  assert.equal(rawCredentials.valid, false);
  assert.equal(validateContract('browser-recipe', recipe).valid, true);
  const invalidVersion = validateContract('browser-recipe', { ...recipe, version: 0 });
  assert.equal(invalidVersion.valid, false);
});
