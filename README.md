# Maestri Context Gateway

Maestri Context Gateway (MCG) is a local-first gateway for task execution,
context compilation, provider telemetry, evidence, registries, scheduling, and
its read-only dashboard. It is distributed as source and runs on Node.js 22+.

The source blueprints and previous MCG plan are preserved under
[`docs/archive/`](docs/archive/) as historical snapshots. The single active
cross-blueprint plan is [`docs/MASTER_BLUEPRINT_CANONICAL.md`](docs/MASTER_BLUEPRINT_CANONICAL.md);
[`docs/STATUS.md`](docs/STATUS.md) records verified MCG evidence separately from
the broader Maestri program.

## Runtime data

MCG stores runtime data in the ignored `.mcg-state/` directory by default. Set `MCG_ROOT` to another local state directory to override it. The repository excludes generated runtime state, tasks, logs, event inbox data, PID files, Wire credentials, and backups.

## CLI

```powershell
$env:MCG_ROOT = Join-Path (Get-Location) '.mcg-state'
node bin/mcg.mjs doctor
node bin/mcg.mjs status --json
node bin/mcg.mjs mcp discover --project-root C:\path\to\project
node bin/mcg.mjs mcp probe --project-root C:\path\to\project
node bin/mcg.mjs result <task-id>
node bin/mcg.mjs evidence <task-id> --type result --lines 80 --offset 0
```

`result` returns a compact completion digest. When more detail is needed, `evidence --type result` reads the locally retained, secret-redacted result on demand; use `--offset` to continue through long output in chunks of up to 200 lines.

Wire integration requires a local `config/wire.json`. Copy `config/wire.example.json` and provide local credentials outside Git. Never commit credentials or runtime data.

## Usage and evaluation evidence

Codex usage reports keep `context_tokens` separate from total input/output tokens. Context usage is unavailable unless both input and cached-input fields are observed; missing fields are never treated as zero. Historical evaluation records may recover context usage from their local raw JSONL evidence.

The dashboard's **Execuções** view is read-only. An execution feed can be injected by the host; the optional Core HTTP adapter accepts loopback URLs only. Missing execution or usage evidence remains `UNAVAILABLE` with `null` measurements.

Run the expanded 30-case paired validation corpus with `npm run eval:validation-v2`. This invokes the configured Codex CLI with read-only sandboxing and may consume provider quota; the dataset itself is local and can be inspected without running the provider.

## Windows daemon lifecycle

Start the daemon with `node bin/mcg.mjs daemon` and stop it gracefully with `node bin/mcg.mjs daemon stop`. The dashboard reports the daemon online only when its authenticated loopback health endpoint responds. A stale PID lock is recovered on the next start; the daemon never terminates an unrelated process by PID.

The dashboard defaults to `http://127.0.0.1:7435`; use `node bin/mcg.mjs dashboard --port 7436 --no-open` if another MCG checkout already owns that port.

To register a current-user, limited-privilege Scheduled Task that starts the daemon at logon, run from the repository root:

```powershell
.\scripts\install-mcg-daemon-autostart.ps1
```

The installer is safe to rerun and refuses to replace a task with a conflicting action. It does not start the dashboard. To remove only this checkout's task:

```powershell
.\scripts\install-mcg-daemon-autostart.ps1 -Uninstall
```

`mcp discover` reads the global and project MCP catalogs for Claude Code, Codex, and Antigravity and prints metadata only (never auth values). `mcp probe` starts configured stdio MCP servers and sends only MCP discovery/list requests; it does not call tools. It records observed health and tool names in local `state/registry/mcps.json`. Use `--provider claude|codex|antigravity` or `--scope global|project` to limit a probe. HTTP endpoints require HTTPS, except loopback.

## Tests

```powershell
node --test test/*.test.mjs
node scripts/check-syntax.mjs
node scripts/scan-sensitive.mjs
```
