import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dispatch } from '@nexus-brain/context-gateway/core';
import { replayTask } from '../src/replay.mjs';

const root = await mkdtemp(join(tmpdir(), 'mcg-replay-redaction-'));
try {
  const task = await dispatch({ task_id: 'replay-redaction', objective: 'Check safe persistence.' }, root);
  const credential = ['gh', 'p_', 'abcdefghijklmnopqrstuvwxyz', '0123456789'].join('');
  const record = await replayTask({
    root,
    task_id: task.task_id,
    variant: 'mcg',
    binary: 'must-not-run',
    processRunner: async () => ({
      stdout: `result ${credential}`,
      stderr: `api_key=${credential}`,
      classification: 'SUCCESS', code: 0, duration_ms: 1, last_activity_at: new Date().toISOString(), heartbeat_count: 0,
      timed_out: false, cancelled: false, policy: { job_class: 'NORMAL' },
      operation: { operation_id: 'op-replay-fixture', status: 'SUCCESS', output: { total_bytes: 80 }, source: 'mcg.executor' }
    })
  });
  assert.equal(record.result.includes(credential), false);
  assert.equal(record.stderr.includes(credential), false);
  assert.match(record.result, /\[REDACTED\]/);
  assert.equal(record.operation.operation_id, 'op-replay-fixture');
  const persisted = await readFile(join(root, 'state', 'evals', 'replays', record.replay_id, 'result.json'), 'utf8');
  const history = await readFile(join(root, 'state', 'history', 'raw', 'replay.jsonl'), 'utf8');
  assert.equal(persisted.includes(credential), false);
  assert.equal(persisted.includes('op-replay-fixture'), true);
  assert.equal(history.includes(credential), false);
} finally {
  await rm(root, { recursive: true, force: true });
}
