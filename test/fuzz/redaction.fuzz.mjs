import { redactSensitive, redactText } from '../../src/redaction.mjs';
import { compactResult } from '../../src/core.mjs';

export function fuzz(data) {
  const secret = `fuzz-secret-${data.toString('base64url') || 'empty-input'}-sentinel`;
  const input = {
    access_token: secret,
    nested: [{
      api_key: secret,
      authorization: `Bearer ${secret}`,
      message: `token=${secret}`
    }]
  };
  const original = JSON.stringify(input);
  const safe = redactSensitive(input);
  const serialized = JSON.stringify(safe);

  if (safe.access_token !== '[REDACTED]') throw new Error('access token field was not redacted');
  if (safe.nested[0].api_key !== '[REDACTED]') throw new Error('API key field was not redacted');
  if (safe.nested[0].message !== 'token=[REDACTED]') throw new Error('embedded token was not redacted');
  if (serialized.includes(secret)) throw new Error('secret value survived structured redaction');
  if (JSON.stringify(input) !== original) throw new Error('redaction mutated its input');
  if (JSON.stringify(redactSensitive(safe)) !== serialized) throw new Error('redaction is not idempotent');

  const safeText = redactText(`Authorization: Bearer ${secret}\napi_key=${secret}`);
  if (safeText.includes(secret)) throw new Error('secret value survived text redaction');

  const metrics = redactSensitive({ estimated_tokens_saved: data.length, tokens_avoided: data.length, api_token: secret });
  if (metrics.estimated_tokens_saved !== data.length || metrics.tokens_avoided !== data.length) throw new Error('numeric context-economy metric was redacted');
  if (metrics.api_token !== '[REDACTED]') throw new Error('credential field was not redacted');

  const compact = compactResult({
    task_id: 'jazzer-summary',
    internal_state: 'DONE',
    external_state: 'DONE',
    result: `token=${secret}`,
    validation: `Authorization: Bearer ${secret}`,
    commit: `api_key=${secret}`,
    evidence_reference: `https://example.test/?access_token=${secret}`
  });
  if (JSON.stringify(compact).includes(secret)) throw new Error('secret value survived compact task summary');

  const blockedCompact = compactResult({
    task_id: 'jazzer-blocked-summary',
    internal_state: 'BLOCKED',
    external_state: 'BLOCKED_OWNER',
    blocker: `password=${secret}`,
    owner_needed: { api_key: secret }
  });
  if (JSON.stringify(blockedCompact).includes(secret)) throw new Error('secret value survived blocked task summary');
}
