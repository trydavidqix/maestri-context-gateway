# Repository status

This repository is the canonical home for Maestri Context Gateway (MCG), extracted from the Lumenva implementation branch on 2026-09-23. It contains the MCG source, contracts, configuration templates, registries, tests, evaluation datasets, and standalone CI.

## Verified snapshot

- Source snapshot: Lumenva PR #26, commit `0901c57c`.
- Unit tests: 36/36 pass.
- Dashboard smoke tests: 14/14 pass.
- Contract smoke: pass.
- Syntax/import smoke: 30 modules pass.
- Sensitive-data/path scan: pass on the extracted tree.
- New repository CI: pass on the initial extraction commit.

## Dashboard and daemon lifecycle — 2026-09-23

- Daemon integration tests exercise inbox processing, restart recovery, dashboard health, duplicate-start rejection, stale PID recovery, and graceful stop on Windows.
- Graceful stop uses an authenticated loopback control endpoint; the daemon does not kill arbitrary processes by PID.
- Windows current-user autostart is installed as a limited-privilege Scheduled Task at logon. The dashboard itself remains manually launched.
- Dashboard CLI accepts `--port` so this checkout can run beside an older MCG dashboard instance without replacing it.
- Validation (latest branch run, 2026-09-23): 44/44 tests pass; syntax/import smoke parses 33 modules; PowerShell parser and sensitive-data scan pass. The Scheduled Task is registered and verified for the current user with an at-logon trigger, Interactive logon, Limited run level, IgnoreNew duplicate policy, and three restart attempts.

## Dashboard reports and Token Firewall follow-up — 2026-09-23

- Canonical implementation tracker: [`superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md`](superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md).
- Progress is **2/6 tasks accepted (33%)**. Tasks 1–2 are complete; Task 3 is paused in Jules session `6700594731787502098`; Tasks 4–6 are not accepted. The paused session and unreviewed Task 3 drafts are not included in the tested branch changes.
- This status is not a declaration that the full dashboard/token-firewall plan is complete. Resume Task 3 only when the owner asks to continue; proceed one task at a time.

## Lumenva branch extraction reconciliation — 2026-09-23

- Ported the portable MCG changes found on Lumenva `vps`: deterministic duplicate-fragment removal before budgeting; separately measured context tokens; context-savings qualification in paired evals; historical context-usage recovery from local raw Codex JSONL; W3C `traceparent` persistence; the 30-case `validation-v2` corpus; and a read-only dashboard **Execuções** view with optional loopback-only Core feed.
- Missing usage fields remain `null`/`unavailable`; this port deliberately does not copy the source branch's assumption that absent cached usage equals zero.
- `npm test`: 46/46 pass. `npm run check:syntax`: 33 modules pass. `npm run scan:sensitive`: PASS (91 files). `validation-v2.jsonl`: 30 valid unique cases across 30 categories; provider execution was not started.
- The original MCG implementation plan and design are preserved as historical snapshots in [`archive/`](archive/).
- The Lumenva-only rollout guard and Maestri V3 plans remain in Lumenva; they are not part of the standalone MCG product. Both VPS branches no longer track the embedded MCG source package or its dedicated old plan/spec; those plan/design snapshots are archived in this repository. Lumenva Core consumes the standalone package through typed exports pinned to merge `b3b5c8808b6f476654cce266f9d2cafd93a99193`. Lumenva Core validation passed: 44/44 tests and typecheck. The separate Lumenva PR #25 still contains only two `operating-core` paths.

## Local runtime-root candidate — 2026-09-23

- The standalone checkout is the dedicated `Projetos/maestri-context-gateway` folder; runtime data defaults to its ignored `.mcg-state/` directory. `MCG_ROOT` remains the explicit override.
- Candidate branch `codex/project-local-runtime-root`, commit `99ffa31`, is pushed to origin and is not merged into `main`.
- Candidate verification: unit suite 40/40, syntax/import 31 modules, sensitive-data/path scan PASS.
- Existing `.mcg-state/` data was preserved; no state migration or deletion was performed.
- A legacy empty directory outside the Projects checkout is not the repository and is not used as the default runtime path.

## Remaining work

- Benchmark the provider discovery/probe path across additional Windows user profiles and current official client releases.
- Add richer telemetry for MCP request errors and protocol-level capability sets when servers expose them.
- Keep rates, latency, and usage unavailable until backed by observed telemetry.

## Provider discovery and MCP probes

- `mcg mcp discover` reads global and project MCP configuration for Claude Code, Codex, and Antigravity and returns metadata only; secret values are never serialized.
- `mcg mcp probe` makes read-only `server/discover` and `tools/list` requests, with legacy initialization fallback for stdio and Streamable HTTP. It never invokes `tools/call`.
- Package download/runner commands (`npx`, `npm`, `pnpm`, `uvx`, etc.) are reported as unprobed by default; they are not executed and cannot install packages during a health check.
- OAuth managed inside a provider client is not exported or read by MCG; a remote endpoint that needs such auth remains unverified here rather than having credentials copied into MCG.
- HTTP endpoints require HTTPS except loopback. Probe results are persisted locally in the ignored `state/registry/mcps.json` file.
- Health and tool names are observed; usage and success/failure rates stay unavailable until telemetry exists.
