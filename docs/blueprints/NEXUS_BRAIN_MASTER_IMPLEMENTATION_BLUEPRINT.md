# Nexus Brain — Master Implementation Blueprint

**Canonical project:** Nexus Brain (`trydavidqix/nexus-brain`)
**Default branch:** `main`
**Status:** MIGRATION READINESS ACTIVE — Blueprint implementation has not started
**Last reconciled:** 2026-09-26

## 0. Migration readiness vs. Blueprint implementation

This tracker contains **24 implementation work packages** (`NB-00`–`NB-23`) from the original Blueprint and **6 migration-readiness work packages** (`NB-24`–`NB-29`) added to prepare the canonical local/GitHub repository. The older “24 vs. 30” counts referred to these two scopes: 30 table rows total, not six missing or duplicate product features.

**Current phase: `MIGRATION READINESS`.** It covers inventory, ownership, architecture moves, workspace validation, Windows legacy cleanup, canonical path, GitHub integration, synchronization, and evidence. Its execution log is [`migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md`](../migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md). Do not begin implementation work packages `NB-02`–`NB-23` until readiness is accepted. `NB-00` is already accepted; `NB-01` is limited to source inventory/ownership and does not own the final directory rename (that belongs only to `NB-29`).

**Next phase: `BLUEPRINT IMPLEMENTATION`.** Its package acceptance criteria remain future-facing. Existing partial MCG/dashboard/security work is evidence, not acceptance of `NB-17`–`NB-19`; those remain `TODO` until their full gates are executed. Migration completion must not mark cloud services, Brain API, providers, security gates, dashboard fidelity, or other future capabilities `DONE` without implementation and evidence.

There is no single percentage combining these phases. Count only `DONE` migration work packages for migration readiness and only `DONE` implementation work packages for Blueprint progress; do not calculate from elapsed time, commits, file moves, or the 30-row denominator.

This is the only active cross-project implementation tracker. Nexus Brain is one product and one monorepo. “Maestri”, “Lumenva Brain”, “Context Gateway/MCG”, “Local Runtime”, “Cloud Fabric”, “Command Center” and “Everything Edge” name historical designs or internal modules—not separate products or repositories. CRM, voice, social-business/Meta integrations, tenant business data and unrelated Lumenva code remain out of scope unless a later explicit decision identifies an exact owned path.

## 1. Mission and completion rule

Build one durable, evidence-based agent platform that owns shared memory/context, project intelligence, task/session orchestration, safe execution, provider integrations, Windows edge sensing, governance, observability and recovery. GitHub is the source of truth for code and versioned policy; the cloud service is the source of truth for canonical memory, project index and operational records; the local Edge is a bounded sensor/bridge, not another brain.

Implementation order for every work package:

`scope and owner → failing test/evidence plan → implement → test → independent validation → update this blueprint → next package`

`DONE` requires the package acceptance criteria and evidence. A written design, skill, successful CI run, or agent claim alone is not implementation proof. Unknowns stay `UNRESOLVED`; no percentage is inferred from elapsed time or prose.

## 2. Canonical system boundary

```text
NEXUS BRAIN — ONE MONOREPO / ONE PRODUCT
├── Control plane: session/task state, DAG, policy, approvals, budgets, scheduler
├── Brain services: memory, temporal facts, provenance, context, retrieval, capabilities
├── Execution: agent factory/supervisor, local runtime, Codex Cloud, Jules/provider adapters
├── Edge: Windows Everything 1.5 + Git + minimal Lumenva Edge/MCP bridge
├── Interfaces: Claude Code, Codex, Gemini CLI, Antigravity, Jules
├── Operations: dashboard/reports, traces, CI/security, backups and disaster recovery
└── Governance: contracts, evidence, branch/PR gates and auditable cleanup
```

Reuse the existing repository, tests, MCG dashboard, Local Runtime and transferred Maestri/Cloud Fabric files where ownership is proven. Do not create a second memory engine, task store, router, dashboard, MCP surface, filesystem watcher or governance policy. Preserve old package/API names as compatibility identifiers until an individually tested migration changes them; renaming the GitHub repository does not authorize a blind code-wide rename.

## 3. Reconciled architecture decisions

| Concern | Canonical V1 decision | Preserved alternative / status |
|---|---|---|
| Product identity | Nexus Brain is the sole product; legacy systems become modules. | Historical source documents retain their original names for provenance. |
| Deployment | Cloud-first: Brain API/MCP, canonical DB, indexer, compiler and backups run in Google Cloud. | Early local-first SQLite/vector design is preserved as history; no local authoritative database in V1. |
| Canonical stores | GitHub = code/config; Cloud SQL PostgreSQL + pgvector = Brain state; Cloud Storage = versioned recovery artifacts. | Firebase SQL Connect is not on the V1 critical path; reconsider only for a concrete UI/app need. |
| Local machine | Tiny Edge uses Everything 1.5 Journal + Git; queue/snapshots are bounded, encrypted, and non-authoritative. | Do not build a recursive scanner or parallel filesystem watcher. Fallback to Git status/diff if Everything is unavailable. |
| Memory/indexing | One memory API and canonical provenance/temporal model; events are candidates, not truth. | Hindsight/Graphiti/provider-specific backends remain replaceable choices; graph backend is `UNRESOLVED` pending evidence. |
| Retrieval/reuse | PostgreSQL lexical search + pgvector + scoped filters; report capabilities with source evidence. | No Neo4j, Graphiti requirement, multiple vector DBs, or generic graph platform in V1. |
| MCP | One stable Brain MCP surface. V1 tools: `brain_context`, `brain_search`, `brain_reuse`, `brain_remember`, `local_search`, `brain_status`. | Earlier 8-tool variants remain in source archive; aliases may be added only for proven client compatibility. |
| Compiler/decision | Deterministic rules first; one Gemini compiler for V1 behind provider-neutral interface; larger models only for ambiguous cases. | Multiple compilers, Laya/classifier choices and routing thresholds remain deferred/experimental until benchmarked. No custom training in V1. |
| Agents/runtime | One task/session/event model; Agent Factory, policy, evidence and bounded loop are shared by local/cloud/Jules execution. | Council, C4, AutoImprove and learned Reflex are later gated modules, not duplicate control planes or V1 prerequisites. |
| Recovery | GitHub for committed code; unique create-only snapshots for uncommitted work; Cloud SQL backup/PITR and a separate GCS recovery vault. | Never use mutable `latest.zip`, auto-commit as backup, or irreversible retention locks before restore tests. |
| Scope | Only Nexus Brain-owned paths enter this repo. | CRM, voice, Meta/social-business and tenant/business migrations are explicitly excluded. |

## 4. Current verified baseline

- GitHub repository was renamed to `trydavidqix/nexus-brain`; it is public, `main` remains default, and no repository currently named `trydavidqix/nexus-brain` existed before the rename.
- The local clone’s `origin` now points to `https://github.com/trydavidqix/nexus-brain.git`. The remote HEAD resolved after rename; local documentation and plan sources still need committing/pushing.
- At the pre-change inspection, the checkout was clean on `main`, with no open PRs and only `main` on the remote. Recheck after this documentation change.
- Existing `docs/blueprints/archive/MASTER_BLUEPRINT_CANONICAL.md` contains a prior Maestri-wide design and source-to-plan map. Its verified snapshot says MCG F0–F2 and F4 were accepted (**4/7 MCG phases, 57% MCG-only**); F3, F5 and F6 were partial. This historical component percentage is not a Nexus-wide or migration-readiness percentage.
- Existing plan/status records say Brain service/API/database, Git governance enforcement, provider-backed Cloud/Jules execution, full Cloud Fabric acceptance and cross-provider recovery are not yet proven complete. Treat them as pending until fresh tests/evidence confirm otherwise.
- Seven Gmail source attachments have been copied into `docs/blueprints/sources/`; their recorded lengths match Gmail metadata and their local SHA-256 hashes are in `sources/SHA256SUMS.txt`. The seven exact source messages were moved to Gmail Trash on 2026-09-25 after source review and plan validation; they were not permanently deleted. The prior Maestri blueprint is retained behind a historical/superseded banner, not as a second active tracker.

## 5. Source ledger and lossless coverage

The files below are immutable evidence/source snapshots, not active trackers. Their unique requirements are represented by the architecture decisions, work packages and acceptance gates in this document. Preserve differences as unresolved where this plan has not selected a V1 decision.

| Source | Canonical coverage |
|---|---|
| `sources/lumenva_global_shared_memory_plan.md` | Global project/capability intelligence; context on demand; multi-client integrations; scanner/indexer; memory compiler; temporal provenance; cross-project reuse. |
| `sources/lumenva_global_brain_plano_implantacao.md` | Core/storage schemas; incremental indexing; capability graph; MCP/API contracts; event capture; compiler; retrieval; observability and cross-agent tests. |
| `sources/lumenva_global_brain_cloud_first_backup_plan.md` | Cloud Run, Cloud SQL, Cloud Storage, minimal PC, GitHub indexing, uncommitted snapshots, create-only backups, PITR/vault and disaster recovery. |
| `sources/lumenva_global_brain_plano_completo_implantacao.md` | Contracts, Google infrastructure, core API, schema, MCP, indexer, retrieval, decision plane, integrations and evaluation. |
| `sources/lumenva_global_brain_plano_completo_v1.md` | V1/non-goals, provider-neutral interfaces, decision tiers, capability/reuse coverage, security and operational tests. |
| `sources/lumenva_everything_edge_implantacao.md` | Everything Journal adapter, cursor, PROJECTS_ROOT/ignore, burst aggregation, Git evidence, Edge, snapshots, offline queue, health and fallback. |
| `sources/lumenva_global_brain_plano_unico_final.md` | Final simplified V1 decisions: cloud-first, no local brain DB/watcher, one Edge, six MCP tools, seven initial tables, backup policy and acceptance. |
| `MASTER_BLUEPRINT_CANONICAL.md` (historical predecessor) | Maestri runtime/session/task/policy/context, Agent Factory, Council/C4, evidence, MCG, Cloud Fabric, Local Runtime, Codex Cloud, Jules, benchmarks, AutoImprove, Reflex, transfer ledger and unresolved decisions. Map these as internal modules; retain its detailed body and status evidence behind a supersession banner. |

No source capability is discarded merely because it is deferred from V1. Deferred means “retained, not required for first usable release.” Duplicate implementations are consolidated only when their responsibility and acceptance are equivalent.

## 6. Work packages and dependency order

Statuses: `TODO`, `IN_PROGRESS`, `BLOCKED`, `VALIDATING`, `DONE`. The isolated branch is completing migration readiness. The `Initial status` cells below are the current status ledger; update only with package acceptance evidence. Mark `DONE` only after all stated checks pass and evidence is linked here or in test/CI artifacts.

| ID | Work package | Depends on | Acceptance gate | Initial status |
|---|---|---|---|---|
| NB-00 | Repository identity, exact source preservation, one canonical tracker | — | GitHub/local name aligned; all source files checksummed and indexed; prior tracker marked historical; no unrelated paths | DONE |
| NB-01 | Monorepo source inventory and ownership map | NB-00 | Exact included/excluded paths; ownership map; source/import/workspace graph; no CRM/voice migration. Final local directory rename is NB-29 only. | IN_PROGRESS |
| NB-02 | Contracts and threat/scope model | NB-01 | Versioned request, identity, task, memory, evidence and permission schemas; conflicts recorded as unresolved | TODO |
| NB-03 | Cloud baseline and least-privilege infrastructure | NB-02 | Officially validated Google project/services/IAM/secrets/logging; reproducible IaC; no permanent GitHub cloud key | TODO |
| NB-04 | Canonical database, temporal memory and provenance | NB-02, NB-03 | Migrations, append-only events, versioned facts, evidence lineage, ACL/scope and restore test | TODO |
| NB-05 | Brain API and one MCP contract | NB-02, NB-04 | Authenticated context/search/remember/reuse/status plus health; contract tests; bounded context | TODO |
| NB-06 | GitHub project indexer and sync/reconciliation | NB-02, NB-03, NB-04 | Idempotent webhook + scheduled reconciliation; branch/commit provenance; safe retry | TODO |
| NB-07 | Workspace index and capability evidence | NB-01, NB-06 | Manifests/files/symbols/capabilities indexed with repo/commit/test evidence and incremental updates | TODO |
| NB-08 | Hybrid retrieval and reuse coverage | NB-05, NB-07 | Lexical+vector+scope retrieval; explainable full/partial/missing coverage; no unsupported percentage | TODO |
| NB-09 | Memory/event compiler and decision tiers | NB-04, NB-05, NB-08 | Candidate→source verification→dedup/conflict→canonical; deterministic-first; model abstention/fallback tests | TODO |
| NB-10 | Windows Everything Edge + Git adapter | NB-01 | Journal cursor, root/ignore filters, Git branch/diff, burst grouping, offline fallback and health | TODO |
| NB-11 | Uncommitted snapshot/restore path | NB-03, NB-10 | Encrypted unique create-only snapshots, ownership/scope checks, offline queue, verified restore; no auto-commit | TODO |
| NB-12 | Provider adapters and project integrations | NB-05, NB-09 | Claude, Codex, Gemini/Antigravity and Jules use same contracts; scoped auth; no duplicated memory | TODO |
| NB-13 | Maestri control plane as Nexus module | NB-02, NB-05 | Session/Event Store, Task DAG, Progress, scheduler, recovery and budgets share the Brain contracts | TODO |
| NB-14 | Agent Factory, policy, approvals and bounded execution | NB-13 | Validated AgentDefinitions, revocable scoped capabilities, risk gates, bounded loops and audit evidence | TODO |
| NB-15 | Local Runtime, Codex Cloud and Jules execution | NB-12, NB-13, NB-14 | Isolated workspaces/branches, resumable jobs, quota-safe retries, independent tests and no direct main merge | TODO |
| NB-16 | Council/C4, evidence and review/report flow | NB-13, NB-14 | Identical snapshots, independent reviews, mandatory structured report, owner approval and acceptance manifest | TODO |
| NB-17 | MCG Context Gateway/Token Firewall integration | NB-05, NB-10, NB-13 | Keep existing bounded batch/redaction; prove live provider path and paired tokens/round-trip benchmark without quality loss | TODO |
| NB-18 | Dashboard/reporting and design/accessibility | NB-17 | Every registered view has clear source/scope/measurement/unavailable report; reference fidelity, keyboard, screen reader, touch | TODO |
| NB-19 | GitHub Actions, security and branch governance | NB-01, NB-02 | CI/security workflows, least token permissions, actual required checks/protection verified; audit current alert findings | TODO |
| NB-20 | Backup, PITR, immutable vault and disaster recovery | NB-03, NB-04 | Unique backups, retention/soft-delete, PITR and tested restore; immutable lock only after restore gate | TODO |
| NB-21 | Observability, budgets and operational runbooks | NB-05, NB-09, NB-13 | Health/latency/sync/conflicts/usage/errors and alert reports backed by real measurements | TODO |
| NB-22 | Cross-provider, offline, security and recovery E2E | NB-05–NB-21 | Cross-write/read, new session/PC, offline recovery, hostile inputs, authorization and disaster restore pass | TODO |
| NB-23 | Release, source-email cleanup and final synchronization | NB-00–NB-22 | All source/coverage checks pass; final docs committed/pushed; only authorized email messages trashed; local/remote synced | TODO |
| NB-24 | Canonical monorepo AS-IS→TARGET map and boundary proof | NB-00 | Every tracked source/test/config/doc/workflow has one owner and destination or explicit defer/exclude; duplicate candidates and current relative-import/workspace graph recorded; package dependency DAG is acyclic by design; no source moved before map review | VALIDATING |
| NB-25 | Shared contracts, schemas, registries and architecture gates | NB-24 | Contracts consolidated by domain without breaking versions; invalid registry source paths corrected from real owners; architecture-boundary tests and import graph gate reject cycles/forbidden imports | VALIDATING |
| NB-26 | Domain package migration | NB-25 | Brain, control-plane, execution, routing, providers, contracts, evidence and governance moved in dependency order; unit tests adjacent; no duplicate authoritative store/router/memory engine; public/legacy APIs pass compatibility tests | VALIDATING |
| NB-27 | Executable apps and Windows Edge migration | NB-26 | Existing gateway/dashboard/CLI/local-runtime code placed in apps/packages by runtime ownership; MCP, daemon, hooks, launchers and workspace references updated; no empty apps or second runtime/dashboard | IN_PROGRESS |
| NB-28 | PNPM, integration tests, evals, docs and GitHub architecture | NB-25, NB-26, NB-27 | Frozen workspace install; imports/typecheck/unit/integration/e2e/security/fuzz/evals pass; architecture docs/ADRs/README/status updated; CODEOWNERS and issue/PR templates have verified owners; CI/security/Dependabot paths work without permanently pending required checks | IN_PROGRESS |
| NB-29 | Canonical local path cutover and final local/GitHub sync | NB-01, NB-28 | Safely rename checkout to `%USERPROFILE%\.lumenva\nexus-brain`; migrate only verified active references; stop legacy MCP/autostart; validate project config/hooks/launchers; Git/remote/branch/worktrees/CI synchronized; global old-path/name scan has zero active in-scope hits | IN_PROGRESS |

### Dependency waves

```text
Wave 0: NB-00 → NB-01 → NB-02
Wave 1: NB-03 → NB-04 → NB-05
Wave 2: NB-06 / NB-10 / NB-19 (independent ownership after contracts)
Wave 3: NB-07 → NB-08 → NB-09; NB-10 → NB-11
Wave 4: NB-12 → NB-13 → NB-14 → NB-15 / NB-16 / NB-17
Wave 5: NB-18 / NB-20 / NB-21
Architecture migration: NB-24 → NB-25 → NB-26 → NB-27 → NB-28 → NB-29
Final product gate: NB-22 and NB-28 → NB-23 (NB-29 also required for canonical local/GitHub sync)
```

No parallel worker/Jules session is part of the current authorization. When later authorized, every work package must have one owner, disjoint write scope, branch/worktree, TDD tests, acceptance contract and integration gate. Never start dependent tasks together or allow a worker to merge directly to `main`.

## 7. GitHub, local protection and toolchain gates

Before changing protections or installing tools, record current state and consult current official documentation. Verify public/private visibility, `main`, Actions, workflow permissions, required checks, rulesets, CodeQL/secret/dependency scanning, Dependabot and branch deletion/force-push policy. Do not treat a passing workflow as a required merge gate unless GitHub confirms it is enforced. Avoid broad settings changes and third-party actions without pinning/security review. Local hooks are supplementary; GitHub is authoritative.

Toolchain inventory covers Windows/global, repository-local, CLI, agents, skills, MCPs, runtimes, tests, security, observability, GitHub and cloud. Each item is `EXISTS`, `CONFIGURED`, `PARTIAL`, `MISSING`, `UNVERIFIED` or `UNNECESSARY`; never install duplicates before inventory. Jules readiness requires official docs plus a safe real-repository smoke test, scoped repository access, environment setup/secrets, session/branch/result review and quota-safe operation.

## 8. Security, authority and non-goals

- User decisions and verified code/config/test/runtime evidence outrank agent inference. Memory candidates require provenance and scope checks.
- Least privilege; no secrets in logs, context, execution records, reports or source archives. Edge receives only short-lived scoped identity, not cloud-admin or database credentials.
- No direct-main worker writes, force-push, destructive cleanup, auto-merge, auto-commit backup, Docker install, paid provider calls, model training, irreversible bucket lock, or CRM/voice migration without the applicable explicit authorization and gates.
- Separate global agent profiles from project integration. A project instruction or skill does not prove a Windows-global config is active.
- Keep models/providers replaceable. The product owns contracts, evidence, memory, task state and recovery.

## 9. Objective progress

The implementation denominator is now 30 work packages NB-00..NB-29. NB-24..NB-29 were added for the user-requested canonical monorepo restructuring; these extend rather than replace the original product blueprint. Only `DONE` counts; `IN_PROGRESS`, `VALIDATING`, `BLOCKED` and `TODO` do not. Component-specific acceptance remains separately labeled (for example, MCG 4/7 = 57% MCG-only); do not average it into the Nexus total.

Current verified tracker state: `DONE 1/30`, `BLOCKED 2/30`, `IN_PROGRESS 7/30`, `TODO 20/30`; **Nexus implementation progress: 3%, remaining: 97%**. Only NB-00 is complete; NB-01 and NB-29 remain blocked by active Codex/MCP consumers and the daemon’s current checkout path. NB-24, NB-25, NB-26 and NB-27 are in progress; their AS-IS→TARGET map is documented in [`../migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md`](../migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md). Six registries, 12 versioned schemas, the JS validator, shared TypeScript contracts, an architecture graph gate, Local Runtime→Edge, context compiler/memory→Brain, Evidence, Context Gateway core/registry/provider discovery, Maestri session/task stores→Control Plane, and Maestri Wire client + authenticated daemon-control→Edge are implemented locally and pass the documented local gates. They still require broader package migration/acceptance and GitHub CI. The operational MCG daemon/inbox state and autostart have not been cut over; CLI and dashboard remain to migrate. Dashboard, Token Firewall and GitHub/security work remain partial under their larger Nexus acceptance gates. This is not a claim that existing MCG code is absent.

### NB-01 audit record

The ownership and local-path audit is [`NB-01_SOURCE_OWNERSHIP_AND_LOCAL_PATH_AUDIT.md`](NB-01_SOURCE_OWNERSHIP_AND_LOCAL_PATH_AUDIT.md). Its 2026-09-25 daemon re-audit establishes that the MCG daemon is the active local inbox/Wire bridge, identifies its Codex parent, state root, two current Codex-hosted MCP launchers, and duplicate logon mechanisms. The obsolete Scheduled Task targeting the separate Desktop MCG repository is disabled; the daemon, state data and remaining Startup shortcut are preserved. No Lumenva branch/worktree or unrelated CRM/voice file was changed. Do not rename the checkout until active consumers are safely redirected and the exact state/config migration can be validated.

### Canonical architecture migration

The migration audit/map and safe waves are in [`../migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md`](../migration/NEXUS_CANONICAL_ARCHITECTURE_MIGRATION.md). It documents existing versus target-only code, non-equivalent duplicate candidates, dependency cycles, and the newly verified daemon/Wire lifecycle. NB-24 remains open until each tracked file is owned and the full dependency graph is reviewed. NB-25 has locally migrated registries and shared JS/TS contracts and added an enforced architecture graph test; it remains open until the broader domain package graph and GitHub CI acceptance are complete.

## 10. Email deletion gate

The seven emails are authorized for deletion only after all of these are true:

1. Each exact source attachment is present under `docs/blueprints/sources/` and has matching byte size/hash to the retrieved attachment.
2. The prior Maestri blueprint’s detailed body is retained behind a supersession banner as historical source, and this Nexus blueprint is the sole active tracker.
3. The source ledger and decisions above have been checked against every source; unresolved conflicts remain explicit.
4. The canonical file is reopened and checked for required sections, all seven source paths, all work-package IDs, and the historical blueprint reference.
5. Email search is repeated by exact attachment filename/message identity; only those seven identified messages are moved to Gmail Trash. Verify all seven are in Trash and no unrelated message was touched.

Do not permanently delete. If any gate fails, leave all source emails untouched and report the exact blocker.

## 11. Final acceptance

Nexus Brain is complete only when NB-00..NB-23 are `DONE`, full-workspace checks and provider-backed gates pass, every capability has evidence, security/backup recovery is verified, all sources remain preserved, and local `main` is synchronized with GitHub `main`. No overall completion claim is made from MCG’s 4/7 score.
