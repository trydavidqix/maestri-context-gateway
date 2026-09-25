import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { request } from 'node:http';
import { dispatch, ensureLayout, loadState } from '../../src/core.mjs';
import { createDashboardServer } from '../../src/dashboard.mjs';

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const cliPath = join(repoRoot, 'bin', 'mcg.mjs');

function launchDaemon(root) {
  const child = spawn(process.execPath, [cliPath, 'daemon'], {
    cwd: repoRoot,
    env: { ...process.env, MCG_ROOT: root },
    stdio: ['ignore', 'ignore', 'pipe']
  });
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.stderrText = () => stderr;
  return child;
}

function runDaemonCommand(root, action) {
  const child = spawn(process.execPath, [cliPath, 'daemon', action], {
    cwd: repoRoot,
    env: { ...process.env, MCG_ROOT: root },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.output = () => ({ stdout, stderr });
  return child;
}

async function waitFor(predicate, child, message) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (child?.exitCode !== null && child?.exitCode !== undefined) throw new Error(`${message}; daemon exited ${child.exitCode}: ${child.stderrText()}`);
    if (await predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  throw new Error(`timed out waiting for ${message}`);
}

async function fileExists(path) {
  try { await access(path); return true; } catch { return false; }
}

function waitForExit(child) {
  if (child.exitCode !== null) return Promise.resolve(child.exitCode);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`daemon did not exit; stderr: ${child.stderrText()}`)), 5000);
    child.once('exit', code => { clearTimeout(timeout); resolve(code); });
  });
}

async function writeDoneEvent(root, taskId, eventId) {
  const inbox = join(root, 'events', 'inbox');
  const eventPath = join(inbox, `${eventId}.json`);
  const tempPath = `${eventPath}.tmp`;
  await writeFile(tempPath, JSON.stringify({
    task_id: taskId,
    event_id: eventId,
    sequence: 1,
    state: 'DONE',
    timestamp: new Date().toISOString(),
    result: 'daemon integration test'
  }));
  await rename(tempPath, eventPath);
}

function getHealth(port) {
  return new Promise((resolve, reject) => {
    request({ host: '127.0.0.1', port, path: '/api/health' }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject).end();
  });
}

function getControlStatus(port, authorization) {
  return new Promise((resolve, reject) => {
    request({ host: '127.0.0.1', port, path: '/health', headers: authorization ? { Authorization: authorization } : {} }, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    }).on('error', reject).end();
  });
}

async function stopDaemon(root, daemonChild) {
  const stop = runDaemonCommand(root, 'stop');
  const stopCode = await waitForExit(stop);
  assert.equal(stopCode, 0, stop.output().stderr || stop.output().stdout);
  await waitFor(() => daemonChild.exitCode !== null, null, 'daemon stop command to finish target');
}

test('daemon processes inbox across restart and dashboard reflects its real lifecycle', async t => {
  const root = await mkdtemp(join(tmpdir(), 'mcg-daemon-e2e-'));
  let child;
  let dashboard;
  t.after(async () => {
    if (child?.exitCode === null) await stopDaemon(root, child).catch(() => child.kill());
    if (dashboard) await new Promise(resolve => dashboard.close(resolve));
    await rm(root, { recursive: true, force: true });
  });

  await ensureLayout(root);
  const firstTask = await dispatch({ task_id: 'daemon-first', executor: 'test' }, root);
  await writeDoneEvent(root, firstTask.task_id, 'daemon-first-event');
  child = launchDaemon(root);
  await waitFor(() => fileExists(join(root, 'state', 'daemon.control.json')), child, 'authenticated control endpoint');
  const control = JSON.parse(await readFile(join(root, 'state', 'daemon.control.json'), 'utf8'));
  assert.equal(await getControlStatus(control.port), 401);
  assert.equal(await getControlStatus(control.port, `Bearer ${control.token}`), 200);
  await waitFor(async () => {
    try { return (await loadState(firstTask.task_id, root)).internal_state === 'DONE'; } catch { return false; }
  }, child, 'startup inbox event ingestion');

  dashboard = await createDashboardServer({ root, port: 0, wireProbe: async () => ({ online: false, workspace: 'Lumenva' }) });
  assert.equal((await getHealth(dashboard.address().port)).daemon, 'ONLINE');

  const duplicate = launchDaemon(root);
  assert.equal(await waitForExit(duplicate), 1);
  assert.match(duplicate.stderrText(), /daemon already running/);

  await stopDaemon(root, child);
  child = null;
  await waitFor(async () => !(await fileExists(join(root, 'state', 'daemon.pid'))), null, 'graceful daemon lock cleanup');
  assert.equal((await getHealth(dashboard.address().port)).daemon, 'OFFLINE');

  const secondTask = await dispatch({ task_id: 'daemon-after-restart', executor: 'test' }, root);
  await writeDoneEvent(root, secondTask.task_id, 'daemon-restart-event');
  child = launchDaemon(root);
  await waitFor(async () => {
    try { return (await loadState(secondTask.task_id, root)).internal_state === 'DONE'; } catch { return false; }
  }, child, 'event recovery after daemon restart');
  assert.equal((await getHealth(dashboard.address().port)).daemon, 'ONLINE');
});

test('daemon replaces a stale PID lock and removes its lock on graceful stop', async t => {
  const root = await mkdtemp(join(tmpdir(), 'mcg-daemon-stale-pid-'));
  let child;
  t.after(async () => {
    if (child?.exitCode === null) await stopDaemon(root, child).catch(() => child.kill());
    await rm(root, { recursive: true, force: true });
  });

  await ensureLayout(root);
  const lockPath = join(root, 'state', 'daemon.pid');
  await writeFile(lockPath, '2147483647\n');
  child = launchDaemon(root);
  await waitFor(async () => (await readFile(lockPath, 'utf8').catch(() => '')).trim() === String(child.pid), child, 'stale PID recovery');
  await stopDaemon(root, child);
  child = null;
  await waitFor(async () => !(await fileExists(lockPath)), null, 'stale PID lock cleanup after shutdown');
});
