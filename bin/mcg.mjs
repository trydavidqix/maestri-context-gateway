#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { dispatch, ensureLayout, ingest, loadState, listTasks, compactResult, removeTask, sliceEvidence, waitForTerminal, stats, ROOT } from '../src/core.mjs';
import { acceptWireMutation, loadWireConfig, openWireFeed, summarizeWireSnapshot, wireRequest, wireSnapshot } from '../src/wire.mjs';
import { createDashboardServer } from '../src/dashboard.mjs';
import { replayTask, compareReplay } from '../src/replay.mjs';
import { discoverProviderConfigs } from '../src/provider-discovery.mjs';
import { refreshRegistries } from '../src/registry.mjs';
import { startDaemonControl, stopDaemon } from '../src/daemon-control.mjs';

const args = process.argv.slice(2);
const command = args.shift();
const value = flag => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
const json = value('--json') !== undefined || args.includes('--json');
const output = value('--output') || 'json';
const print = data => process.stdout.write(typeof data === 'string' ? `${data}\n` : `${JSON.stringify(data, null, 2)}\n`);
const wireStatePath = `${ROOT}/state/wire.json`;
const saveWireState = async value => writeFile(wireStatePath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
const wireStatus = async () => {
  const config = await loadWireConfig();
  const info = await wireRequest(config, '/api/info');
  const workspaces = await wireRequest(config, '/api/workspaces');
  return { host: config.host, port: config.port, protocolVersion: info.protocolVersion, role: info.role, feedSnapshots: info.capabilities?.includes('feedSnapshots') === true, capabilities: info.capabilities?.length || 0, workspaces: workspaces.workspaces.map(({ id, name, workingDirectory, attentionCount }) => ({ id, name, workingDirectory, attentionCount })) };
};
const monitorWire = async (silent = false) => {
  const config = await loadWireConfig();
  const workspaces = await wireRequest(config, '/api/workspaces');
  const workspace = workspaces.workspaces.find(item => item.name === 'Lumenva') || workspaces.workspaces[0];
  if (!workspace) throw new Error('Wire workspace missing');
  let cursor = { epoch: null, sequence: null };
  const consume = async message => {
    if (message.type === 'feed') { const summary = summarizeWireSnapshot(message.snapshot || {}); await saveWireState({ type: 'feed', workspace_id: workspace.id, epoch: cursor.epoch, sequence: cursor.sequence, summary }); return; }
    if (message.type !== 'mutation' || !message.mutation) return;
    const accepted = acceptWireMutation(message.mutation, cursor);
    if (accepted.resync_required) { const snapshot = await wireSnapshot(config, workspace.id); cursor = { epoch: message.mutation.epoch, sequence: message.mutation.sequence }; await saveWireState({ type: 'resync', workspace_id: workspace.id, epoch: cursor.epoch, sequence: cursor.sequence, summary: snapshot.summary }); return; }
    if (accepted.accepted) { cursor = accepted.state; await saveWireState({ type: 'mutation', workspace_id: workspace.id, epoch: cursor.epoch, sequence: cursor.sequence, received_at: new Date().toISOString() }); }
  };
  const connection = await openWireFeed(config, workspace.id, message => { void consume(message).catch(error => process.stderr.write(`mcg wire: ${error.message}\n`)); });
  if (!silent) process.stdout.write(JSON.stringify({ connected: true, workspace: workspace.name }) + '\n');
  return connection;
};
const waitForWireOrAbort = (connection, signal) => new Promise(resolve => {
  const finish = () => { signal.removeEventListener('abort', finish); resolve(); };
  signal.addEventListener('abort', finish, { once: true });
  connection.closed.then(finish, finish);
});
const monitorWireLoop = async signal => {
  while (!signal.aborted) {
    let connection;
    try {
      connection = await monitorWire(true);
      await waitForWireOrAbort(connection, signal);
    } catch (error) { if (!signal.aborted) process.stderr.write(`mcg wire: ${error.message}\n`); }
    connection?.close();
    if (!signal.aborted) await new Promise(resolve => {
      const timer = setTimeout(done, 1000);
      function done() { clearTimeout(timer); signal.removeEventListener('abort', done); resolve(); }
      signal.addEventListener('abort', done, { once: true });
    });
  }
};

try {
  await ensureLayout();
  if (command === 'doctor') {
    const nodeMajor = Number(process.versions.node.split('.')[0]);
    const maestri = spawnSync(process.env.MAESTRI_CLI || 'maestri', ['debug'], { encoding: 'utf8', timeout: 5000 });
    const maestriOutput = `${maestri.stdout || ''}\n${maestri.stderr || ''}`;
    let wire = { status: 'unconfigured' };
    try { wire = { status: 'ok', ...(await wireStatus()) }; } catch (error) { wire = { status: 'error', error: error.message }; }
    print({ root: ROOT, node: process.versions.node, node_ok: nodeMajor >= 22, storage: 'ok', maestri: maestri.status === 0 ? 'available' : 'unavailable', maestri_connection: /Connection:\s+OK/.test(maestriOutput) ? 'ok' : 'unknown', wire, auth: 'not inspected' });
  } else if (command === 'wire') {
    const action = args.shift() || 'status';
    if (action === 'status') print(await wireStatus());
    else if (action === 'feed') { const connection = await monitorWire(); await new Promise(() => {}); connection.close(); }
    else throw new Error('mcg wire commands: status feed');
  } else if (command === 'mcp') {
    const action = args.shift();
    const projectRoot = value('--project-root') || process.cwd();
    const provider = value('--provider');
    const scope = value('--scope');
    if (provider && !['claude', 'codex', 'antigravity'].includes(provider)) throw new Error('providers: claude, codex, antigravity');
    if (scope && !['global', 'project'].includes(scope)) throw new Error('scopes: global, project');
    if (action === 'discover') {
      const entries = await discoverProviderConfigs({ cwd: projectRoot });
      print(entries.filter(entry => (!provider || entry.provider === provider) && (!scope || entry.scope === scope)));
    } else if (action === 'probe') {
      const registries = await refreshRegistries(ROOT, { include_processes: false, probe_mcps: true, cwd: projectRoot, provider, scope });
      print(registries.mcps.filter(entry => entry.source === 'mcp-read-only-probe' && (!provider || entry.provider === provider) && (!scope || entry.scope === scope)));
    } else throw new Error('mcg mcp commands: discover [--project-root PATH] [--provider claude|codex|antigravity] [--scope global|project]; probe [--project-root PATH] [--provider claude|codex|antigravity] [--scope global|project]');
  } else if (command === 'dispatch') {
    const file = value('--file');
    const input = file ? JSON.parse(await readFile(file, 'utf8')) : JSON.parse(await new Promise((resolve, reject) => { let s = ''; process.stdin.on('data', d => s += d); process.stdin.on('end', () => resolve(s)); process.stdin.on('error', reject); }));
    const state = await dispatch(input); print({ task_id: state.task_id, state: state.internal_state });
  } else if (command === 'ingest') {
    const file = value('--file');
    const event = JSON.parse(await readFile(file, 'utf8'));
    const ingested = await ingest(event);
    print({
      task_id: ingested.state?.task_id || event.task_id,
      state: ingested.state?.internal_state || event.state,
      external_state: ingested.state?.external_state || null,
      deduped: ingested.deduped === true,
      result_reference: ingested.state?.result_reference || null,
      evidence_reference: ingested.state?.evidence_reference || null
    });
  } else if (command === 'status') {
    const id = args.find(a => !a.startsWith('-'));
    print(id ? compactResult(await loadState(id)) : (json ? await listTasks() : (await listTasks()).map(s => `${s.project} ${s.task_id} ${s.internal_state}`).join('\n')));
  } else if (command === 'stats') {
    print(await stats(ROOT, { tokens: args.includes('--tokens') }));
  } else if (command === 'dashboard') {
    const port = Number(value('--port') || 7435);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('dashboard port must be an integer from 1 to 65535');
    const server = await createDashboardServer({ port });
    const url = `http://127.0.0.1:${port}`;
    process.stdout.write(`MCG dashboard: ${url}\n`);
    if (!args.includes('--no-open')) spawnSync('cmd.exe', ['/c', 'start', '', url], { windowsHide: true, stdio: 'ignore' });
    const close = () => server.close(() => process.exit(0));
    process.on('SIGINT', close); process.on('SIGTERM', close);
    await new Promise(() => {});
  } else if (command === 'result') {
    print(compactResult(await loadState(args[0])));
  } else if (command === 'wait') {
    print(await waitForTerminal(args[0]));
  } else if (command === 'evidence') {
    print(await sliceEvidence(args[0], value('--type'), Number(value('--lines') || 80), ROOT, Number(value('--offset') || 0)));
  } else if (command === 'replay') {
    const taskId = args.shift(); const variant = args.includes('--mcg') ? 'mcg' : 'baseline';
    const binary = process.env.CODEX_BIN || join(homedir(), '.codex', 'packages', 'standalone', 'current', 'bin', 'codex.exe');
    print(await replayTask({ root: ROOT, task_id: taskId, variant, binary }));
  } else if (command === 'compare') {
    print(await compareReplay(ROOT, args[0]));
  } else if (command === 'cancel') {
    const state = await loadState(args[0]); state.internal_state = 'CANCELLED'; state.updated_at = new Date().toISOString(); await (await import('../src/core.mjs')).saveState(state); print({ task_id: state.task_id, state: state.internal_state });
  } else if (command === 'daemon') {
    const action = args.shift() || 'start';
    if (action === 'stop') {
      await stopDaemon(ROOT);
      print({ daemon: 'STOPPED' });
    } else if (action !== 'start') {
      throw new Error('mcg daemon commands: start | stop');
    } else {
    const { watch } = await import('node:fs');
    const { readdir, readFile, unlink, open } = await import('node:fs/promises');
    const inbox = `${ROOT}/events/inbox`;
    const lockPath = `${ROOT}/state/daemon.pid`;
    let lock;
    try { lock = await open(lockPath, 'wx', 0o600); } catch {
      let previousPidIsAlive = false;
      try { const previousPid = Number((await readFile(lockPath, 'utf8')).trim()); process.kill(previousPid, 0); previousPidIsAlive = true; }
      catch (error) { if (error.code !== 'ESRCH') throw new Error('daemon already running'); }
      if (previousPidIsAlive) throw new Error('daemon already running');
      await unlink(lockPath).catch(() => {});
      lock = await open(lockPath, 'wx', 0o600);
    }
    await lock.writeFile(`${process.pid}\n`);
    const consume = async () => {
      for (const name of await readdir(inbox)) {
        if (!name.endsWith('.json')) continue;
        const path = `${inbox}/${name}`;
        try { await ingest(JSON.parse(await readFile(path, 'utf8'))); await unlink(path); } catch { /* retain malformed events for diagnosis */ }
      }
    };
    await consume();
    let watcher;
    let control;
    let shuttingDown = false;
    const wireController = new AbortController();
    let wireLoop;
    if (existsSync(`${ROOT}/config/wire.json`)) {
      wireLoop = monitorWireLoop(wireController.signal);
    }
    const controlPath = `${ROOT}/state/daemon.control.json`;
    const shutdown = async (code = 0) => {
      if (shuttingDown) return;
      shuttingDown = true;
      watcher?.close();
      wireController.abort();
      if (wireLoop) await Promise.race([wireLoop, new Promise(resolve => setTimeout(resolve, 2000))]);
      await control?.close();
      await lock.close();
      await unlink(lockPath).catch(() => {});
      await unlink(controlPath).catch(() => {});
      process.exit(code);
    };
    try {
      control = await startDaemonControl(ROOT, () => shutdown());
      watcher = watch(inbox, () => { void consume(); });
    } catch (error) { await shutdown(1); throw error; }
    watcher.on('error', error => { process.stderr.write(`mcg daemon: ${error.message}\n`); void shutdown(1); });
    process.on('SIGTERM', () => { void shutdown(); });
    process.on('SIGINT', () => { void shutdown(); });
    await new Promise(() => {});
    }
  } else { print('mcg commands: doctor wire mcp daemon status stats dashboard dispatch wait result evidence cancel ingest'); process.exitCode = 2; }
} catch (error) { process.stderr.write(`mcg: ${error.message}\n`); process.exitCode = 1; }
