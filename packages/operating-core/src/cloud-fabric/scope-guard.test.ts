import { describe, expect, it } from 'vitest';
import { scopeViolations } from './scope-guard.js';

describe('execution scope guard', () => {
  it('allows only changes under explicitly allowed paths', () => {
    expect(scopeViolations({ mode: 'write', allowedPaths: ['packages/demo/src'], changedPaths: ['packages/demo/src/main.ts'] })).toEqual([]);
  });

  it('rejects sibling-prefix paths and traversal', () => {
    expect(scopeViolations({ mode: 'write', allowedPaths: ['packages/demo/src'], changedPaths: ['packages/demo/src-old/main.ts', '../secrets.txt'] })).toEqual(['packages/demo/src-old/main.ts', '../secrets.txt']);
  });

  it('rejects all changes in read-only mode', () => {
    expect(scopeViolations({ mode: 'read_only', allowedPaths: [], changedPaths: ['README.md'] })).toEqual(['README.md']);
  });
});
