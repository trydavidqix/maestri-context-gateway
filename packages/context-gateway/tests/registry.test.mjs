import assert from 'node:assert/strict';
import { REGISTRY_TYPES } from '../src/registry.mjs';

assert.deepEqual(REGISTRY_TYPES, ['agents', 'tools', 'plugins', 'mcps', 'runtimes', 'models']);
console.log('context gateway registry tests: 1 passed');
