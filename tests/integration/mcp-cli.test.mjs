import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const home = await mkdtemp(join(tmpdir(), 'mcg-mcp-cli-'));
const state = join(home, 'state');
const project = join(home, 'project');
const cli = fileURLToPath(new URL('../../bin/mcg.mjs', import.meta.url));
const server = `let data='';process.stdin.setEncoding('utf8');process.stdin.on('data',chunk=>{data+=chunk;const lines=data.split('\\n');data=lines.pop()||'';for(const line of lines){if(!line)continue;const r=JSON.parse(line);if(r.method==='server/discover')process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:r.id,result:{supportedVersions:['2026-07-28']}})+'\\n');if(r.method==='tools/list')process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:r.id,result:{tools:[{name:'fixture.read'}]}})+'\\n')}});`;

try {
  await mkdir(project, { recursive: true });
  await writeFile(join(home, '.claude.json'), JSON.stringify({ mcpServers: { safeFixture: { command: process.execPath, args: ['-e', server], env: { PRIVATE_TOKEN: 'not-for-output' } }, other: { url: 'https://example.test/mcp' } } }));
  await writeFile(join(project, '.mcp.json'), JSON.stringify({ mcpServers: { projectOnly: { url: 'https://project.example.test/mcp' } } }));
  const env = { ...process.env, USERPROFILE: home, HOME: home, MCG_ROOT: state };
  const discover = spawnSync(process.execPath, [cli, 'mcp', 'discover', '--project-root', project, '--provider', 'claude'], { encoding: 'utf8', env, timeout: 10000 });
  assert.equal(discover.status, 0, discover.stderr);
  const found = JSON.parse(discover.stdout);
  assert.equal(found.length, 3);
  assert.ok(found.every(entry => entry.provider === 'claude'));
  assert.doesNotMatch(discover.stdout, /not-for-output|PRIVATE_TOKEN/i);
  const globalOnly = spawnSync(process.execPath, [cli, 'mcp', 'discover', '--project-root', project, '--provider', 'claude', '--scope', 'global'], { encoding: 'utf8', env, timeout: 10000 });
  assert.equal(globalOnly.status, 0, globalOnly.stderr);
  assert.equal(JSON.parse(globalOnly.stdout).length, 2);

  const probe = spawnSync(process.execPath, [cli, 'mcp', 'probe', '--project-root', project, '--provider', 'claude', '--scope', 'global'], { encoding: 'utf8', env, timeout: 15000 });
  assert.equal(probe.status, 0, probe.stderr);
  const results = JSON.parse(probe.stdout);
  assert.equal(results.length, 2);
  const observed = results.find(entry => entry.mcp_name === 'safeFixture');
  assert.equal(observed.health, 'HEALTHY');
  assert.deepEqual(observed.capabilities, ['fixture.read']);
  const persisted = JSON.parse(await readFile(join(state, 'state', 'registry', 'mcps.json'), 'utf8'));
  assert.ok(persisted.some(entry => entry.id === observed.id && entry.health === 'HEALTHY'));
  assert.doesNotMatch(probe.stdout, /not-for-output|PRIVATE_TOKEN/i);
} finally {
  await rm(home, { recursive: true, force: true });
}
console.log('MCP CLI integration tests: 1 passed');
