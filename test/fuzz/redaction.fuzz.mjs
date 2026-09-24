import { redactSensitive, redactText } from '../../src/redaction.mjs';

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
}
