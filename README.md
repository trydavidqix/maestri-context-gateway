# Maestri Context Gateway

Maestri Context Gateway (MCG) is a local-first gateway for task execution,
context compilation, provider telemetry, evidence, registries, scheduling, and
its read-only dashboard. It is distributed as source and runs on Node.js 22+.

## Runtime data

MCG stores runtime data outside Git. Set `MCG_ROOT` to a local state directory before running the CLI. The repository excludes generated runtime state, tasks, logs, event inbox data, PID files, Wire credentials, and backups.

## CLI

```powershell
$env:MCG_ROOT = Join-Path (Get-Location) '.mcg-state'
node bin/mcg.mjs doctor
node bin/mcg.mjs status --json
```

Wire integration requires a local `config/wire.json`. Copy `config/wire.example.json` and provide local credentials outside Git. Never commit credentials or runtime data.

## Tests

```powershell
node --test test/*.test.mjs
node scripts/check-syntax.mjs
node scripts/scan-sensitive.mjs
```
