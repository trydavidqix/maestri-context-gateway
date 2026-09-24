import assert from 'node:assert/strict';
import { test } from 'node:test';
import { request } from 'node:http';
import { createCoreExecutionFeed, createDashboardServer } from '../src/dashboard.mjs';
import { saveEvaluation } from '../src/evals.mjs';
import { recordHistory } from '../src/history/store.mjs';
import { recordTelemetry } from '../src/telemetry.mjs';

function get(port, path) {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method: 'GET' }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject); req.end();
  });
}

test('dashboard serves read-only local endpoints', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  const port = server.address().port;
  const home = await get(port, '/');
  const stats = await get(port, '/api/stats');
  const tasks = await get(port, '/api/tasks');
  const health = await get(port, '/api/health');
  assert.equal(home.status, 200);
  assert.match(home.body, /Tokens economizados/);
  assert.equal(stats.status, 200);
  assert.equal(tasks.status, 200);
  assert.equal(health.status, 200);
  assert.equal(JSON.parse(stats.body).tasks_processed >= 0, true);
  assert.equal(typeof JSON.parse(stats.body).observed_tokens.measurement_type, 'string');
  assert.equal(JSON.parse(tasks.body).tasks instanceof Array, true);
  assert.equal(JSON.parse(health.body).dashboard.host, '127.0.0.1');
  assert.equal(JSON.parse(health.body).dashboard.port, port);
  assert.match(home.body, /renderReportValue/);
  assert.match(home.body, /Detalhes do relatório/);
  assert.match(home.body, /id="theme-select"/);
  assert.match(home.body, /name="theme-color" content="rgb\(0, 0, 0\)"/);
  assert.match(home.body, /rgb\(242, 242, 247\)/);
  assert.match(home.body, /rgb\(0, 230, 118\)/);
  assert.match(home.body, /rgb\(255, 56, 60\)/);
  assert.match(home.body, /prefers-color-scheme: dark/);
  for (const token of [
    'rgb(229, 229, 234)', 'rgb(248, 248, 250)', 'rgb(209, 209, 214)', 'rgb(199, 199, 204)',
    'rgb(174, 174, 178)', 'rgb(142, 142, 147)', 'rgb(48, 209, 88)', 'rgb(233, 21, 45)',
    'rgb(16, 16, 17)', 'rgb(20, 20, 20)', 'rgb(25, 25, 25)', 'rgb(31, 31, 31)',
    'rgb(43, 43, 43)', 'rgb(48, 48, 48)', 'rgb(64, 64, 64)', 'rgb(119, 119, 119)',
    'rgb(0, 255, 106)', 'rgb(255, 18, 48)', 'rgba(25, 25, 25, 0.72)',
    'rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.06)', 'rgba(0, 0, 0, 0.45)',
    'rgba(0, 255, 106, 0.30)', 'rgba(255, 18, 48, 0.30)'
  ]) assert.ok(home.body.includes(token), `theme token ${token} must be present`);
  const clientScript = [...home.body.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)?.[1];
  assert.ok(clientScript, 'dashboard client script is present');
  assert.doesNotThrow(() => new Function(clientScript), 'dashboard client script parses');
  assert.equal(`${stats.body}${tasks.body}${health.body}`.includes('securityKeyHex'), false);
  assert.equal(`${stats.body}${tasks.body}${health.body}`.includes('b16c59355e'), false);
  assert.equal((await get(port, '/api/write')).status, 404);
  assert.equal((await get(port, '/missing')).status, 404);
});

test('dashboard exposes keyboard-accessible view navigation', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  const home = await get(server.address().port, '/');
  assert.match(home.body, /aria-label="Navegação principal"/);
  assert.ok(home.body.indexOf('class="sidebar"') < home.body.indexOf('class="main"'), 'navigation must remain in the sidebar');
  assert.match(home.body, /\.view-json\{[^}]*overflow-wrap:anywhere/);
  for (const label of ['Overview', 'History', 'Traces', 'Tasks', 'Agents', 'Tools', 'Plugins', 'MCPs', 'Graph', 'Cache', 'Memory', 'Validation', 'Alerts']) {
    assert.match(home.body, new RegExp(`data-view="${label}"`));
  }
  assert.match(home.body, /aria-current="page"/);
  assert.match(home.body, /detail-content" class="detail" hidden/);
  assert.equal([...home.body.matchAll(/function renderView\(/g)].length, 1, 'there must be one canonical report renderer');
  assert.match(home.body, /<h2 id="detail-title" tabindex="-1">/);
  assert.match(home.body, /id="view-status" class="visually-hidden" role="status" aria-live="polite"/);
  assert.match(home.body, /id="view-panel" tabindex="-1" role="region" aria-labelledby="detail-title"/);
  assert.match(home.body, /\$\('detail-title'\)\.focus\(/);
  assert.match(home.body, /Relatório carregado:/);
  assert.match(home.body, /period:'Período'/);
  assert.match(home.body, /coverage_percent:'Cobertura do mínimo'/);
  assert.match(home.body, /Falha ao carregar o relatório:/);
  assert.match(home.body, /id="tasks" role="region" aria-label="Tabela de tarefas recentes" tabindex="0"/);
  assert.match(home.body, /const requestId=\+\+viewLoadId/);
  assert.match(home.body, /if\(requestId!==viewLoadId\)return/);
  assert.match(home.body, /fetch\('\/api\/views',\{cache:'no-store'\}\)/);
  assert.doesNotMatch(home.body, /viewDataLoaded/);
  assert.match(home.body, /<caption class="visually-hidden">Tarefas recentes<\/caption>/);
  assert.equal([...home.body.matchAll(/<th scope="col">/g)].length, 7, 'task table headers must identify their columns');
});

test('dashboard renders the observability layout shell and reference sections', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  const home = await get(server.address().port, '/');
  assert.match(home.body, /class="app-shell"/);
  assert.match(home.body, /aria-label="Navegação principal"/);
  for (const id of ['kpis', 'health', 'volume', 'executors', 'tools', 'agents', 'tasks', 'alerts', 'trust']) {
    assert.match(home.body, new RegExp(`id="${id}"`), `${id} must be present in the dashboard shell`);
  }
  assert.match(home.body, /data-view="Overview"/);
  assert.match(home.body, /data-view="Validation"/);
  assert.match(home.body, /data-view="Graph"/);
  assert.match(home.body, /prefers-reduced-motion/);
  assert.match(home.body, /Skip to main content|Pular para o conteúdo/);
});

test('dashboard exposes real telemetry resources from its configured root', async t => {
  const root = await import('node:fs/promises').then(async fs => fs.mkdtemp((await import('node:path')).join((await import('node:os')).tmpdir(), 'mcg-dashboard-')));
  t.after(async () => (await import('node:fs/promises')).rm(root, { recursive: true, force: true }));
  await recordTelemetry(root, { agent: 'Codex CTO', runtime: 'Codex CLI', ide: 'Codex CLI', tool: 'functions.exec', plugin: 'caveman', mcp: 'maestri-wire', input_tokens: 12, output_tokens: 3, total_tokens: 15, measurement_type: 'exact', source: 'codex.cli.usage' });
  const server = await createDashboardServer({ root, port: 0 });
  t.after(() => server.close());
  const port = server.address().port;
  for (const [path, key, name] of [['/api/agents', 'agents', 'Codex CTO'], ['/api/tools', 'tools', 'functions.exec'], ['/api/plugins', 'plugins', 'caveman'], ['/api/mcps', 'mcps', 'maestri-wire'], ['/api/runtimes', 'runtimes', 'Codex CLI']]) {
    const body = JSON.parse((await get(port, path)).body);
    assert.ok(Array.isArray(body[key]));
    assert.equal(JSON.stringify(body[key]).includes(name), true);
  }
});

test('dashboard materializes canonical registries and keeps unobserved entries unavailable', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-registries-'));
  const server = await createDashboardServer({ root, port: 0, registryOptions: { include_processes: false } });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });

  for (const [endpoint, key, expectedName] of [
    ['/api/agents', 'agents', 'Claude CEO'],
    ['/api/tools', 'tools', 'MCG Context Compiler'],
    ['/api/plugins', 'plugins', 'Caveman'],
    ['/api/mcps', 'mcps', 'Maestri Wire'],
    ['/api/runtimes', 'runtimes', 'Antigravity CLI'],
    ['/api/models', 'models', 'Runtime-reported model']
  ]) {
    const response = await get(server.address().port, endpoint);
    const rows = JSON.parse(response.body)[key];
    const entry = rows.find(row => row.name === expectedName);
    assert.ok(entry, `${expectedName} must be served from the canonical registry`);
    assert.equal(entry.health, 'UNAVAILABLE');
    assert.equal(entry.last_seen, null);
    assert.equal(entry.measurement_type, 'unavailable');
    assert.ok(await fs.access(path.join(root, 'state', 'registry', `${key}.json`)).then(() => true));
  }

  const views = JSON.parse((await get(server.address().port, '/api/views')).body).views;
  assert.equal(views.Agents.status, 'UNAVAILABLE');
  assert.equal(views.Agents.count, null);
  assert.ok(views.Agents.registered_count > 0);
  assert.equal(views.Agents.items.find(row => row.name === 'Claude CEO').health, 'UNAVAILABLE');
});

test('dashboard hides paths and unavailable placeholders', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  const home = await get(server.address().port, '/');
  assert.match(home.body, /--bg:rgb\(0, 0, 0\)/i);
  assert.equal(home.body.includes('Gateway path'), false);
  assert.equal(home.body.includes('Métrica indisponível'), false);
  assert.equal(home.body.includes('Unknown'), false);
  assert.match(home.body, /Validação MCG/);
  const trust = await get(server.address().port, '/api/trust');
  assert.equal(trust.status, 200);
  assert.equal(typeof JSON.parse(trust.body).status, 'string');
});

test('dashboard binds loopback only', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  assert.equal(server.address().address, '127.0.0.1');
});

test('pending task has no fake economy', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-pending-'));
  await fs.mkdir(path.join(root, 'tasks', 'pending'), { recursive: true });
  await fs.writeFile(path.join(root, 'tasks', 'pending', 'state.json'), JSON.stringify({
    task_id: 'pending',
    executor: 'codex',
    internal_state: 'DISPATCHED',
    external_state: null,
    created_at: new Date().toISOString()
  }));
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const server = await createDashboardServer({ root, port: 0 });
  const response = await get(server.address().port, '/api/tasks');
  const pending = JSON.parse(response.body).tasks.find(task => task.status === 'DISPATCHED');
  assert.ok(pending);
  assert.equal(pending.delivered_chars, null);
  assert.equal(pending.tokens_saved, null);
  assert.equal(pending.reduction_percent, null);
});

test('events endpoint is an SSE stream', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0 });
  t.after(() => server.close());
  const response = await new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port: server.address().port, path: '/api/events', method: 'GET' }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk.toString(); if (body.includes('event: update')) { resolve({ status: res.statusCode, contentType: res.headers['content-type'], chunk: body }); req.destroy(); } });
    });
    req.on('error', error => { if (error.code !== 'ECONNRESET') reject(error); }); req.end();
  });
  assert.equal(response.status, 200);
  assert.match(response.contentType, /^text\/event-stream/);
  assert.match(response.chunk, /event: update/);
});

test('health uses wire workspace when the probe is available and hides secrets', async t => {
  const server = await createDashboardServer({ root: process.cwd(), port: 0, wireProbe: async () => ({ online: true, workspace: 'Lumenva' }) });
  t.after(() => server.close());
  const response = await get(server.address().port, '/api/health');
  const body = JSON.parse(response.body);
  assert.equal(body.workspace, 'Lumenva');
  assert.equal(body.wire, 'ONLINE');
  assert.equal(JSON.stringify(body).includes('token'), false);
  assert.equal(JSON.stringify(body).includes('securityKey'), false);
});

test('dashboard exposes resource groups, CEO alerts and persisted summary', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-summary-'));
  const server = await createDashboardServer({ root, port: 0, wireProbe: async () => ({ online: true, workspace: 'Lumenva', agents: [] }) });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const statsResponse = await get(server.address().port, '/api/stats');
  const stats = JSON.parse(statsResponse.body);
  assert.ok(Array.isArray(stats.by_plugin));
  assert.ok(Array.isArray(stats.by_tool));
  assert.ok(Array.isArray(stats.by_mcp));
  assert.ok(Array.isArray(stats.by_ide));
  assert.ok(Array.isArray(stats.alerts));
  assert.ok(Array.isArray(stats.agents));
  assert.equal(await fs.access(path.join(root, 'state', 'dashboard', 'snapshot.json')).then(() => true), true);
});


test('dashboard exposes every M0.12 view without fake zero observations', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-views-'));
  const server = await createDashboardServer({ root, port: 0, wireProbe: async () => ({ online: false, workspace: 'Lumenva' }) });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const response = await get(server.address().port, '/api/views');
  assert.equal(response.status, 200);
  const views = JSON.parse(response.body).views;
  assert.deepEqual(Object.keys(views), ['Overview','History','Traces','Tasks','Agents','Tools','Plugins','MCPs','Graph','Executions','Cache','Memory','Validation','Alerts']);
  assert.equal(views.Cache.status, 'UNAVAILABLE');
  assert.equal(views.Cache.samples, null);
  assert.equal(views.Cache.period, 'ALL_TIME');
  assert.equal(views.Cache.record_limit, 5000);
  assert.equal(views.Cache.limit_reached, false);
  assert.equal(views.Memory.records, null);
  assert.equal(views.Validation.paired_runs, null);
  assert.equal(views.Validation.sample_coverage, null);
  assert.equal(views.Validation.status, 'UNVALIDATED');
  assert.equal(views.Executions.status, 'UNAVAILABLE');
  assert.equal(views.Executions.usage.input_tokens, null);
  assert.equal(response.body.includes('NaN'), false);
  const expectedKeys = ['Overview', 'History', 'Traces', 'Tasks', 'Agents', 'Tools', 'Plugins', 'MCPs', 'Graph', 'Executions', 'Cache', 'Memory', 'Validation', 'Alerts'];
  assert.deepEqual(Object.keys(views).sort(), [...expectedKeys].sort(), 'The view catalog must contain exactly the 13 documented views');
  for (const key of expectedKeys) {
    const view = views[key];
    assert.ok(view.source, `View ${key} missing source`);
    assert.ok(view.timestamp, `View ${key} missing timestamp`);
    assert.ok(['exact', 'estimated', 'unavailable'].includes(view.measurement_type), `View ${key} invalid measurement_type: ${view.measurement_type}`);
  }

  for (const endpoint of ['/api/history','/api/cache','/api/memory','/api/validation']) {
    const item = await get(server.address().port, endpoint);
    assert.equal(item.status, 200);
    assert.equal(item.body.includes('NaN'), false);
  }

  await recordHistory(root, 'cache_metrics', { cache_hits: 2, cache_misses: 1, measurement_type: 'exact' });
  await saveEvaluation(root, {
    run_id: 'dashboard-scope-pair', kind: 'A/B', category: 'context-recall',
    baseline: { task_success: true, context_recall: 100, evidence_grounding: 100, hallucination_rate: 0, total_tokens: 100, context_tokens: 80, real_executor: true, measurement_type: 'exact', model: null, effort: 'same', workspace: root },
    mcg: { task_success: true, context_recall: 100, evidence_grounding: 100, hallucination_rate: 0, total_tokens: 90, context_tokens: 40, real_executor: true, measurement_type: 'exact', model: null, effort: 'same', workspace: root }
  });
  const observedViews = JSON.parse((await get(server.address().port, '/api/views')).body).views;
  assert.equal(observedViews.Cache.samples, 1);
  assert.equal(observedViews.Cache.period, 'ALL_TIME');
  assert.equal(observedViews.Cache.limit_reached, false);
  assert.deepEqual(observedViews.Validation.sample_coverage, { observed_pairs: 1, required_pairs: 30, coverage_percent: 3.33, minimum_met: false, coverage_scope: 'minimum benchmark pairs' });
});

test('history aggregate is unavailable when any history subtype is unavailable', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-history-'));
  await recordHistory(root, 'tasks', { task_id: 'task-1', measurement_type: 'exact' });
  const server = await createDashboardServer({ root, port: 0, wireProbe: async () => ({ online: false, workspace: 'Lumenva' }) });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const response = await get(server.address().port, '/api/history');
  const history = JSON.parse(response.body);
  assert.equal(response.status, 200);
  assert.equal(history.types.tasks.measurement_type, 'exact');
  assert.equal(history.measurement_type, 'unavailable');
});

test('dashboard exposes read-only graph view and source drill-down', async t => {
  const server = await createDashboardServer({
    root: process.cwd(),
    port: 0,
    graphView: async () => ({
      readOnly: true,
      namespace: 'project:lumenva',
      query: 'context',
      nodes: [{ id: 'fact:1', kind: 'fact', label: 'Fact', sourceId: 'note-1' }],
      edges: [{ id: 'edge:1', source: 'fact:1', target: 'source:note-1', sourceId: 'note-1', confidence: 0.9, validFrom: '2026-01-01', validUntil: null }]
    })
  });
  t.after(() => server.close());
  const graph = await get(server.address().port, '/api/graph');
  assert.equal(graph.status, 200);
  assert.equal(JSON.parse(graph.body).readOnly, true);
  assert.match((await get(server.address().port, '/')).body, /data-view="Graph"/);
  assert.match((await get(server.address().port, '/')).body, /Graph/);
});

test('dashboard exposes persisted execution evidence and observed usage read-only', async t => {
  const execution = { id: 'execution-1', status: 'success', result: { usage: { input_tokens: 10, cached_tokens: 3, output_tokens: 4, duration_ms: 50, cost_usd: 0.01 } } };
  const server = await createDashboardServer({ root: process.cwd(), port: 0, executionFeed: async () => [execution] });
  t.after(() => server.close());
  const views = JSON.parse((await get(server.address().port, '/api/views')).body).views;
  assert.equal(views.Executions.status, 'OBSERVED');
  assert.deepEqual(views.Executions.usage, { input_tokens: 10, cached_tokens: 3, output_tokens: 4, duration_ms: 50, cost_usd: 0.01, measurement_type: 'exact', source: 'Core GET /executions usage' });
  assert.match((await get(server.address().port, '/')).body, /data-view="Executions"/);
});

test('core execution feed accepts loopback HTTP only', async () => {
  assert.throws(() => createCoreExecutionFeed('https://example.com'), /loopback HTTP/);
  assert.throws(() => createCoreExecutionFeed('http://example.com'), /loopback HTTP/);
});

test('dashboard periods stay unavailable when no context compile was observed', async t => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const os = await import('node:os');
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mcg-dashboard-periods-'));
  const server = await createDashboardServer({ root, port: 0, wireProbe: async () => ({ online: false, workspace: 'Lumenva' }) });
  t.after(async () => { await new Promise(resolve => server.close(resolve)); await fs.rm(root, { recursive: true, force: true }); });
  const stats = JSON.parse((await get(server.address().port, '/api/stats')).body);
  assert.equal(stats.periods.today, null);
  assert.equal(stats.periods.seven_days, null);
  assert.equal(stats.periods.all_time, null);
});
