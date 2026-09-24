const SECRET_PATTERNS = [/(?:sk|pk|rk)_[A-Za-z0-9_-]{16,}/g, /Bearer\s+[A-Za-z0-9._-]+/gi, /(?:password|secret|token|api[_-]?key)\s*[:=]\s*[^\s,;"}]+/gi];

export function redactSecrets(value: string): string {
  return SECRET_PATTERNS.reduce((text, pattern) => text.replace(pattern, '[REDACTED]'), value);
}

export function sanitizeTrace<T>(value: T): T {
  if (typeof value === 'string') return redactSecrets(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeTrace(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [redactSecrets(key), sanitizeTrace(item)])) as T;
  }
  return value;
}
