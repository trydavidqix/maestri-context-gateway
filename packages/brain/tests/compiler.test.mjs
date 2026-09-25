import assert from 'node:assert/strict';
import { compileContext, diffContext, normalizeFragment } from '../src/compiler.mjs';

const required = { id: 'approval', category: 'must_keep', content: 'OWNER_APPROVAL_REQUIRED', priority: 100 };
const compiled = compileContext({
  fragments: [required, { id: 'old', category: 'historical', content: 'x'.repeat(100) }],
  budget_chars: 10,
});

assert.equal(compiled.fragments.some((fragment) => fragment.id === 'approval'), true);
assert.equal(compiled.dropped.some((fragment) => fragment.id === 'approval'), false);
assert.equal(normalizeFragment({ content: 'hello' }).content, 'hello');

const delta = diffContext([{ id: 'same', content: 'old' }], [
  { id: 'same', content: 'new' },
  { id: 'added', content: 'fresh' },
]);
assert.equal(delta.changed.length, 1);
assert.equal(delta.added.length, 1);

console.log('brain compiler tests: 1 passed');
