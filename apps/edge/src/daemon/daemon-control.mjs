import { createServer, request } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CONTROL_NAME = 'daemon.control.json';

async function readControl(root) {
  try {
    const control = JSON.parse(await readFile(join(root, 'state', CONTROL_NAME), 'utf8'));
    if (control.host !== '127.0.0.1' || !Number.isInteger(control.port) || control.port < 1 || control.port > 65535 || !/^[a-f0-9]{64}$/.test(control.token)) return null;
    return control;
  } catch { return null; }
}

function matchesToken(candidate, token) {
  if (typeof candidate !== 'string') return false;
  const left = Buffer.from(candidate);
  const right = Buffer.from(token);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function startDaemonControl(root, onStop) {
  const stateDir = join(root, 'state');
  await mkdir(stateDir, { recursive: true });
  const token = randomBytes(32).toString('hex');
  let stopping = false;
  const server = createServer((req, res) => {
    if (!matchesToken(req.headers.authorization?.replace(/^Bearer\s+/i, ''), token)) {
      res.writeHead(401).end();
      return;
    }
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end('{"status":"ONLINE"}');
      return;
    }
    if (req.method === 'POST' && req.url === '/stop') {
      if (stopping) { res.writeHead(202).end(); return; }
      stopping = true;
      res.writeHead(202).end();
      setImmediate(() => { void onStop(); });
      return;
    }
    res.writeHead(404).end();
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const descriptor = { host: '127.0.0.1', port: server.address().port, token };
  const path = join(stateDir, CONTROL_NAME);
  const temp = `${path}.${process.pid}.tmp`;
  await writeFile(temp, `${JSON.stringify(descriptor)}\n`, { mode: 0o600, flag: 'wx' });
  await rename(temp, path);
  return {
    async close() {
      await rm(path, { force: true });
      await new Promise(resolve => server.close(resolve));
    }
  };
}

function controlRequest(control, method, path, timeoutMs = 1000) {
  return new Promise((resolve, reject) => {
    const req = request({ host: control.host, port: control.port, method, path, headers: { Authorization: `Bearer ${control.token}` }, timeout: timeoutMs }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('timeout', () => req.destroy(new Error('daemon control request timed out')));
    req.on('error', reject);
    req.end();
  });
}

export async function probeDaemon(root) {
  const control = await readControl(root);
  if (control) {
    try { return (await controlRequest(control, 'GET', '/health')) === 200; } catch { return false; }
  }
  try {
    const pid = Number((await readFile(join(root, 'state', 'daemon.pid'), 'utf8')).trim());
    if (!Number.isSafeInteger(pid) || pid < 1) return false;
    process.kill(pid, 0);
    return true;
  } catch { return false; }
}

export async function stopDaemon(root, { timeoutMs = 5000 } = {}) {
  const control = await readControl(root);
  if (!control) throw new Error('daemon control endpoint unavailable; refusing to terminate process by PID');
  const pidPath = join(root, 'state', 'daemon.pid');
  const targetPid = (await readFile(pidPath, 'utf8').catch(() => '')).trim();
  const status = await controlRequest(control, 'POST', '/stop');
  if (status !== 202) throw new Error(`daemon refused graceful stop (${status})`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const currentPid = (await readFile(pidPath, 'utf8').catch(() => '')).trim();
    if (!currentPid || currentPid !== targetPid) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('timed out waiting for daemon shutdown');
}
