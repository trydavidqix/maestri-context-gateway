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
