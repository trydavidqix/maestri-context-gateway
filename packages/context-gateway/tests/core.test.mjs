import assert from 'node:assert/strict';
import { compactResult } from '../src/core.mjs';

const result = compactResult({ task_id: 'compat-task', internal_state: 'DONE', external_state: 'DONE', result: 'finished' });
assert.equal(result.STATUS, 'DONE');
assert.equal(result.TASK, 'compat-task');
console.log('context gateway core tests: 1 passed');
