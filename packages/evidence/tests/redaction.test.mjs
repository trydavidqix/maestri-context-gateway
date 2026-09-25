import assert from 'node:assert/strict';
import { redactText } from '../src/redaction.mjs';

assert.match(redactText('authorization: Bearer abcdefghijklmnop'), /\[REDACTED\]/);
console.log('evidence redaction tests: 1 passed');
