# Nexus Brain — Master Implementation Blueprint

**Canonical project:** Nexus Brain (`trydavidqix/nexus-brain`)
**Default branch:** `main`
**Status:** ACTIVE — consolidation and implementation not complete
**Last reconciled:** 2026-09-26

This is the only active cross-project implementation tracker. Nexus Brain itself is one product and one monorepo. The ecosystem it manages is explicitly multi-project: many independent projects, repositories, workspaces, sessions and agents may be registered and governed by Nexus without being moved into the Nexus monorepo. “Maestri”, “Lumenva Brain”, “Context Gateway/MCG”, “Local Runtime”, “Cloud Fabric”, “Command Center” and “Everything Edge” name historical designs or internal modules—not separate products or repositories. CRM, voice, social-business/Meta integrations, tenant business data and unrelated Lumenva code remain out of scope unless a later explicit decision identifies an exact owned path.

## 1. Mission and completion rule

Build one durable, evidence-based agent platform that owns shared memory/context, project intelligence, task/session orchestration, safe execution, provider integrations, Windows edge sensing, governance, observability and recovery. Memory safety principle: **Agents produce observations; evidence produces knowledge.** Shared memory exists to distribute verified, scoped, source-backed knowledge—not to make multiple models repeat the same unsupported claim. GitHub is the source of truth for code and versioned policy; the cloud service is the source of truth for canonical memory, project index and operational records; the local Edge is a bounded sensor/bridge, not another brain.

Implementation order for every work package:

`scope and owner → failing test/evidence plan → implement → test → independent validation → update this blueprint → next package`

`DONE` requires the package acceptance criteria and evidence. A written design, skill, successful CI run, or agent claim alone is not implementation proof. Unknowns stay `UNRESOLVED`; no percentage is inferred from elapsed time or prose.

**Current operational phase:** `MIGRATION READINESS`. The implementation additions below are the next phase only. Do not begin Hindsight rollout, Code Intelligence, Task Intelligence, new Skills/SOP extraction, tool-profile rollout or other Blueprint feature implementation until migration readiness is 100%, local/GitHub are synchronized, the working tree is clean, and the migration phase has explicitly stopped.

## 2. Canonical system boundary

```text
NEXUS BRAIN — ONE PLATFORM / ONE BRAIN / ONE CONTROL PLANE
├── Nexus codebase: one product and one monorepo
├── Project Registry: project identity, repository/workspace binding, stack, policy, permissions and lifecycle
├── Control plane (Maestri): session/task state, DAG, routing, approvals, budgets, scheduler and project-aware orchestration
├── Brain services: global/project/session/task memory, temporal facts, provenance, context, retrieval and reusable capabilities
├── Memory runtime: Hindsight API + dedicated background worker service(s) over canonical PostgreSQL/pgvector
├── Task Intelligence: task-boundary detection, task-scoped retrieval, validated reusable Skills/SOPs
├── Code Intelligence: replaceable structural-code backend for symbols, calls, dependencies, impact, tests, Git changes and cross-repo evidence
├── Execution: agent factory/supervisor, local runtime, Codex Cloud, Jules/provider adapters
├── Edge: Windows Everything 1.5 + Git + minimal Lumenva Edge/MCP bridge
├── Interfaces: Claude Code, Codex, Gemini CLI, Antigravity, Jules
├── Operations: multi-project dashboard/reports, traces, CI/security, backups and disaster recovery
└── Governance: contracts, evidence, project isolation, branch/PR gates and auditable cleanup

MANAGED ECOSYSTEM
├── MANY independent projects
├── MANY repositories
├── MANY local/cloud workspaces
├── MANY sessions/tasks
└── MANY agents/providers
```

Reuse the existing Nexus repository, tests, MCG dashboard, Local Runtime and transferred Maestri/Cloud Fabric files where ownership is proven. Managed projects remain in their own repositories/workspaces; registering a project must not require copying or vendoring that project's code into Nexus. Do not create a second memory engine, task store, router, dashboard, MCP surface, filesystem watcher or governance policy. Preserve old package/API names as compatibility identifiers until an individually tested migration changes them; renaming the GitHub repository does not authorize a blind code-wide rename.

## 3. Reconciled architecture decisions

| Concern | Canonical V1 decision | Preserved alternative / status |
|---|---|---|
| Product identity | Nexus Brain is the sole platform product; legacy systems become internal modules. The Nexus codebase remains one monorepo, while the managed ecosystem is many independent projects/repositories/workspaces. | Historical source documents retain their original names for provenance. |
| Deployment | Cloud-first: Brain API/MCP, canonical DB, indexer, compiler, **Hindsight API + dedicated Hindsight worker service(s)** and backups run in Google Cloud. Hindsight API and workers scale independently while sharing the canonical PostgreSQL state. | Early local-first SQLite/vector design is preserved as history; no local authoritative database in V1. |
| Canonical stores | GitHub = code/config; Cloud SQL PostgreSQL + pgvector = Brain state; Cloud Storage = versioned recovery artifacts. | Firebase SQL Connect is not on the V1 critical path; reconsider only for a concrete UI/app need. |
| Local machine | Tiny Edge uses Everything 1.5 Journal + Git; queue/snapshots are bounded, encrypted, and non-authoritative. | Do not build a recursive scanner or parallel filesystem watcher. Fallback to Git status/diff if Everything is unavailable. |
| Memory/indexing | One Nexus-owned memory API and canonical provenance/temporal model; **Hindsight is the V1 memory engine behind a replaceable `MemoryEngine` adapter, not the authority**. Agent/model/Hindsight outputs are observations or candidates, never truth by assertion. Memory lifecycle is `OBSERVED → CANDIDATE → VERIFIED → CANONICAL`, with `SUPERSEDED`, `CONFLICTED` and `REVOKED` states. Canonical promotion remains Nexus-owned and requires provenance, scope and supporting evidence. | **Graphiti is deferred as a benchmark alternative**, not installed in V1. Evaluate it only if a concrete graph/temporal retrieval limitation is proven. |
| Retrieval/reuse | Hindsight V1 supplies semantic, lexical, graph/relationship and temporal retrieval over the PostgreSQL/pgvector memory stack; Nexus applies project/task scope, evidence/provenance/freshness policy and Context Compiler filtering before provider delivery. More memory is not automatically better context. | No Neo4j, Graphiti deployment, second vector DB, or second authoritative memory engine in V1. |
| Code Intelligence | Nexus owns a provider-neutral `CodeIntelligenceEngine`; **codebase-memory-mcp is the initial V1 adapter/backend candidate after pinned-version, security, Windows and correctness validation**. It provides structural code evidence (AST/LSP graph, callers/callees, imports, routes, tests, Git changes, impact and cross-repo relationships), not canonical truth. | Do not make any code-graph backend authoritative. If coverage/confidence is insufficient, fall back to direct Git/file/test/runtime evidence. The adapter must remain replaceable. |
| Task Intelligence | Nexus-native task-boundary detection separates multiple tasks inside a session, narrows retrieval to the active task, and can derive reusable Skills/SOP candidates only from evidenced successful work. | Patterns observed in TencentDB Agent Memory/community forks are implementation references, not a second memory/control plane. No automatic promotion of generated Skills to global/canonical status. |
| Context delivery | Nexus can assemble a bounded edit/context bundle combining current code structure, tests, blast radius, Git changes, verified memory and evidence; Maestri selects a minimal tool profile for the task. | Avoid exposing the full MCP/tool catalog or bulk repository/memory context to every agent by default. |
| MCP | One stable Brain MCP surface. V1 tools: `brain_context`, `brain_search`, `brain_reuse`, `brain_remember`, `local_search`, `brain_status`. | Earlier 8-tool variants remain in source archive; aliases may be added only for proven client compatibility. |
| Compiler/decision | Deterministic rules first; one Gemini compiler for V1 behind provider-neutral interface; larger models only for ambiguous cases. | Multiple compilers, Laya/classifier choices and routing thresholds remain deferred/experimental until benchmarked. No custom training in V1. |
| Agents/runtime | One task/session/event model; Agent Factory, policy, evidence and bounded loop are shared by local/cloud/Jules execution. | Council, C4, AutoImprove and learned Reflex are later gated modules, not duplicate control planes or V1 prerequisites. |
| Provider/native directories | Codex, Claude Code, Gemini/Antigravity and other provider runtimes keep their official global install/config/state directories under provider ownership. Nexus integrates only through supported interfaces such as MCP, API, CLI, hooks and project-level configuration; it must not relocate, fork, vendor, patch or convert provider home/install directories into Nexus-owned paths. | Project-scoped adapter/config files may live in Nexus when officially supported. Official provider updates must remain independently applicable without requiring Nexus directory migration. |
| Recovery | GitHub for committed code; unique create-only snapshots for uncommitted work; Cloud SQL backup/PITR and a separate GCS recovery vault. | Never use mutable `latest.zip`, auto-commit as backup, or irreversible retention locks before restore tests. |
| Scope | Only Nexus Brain-owned platform code enters this repo. External projects are registered, indexed and governed in place through project identity + repository/workspace bindings; they are not absorbed into the Nexus monorepo. | CRM, voice, Meta/social-business and tenant/business code remain outside this repo unless a later explicit migration decision changes ownership. |

## 3A. Multi-project platform model

Nexus is not a single-project brain. It is the permanent control and intelligence platform for present and future projects.

Core invariant:

`NEXUS ITSELF = one product + one monorepo`

`NEXUS-MANAGED ECOSYSTEM = many independent projects + repositories + workspaces + sessions + agents`

### Project Registry

Every managed project has a stable `project_id` and registry record binding at minimum:

- canonical repository and default branch;
- optional local/cloud workspace locations;
- project lifecycle/status;
- stack/runtime metadata;
- allowed agents/providers/tools;
- project policies, approvals and budgets;
- project memory/knowledge namespace;
- task/session/evidence namespace;
- Git/CI/deployment bindings where applicable.

Project metadata may be discovered from repository evidence and/or an optional project-scoped descriptor (for example `.nexus/project.yaml`) when later justified. The descriptor is metadata, not a requirement to relocate the project.

### Memory and context scopes

Shared memory must be explicitly scoped. V1 scope model:

`GLOBAL → PROJECT → SESSION → TASK`

Agent-private scratch state may exist, but it is not canonical shared memory by default.

Retrieval order is project-aware and task-bounded: task/session context first, then project memory, then only relevant global knowledge. Cross-project reuse is allowed only for evidence-backed reusable capabilities/patterns and must never leak project-specific secrets, incompatible decisions or stale configuration into another project's context.

### Maestri role

Maestri is the Nexus-native control plane/orchestrator, not a separate product and not a project-specific agent. It receives operator intent, resolves `project_id`, loads the project's registry/policy/context, routes work to the appropriate provider/runtime, tracks tasks/sessions/evidence, and keeps authority over lifecycle, budgets, approvals and recovery.

Provider agents execute bounded work inside the selected project's repository/workspace. They do not become the source of truth for project identity, task state, policy or canonical memory.

### Multi-project Control Center

The Nexus Control Center must support portfolio-level and project-level views. Portfolio view shows registered projects, health/status, active tasks, agents, budgets, incidents and blockers. Project drill-down exposes that project's tasks, sessions, memory, knowledge, Git/PRs, tests, deployments, evidence, costs and history without mixing unrelated project state.

## 3B. V1 memory engine: Hindsight

**Decision:** Hindsight is the V1 memory engine. Nexus Brain remains the authority over canonical truth, scope, provenance, conflict resolution, policy and context delivery.

```text
Nexus Brain API
      ↓
Memory Governance
      ↓
MemoryEngine interface
      ↓
HindsightAdapter (V1)
      ↓
Hindsight API
   ↙       ↘
PostgreSQL  Hindsight Worker(s)
 + pgvector   (background processing)
```

The Hindsight API and worker service(s) are separate runtime roles. The API serves Nexus memory operations; workers process asynchronous/background memory work. They share the same canonical PostgreSQL/pgvector state and must be independently observable and scalable.

### Responsibility boundary

Nexus owns:

- canonical memory lifecycle and promotion policy;
- `OBSERVED/CANDIDATE/VERIFIED/CANONICAL/SUPERSEDED/CONFLICTED/REVOKED` states;
- provenance/evidence requirements;
- GLOBAL/PROJECT/SESSION/TASK scopes;
- project isolation and cross-project reuse policy;
- conflict handling, freshness rules and source re-check;
- Context Compiler and Token Firewall;
- provider-facing Brain API/MCP contracts.

Hindsight owns V1 memory-engine mechanics behind the adapter:

- retain/ingest memory candidates;
- semantic retrieval;
- lexical retrieval;
- relationship/graph-assisted retrieval;
- temporal retrieval;
- ranking/reranking and memory-engine indexing;
- optional reflection only as non-canonical inference.

**Hindsight output never self-promotes to canonical truth.** Any `reflect`, inferred relation, summary or model-generated conclusion re-enters Nexus as `OBSERVED` or `CANDIDATE` and must pass normal verification policy.

### Multi-project banks, tags and retrieval

Use **one Hindsight bank per project**, plus one separate global bank:

```text
bank: global
bank: project:<project_id>
```

`SESSION` and `TASK` remain Nexus scopes, but are represented inside the relevant project bank with Hindsight tags/metadata rather than separate banks:

```text
tag: session:<session_id>
tag: task:<task_id>
tag: scope:project|session|task
tag: type:<memory_type>
```

The invariant is strong isolation by `project_id`: a project bank contains that project's memory; session/task tags narrow retrieval inside it. Cross-project retrieval is denied by default.

For normal task context, Nexus performs **separate retrievals** and owns the merge:

```text
1. query project:<project_id> bank with task/session tags
2. query global bank only when reusable global knowledge is relevant
3. apply Nexus provenance/freshness/conflict/security policy
4. merge + deduplicate + rank
5. Context Compiler + Token Firewall
6. deliver bounded context to the provider agent
```

Hindsight banks do not become an implicit cross-project sharing mechanism. Only evidence-backed reusable knowledge may be promoted to the global bank by Nexus policy.

### Replaceability

Nexus code must depend on an internal `MemoryEngine` contract, not directly on Hindsight APIs throughout the codebase. Minimum V1 adapter surface:

```text
retain()
recall()
search()
relate()
reflect()
health()
```

The Hindsight-specific implementation lives behind `HindsightAdapter`. Provider agents call Nexus Brain API/MCP, not Hindsight directly.

### Graphiti status

Graphiti is **DEFERRED / BENCHMARK ALTERNATIVE** for V1. Do not operate Hindsight and Graphiti as parallel authoritative memory systems. Benchmark Graphiti only if a real Nexus workload demonstrates insufficient graph traversal, temporal relationship quality, retrieval accuracy or scale with Hindsight. Adoption requires same-task A/B evidence, migration/consistency design and no duplicate source of truth.

## 3C. Task, code and evidence intelligence implementation model

The reverse-engineering review of TencentDB Agent Memory, its task/team-memory derivatives, codebase-memory-mcp and related code-intelligence projects adds implementation detail **without adding new top-level work packages or creating another Brain**.

### Internal contracts first

Nexus code depends on internal contracts, not vendor APIs throughout the codebase:

```text
MemoryEngine
├── retain()
├── recall()
├── search()
├── relate()
├── reflect()
└── health()

CodeIntelligenceEngine
├── index()
├── searchSymbol()
├── getContext()
├── getCallers()
├── getCallees()
├── getTests()
├── analyzeImpact()
├── getChanges()
└── health()

EvidenceEngine
├── record()
├── validate()
├── supersede()
├── conflict()
└── trace()

TaskIntelligence
├── detectBoundary()
├── currentTask()
├── retrieveSkills()
└── closeTask()
```

V1 mappings:

- `MemoryEngine → HindsightAdapter`.
- `CodeIntelligenceEngine → CBMAdapter` initially, subject to pinned-version/security/correctness validation.
- `TaskIntelligence → Nexus-native`.
- Provider agents call Nexus contracts; they do not call Hindsight or the code-intelligence backend as authorities.

### Evidence lifecycle

Retrieval alone does not prove usefulness. Nexus records a separate evidence lifecycle:

```text
RECALLED → SELECTED → INJECTED → USED → VALIDATED → CONTRIBUTED
```

A memory/Skill may be retrieved and still contribute nothing. Positive contribution requires a concrete link to a decision/change/tool action plus independent validation such as tests, CI, source inspection or another objective checker.

### Task-aware context and Skills

A session may contain multiple tasks. Nexus detects task boundaries and keeps task-scoped context separate:

```text
PROJECT → SESSION → TASK
```

On a new task, old task context is not bulk-carried forward. After evidenced successful work, Nexus may derive a procedural Skill/SOP as a `CANDIDATE`; it becomes project-level or global reusable knowledge only after provenance, compatibility and validation gates.

### Code Intelligence boundary

The initial code-intelligence backend supplies evidence about the **current code**:

- symbols, definitions, callers/callees and imports;
- routes/services and dependency relationships;
- related tests and change/blast-radius analysis;
- Git diff/history signals;
- incremental indexing and bounded cross-repository relationships.

Code-graph output can be incomplete for dynamic frameworks or parser/LSP edge cases. Therefore `CodeIntelligenceEngine` results carry source/project/commit/index version and coverage/confidence metadata. Nexus must fall back to direct file/Git/test/runtime verification when confidence is insufficient.

### Bounded code context bundle

Nexus may expose a provider-neutral edit/context operation that assembles only what a task needs:

```text
target symbol/file
+ current source
+ callers/callees
+ relevant dependencies
+ related tests
+ recent Git changes
+ blast radius
+ verified project memory
+ relevant evidence
→ Context Compiler
→ Token Firewall
→ provider agent
```

This bundle is a Nexus feature, not a direct pass-through of any external MCP implementation.

### Tool profiles

Maestri selects a minimal tool surface per task instead of exposing every tool schema to every provider. Initial conceptual profiles:

```text
core    → context/search/status
coding  → code context/impact/tests/changes
review  → diff/impact/tests/evidence
memory  → remember/search/history/evidence
```

Profiles are capability policies, not provider-native installation changes.

### Cross-project intelligence

Cross-project code/memory reuse is opt-in and policy-gated. Project-specific facts stay isolated. Only evidence-backed reusable abstractions, Skills/patterns or explicitly linked inter-repository relationships may cross project boundaries, with ACL/secrets/version/compatibility checks.

### Implementation sequence after migration readiness

Keep the canonical **25 work packages**. Implement these capabilities as subtasks/acceptance gates inside them:

```text
contracts
→ Project Registry
→ Hindsight memory
→ evidence ledger/governance
→ task intelligence
→ code intelligence adapter
→ incremental indexing
→ bounded code-context bundle
→ Context Compiler/Token Firewall
→ tool profiles
→ validated Skills/SOPs
→ cross-project intelligence
→ Maestri orchestration
→ Control Center
→ paired benchmarks
→ failure/recovery E2E
```

No external project is copied wholesale into Nexus merely because its design is useful. Prefer adapters and independently owned Nexus contracts first; reuse/adaptation of source code requires explicit license, security, maintenance and version-pinning review.

## 4. Current verified baseline

- GitHub repository was renamed to `trydavidqix/nexus-brain`; it is public, `main` remains default, and no repository currently named `trydavidqix/nexus-brain` existed before the rename.
- The local clone’s `origin` now points to `https://github.com/trydavidqix/nexus-brain.git`. The remote HEAD resolved after rename; local documentation and plan sources still need committing/pushing.
- At the pre-change inspection, the checkout was clean on `main`, with no open PRs and only `main` on the remote. Recheck after this documentation change.
- Existing `docs/MASTER_BLUEPRINT_CANONICAL.md` contains a prior Maestri-wide design and source-to-plan map. Its verified snapshot says MCG F0–F2 and F4 are accepted (**4/7 MCG phases, 57% MCG-only**); F3, F5 and F6 are partial. This is not a Nexus-wide percentage.
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

Statuses: `TODO`, `IN_PROGRESS`, `BLOCKED`, `VALIDATING`, `DONE`. Current stage is plan/source reconciliation. Mark a package `DONE` only after its acceptance checks pass and evidence is linked here or in the package’s test/CI artifacts.

| ID | Work package | Depends on | Acceptance gate | Initial status |
|---|---|---|---|---|
| NB-00 | Repository identity, exact source preservation, one canonical tracker | — | GitHub/local name aligned; all source files checksummed and indexed; prior tracker marked historical; no unrelated paths | DONE |
| NB-01 | Nexus monorepo inventory, ownership map and canonical local path | NB-00 | Branch/path ownership audit; exact included/excluded Nexus-owned paths; dependency/import graph; safe folder rename; external projects remain independent | BLOCKED |
| NB-02 | Contracts and threat/scope model | NB-01 | Versioned request, identity, task, memory, evidence and permission schemas; provider-neutral `MemoryEngine`, `CodeIntelligenceEngine`, `EvidenceEngine` and `TaskIntelligence` contracts; backend authority boundaries; conflicts recorded as unresolved | TODO |
| NB-03 | Cloud baseline and least-privilege infrastructure | NB-02 | Officially validated Google project/services/IAM/secrets/logging; reproducible IaC; independently deployable/observable Hindsight API + worker service(s); shared Cloud SQL connectivity; no permanent GitHub cloud key | TODO |
| NB-04 | Canonical database, temporal memory and provenance | NB-02, NB-03 | PostgreSQL/pgvector canonical store; Hindsight V1 behind Nexus ownership; one `global` bank + one `project:<project_id>` bank per registered project; session/task represented by scoped tags/metadata; append-only observations/events; `OBSERVED/CANDIDATE/VERIFIED/CANONICAL/SUPERSEDED/CONFLICTED/REVOKED`; evidence lineage plus `RECALLED/SELECTED/INJECTED/USED/VALIDATED/CONTRIBUTED` attribution; ACL/scope; restore test | TODO |
| NB-05 | Brain API and one MCP contract | NB-02, NB-04 | Provider-neutral Nexus Brain API/MCP fronts internal engines; Hindsight/code-intelligence backends are not called directly by agents as authorities; authenticated context/search/remember/reuse/status plus bounded code/edit-context capability; `remember` stores observations/candidates unless Nexus policy passes; responses expose status/provenance/source/coverage; contract tests; bounded context | TODO |
| NB-06 | GitHub project indexer and sync/reconciliation | NB-02, NB-03, NB-04 | Idempotent webhook + scheduled reconciliation; branch/commit provenance; safe retry | TODO |
| NB-06A | Project Registry and multi-project identity/scope | NB-02, NB-04, NB-06 | Stable project IDs; repo/workspace bindings; lifecycle/stack metadata; per-project policies/agent permissions/budgets; memory bank + code-index binding/version/health; global/project/session/task namespaces; cross-project isolation tests; project registration without code relocation | TODO |
| NB-07 | Workspace index, Code Intelligence and capability evidence | NB-01, NB-06, NB-06A | `CodeIntelligenceEngine` with initial validated CBM adapter; per-project files/symbols/calls/imports/routes/tests/dependencies/Git-change evidence; incremental re-index; impact/blast-radius queries; coverage/confidence + source/commit/index-version metadata; bounded cross-repo links; safe direct-source fallback; no namespace collision | TODO |
| NB-08 | Hybrid retrieval, task-aware context and reuse coverage | NB-05, NB-07 | Hindsight semantic/lexical/relationship/temporal retrieval plus code-evidence retrieval; task-boundary-aware project/session/task selection; project bank first and global separately only when relevant; policy filter/merge/dedup/rank; conflicted/revoked excluded; minimal context; abstention when evidence is weak; safe reusable cross-project lookup; explainable full/partial/missing coverage | TODO |
| NB-09 | Memory/event compiler, Skills and decision tiers | NB-04, NB-05, NB-08 | `OBSERVED→CANDIDATE→source verification→dedup/conflict→VERIFIED→CANONICAL`; deterministic-first; Hindsight inference and derived Skills/SOPs remain candidates until validated; task-success evidence can generate procedural-memory candidates; project→global promotion requires compatibility/provenance gates; contradictions yield `CONFLICTED`; verified newer facts supersede without erasing history; abstention/fallback tests | TODO |
| NB-10 | Windows Everything Edge + Git adapter | NB-01 | Journal cursor, root/ignore filters, Git branch/diff, burst grouping, offline fallback and health | TODO |
| NB-11 | Uncommitted snapshot/restore path | NB-03, NB-10 | Encrypted unique create-only snapshots, ownership/scope checks, offline queue, verified restore; no auto-commit | TODO |
| NB-12 | Provider adapters and project integrations | NB-05, NB-09 | Claude, Codex, Gemini/Antigravity and Jules use the same Nexus contracts through supported interfaces; Maestri/Nexus assigns minimal task-specific tool profiles; provider outputs enter as observations/candidates, never automatic truth; native provider directories remain provider-owned/untouched; official updates remain independent; scoped auth; no duplicated memory | TODO |
| NB-13 | Maestri control plane as Nexus-native multi-project orchestrator | NB-02, NB-05, NB-06A | Resolves project identity before execution; owns task-boundary lifecycle and active-task selection; selects provider/tool profile; Session/Event Store, Task DAG, Progress, scheduler, recovery and budgets are project-scoped and share Brain contracts; Maestri remains platform-wide, not tied to one repository | TODO |
| NB-14 | Agent Factory, policy, approvals and bounded execution | NB-13 | Validated AgentDefinitions, revocable scoped capabilities/tool profiles, risk gates, bounded loops, evidence-attribution hooks and audit evidence; provider execution never bypasses project/task/code/memory scope | TODO |
| NB-15 | Local Runtime, Codex Cloud and Jules execution | NB-12, NB-13, NB-14 | Isolated workspaces/branches, resumable jobs, quota-safe retries, independent tests and no direct main merge | TODO |
| NB-16 | Council/C4, evidence and review/report flow | NB-13, NB-14 | Identical snapshots, independent reviews, mandatory structured report, owner approval and acceptance manifest | TODO |
| NB-17 | MCG Context Gateway/Token Firewall integration | NB-05, NB-10, NB-13 | Merge Nexus-filtered Hindsight memory + Code Intelligence evidence into bounded task/edit-context bundles; keep existing bounded batch/redaction; dedupe/compact tool output; expose minimal tool schemas; exclude conflicted/revoked/stale evidence by default; prove live provider path and paired token/tool-call benchmark with lower cost and no quality/accuracy loss | IN_PROGRESS |
| NB-18 | Multi-project Control Center/dashboard/reporting and design/accessibility | NB-17, NB-06A | Portfolio + project drill-down; project memory states/conflicts, task boundaries, Skills/SOP candidates, code-index health/coverage, evidence attribution, active agents/tasks/costs/incidents; clear project/source/scope/measurement/unavailable reports; no cross-project leakage; reference fidelity, keyboard, screen reader, touch | IN_PROGRESS |
| NB-19 | GitHub Actions, security and branch governance | NB-01, NB-02 | CI/security workflows, least token permissions, actual required checks/protection verified; audit current alert findings | IN_PROGRESS |
| NB-20 | Backup, PITR, immutable vault and disaster recovery | NB-03, NB-04 | Unique backups, retention/soft-delete, PITR and tested restore; immutable lock only after restore gate | TODO |
| NB-21 | Observability, budgets and operational runbooks | NB-05, NB-09, NB-13 | Health/latency/sync/conflicts/usage/errors backed by real measurements; Hindsight API/worker health and backlog; Code Intelligence index age/coverage/failures/watchers; retrieval funnel and `RECALLED→…→CONTRIBUTED` metrics; token/tool-call budgets; fallback/degradation/scaling runbooks | TODO |
| NB-22 | Cross-provider, cross-project, offline, security and recovery E2E | NB-05–NB-21 | Cross-write/read; project isolation; safe cross-project reusable knowledge/code links; new project/session/PC; task-boundary changes; stale/contradictory memory; incomplete/wrong code graph; dynamic-framework fallback; index lag/crash; Hindsight/worker/code-intelligence/provider outages; proof unsupported provider claims cannot become canonical; authorization/hostile inputs/restore; paired baseline vs memory vs task+code-context evals for success, tokens, tool calls, latency and wrong-context rate | TODO |
| NB-23 | Release, source-email cleanup and final synchronization | NB-00–NB-22 | All source/coverage checks pass; final docs committed/pushed; only authorized email messages trashed; local/remote synced | TODO |

### Dependency waves

```text
Wave 0: NB-00 → NB-01 → NB-02
Wave 1: NB-03 → NB-04 → NB-05
Wave 2: NB-06 / NB-10 / NB-19 (independent ownership after contracts)
Wave 3: NB-06 → NB-06A → NB-07 → NB-08 → NB-09; NB-10 → NB-11
Wave 4: NB-12 → NB-13 → NB-14 → NB-15 / NB-16 / NB-17
Wave 5: NB-18 / NB-20 / NB-21
Final:  NB-22 → NB-23
```

No parallel worker/Jules session is part of the current authorization. When later authorized, every work package must have one owner, disjoint write scope, branch/worktree, TDD tests, acceptance contract and integration gate. Never start dependent tasks together or allow a worker to merge directly to `main`.

## 7. GitHub, local protection and toolchain gates

Before changing protections or installing tools, record current state and consult current official documentation. Verify public/private visibility, `main`, Actions, workflow permissions, required checks, rulesets, CodeQL/secret/dependency scanning, Dependabot and branch deletion/force-push policy. Do not treat a passing workflow as a required merge gate unless GitHub confirms it is enforced. Avoid broad settings changes and third-party actions without pinning/security review. Local hooks are supplementary; GitHub is authoritative.

Toolchain inventory covers Windows/global, repository-local, CLI, agents, skills, MCPs, runtimes, tests, security, observability, GitHub and cloud. Each item is `EXISTS`, `CONFIGURED`, `PARTIAL`, `MISSING`, `UNVERIFIED` or `UNNECESSARY`; never install duplicates before inventory. Jules readiness requires official docs plus a safe real-repository smoke test, scoped repository access, environment setup/secrets, session/branch/result review and quota-safe operation.

## 8. Security, authority and non-goals

- User decisions and verified code/config/test/runtime evidence outrank agent inference. Memory candidates require provenance and scope checks.
- Core memory invariant: **agents produce observations; evidence produces knowledge**. No output from Codex, Claude, Gemini/Antigravity, Jules, or Nexus itself becomes canonical solely because a model asserted it.
- Canonical memory is not blind trust. High-impact decisions must retain a path back to source evidence so the acting agent can re-check the current authoritative source when required.
- Contradictions are first-class state: never silently choose between conflicting claims. Record `CONFLICTED`, preserve both evidence chains, and promote only after an objective resolution rule or verified source settles the conflict.
- Fresh verified evidence may mark older canonical facts `SUPERSEDED`; history/provenance remain append-only and auditable.
- Context injection is task-bounded: retrieve the minimum relevant verified information needed for the current task rather than dumping the full shared memory into provider prompts.
- Do not expose Hindsight directly to provider agents as an authority. Agents use Nexus Brain API/MCP; Hindsight remains an internal replaceable engine behind Nexus governance.
- Project banks are isolation boundaries. Session/task scoping uses tags/metadata inside the selected project bank; do not create separate session/task banks by default.
- Project-bank and global-bank retrievals are performed separately and merged only by Nexus after scope, provenance, freshness, conflict and security checks.
- Do not run Graphiti in parallel as a second authoritative V1 memory system. It remains a benchmark alternative until evidence justifies a migration or specialized adapter.
- Do not run TencentDB Agent Memory, MARM, Total Agent Memory, CodeGraph memory, or codebase-memory-mcp memory as parallel authoritative Brains. Their useful patterns/backends may be adapted behind Nexus contracts only.
- Code Intelligence is advisory evidence, not truth. Parser/LSP/graph misses or stale indexes must fall back to direct Git/file/test/runtime verification.
- Task/Skill extraction must not convert a successful-looking agent narrative into reusable procedure without objective task outcome evidence.
- Least privilege; no secrets in logs, context, execution records, reports or source archives. Edge receives only short-lived scoped identity, not cloud-admin or database credentials.
- No direct-main worker writes, force-push, destructive cleanup, auto-merge, auto-commit backup, Docker install, paid provider calls, model training, irreversible bucket lock, or CRM/voice migration without the applicable explicit authorization and gates.
- Keep provider-native global directories and installations external to Nexus. Codex, Claude Code, Gemini/Antigravity and other provider runtimes retain their official install/config/state locations; Nexus must not require moving, forking, vendoring or patching those directories.
- Project integration may add only supported project-level adapters/configuration (for example MCP, API, CLI, hooks or project instructions). A project instruction or skill does not prove a Windows-global config is active, and official provider updates must continue to work independently of Nexus.
- Keep models/providers replaceable. The product owns contracts, evidence, memory, task state and recovery.

## 9. Objective progress

The implementation tracker has **25 work packages total**: NB-00..NB-23 (24 packages) plus NB-06A (Project Registry). This denominator is canonical unless a future blueprint change explicitly adds/removes a package. Only `DONE` counts; `IN_PROGRESS`, `VALIDATING`, `BLOCKED` and `TODO` do not. Component-specific acceptance remains separately labeled (for example, MCG 4/7 = 57% MCG-only); do not average it into the Nexus total.

Current tracker snapshot: `DONE 1/25`, `BLOCKED 1/25`, `IN_PROGRESS 3/25`, `TODO 20/25`; **Nexus implementation progress: 4%, remaining: 96%**. Only NB-00 is complete; NB-01 is blocked by active processes/workspace references to the old local path. Dashboard, Token Firewall and GitHub/security work remain partial under their larger Nexus acceptance gates. This is not a claim that existing MCG code is absent.

### NB-01 audit record

The read-only ownership and local-path audit is [`NB-01_SOURCE_OWNERSHIP_AND_LOCAL_PATH_AUDIT.md`](NB-01_SOURCE_OWNERSHIP_AND_LOCAL_PATH_AUDIT.md). It records the 53-branch Lumenva source inventory, the one-branch Nexus target, selective Maestri ownership boundaries, current dirty/active source worktrees, path-reference checks, and the live daemon/MCP blockers. No Lumenva branch/worktree or unrelated CRM/voice file was changed. Do not rename the local checkout until the recorded blockers are cleared and the full post-rename validation is possible.

## 10. Email deletion gate

The seven emails are authorized for deletion only after all of these are true:

1. Each exact source attachment is present under `docs/blueprints/sources/` and has matching byte size/hash to the retrieved attachment.
2. The prior Maestri blueprint’s detailed body is retained behind a supersession banner as historical source, and this Nexus blueprint is the sole active tracker.
3. The source ledger and decisions above have been checked against every source; unresolved conflicts remain explicit.
4. The canonical file is reopened and checked for required sections, all seven source paths, all work-package IDs, and the historical blueprint reference.
5. Email search is repeated by exact attachment filename/message identity; only those seven identified messages are moved to Gmail Trash. Verify all seven are in Trash and no unrelated message was touched.

Do not permanently delete. If any gate fails, leave all source emails untouched and report the exact blocker.

## 11. Final acceptance

Nexus Brain is complete only when all **25 work packages** (NB-00..NB-23 plus NB-06A) are `DONE`, full-workspace checks and provider-backed gates pass, every capability has evidence, security/backup recovery is verified, all sources remain preserved, and local `main` is synchronized with GitHub `main`. No overall completion claim is made from MCG’s 4/7 score.
