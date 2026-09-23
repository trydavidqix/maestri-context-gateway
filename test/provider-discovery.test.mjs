import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverProviderConfigs } from '../src/provider-discovery.mjs';

const home = await mkdtemp(join(tmpdir(), 'mcg-provider-discovery-'));
const cwd = join(home, 'workspace');
try {
  await mkdir(join(cwd, '.codex'), { recursive: true });
  await mkdir(join(cwd, '.agents'), { recursive: true });
  await mkdir(join(home, '.codex'), { recursive: true });
  await mkdir(join(home, '.gemini', 'config'), { recursive: true });
  await writeFile(join(home, '.claude.json'), JSON.stringify({ mcpServers: {
    jules: { command: 'node', args: ['server.js'], env: { JULES_TOKEN: 'must-not-leak' } },
    remote: { type: 'http', url: 'https://mcp.example.test/mcp', headers: { Authorization: 'Bearer hidden' } },
  } }));
  await writeFile(join(home, '.codex', 'config.toml'), '[mcp_servers.jules]\ncommand = "node"\nargs = ["jules-server.js"]\n\n[mcp_servers.jules.env]\nTOKEN = "must-not-leak"\n\n[mcp_servers.remote]\nurl = "https://codex.example.test/mcp"\n');
  await writeFile(join(cwd, '.codex', 'config.toml'), '[mcp_servers.project]\ncommand = "node"\nargs = ["project.js"]\n');
  await writeFile(join(home, '.gemini', 'config', 'mcp_config.json'), JSON.stringify({ mcpServers: { github: { command: 'node', args: ['github.js'] } } }));
  await writeFile(join(cwd, '.agents', 'mcp_config.json'), JSON.stringify({ mcpServers: { projectHttp: { serverUrl: 'https://project.example.test/mcp' } } }));

  const entries = await discoverProviderConfigs({ home, cwd });
  assert.deepEqual(entries.map(({ provider, scope, name, transport }) => [provider, scope, name, transport]), [
    ['antigravity', 'global', 'github', 'stdio'], ['antigravity', 'project', 'projectHttp', 'http'],
    ['claude', 'global', 'jules', 'stdio'], ['claude', 'global', 'remote', 'http'],
    ['codex', 'global', 'jules', 'stdio'], ['codex', 'global', 'remote', 'http'],
    ['codex', 'project', 'project', 'stdio'],
  ]);
  const serialized = JSON.stringify(entries);
  assert.doesNotMatch(serialized, /must-not-leak|hidden|JULES_TOKEN|Authorization/i);
  assert.ok(entries.every(entry => entry.health === 'UNAVAILABLE' && entry.capabilities.length === 0));
} finally {
  await rm(home, { recursive: true, force: true });
}
console.log('provider discovery tests: 1 passed');
