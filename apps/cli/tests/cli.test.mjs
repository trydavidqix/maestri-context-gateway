import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('canonical CLI preserves the documented command help and exit status', async () => {
  const root = await mkdtemp(join(tmpdir(), 'nexus-cli-'));
  try {
    const script = fileURLToPath(new URL('../src/mcg.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, 'help'], {
      encoding: 'utf8',
      env: { ...process.env, MCG_ROOT: root },
    });
    assert.equal(result.status, 2, result.stderr);
    assert.match(result.stdout, /mcg commands: doctor wire mcp daemon status stats dashboard dispatch wait result evidence cancel ingest/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('doctor reports standalone Nexus runtime without probing Maestri', async () => {
  const root = await mkdtemp(join(tmpdir(), 'nexus-cli-doctor-'));
  try {
    const script = fileURLToPath(new URL('../src/mcg.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, 'doctor'], {
      encoding: 'utf8',
      env: { ...process.env, MCG_ROOT: root, MAESTRI_CLI: 'must-not-be-invoked' },
    });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.node_ok, Number(process.versions.node.split('.')[0]) >= 22);
    assert.equal(report.storage, 'ok');
    assert.equal('maestri' in report, false);
    assert.equal('maestri_connection' in report, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
