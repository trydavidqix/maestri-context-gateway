# Nexus Brain architecture — current migration state

Nexus Brain is one product and one repository. This document describes code that exists in the migration branch, not future Blueprint capabilities. The Master Implementation Blueprint remains the only implementation tracker; do not infer that a listed target service is already implemented.

| Runtime/application | Current owner | Role today |
|---|---|---|
| CLI | `apps/cli` | Preserves existing MCG commands and evaluation entrypoints as compatibility-facing commands. |
| Control Center | `apps/control-center` | Loopback-only read-only dashboard over persisted task/evidence/telemetry data. |
| Edge | `apps/edge` | Local MCP bridge, bounded read-only batch capability, Git adapter, daemon control and optional Wire bridge. |
| Brain/context | `packages/brain`, `packages/context-gateway` | Context compilation, local memory, task gateway and provider/MCP discovery. |
| Shared domains | `packages/{contracts,control-plane,evidence,execution,governance,providers,routing}` | Existing contracts, task/session helpers, evidence, execution, policies, provider adapters and routing. |
| Legacy bridge | `packages/compat`, root `src/` and `bin/` shims | Explicit compatibility only; canonical implementations remain in the owners above. |

The current repository is not yet the future cloud deployment: the SQL schema is an unapplied artifact under `infra/cloud/database`; there is no claim of a deployed Brain API, cloud database or provider-backed workflow. Local runtime state defaults to `.nexus-state` and accepts `MCG_ROOT` only as a legacy override.

See [Control Plane](control-plane.md), [Brain](brain.md), [Execution](execution.md), [Edge](edge.md), and [Data flow](data-flow.md) for present-day ownership and limits.
