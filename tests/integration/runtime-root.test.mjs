import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const home = await mkdtemp(join(tmpdir(), 'mcg-default-root-'));
const expected = join(fileURLToPath(new URL('../..', import.meta.url)), '.nexus-state');

try {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `import { ROOT } from ${JSON.stringify(new URL('../../src/core.mjs', import.meta.url).href)}; console.log(ROOT)`], {
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home, MCG_ROOT: '' },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), expected);
} finally {
  await rm(home, { recursive: true, force: true });
}

console.log('MCG default runtime root test: 1 passed');
