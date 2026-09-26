import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCodexJsonl } from '@nexus-brain/providers/codex/usage';

test('Codex provider usage parser sums input and output token evidence', () => {
  const result = parseCodexJsonl(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 8, output_tokens: 3 } }));
  assert.equal(result.input_tokens, 8);
  assert.equal(result.output_tokens, 3);
});
