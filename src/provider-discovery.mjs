import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { homedir } from 'node:os';
import { spawn } from 'node:child_process';

const MODERN_VERSION = '2026-07-28';
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const PACKAGE_RUNNERS = new Set(['npx', 'npx.cmd', 'npm', 'npm.cmd', 'pnpm', 'pnpm.cmd', 'bunx', 'bunx.exe', 'uvx', 'uvx.exe', 'pipx', 'pipx.exe']);

async function json(path) {
  try { return JSON.parse(await readFile(path, 'utf8')); } catch { return null; }
}

function tomlValue(value) {
  const text = value.trim();
  if (text.startsWith('"') && text.endsWith('"')) {
    try { return JSON.parse(text); } catch { return text.slice(1, -1); }
  }
  if (text.startsWith('[') && text.endsWith(']')) {
    const parts = text.slice(1, -1).match(/"(?:\\.|[^"\\])*"|'[^']*'|[^,]+/g) || [];
    return parts.map(part => part.trim()).filter(Boolean).map(part => part.startsWith('"') ? JSON.parse(part) : part.replace(/^'|'$/g, ''));
  }
  return null;
}

function parseCodexToml(text) {
  const servers = new Map();
  let name = null;
  for (const line of text.split(/\r?\n/)) {
    const table = line.match(/^\s*\[mcp_servers\.([^\]]+)\]\s*(?:#.*)?$/);
    if (table) {
      const rawName = table[1];
      if (rawName.includes('.') && !(rawName.startsWith('"') && rawName.endsWith('"'))) { name = null; continue; }
      name = rawName.replace(/^"|"$/g, ''); servers.set(name, {}); continue;
    }
    if (!name || /^\s*\[/.test(line)) { if (/^\s*\[/.test(line)) name = null; continue; }
    const entry = line.match(/^\s*(command|args|url|server_url)\s*=\s*(.*?)\s*(?:#.*)?$/);
    if (entry) servers.get(name)[entry[1]] = tomlValue(entry[2]);
  }
  return [...servers].map(([serverName, config]) => [serverName, config]);
}

function endpointHost(config) {
  const address = config.serverUrl || config.url;
  try { return address ? new URL(address).host : null; } catch { return null; }
}

function safeEntry(provider, scope, name, source, config) {
  const transport = typeof config.command === 'string' ? 'stdio' : (config.serverUrl || config.url ? 'http' : 'unknown');
  return {
    id: `mcp-${slug(`${provider}-${scope}-${name}`)}`,
    name,
    mcp_name: name,
    provider,
    scope,
    source,
    transport,
    executable: transport === 'stdio' ? basename(config.command) : null,
    endpoint_host: transport === 'http' ? endpointHost(config) : null,
    capabilities: [],
    health: 'UNAVAILABLE',
    last_seen: null,
    measurement_type: 'unavailable',
  };
}

async function readConfigFile(path, parse) {
  try { return parse(await readFile(path, 'utf8')); } catch { return []; }
}

async function collect({ home, cwd }) {
  const records = [];
  const addJson = async (provider, scope, path, select) => {
    const value = await json(path);
    const servers = select(value);
    if (!servers || typeof servers !== 'object' || Array.isArray(servers)) return;
    for (const [name, config] of Object.entries(servers)) {
      if (config && typeof config === 'object') records.push({ safe: safeEntry(provider, scope, name, path, config), config });
    }
  };
  await addJson('claude', 'global', join(home, '.claude.json'), value => value?.mcpServers);
  await addJson('claude', 'project', join(cwd, '.mcp.json'), value => value?.mcpServers);
  const codexFiles = [['global', join(home, '.codex', 'config.toml')], ['project', join(cwd, '.codex', 'config.toml')]];
  for (const [scope, path] of codexFiles) {
    for (const [name, config] of await readConfigFile(path, parseCodexToml)) records.push({ safe: safeEntry('codex', scope, name, path, config), config });
  }
  await addJson('antigravity', 'global', join(home, '.gemini', 'config', 'mcp_config.json'), value => value?.mcpServers);
  await addJson('antigravity', 'project', join(cwd, '.agents', 'mcp_config.json'), value => value?.mcpServers);
  return records;
}

export async function discoverProviderConfigs({ home = homedir(), cwd = process.cwd() } = {}) {
  return (await collect({ home, cwd })).map(({ safe }) => safe)
    .sort((a, b) => `${a.provider}:${a.scope}:${a.name}`.localeCompare(`${b.provider}:${b.scope}:${b.name}`));
}

function requestMeta(version = MODERN_VERSION) {
  return {
    'io.modelcontextprotocol/protocolVersion': version,
    'io.modelcontextprotocol/clientInfo': { name: 'maestri-context-gateway', version: '1.0.0' },
    'io.modelcontextprotocol/clientCapabilities': {},
  };
}

async function sendHttp(config, method, id, params, { fetchImpl, timeoutMs, version = MODERN_VERSION, legacy = false, sessionId }) {
  const url = new URL(config.serverUrl || config.url);
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) throw new Error('insecure-endpoint');
  const headers = { Accept: 'application/json, text/event-stream', 'Content-Type': 'application/json', ...config.headers };
  if (legacy) {
    if (method !== 'initialize') headers['MCP-Protocol-Version'] = version;
    if (sessionId) headers['Mcp-Session-Id'] = sessionId;
  } else {
    headers['MCP-Protocol-Version'] = version;
    headers['Mcp-Method'] = method;
  }
  const requestParams = legacy ? params : { ...params, _meta: requestMeta(version) };
  const response = await fetchImpl(url, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', ...(id == null ? {} : { id }), method, params: requestParams }),
  });
  const text = await response.text();
  let message;
  try { message = JSON.parse(text); } catch {
    const events = text.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => {
      try { return JSON.parse(line.slice(5).trim()); } catch { return null; }
    }).filter(Boolean);
    message = events.find(event => id != null && event.id === id) || events.find(event => event.result || event.error);
  }
  if (response.status === 202 && id == null) return { message: null, sessionId: response.headers?.get?.('mcp-session-id') || sessionId || null, status: response.status };
  if (!response.ok && !message) throw new Error(`http-status-${response.status}`);
  if (!message) throw new Error('http-failure');
  return { message, sessionId: response.headers?.get?.('mcp-session-id') || sessionId || null, status: response.status };
}

async function probeHttp(config, options) {
  let version = MODERN_VERSION;
  const discoveredResponse = await sendHttp(config, 'server/discover', 1, {}, options).catch(() => null);
  const discovered = discoveredResponse?.message;
  let legacy = false;
  if (discovered?.result?.supportedVersions?.length) {
    version = discovered.result.supportedVersions.includes(MODERN_VERSION) ? MODERN_VERSION : discovered.result.supportedVersions[0];
  } else if (discovered?.error?.code === -32022 && Array.isArray(discovered.error.data?.supported)) {
    version = discovered.error.data.supported.includes(MODERN_VERSION) ? MODERN_VERSION : discovered.error.data.supported[0];
  } else {
    legacy = true;
  }
  let listedResponse;
  if (legacy) {
    const initialized = await sendHttp(config, 'initialize', 2, { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'maestri-context-gateway', version: '1.0.0' } }, { ...options, version, legacy: true });
    if (initialized.message?.error || !initialized.message?.result) throw new Error('legacy-initialize-failed');
    version = initialized.message.result.protocolVersion || '2025-11-25';
    await sendHttp(config, 'notifications/initialized', null, {}, { ...options, version, legacy: true, sessionId: initialized.sessionId });
    listedResponse = await sendHttp(config, 'tools/list', 3, {}, { ...options, version, legacy: true, sessionId: initialized.sessionId });
  } else {
    listedResponse = await sendHttp(config, 'tools/list', 3, {}, { ...options, version });
  }
  const listed = listedResponse.message;
  if (listed?.error || !listed?.result) throw new Error('tools-list-failed');
  const tools = Array.isArray(listed.result.tools) ? listed.result.tools : [];
  return { version, tools };
}

async function probeStdio(config, { timeoutMs, discoveryTimeoutMs, spawnImpl }) {
  if (typeof config.command !== 'string' || !config.command.trim()) throw new Error('missing-command');
  const child = spawnImpl(config.command, Array.isArray(config.args) ? config.args : [], {
    cwd: config.cwd || process.cwd(), env: { ...process.env, ...(config.env || {}) },
    stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true, shell: false,
  });
  let buffer = '';
  let nextId = 0;
  const replies = new Map();
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', data => {
    buffer += data;
    const lines = buffer.split(/\r?\n/); buffer = lines.pop() || '';
    for (const line of lines) {
      try { const message = JSON.parse(line); const handlers = replies.get(message.id); if (handlers) { replies.delete(message.id); handlers.resolve(message); } } catch { /* ignore non-RPC output */ }
    }
  });
  child.on('error', error => {
    for (const [id, handlers] of replies) { clearTimeout(handlers.timer); handlers.reject(error); replies.delete(id); }
  });
  const send = (method, params = {}, metaVersion = null, requestTimeoutMs = timeoutMs) => new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { replies.delete(id); reject(new Error('stdio-timeout')); }, requestTimeoutMs);
    replies.set(id, { timer, resolve: message => { clearTimeout(timer); resolve(message); }, reject });
    const requestParams = metaVersion ? { ...params, _meta: requestMeta(metaVersion) } : params;
    try { child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params: requestParams })}\n`); }
    catch (error) { clearTimeout(timer); replies.delete(id); reject(error); }
  });
  try {
    let version = MODERN_VERSION;
    let modern = false;
    const discovered = await send('server/discover', {}, MODERN_VERSION, Math.min(timeoutMs, discoveryTimeoutMs)).catch(() => null);
    if (discovered && !discovered.error) modern = true;
    else if (discovered?.error?.code === -32022 && Array.isArray(discovered.error.data?.supported)) {
      modern = true;
      version = discovered.error.data.supported.includes(MODERN_VERSION) ? MODERN_VERSION : discovered.error.data.supported[0];
    }
    if (!modern) {
      const initialized = await send('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'maestri-context-gateway', version: '1.0.0' } });
      if (initialized.error || !initialized.result) throw new Error('legacy-initialize-failed');
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`);
    }
    const listed = await send('tools/list', {}, modern ? version : null);
    if (listed.error || !listed.result) throw new Error('tools-list-failed');
    return { version: modern ? version : listed.result.protocolVersion || '2025-11-25', tools: Array.isArray(listed.result.tools) ? listed.result.tools : [] };
  } finally {
    child.stdin.end();
    const killTimer = setTimeout(() => child.kill(), 100);
    killTimer.unref();
  }
}

export async function probeMcpServer(config, { timeoutMs = 8000, discoveryTimeoutMs = 1000, fetchImpl = fetch, spawnImpl = spawn } = {}) {
  const started = Date.now();
  try {
    if (typeof config.command !== 'string' && !config.serverUrl && !config.url) throw new Error('missing-transport');
    if (typeof config.command === 'string' && PACKAGE_RUNNERS.has(basename(config.command).toLowerCase())) throw new Error('package-runner-disabled');
    const { version, tools } = typeof config.command === 'string'
      ? await probeStdio(config, { timeoutMs, discoveryTimeoutMs, spawnImpl })
      : await probeHttp(config, { timeoutMs, fetchImpl });
    const capabilities = [...new Set(tools.map(tool => tool.name).filter(name => typeof name === 'string'))];
    return { health: 'HEALTHY', capabilities, tool_count: tools.length, protocol_version: version, latency_ms: Date.now() - started, measurement_type: 'exact', last_seen: new Date().toISOString(), source: 'mcp-read-only-probe' };
  } catch (error) {
    const safeError = ['insecure-endpoint', 'http-failure', 'tools-list-failed', 'missing-command', 'missing-transport', 'package-runner-disabled', 'stdio-timeout', 'legacy-initialize-failed'].includes(error.message)
      ? error.message : /^http-status-\d{3}$/.test(error.message) ? error.message : 'probe-failed';
    const notMeasured = ['missing-transport', 'package-runner-disabled'].includes(safeError);
    const authRequired = ['http-status-401', 'http-status-403'].includes(safeError);
    const protocolUnavailable = ['legacy-initialize-failed', 'tools-list-failed', 'http-status-400', 'http-status-404', 'http-status-405'].includes(safeError);
    const health = notMeasured || protocolUnavailable ? 'UNAVAILABLE' : authRequired ? 'AUTH_REQUIRED' : 'UNHEALTHY';
    return { health, capabilities: [], tool_count: 0, latency_ms: notMeasured ? null : Date.now() - started, measurement_type: notMeasured ? 'unavailable' : 'exact', last_seen: notMeasured ? null : new Date().toISOString(), source: 'mcp-read-only-probe', error: authRequired ? 'authentication-required' : safeError };
  }
}

export async function probeConfiguredMcpServers(options = {}) {
  const records = await collect({ home: options.home || homedir(), cwd: options.cwd || process.cwd() });
  const results = [];
  for (const { safe, config } of records) {
    if (options.provider && safe.provider !== options.provider) continue;
    if (options.scope && safe.scope !== options.scope) continue;
    results.push({ ...safe, ...await probeMcpServer(config, options) });
  }
  return results;
}
