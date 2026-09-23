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

## Local runtime-root candidate — 2026-09-23

- The standalone checkout is `C:\Users\David\Desktop\Projetos\maestri-context-gateway`; runtime data defaults to its ignored `.mcg-state/` directory. `MCG_ROOT` remains the explicit override.
- Candidate branch `codex/project-local-runtime-root`, commit `99ffa31`, is pushed to origin and is not merged into `main`.
- Candidate verification: unit suite 40/40, syntax/import 31 modules, sensitive-data/path scan PASS.
- Existing `.mcg-state/` data was preserved; no state migration or deletion was performed.
- A legacy empty directory at `%USERPROFILE%\.lumenva\maestri-context-gateway` is not the repository checkout and is not used as the default runtime path.

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
