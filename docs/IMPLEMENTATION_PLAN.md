# Maestri Context Gateway Implementation Plan (Historical Baseline)

> This checklist records the original implementation plan from the Lumenva monorepo. It is retained as project history, not as the current task tracker. See [`STATUS.md`](STATUS.md) for the extracted repository's verified state and remaining work.

> **Scope clarification (2026-09-23):** The push/merge restriction below belongs to this historical checklist. The active dashboard reports/Token Firewall work is tracked separately in [`superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md`](superpowers/plans/2026-09-23-dashboard-reports-token-firewall.md), whose current owner instruction authorizes integrating the verified current branch into `main`. That authorization does not mark its six tasks complete or include unrelated branches, deployments, or daemon restarts.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build real local telemetry, discovery, alerts, validation, and dashboard evidence.

**Architecture:** Append-only JSONL stores observations. Read-only API composes task files, telemetry, live process/Wire observations, and validation records. SSE emits complete snapshots.

**Tech Stack:** Node.js standard library, Server-Sent Events, JSONL, PowerShell process inventory.

**Architecture:** [`ARCHITECTURE.md`](ARCHITECTURE.md)

## Global Constraints

- Preserve task and evidence files.
- Use `exact`, `estimated`, or `unavailable` measurement types only.
- Never fabricate zero token use for unavailable data.
- Bind dashboard only to `127.0.0.1:7435`.
- Do not deploy, push, or merge.

## Review Focus

- Pending task must not create savings.
- Exact provider usage must survive aggregation.
- Unknown absent attribution must not become a visible fake resource.
- A warning must not repeatedly create CEO inbox entries.
- Validation must reject missing evidence instead of yielding a Trust Score.

### Task 1: Telemetry foundation

**Files:** `src/telemetry.mjs`, `src/core.mjs`, `test/telemetry.test.mjs`, `test/stats.test.mjs`

- [ ] Write failing tests for exact token precedence, full schema, retention, pending-task exclusion, and explicit plugin source.
- [ ] Run `node --test test/telemetry.test.mjs test/stats.test.mjs`; verify expected failures.
- [ ] Implement append-only ingestion and provenance-aware aggregation.
- [ ] Run same tests; verify pass.

### Task 2: Dashboard and realtime APIs

**Files:** `src/dashboard.mjs`, `test/dashboard.test.mjs`

- [ ] Write failing endpoint, SSE, NaN, and coverage tests.
- [ ] Run `node --test test/dashboard.test.mjs`; verify expected failures.
- [ ] Implement read-only APIs and graphite dashboard.
- [ ] Run `node --test test/dashboard.test.mjs`; verify pass.

### Task 3: Discovery and governance

**Files:** `src/telemetry.mjs`, `src/dashboard.mjs`, `test/telemetry.test.mjs`, `test/dashboard.test.mjs`

- [ ] Write failing tests for process/telemetry discovery, budgets, dedupe, and CEO delivery status.
- [ ] Run focused tests; verify expected failures.
- [ ] Implement discovery and alert persistence.
- [ ] Run focused tests; verify pass.

### Task 4: Validation Lab

**Files:** `src/evals.mjs`, `evals/datasets/*`, `test/evals.test.mjs`

- [ ] Write failing deterministic recall, hallucination, A/B evidence, and Trust Score tests.
- [ ] Run `node --test test/evals.test.mjs`; verify expected failures.
- [ ] Implement immutable run storage and graders.
- [ ] Run all test files; verify pass.

### Task 5: End-to-end evidence

**Files:** `state/telemetry/events.jsonl`, `state/evals/*`

- [ ] Execute a read-only MCG task through installed Codex CLI.
- [ ] Execute baseline and compacted lanes with same executor and isolated inputs.
- [ ] Query dashboard APIs and retain output as run evidence.

## Additive amendment — dashboard design workflow and conversational voice

This section is additive. It preserves the historical checklist above and does not replace, remove, or rewrite its tasks. The screenshot-led dashboard UI has already been implemented in `src/dashboard-ui.mjs`; use this amendment for subsequent visual revisions and the separate assistant-communication layer.

### Existing global Claude communication settings (verified 2026-09-23)

The global Claude profile already has these files and behaviors; preserve them and extend only when explicitly implementing the new layer:

- `%USERPROFILE%\.claude\CLAUDE.md`: PT-BR, direct human voice with light RJ influence, project-role preservation, semantic emoji policy, pipeline source-of-truth, and no prompt replay in hooks.
- `%USERPROFILE%\.claude\rules\00-language.md`, `10-human-communication.md`, `20-progress-reporting.md`, `30-emoji-policy.md`, and `40-memory-discipline.md`: separate language, human voice, complete pipeline updates, emojis, and memory discipline.
- `%USERPROFILE%\.claude\output-styles\david-ptbr-carioca.md`: already active; contains voice and pipeline reporting formats.
- Global skills `humanizar` and `girias` remain optional references. They are not replaced or duplicated.

These settings are the existing baseline, not work to reinstall. “Carioca Human State” below is a proposed additional layer: it must not weaken PT-BR, technical accuracy, role/project instructions, progress reporting, or artifact/customer-facing language.

### Use design skills at the right time

For future dashboard changes, apply existing skills in sequence and only at their useful stage. Do not install duplicate copies:

1. **Before changing layout:** use `ui-ux-pro-max` to translate the supplied reference into layout, hierarchy, color, typography, chart, and responsive decisions. Treat the screenshots as visual direction; use real application data and never copy illustrative numbers as facts.
2. **During implementation:** use `antislop-ui` and `antislop-layoutmobile` for visual discipline and small-screen behavior. Keep changes within the dashboard scope; preserve its existing data contracts and unrelated local changes.
3. **During interaction/accessibility implementation:** use `accessibility` for keyboard operation, labels, focus, semantics, contrast, reduced motion, and empty/loading/error states.
4. **After implementation:** use `web-design-guidelines` against the changed UI and current official guideline source; fix only findings in scope.
5. **Before acceptance:** use `web-perf` when a browser performance trace is available. If its required browser tooling is unavailable, record the limitation and use repository tests plus a safe isolated browser check; never commandeer David’s active Chrome.

Acceptance for a visual change: reference fidelity checked at desktop and mobile widths; UI controls work; accessibility and responsive behavior checked; real data/unknown states remain honest; focused tests and full relevant test suite pass. Do not claim production performance from synthetic fixture timings.

### Proposed additive layer — Carioca Human State

**Goal:** add a context-aware conversational voice layer alongside existing communication rules. It affects only conversational replies to David. It never changes the dashboard’s customer-facing UI, code, commands, identifiers, JSON/YAML, logs, commits, documentation, PRs, or client messages.

**Layer order:** agent role and project rules → existing `humanizar` when relevant → new `carioca-human-state` when context calls for it → conversation context → response. The CEO/CTO/engineer role remains authoritative for work; this layer controls only conversational expression. Do not enlarge `humanizar` or replace existing global rules/output style.

**Proposed files:** add a focused `carioca-human-state/SKILL.md` and small references for `carioca-language.md`, `emotional-state.md`, `profanity.md`, `reactions.md`, and `examples.md` in the selected global skill location. Resolve and document the supported global skill locations for each intended runtime before installation; avoid parallel or duplicate skill copies. Load detailed references only when the conversation needs them.

**Implementation phases:**

1. **Baseline and compatibility:** back up/read the existing Claude profile and relevant Codex/Gemini global skill roots; verify installed `humanizar`/`girias`; record paths and precedence. Make no global setting changes during planning.
2. **Skill boundary:** specify the new skill as a separate optional communication layer; preserve existing identity, language, output-style, emoji, memory, and pipeline rules. Conversational voice must not alter technical correctness or artifact text.
3. **Contextual RJ language:** create a compact reference of greetings, agreement, teasing, positive reactions, and suspicion. Each expression has a context; no random catchphrases, forced slang, or caricature.
4. **Fictional style state:** define neutral, animated, suspicious, bolado, puto, muito puto, resolved, and relieved as writing modes only—not claims of real model emotion.
5. **Bounded frustration response:** allow one contextual reaction to repeated failures, then stop escalating profanity. After three consecutive failed attempts, reassess the hypothesis, stop patching blindly, investigate root cause, and test. Reset the conversational style after the issue is resolved.
6. **Positive-state handling:** scale brief positive reactions to the size of a verified win, then return to neutral. Never claim success without evidence.
7. **Suspicion handling:** trigger on contradictions, missing files/evidence, incompatible status, or unverified “done” claims. Express uncertainty proportionally, then inspect evidence; language is not proof.
8. **Friendly teasing:** optional, low frequency, only when rapport and context support it. No humiliation, insults aimed at David, or teasing during sensitive/high-stakes situations.
9. **Profanity and emoji controls:** frequency varies by context and stays bounded; avoid stacking profanity. Use 😂, 🤦, 👀, 😤, 💀, or ✅ only when they clarify the reaction. Existing semantic emoji policy remains authoritative.
10. **Artifact boundary:** explicitly test that conversational voice is off for code, terminal, logs, docs, commits, PRs, customer-facing messages, and other artifacts. Preserve original technical names and quoted text.
11. **Short-lived style continuity:** keep any mood/error streak only as minimal session-local conversational context. Do not write emotional state into persistent project memory or pipeline ledger; clear it after resolution/session boundary.
12. **Guardrails and validation:** prohibit reduced technical quality, destructive actions motivated by style, fabricated emotions/results/errors, user attacks, and style contamination. Test neutral chat, positive outcome, suspicious evidence, one/two/three repeated failures, sensitive context, session reset, and every artifact boundary. Compare against the existing output style and verify no rule conflict before enabling the new skill.

**Acceptance:** existing settings and skills remain intact; the new layer is optional and context-sensitive; no forced profanity/slang; three failures trigger hypothesis review rather than louder language; evidence controls claims; all artifact/customer boundaries pass; style returns to neutral after resolution; the UI reference/design workflow above remains independent.

**Scope note:** this is a plan-only addition. It does not install `carioca-human-state`, edit Claude/Codex/Gemini settings, or alter the already implemented dashboard.
