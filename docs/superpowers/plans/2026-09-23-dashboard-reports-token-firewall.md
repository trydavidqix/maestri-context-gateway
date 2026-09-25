# Lumenva Dashboard Reports & Codex Token Firewall Implementation Plan

> **SUPERSEDED (2026-09-24):** This file is preserved as the detailed historical plan and evidence. Do not use it as an active checklist. The single active cross-blueprint plan is [`../../blueprints/NEXUS_BRAIN_MASTER_IMPLEMENTATION_BLUEPRINT.md`](../../blueprints/NEXUS_BRAIN_MASTER_IMPLEMENTATION_BLUEPRINT.md); verified MCG component evidence remains in [`../../STATUS.md`](../../STATUS.md).

> **Current execution rule (2026-09-23):** Work strictly one task at a time. Use no subagents and no parallel Jules sessions. The owner asked to stop for today; Jules Task 3 session `6700594731787502098` is confirmed `PAUSED`. Do not resume or start another session until the owner resumes work. Tasks 1–2 are accepted; Tasks 3–6 remain open as tracked below. The owner has now explicitly requested that the verified current branch changes and reconciled documentation be integrated into `main`; this authorizes only the tested, reviewed changes in this repository, not deployment, daemon restart, global Codex configuration changes, or unrelated worktree/branch merges.

> **Implementation update (2026-09-24):** The historical MCG tracker was `MASTER_BLUEPRINT_CANONICAL.md` §49; its component evidence is retained in `STATUS.md`. F4 reports are implemented for all 13 views but still partial pending metric-specific semantics/accessibility/stale-state checks. F5 exact light/dark palettes, persistent System/Light/Dark selector, matching theme-color metadata, and isolated browser smoke (13 views, both modes, 390px no horizontal overflow) are implemented but not accepted pending visual-reference and accessibility review. Task 3 Token Firewall remains partial; F6 paired benchmark/evaluation/release remains pending. The overall MCG acceptance denominator therefore remains 3/7 = 43%; no new phase has been accepted by this update.

**Goal:** Bring the existing Lumenva Context Gateway dashboard in line with the supplied visual references, provide clear evidence-based reports in all 13 dashboard areas, and measure then reduce avoidable Codex context/tool overhead without changing the permanent CEO/CTO session model.

## Live Progress (2026-09-23, reconciled after stop request)

- **Overall:** 2/6 tasks accepted = **33%**. Only Tasks 1 and 2 meet their completion criteria.
- **Task 3 — PAUSED, not accepted:** Jules session `sessions/17258521812247671830` completed on the correct branch, but its patch was rejected and not applied. It marked a skipped 3000-token benchmark complete, emitted references from a boolean without resolution proof, silently filtered unsafe batch commands, left its summarizer disconnected from the model-facing path, and used an incomplete envelope with inaccurate byte/status semantics. The single rework session `sessions/6700594731787502098` is confirmed `PAUSED` (last API state check: 2026-09-23 20:50 UTC); the owner observed it stuck in “Running code review” and requested stopping for today. No new Jules session was created. The interrupted local draft is preserved in `stash@{0}` (`preserve interrupted local Task 3 draft before Jules retry`); the earlier Jules draft remains in `stash@{1}`. Focused tests on the local draft passed (`node --test test/context.test.mjs test/executor.test.mjs test/core.test.mjs`: 8/8), but it is not integrated or accepted. Full-suite validation on that draft was interrupted and is not a pass. The rework was explicitly told to leave the 3000-token benchmark unchecked because Codex CLI was unavailable in its VM.
- **Task 4 — NOT STARTED/NOT ACCEPTED:** no report implementation has been integrated. A completed Jules proposal was reviewed and rejected because it used placeholder/zero-like values and did not satisfy the report/data-coverage criteria. No user-facing report is considered done from that proposal.
- **Task 5 — NOT STARTED/NOT ACCEPTED:** no theme implementation has been integrated or visually verified. A Jules proposal exists but remains unapplied and requires scope, palette, theme-bootstrap, accessibility, and test review.
- **Task 6 — NOT STARTED:** final accessibility, visual, benchmark, full-suite, evaluation, and documentation gates remain.
- **Branch sync before documentation reconciliation:** `codex/daemon-autostart` was 4 commits ahead of `origin/main`, 0 behind, and equal to `origin/codex/daemon-autostart`; the current full test suite passes 44/44, syntax/import smoke parses 33 modules, and sensitive-data scan passes on 91 files. Task 3 drafts remain preserved in local stashes `stash@{0}` and `stash@{1}`; they are intentionally excluded because neither is reviewed/accepted. Do not drop or publish those drafts as part of this integration.
- **Agent safety:** no other Jules sessions or worktrees were changed. The provider-discovery worktree is separate and is not part of this dashboard/token-firewall merge. No deploy, daemon restart, or global Codex configuration edit occurred.

### Remaining work, in order

1. Finish and validate Task 3; either integrate only safe, tested behavior or explicitly document unsupported optimizations as deferred rather than claiming completion.
2. Implement and verify all 13 evidence-based reports (Task 4), then exact dual-theme design and persistence (Task 5), without invented metrics.
3. Complete Task 6: accessibility/UI checks, full tests and evaluation, isolated Codex output-limit benchmark, and paired 20-task baseline/candidate benchmark. Report unavailable measurements honestly.
4. Reconcile documentation and task status, commit/push only accepted work, and integrate the verified branch changes into `main` as explicitly requested. Keep Tasks 3–6 visibly incomplete; merging the current verified branch does not mean the six-task plan is 100% complete.

**Architecture:** Keep the existing read-only dashboard APIs and telemetry model as the source of truth. Add presentation/report models in the dashboard UI, with raw JSON available only as an optional technical disclosure. Add a measured Token Firewall workflow around the existing Context Compiler, cache, executor, and watcher; do not create a second Codex session, agent, task contract, memory system, or competing telemetry store.

**Tech Stack:** Node.js 22+, native ES modules, built-in Node test runner, HTML/CSS/JavaScript dashboard, existing local telemetry/evidence files, Codex CLI JSONL usage records.

**Spec:** User-provided desktop/mobile dashboard screenshots and palette; `docs/ARCHITECTURE.md`; existing `docs/IMPLEMENTATION_PLAN.md` (preserved, not replaced); current `src/dashboard.mjs`, `src/dashboard-ui.mjs`, `src/codex-usage.mjs`, `src/context/compiler.mjs`, and `src/context/cache.mjs`.

## Global Constraints

- Preserve all pre-existing and uncommitted changes; do not reset, overwrite, or stage unrelated files.
- The user approved synchronizing the full current worktree to `origin/codex/daemon-autostart`; inspect and security-scan the complete snapshot before committing/pushing. Never include files from another repository or worktree.
- Work only in `maestri-context-gateway`; no CRM, other repository, old audit worktree, or global profile changes.
- Keep MCG dashboard APIs read-only, loopback-only, port-configurable, and compatible with the existing `--port` behavior; do not hard-code a competing port.
- The screenshots define visual hierarchy and style, not truthful sample data. Never copy sample values as live metrics or invent unavailable measurements.
- Preserve the one persistent Maestri CEO + one persistent Codex CTO and their current session/context identity. Work one task at a time; never spawn subagents, fork/parallelize Jules sessions, or switch the execution identity to chase token savings. The current Jules session is paused; do not resume it until the owner says to continue.
- Do not change `%USERPROFILE%\.codex\config.toml` during implementation without a separate explicit approval. `tool_output_token_limit = 3000` is a benchmark candidate only, not an assumed optimum.
- Keep evidence and raw tool output outside the model prompt by default; expose exact details only on demand. Never remove evidence needed to audit a result.
- Distinguish exact, estimated, and unavailable measurements. A missing value is not zero; a cache estimate is not provider-reported savings; input usage is not equivalent to subscription allowance or money billed.
- Dashboard prose is Brazilian Portuguese, direct and objective. Technical identifiers, code, logs, and original provider values remain unchanged.

## Review Focus

1. Codex reports reasoning usage separately while also reporting output/total fields: tests must prevent counting a breakdown twice.
2. Empty, malformed, partial, and stale telemetry must produce explicit coverage/unavailable states, never fabricated zeroes or “online” claims.
3. Very large, hostile, or secret-bearing tool output must be safely bounded/redacted in summaries while remaining recoverable as evidence under the existing privacy policy.
4. Every dashboard route and browser-history deep link must render the correct report and retain an optional escaped technical view without breaking on nulls or arrays.
5. Light/dark theme, charts, and alerts must remain readable and keyboard/touch operable at narrow viewport sizes; status must never rely on color alone.

---

## Audited Starting Point

- At plan creation, the `codex/daemon-autostart` checkout contained the listed implementation files and user/prior edits; those changes are part of the four tested commits being integrated. At the latest audit, only this plan's status reconciliation was uncommitted. Preserve both local Task 3 stashes; they are unaccepted drafts, not merge candidates.
- `docs/IMPLEMENTATION_PLAN.md` is an existing, historically augmented plan. This new file is additive; do not rewrite or delete the existing plan/amendments.
- `docs/ARCHITECTURE.md` already requires attributable persisted telemetry, explicit provenance and measurement type, honest unavailable states, read-only dashboard behavior, and loopback access. Its pinned port note is stale relative to the current CLI's configurable `--port`; implementation must preserve the actual current CLI contract and correct docs only as part of the relevant task.
- `src/dashboard.mjs` already exposes 13 views through `/api/views`: Overview, History, Traces, Tasks, Agents, Tools, Plugins, MCPs, Graph, Cache, Memory, Validation, and Alerts.
- `src/dashboard-ui.mjs` already implements the screenshot-oriented overview and responsive CSS. It currently uses a dark navy-only palette and renders Graph as cards, but sends the other 12 detail views to a raw JSON `<pre>`. The mobile MCPs screenshot demonstrates this user-facing gap.
- `src/context/compiler.mjs` already hashes and prioritizes context fragments, bounds optional fragments, computes changes against prior fragments, and emits estimated reuse metrics. `src/context/cache.mjs` currently counts hash hits and estimates avoided tokens; it does not prove provider-side token savings or suppress actual repeated reads by itself.
- `src/codex-usage.mjs` currently computes `total_tokens` as input + output + reasoning, and `test/codex-usage.test.mjs` locks in that behavior. Verify the installed Codex event schema and official semantics, then correct parser/tests if reasoning is a breakdown included in output/total. Preserve provider-reported `total_tokens` when present; otherwise use only the documented, non-overlapping fields.
- The existing test command is `npm test`; focused commands include `node --test test/codex-usage.test.mjs test/dashboard.test.mjs test/metrics.test.mjs` and `npm run smoke:dashboard`.
- Current `%USERPROFILE%\.codex\config.toml` has `model = "gpt-5.6-sol"` and `model_reasoning_effort = "medium"`; the audit found no explicit `tool_output_token_limit`. Do not modify that global file as part of this plan.

## Planned Files and Ownership

- `src/codex-usage.mjs`: canonical Codex usage extraction, deduplication, and measurement labels; no UI formatting.
- `src/context/compiler.mjs`, `src/context/cache.mjs`, `src/executor.mjs`, `src/core.mjs`: Token Firewall integration at existing boundaries only; no parallel engine.
- `src/dashboard.mjs`: keep APIs/data read-only and provide any small normalized report metadata needed by the UI without changing source-of-truth telemetry.
- `src/dashboard-ui.mjs`: accessible report layouts for the 13 existing views, theme tokens/toggle, visual hierarchy and progressive disclosure.
- `test/codex-usage.test.mjs`, `test/dashboard.test.mjs`, `test/metrics.test.mjs`, plus narrowly scoped new tests only if the existing suites cannot cover a distinct component.
- `docs/ARCHITECTURE.md`, `docs/STATUS.md`, and `docs/IMPLEMENTATION_PLAN.md`: update only the relevant documentation/status after implementation; this plan remains the unified implementation checklist and the old plan remains intact.

## Implementation Tasks

### Task 1 — Freeze baseline, schema, and dashboard contract

**Files:** inspect only initially: `src/codex-usage.mjs`, `src/dashboard.mjs`, `src/dashboard-ui.mjs`, `src/context/compiler.mjs`, `src/context/cache.mjs`, `src/executor.mjs`, `src/core.mjs`, `test/codex-usage.test.mjs`, `test/dashboard.test.mjs`, `docs/ARCHITECTURE.md`; later modify only the relevant owner files.

- [x] Record current `git status`, diff of overlapping files, Node/Codex versions, existing dashboard port, API response shape, and current test baseline. Do not stage or discard any pre-existing edit.
- [x] Record the available privacy-safe local usage baseline below. Machine-level/task-level fields not present in local evidence remain explicitly unavailable; aggregate estimates are not presented as provider measurements.
- [x] Verify Codex `codex exec --json` event and config fields against the official SDK event types and official Codex config source. Do not infer ChatGPT allowance or cost from JSONL usage.
- [x] Add/adjust contract tests that enumerate exactly the 13 view keys and verify every view has source, timestamp, and one of `exact | estimated | unavailable`, while preserving each view's existing payload fields.
- [x] Run `node --test test/dashboard.test.mjs test/codex-usage.test.mjs test/metrics.test.mjs`; record baseline failures separately from changes in this plan.

**Done when:** baseline and data contract are documented with no user settings changed; all existing local edits remain present.

**Captured baseline (2026-09-23):** Node `v24.19.0`; Codex CLI `0.155.1`; local Codex model `gpt-5.6-sol`, reasoning effort `medium`; no global `tool_output_token_limit` configured (left unchanged). `node bin/mcg.mjs stats --tokens` observed 9 tasks (8 Codex, 1 Antigravity), 37,229 source chars, 21,422 delivered chars, 15,807 chars avoided. Derived using the existing `chars / 4` estimate only: 9,308 original tokens, 5,356 delivered, 3,952 estimated avoided, 42.46% reduction. This is not provider-exact usage or billing. Exact input/cached/output/reasoning tokens, tool calls/output bytes, model turns, duration, success/retries and context overflow/compaction are unavailable from these aggregates; six old task records lack their exact event/result evidence. MCP/IDE attribution is unavailable. Initial full test baseline before Jules changes: 43/43 passed. Initial branch was clean at `d4fe78e`; dashboard default is `127.0.0.1:7435`, override remains `--port`, and `/api/views` is the 13-view read-only payload contract.

**Official schema check:** [Codex SDK `events.ts`](https://github.com/openai/codex/blob/main/sdk/typescript/src/events.ts) defines `turn.completed.usage` with input, cached input, cache-write input, output, and reasoning-output fields; it does not define `total_tokens` or a per-turn ID. The usage guide confirms cached tokens are included in input, reasoning is included in output, and missing usage is not zero. [Codex config source](https://github.com/openai/codex/blob/main/codex-rs/config/src/config_toml.rs) defines `tool_output_token_limit` as an optional token budget for tool/function outputs. Thus multi-event aggregates in this parser cannot be safely deduplicated from documented event IDs and must remain estimated; no global setting was changed.

### Task 2 — Make Codex usage totals correct and auditable

**Files:** `src/codex-usage.mjs`, `test/codex-usage.test.mjs`, and narrowly scoped usage consumers `src/eval-runner.mjs` / `src/replay.mjs` only if their current assumptions require adjustment.

- [x] Add fixtures for provider-supplied/absent totals, missing output, reasoning as a breakdown, cached input, multiple indistinguishable turn events, and malformed lines.
- [x] Define the invariant: retain provider `total_tokens` exactly if present; otherwise compute only from non-overlapping input/output fields. Keep `reasoning_tokens` separately as a breakdown and never add it twice. Keep `cached_input_tokens` as a subset of input, not an extra sum.
- [x] Aggregate `turn.completed` usage. Official event schema has no per-turn identifier, so multi-event aggregates are explicitly estimated and identical events are not unsafely deduplicated.
- [x] Return per-field provenance and `measurement_type`; distinguish present values from unavailable fields. Preserve backward compatibility for existing consumers or update those consumers/tests together.
- [x] Run `node --test test/codex-usage.test.mjs test/metrics.test.mjs` and verify expected sums manually from the fixtures.

**Done when:** tests prove input/cache/output/reasoning/total relationships; the dashboard never adds reasoning twice or claims an exact total from incomplete evidence.

### Task 3 — Add the measured Token Firewall to the existing CTO workflow

**Files:** `src/context/compiler.mjs`, `src/context/cache.mjs`, `src/executor.mjs`, `src/core.mjs`, relevant tests under `test/`; adapt existing interfaces instead of adding another task/session/agent store.

- [ ] Define a compact operation/result envelope: operation ID, task/session scope, tool name, start/end timestamps, input/output byte counts, status, short human summary, evidence reference, and measurement provenance. Redact secrets before persistence or model delivery.
- [ ] Batch independent read-only inspections and checks into one executor invocation where shell/platform behavior permits. Keep commands sequential when an output is a dependency for the next action; do not batch destructive or approval-gated operations.
- [ ] Bound model-facing tool output by type: summarize test failures, lint/type errors, search hits, and diffs; include counts, paths/line ranges, exit status, and evidence reference. Keep raw output recoverable from existing local evidence with size/retention controls. Expand exact details only on request.
- [ ] Use existing fragment hashes to send unchanged-context references/deltas only when the executor protocol can resolve the referenced content safely. If the consumer cannot resolve it, send the required content; never assume cache hit equals provider prompt-cache hit or saved tokens.
- [ ] Use content hashes and Git checkpoints to avoid rereading/re-emitting unchanged data; expose changed file names and small diffs first. Provide a full-read escape hatch and test changed/renamed/deleted files.
- [ ] Reuse the existing task watcher/wait mechanism for long commands. The model must not be re-invoked merely to poll process state; emit one terminal result event when the command completes, fails, times out, or is cancelled.
- [ ] Benchmark candidate `tool_output_token_limit = 3000` only in an isolated temporary Codex config/profile after validating that the installed CLI version accepts it and documenting its precise effect. Compare with unchanged baseline; do not alter global config or recommend global rollout without explicit approval.
- [ ] Run focused executor/context tests, then the full test suite. Verify the same CTO session identity is retained and there are no spawned agents or sessions.

**Done when:** the firewall reduces duplicated tool/context payload in measured trials, all evidence remains retrievable, task outcomes and required context are not lost, and the unchanged global config is verified by diff/hash.

### Task 4 — Replace JSON-first detail pages with 13 clear reports

**Files:** `src/dashboard-ui.mjs`, `src/dashboard.mjs` only where report metadata is absent, `test/dashboard.test.mjs`.

- [ ] Build a shared report shell with title, one-sentence finding, period/filter, observed summary, breakdown/table, source/provenance, measurement badge, updated-at time, coverage/limitations, and next useful action. Hide fields that do not apply rather than rendering empty placeholders.
- [ ] Implement friendly, area-specific reports for all 13 existing dashboard sections:
  - **Visão geral:** observed KPIs, health of Daemon/Wire/Workspace/SSE, token efficiency, task snapshot, alerts, and validation coverage.
  - **Histórico:** event counts by period/type/status, latest events, source, filters, and retention/coverage.
  - **Traces:** trace/job/task/execution chain, duration, provider, event chronology, incomplete spans, and drill-down to evidence.
  - **Tarefas:** state, goal, executor/provider, started/updated/duration, input/output/estimated savings, evidence, and blocked/failed reason.
  - **Agentes:** discovered agents, health/capabilities, observed task activity/usage, last seen, and explicit discovery coverage.
  - **Ferramentas:** tool registry, source/provider, availability/health, call count/latency/failures only when measured, and unavailable reason otherwise.
  - **Plugins / Skills:** discovered catalog and explicit task-attributed usage, version/source and health; do not attribute legacy/unidentified events to a named plugin.
  - **MCPs:** server, transport, observed tools/capabilities, probe/health status, last seen, calls/latency/error only if recorded, and actionable configuration/connection diagnosis. No raw JSON as the default page.
  - **Contexto / Graph:** graph coverage, node/edge counts, source/namespace/query/time and readable entity/relation lists; state clearly when Graph provider is unavailable.
  - **Cache:** observed fragment hits/misses/bytes and estimated reuse, source and limitations; label “estimated tokens avoided” as an estimate, never provider savings.
  - **Memória:** retrieval/write events by time/source/scope, counts, provenance, and coverage without exposing secret contents or dumping the store.
  - **Validação MCG:** paired run status, baseline/candidate, evidence completeness, context recall, grounding, task success, quality-preserving savings and score only when both lanes/evidence qualify; otherwise show why it is unvalidated.
  - **Alertas:** active/resolved/severity/time/source, evidence, deduplicated event context, suggested response, and explicit empty state when none are active.
- [ ] Keep raw API/JSON fields available inside a collapsed, labeled “Detalhes técnicos (JSON)” disclosure for diagnosis; escape all values and never inject untrusted HTML.
- [ ] Add loading, no data yet, true zero, partial coverage, stale data, unavailable source, API failure, and retry states with distinct explanatory copy and next action. A true zero requires a successful measurement covering the requested period.
- [ ] Verify every section renders from exact, estimated, unavailable, empty-array, null, and partial fixtures; test titles, links/back-forward navigation, source, report copy, raw-detail disclosure and HTML escaping.
- [ ] Run `node --test test/dashboard.test.mjs` and `npm run smoke:dashboard`.

**Done when:** selecting any of the 13 navigation entries opens an understandable report; raw JSON is optional, not the user-facing default; every number is sourced and qualified.

### Task 5 — Match the references with exact dual-theme tokens

**Files:** `src/dashboard-ui.mjs`, dashboard UI tests/fixtures as needed, and the project design artifact only if one already exists and can be added without overwriting it.

- [ ] Use `ui-ux-pro-max` before changing visual hierarchy; preserve the supplied Lumenva reference layout (left navigation, dense operational header, KPI row, charts, executor/plugin panels, task/alert panels, validation footer) without copying illustrative screenshot metrics.
- [ ] Replace scattered colors with semantic CSS custom properties for surfaces, text, borders, status, charts, shadows, focus, and glass effects. Keep content/layout independent of the active theme.
- [ ] Implement the exact light palette supplied by the user:
  - Main `rgb(242, 242, 247)`; secondary `rgb(229, 229, 234)`; cards `rgb(248, 248, 250)`; elevated cards `rgb(255, 255, 255)`.
  - Grays `rgb(209, 209, 214)`, `rgb(199, 199, 204)`, `rgb(174, 174, 178)`, `rgb(142, 142, 147)`; secondary text `rgb(72, 72, 74)`; primary text `rgb(28, 28, 30)`.
  - Green `rgb(0, 200, 83)` / glow `rgb(48, 209, 88)`; red `rgb(255, 56, 60)` / strong alert `rgb(233, 21, 45)`.
  - White glass `rgba(255, 255, 255, 0.65)`; glass border `rgba(255, 255, 255, 0.80)`; shadow `rgba(0, 0, 0, 0.12)`.
- [ ] Implement the exact dark palette supplied by the user:
  - Absolute black `rgb(0, 0, 0)`; soft black `rgb(16, 16, 17)`; main black `rgb(20, 20, 20)`; cards `rgb(25, 25, 25)`; black-gray `rgb(31, 31, 31)`; dark gray `rgb(43, 43, 43)`; border `rgb(48, 48, 48)`; medium gray `rgb(64, 64, 64)`; secondary gray `rgb(119, 119, 119)`; secondary text `rgb(153, 153, 153)`; primary text `rgb(245, 245, 245)`.
  - Green `rgb(0, 230, 118)` / glow `rgb(0, 255, 106)`; red `rgb(239, 68, 68)` / strong alert `rgb(255, 18, 48)`.
  - Dark glass `rgba(25, 25, 25, 0.72)`; subtle light border `rgba(255, 255, 255, 0.10)`; highlight `rgba(255, 255, 255, 0.06)`; shadow `rgba(0, 0, 0, 0.45)`; green glow `rgba(0, 255, 106, 0.30)`; red glow `rgba(255, 18, 48, 0.30)`.
- [ ] Add Light / Dark / System preference control. System follows `prefers-color-scheme`; an explicit user choice persists locally and is restored on reload. Avoid a flash of the wrong theme and retain the choice without a server write.
- [ ] Use glass, border, shadow, and glow as restrained elevation/status accents; keep text and chart labels opaque enough for contrast. Add non-color status text/icons/patterns and explicit chart legends/data summaries.
- [ ] Apply `antislop-ui` and `antislop-layoutmobile` during visual implementation; preserve existing navigation/routes and avoid ornamental animation or emoji-as-icon.
- [ ] Validate theme switch/persistence and visual snapshots at desktop and narrow phone sizes against both reference images. Confirm no horizontal page overflow; detail tables may use a labeled local scroll region.

**Done when:** both exact palettes are applied through semantic tokens; the user can select and retain a theme; the existing layout remains recognizable at desktop and usable on mobile.

### Task 6 — Accessibility, benchmark, and safe rollout gate

**Files:** relevant UI and usage tests, `docs/ARCHITECTURE.md`, `docs/STATUS.md`, `docs/IMPLEMENTATION_PLAN.md` only for a narrowly scoped progress amendment after acceptance.

- [ ] Run `accessibility` checks for keyboard navigation, skip link, focus visibility, accessible names, heading hierarchy, live status/error announcements, target size, contrast, screen-reader status, zoom/reflow, and reduced motion. Status and chart meaning must not depend on color alone.
- [ ] Run `web-design-guidelines` against the final changed dashboard and resolve in-scope findings. Use `web-perf` only with a real browser performance trace; otherwise mark browser-performance evidence unavailable instead of claiming a pass.
- [ ] Test all 13 views across desktop and mobile, plus loading/empty/error/stale/unavailable states, theme selection, `prefers-reduced-motion`, and offline API behavior. Keep loopback binding and test a non-default free `--port` without stopping unrelated daemons/worktrees.
- [ ] Run `npm test`, `npm run check:syntax`, `npm run scan:sensitive`, `npm run smoke:dashboard`, and `npm run eval:validation`; retain concise command results as local task evidence and protect existing evidence from deletion.
- [ ] Run paired baseline/candidate trials on the same 20 representative tasks, code snapshot, model, reasoning setting, and task criteria. Compare provider-reported input/cached/output/reasoning separately, turns, tools/calls/bytes, latency, retries, context overflow, task success, recall, and evidence grounding. Include confidence/coverage and disclose unavailable metrics.
- [ ] Accept a Token Firewall optimization only when it measurably reduces redundant model/tool/context payload without reducing task success, recall, grounding, or required evidence. Do not promise the example 81.6% reduction; it is not this project's measured result.
- [ ] Review the 3000-token output-cap trial separately. If it truncates necessary evidence or harms quality, reject it. Any eventual global Codex configuration change requires explicit approval, backup, exact version/schema validation, and rollback instructions; this plan alone grants no such approval.
- [ ] Update architecture/status documentation to record implemented contracts, measurement limits, theme preference, coverage, benchmark results, known unavailable fields, and remaining work. Preserve the original implementation plan and append only a clearly titled additive status amendment if needed.

**Done when:** full tests and accessibility gates pass; all 13 areas show useful, honest reports; baseline/candidate evidence supports any claimed optimization; no global configuration, external service, unrelated port, or branch was changed.

## Skill Use Order

Use only the already available global skills; do not install or duplicate skills:

1. `ui-ux-pro-max` before layout/theme decisions.
2. `antislop-ui` and `antislop-layoutmobile` while refining visual and responsive UI.
3. `accessibility` while adding report interactions, states, and theme controls.
4. `web-design-guidelines` after the UI is complete.
5. `web-perf` only when a genuine browser performance trace is available.

## Official References to Revalidate at Execution Time

- Codex configuration schema and `tool_output_token_limit` semantics: <https://github.com/openai/codex/blob/main/codex-rs/config/src/config_toml.rs>
- Codex token usage display/total handling: <https://github.com/openai/codex/blob/main/codex-rs/tui/src/token_usage.rs>
- Codex API response usage mapping: <https://github.com/openai/codex/blob/main/codex-rs/codex-api/src/sse/responses.rs>
- OpenAI conversation state and context accounting: <https://developers.openai.com/api/docs/guides/conversation-state>
- OpenAI compaction behavior: <https://developers.openai.com/api/docs/guides/compaction>

Codex changes over time. At execution, verify these references against the installed CLI version and exact JSONL/config schema before changing parser behavior or testing the optional output cap.
