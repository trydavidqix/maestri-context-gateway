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

## Dashboard reports and Token Firewall follow-up — consolidated 2026-09-24

- Single active cross-blueprint plan: [`MASTER_BLUEPRINT_CANONICAL.md`](MASTER_BLUEPRINT_CANONICAL.md). MCG evidence remains tracked in this status file and in §49 of that plan.
- Consolidated progress: **3/7 phases accepted = 43%**. This uses a broader denominator than the former 2/6 dashboard-only tracker; it is a scope reconciliation, not newly completed work.
- Phases 0–2 are accepted. Phase 3 Token Firewall is partial and not accepted; its safe ported pieces are documented in the master plan. Phases 4–6 (13 reports, reference-faithful dual theme/accessibility, final eval/benchmark/release) remain open.
- Jules drafts/session `6700594731787502098` remain paused/unaccepted and are not part of the accepted branch. Do not count them as implementation evidence.
- `superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md` is retained as historical detail and superseded by the master plan; it is not a second active tracker.

## Lumenva branch extraction reconciliation — 2026-09-23

- Ported the portable MCG changes found on Lumenva `vps`: deterministic duplicate-fragment removal before budgeting; separately measured context tokens; context-savings qualification in paired evals; historical context-usage recovery from local raw Codex JSONL; W3C `traceparent` persistence; the 30-case `validation-v2` corpus; and a read-only dashboard **Execuções** view with optional loopback-only Core feed.
- Missing usage fields remain `null`/`unavailable`; this port deliberately does not copy the source branch's assumption that absent cached usage equals zero.
- `npm test`: 46/46 pass. `npm run check:syntax`: 33 modules pass. `npm run scan:sensitive`: PASS (91 files). `validation-v2.jsonl`: 30 valid unique cases across 30 categories; provider execution was not started.
- The original MCG implementation plan and design are preserved as historical snapshots in [`archive/`](archive/).
- The consolidated cross-blueprint plan is [`MASTER_BLUEPRINT_CANONICAL.md`](MASTER_BLUEPRINT_CANONICAL.md). MCG remains a standalone workstream there; CRM and voice code are not moved into this repository.
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

## Cross-repository Maestri branch migration audit — 2026-09-24

- Unified branch inventory and Maestri-only path boundaries are documented in [`MASTER_BLUEPRINT_CANONICAL.md`](MASTER_BLUEPRINT_CANONICAL.md), §§54–61; the live transfer ledger is [`migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md`](migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md).
- Selective Maestri transfer was merged to standalone `main` via PR #5, merge `4195fea8cde0edbd6b59e284a18141dab62701af`; synced working branch `migration/lumenva-maestri-import-20260924` is clean and at the same commit. Contents: VPS operating-core + Session Engine delta, Local Runtime, 61 unique TOKENS Cloud Fabric modules, selected Council docs, sanitized Codex Cloud plan, project Jules skill, non-active CEO/CIO templates, and disabled workflow snapshots. No whole Lumenva branch was merged.
- Validation (2026-09-24): MCG `pnpm test` 46/46; syntax/import smoke 33 modules; sensitive scan PASS (125 files); Local Runtime tests 14/14 and typecheck pass; Core/Cloud Fabric strict typecheck passes and tests 69/69, with 2 integration tests skipped. No Docker tests were run. Real provider, durable database and full release/browser QA remain pending.
- TOKENS Cloud Fabric acceptance remains OPEN. This branch now integrates model scoring/routing and model handoff, validated-only learning, independent reviewer exclusion, allowed-path propagation/scope guards, approval persistence seam and orchestrator integration tests. Provider cost stays null when unknown. Still pending: concrete worktree driver, durable evidence resolving artifacts, real subscription quota/usage, provider E2E within existing quotas, and >=30 validated benchmark observations. The detailed evidence/status table is in `migration/LUMENVA_SOURCE_TRANSFER_LEDGER.md`.
- Dashboard report renderer now covers the 13 registered views with readable fields/lists, source/timestamp/measurement quality and explicit unavailable values. Light/dark/system preference, persistence, palette tokens and matching browser theme-color metadata are implemented. Isolated Playwright smoke verified both palettes, all 13 report views and 390px mobile without horizontal overflow. Screen-reader/keyboard report drilldown, fuller metric-specific coverage/period labels and screenshot-level reference fidelity remain open.
- PR #5 CI passed and was merged to target `main`. No Lumenva source branch deletion or source-worktree modification occurred.
- Cleanup remains unsafe: Command Center is 50 commits ahead/21 behind with dirty CRM and Maestri files; F1 Cloud has dirty CRM/Codex Cloud files; several source refs remain attached to worktrees.
- Branch creation timestamps are not exposed by Git refs; the plan records first unique commit/tip dates as evidence rather than claiming exact creation dates.
- Both source and destination GitHub repositories are public. The current imported set passed a sensitive/path scan; any additional file transfer still needs an exact-path audit before push.
- MCG remains standalone inside the Maestri project. Overall migration progress is not a valid percentage yet: unresolved Cloud Fabric/runtime gates and Command Center/source-branch ownership remain; no objective equal-weight completion denominator exists.

## Provider discovery and MCP probes

- `mcg mcp discover` reads global and project MCP configuration for Claude Code, Codex, and Antigravity and returns metadata only; secret values are never serialized.
- `mcg mcp probe` makes read-only `server/discover` and `tools/list` requests, with legacy initialization fallback for stdio and Streamable HTTP. It never invokes `tools/call`.
- Package download/runner commands (`npx`, `npm`, `pnpm`, `uvx`, etc.) are reported as unprobed by default; they are not executed and cannot install packages during a health check.
- OAuth managed inside a provider client is not exported or read by MCG; a remote endpoint that needs such auth remains unverified here rather than having credentials copied into MCG.
- HTTP endpoints require HTTPS except loopback. Probe results are persisted locally in the ignored `state/registry/mcps.json` file.
- Health and tool names are observed; usage and success/failure rates stay unavailable until telemetry exists.
