# Current data flow

```text
Codex project MCP configuration
  → tooling/scripts/run-edge-mcp.mjs
  → apps/edge MCP bridge
  → bounded read-only batch / Git read adapter
  → packages/context-gateway, brain, contracts and evidence
  → local state under .nexus-state (not tracked by Git)
  → apps/control-center read-only API/UI on loopback
```

Optional Wire requests use the Edge bridge only when local Wire configuration and credentials are present. No Wire server, Maestri process, cloud database, or provider is assumed available. Unknown measurements are reported as unavailable; estimated context/token metrics are not labeled exact. The future cloud-first ingestion and Brain API flow belongs to later Blueprint implementation.
