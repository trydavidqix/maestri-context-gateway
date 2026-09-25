const SECRET_KEY = /pass(word)?|token|secret|private[_-]?key|api[_-]?key|authorization|cookie/i;
const USAGE_KEY = /^(?:(?:input|cached_input|cached|output|reasoning|total|context|estimated)_tokens|tokens?)(?:_(?:saved|avoided|original|delivered))?$/i;
const SECRET_PATTERNS = [
  { pattern: /(\bAuthorization\s*[:=]\s*Bearer\s+)[^\s"'`,;]+/gi, replace: (_match, prefix) => `${prefix}[REDACTED]` },
  { pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-(?:ant-)?[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,})\b/g, replace: () => '[REDACTED]' },
  { pattern: /(\b(?:password|passwd|token|secret|api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*)[^\s,;]+/gi, replace: (_match, prefix) => `${prefix}[REDACTED]` },
  { pattern: /([?&](?:access_token|token|api_key|key)=)[^&\s]+/gi, replace: (_match, prefix) => `${prefix}[REDACTED]` },
  { pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, replace: () => '[REDACTED PRIVATE KEY]' }
];

export function redactText(value) {
  const text = String(value ?? '');
  return SECRET_PATTERNS.reduce((safe, item) => safe.replace(item.pattern, item.replace), text);
}

export function redactSensitive(value, key = '') {
  if (USAGE_KEY.test(key) && Number.isFinite(value)) return value;
  if (SECRET_KEY.test(key)) return '[REDACTED]';
  if (Array.isArray(value)) return value.map(item => redactSensitive(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, redactSensitive(item, name)]));
  }
  if (typeof value === 'string') return redactText(value);
  return value;
}
