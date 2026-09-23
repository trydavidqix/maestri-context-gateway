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

## Remaining work

- Discover and validate real configuration/catalogs for supported providers.
- Probe actual tool and MCP health/capabilities; do not mark static catalog entries healthy without observations.
- Keep rates, latency, and usage unavailable until backed by observed telemetry.

No deployment or provider configuration is performed by the extraction itself.
