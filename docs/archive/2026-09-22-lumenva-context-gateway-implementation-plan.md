# Lumenva Context Gateway Implementation Plan — historical snapshot

> Archived from the Lumenva VPS branches during the 2026-09-23 product extraction. This is retained as project history, not as the current task tracker. Use [`../STATUS.md`](../STATUS.md) for verified status and [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) for the current repository plan. Historical prohibitions below do not override current repository policy.

**Goal:** Build real local telemetry, discovery, alerts, validation, and dashboard evidence.

**Architecture:** Append-only JSONL stores observations. Read-only API composes task files, telemetry, live process/Wire observations, and validation records. SSE emits complete snapshots.

**Tech Stack:** Node.js standard library, Server-Sent Events, JSONL, PowerShell process inventory.

**Spec:** [`2026-09-22-lumenva-context-gateway-design.md`](2026-09-22-lumenva-context-gateway-design.md)

## Global Constraints

- Preserve task and evidence files.
- Use `exact`, `estimated`, or `unavailable` measurement types only.
- Never fabricate zero token use for unavailable data.
- Bind dashboard only to `127.0.0.1:7435`.
- Historical instruction: do not deploy, push, or merge.

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
- [ ] Implement read-only APIs and dashboard.
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

This section was appended later and is preserved as historical scope. It states that screenshot-led dashboard UI had been implemented in `src/dashboard-ui.mjs` and separated follow-up work into a dashboard design workflow and assistant-communication layer.
