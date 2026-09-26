import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cacheContext } from '../src/context/cache.mjs';

const root = await mkdtemp(join(tmpdir(), 'nexus-evidence-cache-'));
try {
  const fragments = [{ id: 'known', content: 'reuse this context' }];
  const first = await cacheContext(root, fragments);
  const second = await cacheContext(root, fragments);
  assert.equal(first.cache_hits, 0);
  assert.equal(second.cache_hits, 1);
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log('evidence cache tests: 1 passed');
