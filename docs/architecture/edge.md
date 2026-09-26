# Edge — current code

Canonical owner: `apps/edge`.

The app contains the existing Local Runtime MCP bridge, bounded read-only `mcg_read_batch` tool, Git read adapter, daemon control, and optional Maestri Wire client. The MCP launcher is `tooling/scripts/run-edge-mcp.mjs`; project Codex configuration points to this launcher. The standalone Nexus gateway and dashboard do not require Wire or the Maestri application.

The legacy Windows MCG daemon is not part of the required standalone runtime and is being disabled. No active daemon was observed in the latest Windows audit; the startup shortcut and stale MCP sessions still require cleanup/reload. The reusable Edge bridge and Token Firewall code remain in the repository.
