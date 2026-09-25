import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compactResult, dispatch, ingest, loadState, sliceEvidence } from '../src/core.mjs';
import { telemetryEvents } from '@nexus-brain/evidence/telemetry';

const root = await mkdtemp(join(tmpdir(), 'mcg-core-'));
try {
  const summarySecret = 'mcg-summary-redaction-canary-2026';
  const summary = compactResult({
    task_id: 'summary-redaction',
    internal_state: 'DONE',
    external_state: 'DONE',
    result: `token=${summarySecret}`,
    validation: `Authorization: Bearer ${summarySecret}`,
    commit: `api_key=${summarySecret}`,
    evidence_reference: `https://example.test/?access_token=${summarySecret}`
  });
  const serializedSummary = JSON.stringify(summary);
  assert.equal(serializedSummary.includes(summarySecret), false, 'compact task summaries must redact credentials from every returned field');
  assert.match(summary.RESULT, /\[REDACTED\]/);
  assert.match(summary.VALIDATION, /\[REDACTED\]/);
  assert.match(summary.COMMIT, /\[REDACTED\]/);
  assert.match(summary.EVIDENCE, /\[REDACTED\]/);
  const blockedSummary = compactResult({
    task_id: 'blocked-summary-redaction',
    internal_state: 'BLOCKED',
    external_state: 'BLOCKED_OWNER',
    blocker: { password: summarySecret },
    owner_needed: `token=${summarySecret}`
  });
  assert.equal(JSON.stringify(blockedSummary).includes(summarySecret), false);
  assert.equal(blockedSummary.BLOCKER, '{"password":"[REDACTED]"}');
  assert.match(blockedSummary.OWNER_NEEDED, /\[REDACTED\]/);
  const boundedSummary = compactResult({
    task_id: `token=${summarySecret}`,
    internal_state: 'DONE',
    external_state: 'DONE',
    result: 'r'.repeat(7000),
    validation: 'v'.repeat(4000),
    commit: 'c'.repeat(2000),
    evidence_reference: 'e'.repeat(2000)
  });
  assert.equal(JSON.stringify(boundedSummary).includes(summarySecret), false);
  assert.equal(boundedSummary.TASK.length <= 256, true);
  assert.equal(boundedSummary.RESULT.length <= 6000, true);
  assert.equal(boundedSummary.VALIDATION.length <= 3000, true);
  assert.equal(boundedSummary.COMMIT.length <= 1000, true);
  assert.equal(boundedSummary.EVIDENCE.length <= 1000, true);

  const task = await dispatch({ task_id: 'real-metadata', executor: 'codex', agent: 'Codex CTO', runtime: 'Codex CLI', ide: 'Codex CLI', source: { plugin_id: 'caveman', plugin_name: 'Caveman', skill_name: 'caveman', host_agent: 'Codex CTO' } }, root);
  assert.equal(task.source.plugin_id, 'caveman');
  await assert.rejects(ingest({ task_id: task.task_id, event_id: 'invalid-timestamp', state: 'WORKING', timestamp: 'not-a-date' }, root), /event contract invalid/);
  await ingest({ task_id: task.task_id, event_id: 'complete', sequence: 1, state: 'DONE', result: 'ok', usage: { input_tokens: 100, cached_input_tokens: 25, output_tokens: 20, reasoning_tokens: 10, total_tokens: 130, source: 'codex.cli.usage' } }, root);
  assert.equal((await loadState(task.task_id, root)).source.skill_name, 'caveman');
  const telemetry = await telemetryEvents(root);
  assert.equal(telemetry.at(-1).total_tokens, 130);
  assert.equal(telemetry.at(-1).measurement_type, 'exact');
  assert.equal(telemetry.at(-1).plugin, 'caveman');
  assert.equal(telemetry.at(-1).outcome, 'success');
  assert.match(task.trace_id, /^trace-/);
  const busEvents = (await readFile(join(root, 'state', 'events', 'events.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
  assert.deepEqual(busEvents.map(event => event.type), ['context.compiled', 'task.dispatched', 'task.event']);
  assert.equal(busEvents.at(-1).trace_id, task.trace_id);
  const failedTask = await dispatch({ task_id: 'failed-metadata', executor: 'codex', agent: 'Codex CTO', runtime: 'Codex CLI' }, root);
  await ingest({ task_id: failedTask.task_id, event_id: 'failed', sequence: 1, state: 'FAILED_FINAL' }, root);
  const failedTelemetry = (await telemetryEvents(root)).find(event => event.task_id === failedTask.task_id && event.operation === 'ingest');
  assert.equal(failedTelemetry.outcome, 'failure');
  const drilldownTask = await dispatch({ task_id: 'evidence-drilldown', executor: 'codex' }, root);
  const secretBearingResult = 'full-output-marker\nAuthorization: Bearer abcdefghijklmnopqrstuvwxyz0123456789\nghp_abcdefghijklmnopqrstuvwxyz0123456789\nresult-page-two';
  await ingest({ task_id: drilldownTask.task_id, event_id: 'drilldown-done', sequence: 1, state: 'DONE', result: secretBearingResult }, root);
  const safeResult = await sliceEvidence(drilldownTask.task_id, 'result', 80, root);
  assert.match(safeResult, /full-output-marker/);
  assert.doesNotMatch(safeResult, /abcdefghijklmnopqrstuvwxyz0123456789/);
  assert.match(safeResult, /\[REDACTED\]/);
  assert.match(await sliceEvidence(drilldownTask.task_id, 'result', 1, root, 3), /result-page-two/);
} finally { await rm(root, { recursive: true, force: true }); }
console.log('core tests: 1 passed');
