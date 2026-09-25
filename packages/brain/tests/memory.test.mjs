import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { remember, recall } from '../src/memory.mjs';

const root = await mkdtemp(join(tmpdir(), 'nexus-brain-memory-'));
try {
  const stored = await remember(root, { id: 'decision-1', layer: 'L4', content: 'preserve task ownership', source: 'test' });
  const found = await recall(root, { layer: 'L4' });
  assert.equal(found.length, 1);
  assert.equal(found[0].id, stored.id);
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log('brain memory tests: 1 passed');
