# Nexus Brain threat and scope model

**Status:** NB-02 working model. This document records boundaries and required controls; it does not claim runtime enforcement is complete.

## Assets

- Project, task, session and agent identity, plus the policy and budget bound to each task.
- Browser host/session/profile state, cookies, credentials, uploads, downloads and side effects.
- Memory records, evidence, provenance, task results, artifacts and recovery data.
- Permission decisions, approvals, audit events and provider credentials.

## Trust boundaries

- Maestri owns task/session lifecycle, project selection, budgets, approvals and continuation.
- Nexus governance owns policy, authorization, memory promotion, evidence scope and delivery gates.
- Provider agents and external engines are bounded executors; their claims do not become canonical state without evidence.
- Internet pages, API results, browser DOM/accessibility text, screenshots, network payloads and downloaded files are untrusted input.
- Browser backends execute an authorized `BrowserPlan`; they do not own task state, policy or evidence authority.
- Hindsight is an internal memory engine behind Nexus governance, not an agent-facing authority.

## Threats and required controls

| Threat | Required control |
|---|---|
| Cross-project, cross-task or cross-agent data leakage | Carry project/task/agent identity in task-bound contracts. Scope retrieval and skill sets to the active task and agent. Test isolation across parallel tasks and browser sessions. |
| Prompt injection or hostile instructions in retrieved content | Mark fetched web evidence `UNTRUSTED`. Treat content as data, never system or tool instructions. Do not treat sanitization as trust. |
| Secret disclosure or unauthorized external side effect | Apply origin, redirect, upload, download and data-transmission policy before browser execution. Classify effects R0–R4. R3/R4 use configured approval gates. |
| Overbroad tool or skill access | Give each task the smallest justified tool profile. Expose compact Skill Registry metadata globally; load full skill bodies only through Skill Resolver for `task_id + agent_id`. |
| Unsupported, stale or conflicting memory | Preserve provenance and scope. Keep conflicting claims `CONFLICTED`; never silently promote model output. Re-check authoritative evidence before high-impact use. |
| Provider or backend treated as authority | Keep provider-specific types behind adapters. Nexus retains identity, policy, task state, evidence and canonical-memory authority. |

## Scope

This model covers Nexus-owned contracts and controls for registered projects, repositories, workspaces, sessions and agents. It does not move other projects into the Nexus repository. It does not authorize access-control bypass, stealth escalation, direct-main writes, unbounded autonomy, secret logging, or automatic promotion of generated skills and memories.

Provider-native global directories and installations remain under provider ownership. Project integrations use supported interfaces and project-scoped configuration only.

## Enforcement and evidence

Schemas define data shape and required identity. They do not authorize actions. Runtime policy, approval, resolver and delivery enforcement belong to the later implementation packages in the Master Blueprint. Acceptance requires behavioral tests for scope isolation, hostile content, secret boundaries, R0–R4 decisions and skill-resolution bypass attempts; schema validation alone does not prove those controls.

Threat-specific thresholds and provider behavior remain policy/evaluation inputs. No universal confidence or coverage threshold is defined here.

## Unresolved contract decisions

- Exact canonicalization and matching rules for allowed origins, redirects, ports and internationalized domain names remain `UNRESOLVED`; policy implementation must define them before browser execution is enabled.
- Permission grant renewal, revocation propagation and approval lifecycle remain `UNRESOLVED` beyond the versioned decision fields; runtime policy owns these behaviors.
- `scope_size`, `testability`, `interaction_mode`, `observation_mode` and browser task/session state vocabularies remain strings until measured use justifies a stable enum.
- Detailed field vocabularies for `secret_policy`, `profile_policy`, `host_requirements` and `delivery_policy` remain `UNRESOLVED`; these envelopes do not authorize behavior by themselves.
