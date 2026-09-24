---
name: jules-delegation
description: Dispatch and independently verify one scoped Maestri engineering task in Jules. Use only when Jules execution is explicitly requested.
---

# Jules delegation for Maestri

## Dispatch limits

- Jules is an optional remote executor, not a second source of task state. Maestri owns task IDs, branch ownership, status, evidence, retries and handoff.
- Before dispatch, check existing tasks, sessions, branches and worktrees for overlap. Never duplicate active work.
- Run one Jules task at a time unless the owner explicitly approves independent parallel tasks. Do not create subagents.
- Never interrupt or alter another active session. If a session is stalled, inspect its last activity; ask once for status, then stop/cancel only the Jules session assigned to this task if it remains stalled.
- Give Jules the complete scoped objective, allowed paths, constraints, acceptance criteria, base ref, required tests and evidence in the initial prompt. Each session starts without local dependencies; include the install prerequisite before the exact test/build command.
- Require a plan before implementation when the integration supports plan approval. Review the plan for scope, destructive steps and shared interfaces before approving.

## Verification before acceptance

1. Fetch and record the exact task branch head and base SHA.
2. For every claimed fix, verify a non-empty diff for the relevant files; one diff does not prove multiple claims.
3. Run the required tests/typecheck/security checks locally or inspect their actual CI logs. A prose claim is not evidence.
4. Check that no shared test infrastructure, unrelated package, credential, CRM, voice or Meta path changed.
5. Review the final diff and evidence independently. Accept only changes matching the task contract.

## Safe handoff

Record task/session IDs, branch, base/head SHAs, plan approval, changed paths, test commands and outputs, blockers, retry count and next action in Maestri's task ledger. Never include secrets in prompts, logs or reports. Never force-push to resolve overlap; stop and reconcile against the latest remote state.
