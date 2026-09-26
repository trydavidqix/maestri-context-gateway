import assert from 'node:assert/strict';
import { test } from 'node:test';
import { redactSensitive, redactText } from '../src/redaction.mjs';

test('redacts provider credentials and bearer values from persisted text', () => {
  const credential = ['gh', 'p_', 'abcdefghijklmnopqrstuvwxyz', '0123456789'].join('');
  const privateKey = [['-----BEGIN ', 'PRIVATE KEY', '-----'].join(''), 'local-private-material', ['-----END ', 'PRIVATE KEY', '-----'].join('')].join('\n');
  const input = [
    'Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123456789',
    credential,
    'api_key=local-test-secret',
    '?access_token=query-secret',
    privateKey
  ].join('\n');
  const safe = redactText(input);
  for (const secret of ['abcdefghijklmnopqrstuvwxyz0123456789', 'local-test-secret', 'query-secret', 'local-private-material']) {
    assert.equal(safe.includes(secret), false);
  }
  assert.match(safe, /\[REDACTED\]/);
  assert.match(safe, /\[REDACTED PRIVATE KEY\]/);
});

test('redacts secret-valued fields recursively while preserving usage numbers', () => {
  const safe = redactSensitive({
    input_tokens: 120,
    context_tokens: 240,
    tokens: 360,
    nested: { api_key: 'hidden', message: 'token=another-hidden-value' }
  });
  assert.deepEqual(safe, {
    input_tokens: 120,
    context_tokens: 240,
    tokens: 360,
    nested: { api_key: '[REDACTED]', message: 'token=[REDACTED]' }
  });
});

test('preserves numeric context-economy metrics without exposing credential fields', () => {
  const safe = redactSensitive({
    estimated_tokens_saved: 42,
    estimated_tokens_avoided: 18,
    tokens_saved: 12,
    api_token: 987654
  });
  assert.deepEqual(safe, {
    estimated_tokens_saved: 42,
    estimated_tokens_avoided: 18,
    tokens_saved: 12,
    api_token: '[REDACTED]'
  });
});

test('does not rewrite ordinary output text', () => {
  assert.equal(redactText('test passed; total_tokens=120'), 'test passed; total_tokens=120');
});
