# Execution and providers — current code

Execution modules live in `packages/execution`; provider-specific adapters currently live under `packages/providers/{claude,codex,antigravity}`; routing policies and selectors live in `packages/routing`; policy/evaluation controls live in `packages/governance`; evidence, telemetry and redaction live in `packages/evidence`.

`packages/execution/src/cloud-fabric` retains the existing Cloud Fabric implementation as one cohesive compatibility domain where its current imports and tests depend on that boundary. The migration does not claim that every module has been decomposed into the future fine-grained subfolders. Concrete PostgreSQL schema is an unapplied infrastructure artifact in `infra/cloud/database`.

Jules, Gemini, Antigravity production execution, quotas, cloud deployment, and recovery orchestration are not considered complete merely because the Blueprint defines them.
