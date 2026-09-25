# Brain — current code

Canonical owners: `packages/brain` for context compilation, memory and knowledge helpers; `packages/context-gateway` for the existing local task/context gateway and provider/MCP discovery.

The Token Firewall capability is preserved: bounded read batches, redaction, context compilation and existing telemetry/evaluation behavior remain available through the Edge and their canonical packages. Provider token savings are not claimed without paired observed measurements.

Local state is non-authoritative runtime data, defaults to `.nexus-state`, and is not checked into Git. `MCG_ROOT` is supported only as a legacy override; cloud-backed memory/API/indexing are future Blueprint work, not part of migration readiness.
