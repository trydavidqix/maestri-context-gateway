export interface ScopeGuardInput {
  mode: 'read_only' | 'write';
  allowedPaths: string[];
  changedPaths: string[];
}

function normalizeRelativePath(path: string): string | undefined {
  const normalized = path.replace(/\\/g, '/').replace(/^\.\//, '');
  if (!normalized || normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) return undefined;
  const segments = normalized.split('/');
  if (segments.some((segment) => segment === '..' || segment === '')) return undefined;
  return normalized;
}

export function scopeViolations(input: ScopeGuardInput): string[] {
  const allowed = input.allowedPaths.flatMap((path) => {
    const normalized = normalizeRelativePath(path);
    return normalized ? [normalized] : [];
  });

  return input.changedPaths.filter((path) => {
    const changed = normalizeRelativePath(path);
    if (!changed || input.mode === 'read_only') return true;
    return !allowed.some((root) => changed === root || changed.startsWith(`${root}/`));
  });
}
