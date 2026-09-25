import assert from 'node:assert/strict';
import { probeMcpServer } from '../src/provider-discovery.mjs';

const modernServer = `
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
  const lines = input.split('\\n'); input = lines.pop() || '';
  for (const line of lines) {
    if (!line) continue;
    const request = JSON.parse(line);
    if (request.method === 'server/discover') process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,result:{supportedVersions:['2026-07-28']}})+'\\n');
    if (request.method === 'tools/list') process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,result:{tools:[{name:'github.search'},{name:'github.read'}]}})+'\\n');
    if (request.method === 'tools/call') process.exitCode = 19;
  }
});`;

const stdio = await probeMcpServer({ command: process.execPath, args: ['-e', modernServer] });
assert.equal(stdio.health, 'HEALTHY');
assert.deepEqual(stdio.capabilities, ['github.search', 'github.read']);
assert.equal(stdio.tool_count, 2);
assert.equal(stdio.protocol_version, '2026-07-28');

const legacyServer = `
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
  const lines = input.split('\\n'); input = lines.pop() || '';
  for (const line of lines) {
    if (!line) continue;
    const request = JSON.parse(line);
    if (request.method === 'server/discover') process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,error:{code:-32601,message:'unknown method'}})+'\\n');
    if (request.method === 'initialize') process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,result:{protocolVersion:'2025-11-25',capabilities:{tools:{}},serverInfo:{name:'legacy-test',version:'1'}}})+'\\n');
    if (request.method === 'tools/list') process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:request.id,result:{tools:[{name:'legacy.read'}]}})+'\\n');
  }
});`;
const legacy = await probeMcpServer({ command: process.execPath, args: ['-e', legacyServer] });
assert.equal(legacy.health, 'HEALTHY');
assert.deepEqual(legacy.capabilities, ['legacy.read']);
assert.equal(legacy.protocol_version, '2025-11-25');

const methods = [];
const httpRequests = [];
const http = await probeMcpServer({ url: 'https://mcp.example.test/mcp', headers: { Authorization: 'Bearer secret' } }, {
  fetchImpl: async (_url, options) => {
    const request = JSON.parse(options.body); methods.push(request.method); httpRequests.push({ request, headers: options.headers });
    const result = request.method === 'server/discover'
      ? { supportedVersions: ['2026-07-28'] }
      : { tools: [{ name: 'read_only' }] };
    return { ok: true, status: 200, text: async () => JSON.stringify({ jsonrpc: '2.0', id: request.id, result }) };
  },
});
assert.equal(http.health, 'HEALTHY');
assert.deepEqual(http.capabilities, ['read_only']);
assert.deepEqual(methods, ['server/discover', 'tools/list']);
assert.ok(httpRequests.every(({ request, headers }) => request.params._meta['io.modelcontextprotocol/protocolVersion'] === '2026-07-28' && !('_meta' in request) && headers['Mcp-Method'] === request.method && headers['MCP-Protocol-Version'] === '2026-07-28'));
assert.doesNotMatch(JSON.stringify(http), /secret|Authorization/i);

const sse = await probeMcpServer({ url: 'https://sse.example.test/mcp' }, {
  fetchImpl: async (_url, options) => {
    const request = JSON.parse(options.body);
    const result = request.method === 'server/discover' ? { supportedVersions: ['2026-07-28'] } : { tools: [{ name: 'sse.read' }] };
    const eventBody = `event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/progress', params: {} })}\n\nevent: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: request.id, result })}\n\n`;
    return { ok: true, status: 200, headers: new Headers({ 'content-type': 'text/event-stream' }), text: async () => eventBody };
  },
});
assert.equal(sse.health, 'HEALTHY');
assert.deepEqual(sse.capabilities, ['sse.read']);

const legacyHttpMethods = [];
const legacyHttp = await probeMcpServer({ url: 'https://legacy.example.test/mcp' }, {
  fetchImpl: async (_url, options) => {
    const request = JSON.parse(options.body); legacyHttpMethods.push(request.method);
    if (request.method === 'server/discover') return { ok: false, status: 400, headers: new Headers(), text: async () => '' };
    if (request.method === 'initialize') return { ok: true, status: 200, headers: new Headers({ 'mcp-session-id': 'session-local' }), text: async () => JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { protocolVersion: '2025-11-25' } }) };
    if (request.method === 'notifications/initialized') return { ok: true, status: 202, headers: new Headers(), text: async () => '' };
    return { ok: true, status: 200, headers: new Headers(), text: async () => JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { tools: [{ name: 'legacy.http.read' }] } }) };
  },
});
assert.equal(legacyHttp.health, 'HEALTHY');
assert.deepEqual(legacyHttp.capabilities, ['legacy.http.read']);
assert.deepEqual(legacyHttpMethods, ['server/discover', 'initialize', 'notifications/initialized', 'tools/list']);

const unsafe = await probeMcpServer({ url: 'http://external.example.test/mcp' });
assert.equal(unsafe.health, 'UNHEALTHY');
assert.equal(unsafe.error, 'insecure-endpoint');
const authRequired = await probeMcpServer({ url: 'https://auth.example.test/mcp' }, { fetchImpl: async () => ({ ok: false, status: 401, headers: new Headers(), text: async () => '' }) });
assert.equal(authRequired.health, 'AUTH_REQUIRED');
assert.equal(authRequired.error, 'authentication-required');
const protocolUnsupported = await probeMcpServer({ url: 'https://legacy.example.test/mcp' }, { fetchImpl: async () => ({ ok: false, status: 400, headers: new Headers(), text: async () => '' }) });
assert.equal(protocolUnsupported.health, 'UNAVAILABLE');
assert.equal(protocolUnsupported.error, 'http-status-400');
const missing = await probeMcpServer({ command: 'mcg-command-that-does-not-exist-xyz' }, { timeoutMs: 100 });
assert.equal(missing.health, 'UNHEALTHY');
assert.equal(missing.error, 'stdio-timeout');
let packageSpawned = false;
const packageServer = await probeMcpServer({ command: 'npx.cmd', args: ['-y', 'remote-package'] }, { spawnImpl: () => { packageSpawned = true; throw new Error('must not spawn'); } });
assert.equal(packageServer.health, 'UNAVAILABLE');
assert.equal(packageServer.error, 'package-runner-disabled');
assert.equal(packageSpawned, false);
const transportMissing = await probeMcpServer({});
assert.equal(transportMissing.health, 'UNAVAILABLE');
assert.equal(transportMissing.error, 'missing-transport');
console.log('MCP read-only probes: 11 passed');
