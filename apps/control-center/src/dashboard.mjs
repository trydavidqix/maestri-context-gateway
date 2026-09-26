import { createServer } from 'node:http';
import { watch } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from '@nexus-brain/context-gateway/core';
import { loadWireConfig, wireRequest } from '@nexus-brain/edge/wire';
import { aggregateTelemetry, alertHistory, ceoInbox, coverage, discoverResources, evaluateAlerts, evaluateAnomalies, telemetryEvents } from '@nexus-brain/evidence/telemetry';
import { aggregatePairedEvaluations, evaluationRuns, latestEvaluation, trustScore } from '@nexus-brain/evidence/evals';
import { listTraces, loadTrace } from '@nexus-brain/evidence/traces';
import { getEventBus } from '@nexus-brain/evidence/events';
import { efficiencyScore, regressionWatch } from '@nexus-brain/evidence/scores';
import { getHistoryStore, HISTORY_TYPES } from '@nexus-brain/evidence/history';
import { MEMORY_LAYERS, MEMORY_NAMESPACES, memoryEvents, retrievalHistory } from '@nexus-brain/brain/memory';
import { refreshRegistries } from '@nexus-brain/context-gateway/registry';
import { probeDaemon } from '@nexus-brain/edge/daemon-control';
import { dashboardHtml } from './dashboard-ui.mjs';

const HOST = '127.0.0.1';
const PORT = 7435;
const safeNumber = value => Number.isFinite(value) ? value : 0;
const labels = { DONE: 'CONCLUÍDA', RUNNING: 'EM EXECUÇÃO', DISPATCHED: 'ENVIADA', BLOCKED: 'BLOQUEADA', FAILED: 'FALHOU', CANCELLED: 'CANCELADA', INCOMPLETE: 'INCOMPLETA' };

async function readJson(path) { try { return JSON.parse(await readFile(path, 'utf8')); } catch { return null; } }
async function size(path) { try { return (await stat(path)).size; } catch { return null; } }
function taskStatus(state) { if (state.external_state === 'DONE') return 'DONE'; if (state.external_state === 'BLOCKED_OWNER' || state.internal_state === 'BLOCKED') return 'BLOCKED'; if (['WORKING', 'TESTING', 'BUILDING', 'CI_RUNNING', 'RETRYING'].includes(state.internal_state)) return 'RUNNING'; if (state.internal_state === 'DISPATCHED') return 'DISPATCHED'; return state.internal_state === 'CANCELLED' ? 'CANCELLED' : 'INCOMPLETE'; }
function metric(original, delivered) {
  if (!Number.isFinite(delivered)) return { original_chars: original || null, delivered_chars: null, tokens_saved: null, reduction_percent: null, measurable: false, measurement_type: 'unavailable', source: 'task result absent', timestamp: new Date().toISOString() };
  const baseline = safeNumber(original); const saved = Math.max(0, baseline - delivered); const reduction = baseline > 0 ? Number((saved / baseline * 100).toFixed(2)) : 0;
  return { original_chars: baseline, delivered_chars: delivered, tokens_saved: Math.ceil(saved / 4), reduction_percent: reduction, measurable: true, measurement_type: 'estimated', source: 'task evidence bytes / 4', timestamp: new Date().toISOString() };
}

export async function taskStats(root = ROOT) {
  let ids = []; try { ids = await readdir(join(root, 'tasks')); } catch { return []; }
  const rows = [];
  for (const id of ids) {
    const state = await readJson(join(root, 'tasks', id, 'state.json')); if (!state) continue;
    const events = await size(join(root, 'tasks', id, 'events.jsonl')); const manifest = await size(join(root, 'tasks', id, 'manifest.json')); const delivered = await size(join(root, 'tasks', id, 'result.json'));
    const source = state.source || {}; const status = taskStatus(state);
    rows.push({ task_id: id, executor: state.executor || 'Não identificado', agent: state.agent || source.host_agent || 'Não identificado', runtime: state.runtime || state.ide || 'Não identificado', plugin: source.plugin_name || source.plugin_id || 'Legacy / Não identificado', status, detail_status: state.external_state || state.internal_state || 'Não identificado', active: ['RUNNING', 'DISPATCHED'].includes(status), created_at: state.created_at || null, completed_at: status === 'DONE' ? state.updated_at || null : null, ...metric(safeNumber(events) + safeNumber(manifest), delivered) });
  }
  return rows.sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')));
}

export function contextMetricsFromEvents(events = []) {
  const compiles = events.filter(event => event.operation === 'context.compile' && Number.isFinite(event.input_chars) && Number.isFinite(event.output_chars));
  const original_chars = compiles.reduce((sum, event) => sum + event.input_chars, 0);
  const delivered_chars = compiles.reduce((sum, event) => sum + event.output_chars, 0);
  const saved_chars = Math.max(0, original_chars - delivered_chars);
  const compression_ratio = original_chars > 0 ? Number((saved_chars / original_chars * 100).toFixed(2)) : null;

  const eligibleTaskIds = new Set(events.filter(event => event.task_id).map(event => event.task_id));
  const coveredTaskIds = new Set(compiles.filter(event => event.task_id).map(event => event.task_id));
  const mcg_coverage = eligibleTaskIds.size ? Number((coveredTaskIds.size / eligibleTaskIds.size * 100).toFixed(2)) : null;

  return {
    compiles,
    compression_ratio,
    mcg_coverage,
    eligible_tasks: eligibleTaskIds.size,
    covered_tasks: coveredTaskIds.size,
    estimated_context_savings: {
      original_chars,
      delivered_chars,
      saved_chars,
      estimated_tokens_original: original_chars ? Math.ceil(original_chars / 4) : null,
      estimated_tokens_delivered: original_chars ? Math.ceil(delivered_chars / 4) : null,
      estimated_tokens_avoided: original_chars ? Math.ceil(saved_chars / 4) : null,
      measurement_type: compiles.length ? 'estimated' : 'unavailable',
      source: 'context.compile observed chars; token estimate chars/4',
      timestamp: new Date().toISOString()
    }
  };
}

function taskTokenSummary(tasks, compiles) {
  const completed = tasks.filter(task => task.status === 'DONE');
  const active = tasks.filter(task => task.active);
  const original = compiles.reduce((sum, event) => sum + (Number.isFinite(event.input_chars) ? event.input_chars : 0), 0);
  const delivered = compiles.reduce((sum, event) => sum + (Number.isFinite(event.output_chars) ? event.output_chars : 0), 0);
  const saved = Math.max(0, original - delivered);
  const total = {
    executor: 'total',
    tasks_processed: completed.length,
    tasks_active: active.length,
    original_chars: original || null,
    delivered_chars: compiles.length ? delivered : null,
    saved_chars: compiles.length ? saved : null,
    reduction_percent: original > 0 ? Number((saved / original * 100).toFixed(2)) : null,
    estimated_tokens_original: original ? Math.ceil(original / 4) : null,
    estimated_tokens_delivered: compiles.length ? Math.ceil(delivered / 4) : null,
    estimated_tokens_saved: compiles.length ? Math.ceil(saved / 4) : null,
    measurement_type: compiles.length ? 'estimated' : 'unavailable',
    source: 'context.compile observed chars; token estimate chars/4',
    timestamp: new Date().toISOString()
  };

  const by_executor = {};
  for (const event of compiles) {
    const key = event.executor || 'Não identificado';
    by_executor[key] ||= {
      executor: key,
      tasks_processed: 0,
      tasks_active: tasks.filter(task => task.executor === key && task.active).length,
      original_chars: 0,
      delivered_chars: 0,
      saved_chars: 0,
      estimated_tokens_original: 0,
      estimated_tokens_delivered: 0,
      estimated_tokens_saved: 0,
      reduction_percent: null,
      measurement_type: 'estimated',
      source: 'context.compile observed chars; token estimate chars/4',
      timestamp: total.timestamp,
      task_ids: new Set()
    };
    const item = by_executor[key];
    item.original_chars += event.input_chars;
    item.delivered_chars += event.output_chars;
    item.task_ids.add(event.task_id || `compile-${item.task_ids.size}`);
  }
  for (const item of Object.values(by_executor)) {
    item.tasks_processed = item.task_ids.size;
    item.saved_chars = Math.max(0, item.original_chars - item.delivered_chars);
    item.estimated_tokens_original = Math.ceil(item.original_chars / 4);
    item.estimated_tokens_delivered = Math.ceil(item.delivered_chars / 4);
    item.estimated_tokens_saved = Math.ceil(item.saved_chars / 4);
    item.reduction_percent = item.original_chars ? Number((item.saved_chars / item.original_chars * 100).toFixed(2)) : null;
    delete item.task_ids;
  }
  return { ...total, by_executor };
}

async function wireHealth(root, wireProbe) {
  if (wireProbe) return wireProbe();
  try {
    const config = await loadWireConfig(root); const [info, workspaces] = await Promise.all([wireRequest(config, '/api/info'), wireRequest(config, '/api/workspaces')]); const workspace = workspaces.workspaces?.find(item => item.name === 'Lumenva') || workspaces.workspaces?.[0];
    return { online: Boolean(info), workspace: workspace?.name || 'Lumenva' };
  } catch { return { online: false, workspace: 'Lumenva' }; }
}

export async function health(root = ROOT, wireProbe, port = PORT) {
  const daemon = await probeDaemon(root);
  const wire = await wireHealth(root, wireProbe); return { dashboard: { host: HOST, port }, daemon: daemon ? 'ONLINE' : 'OFFLINE', wire: wire.online ? 'ONLINE' : 'OFFLINE', workspace: wire.workspace || 'Lumenva', workspace_online: wire.online, source: 'authenticated daemon control endpoint + Maestri Wire', measurement_type: 'exact', timestamp: new Date().toISOString() };
}

export async function dashboardStats(root = ROOT) {
  const [tasks, events, resources, evaluation, aggregate] = await Promise.all([
    taskStats(root),
    telemetryEvents(root),
    discoverResources(root),
    latestEvaluation(root),
    aggregatePairedEvaluations(root)
  ]);
  const validation = aggregate?.dataset_size > 0
    ? { ...aggregate, trust: trustScore({ ...aggregate, last_validation: aggregate.timestamp }) }
    : evaluation;
  const contextMetrics = contextMetricsFromEvents(events);
  const summary = taskTokenSummary(tasks, contextMetrics.compiles);
  const groups = aggregateTelemetry(events);
  const tokenUsage = events.reduce((sum, event) => sum + (event.total_tokens || event.estimated_tokens || 0), 0);
  const providerEvents = events.filter(event => event.measurement_type === 'exact' && Number.isFinite(event.total_tokens));
  const observed_tokens = {
    input_tokens: providerEvents.length ? providerEvents.reduce((sum, event) => sum + (event.input_tokens || 0), 0) : null,
    output_tokens: providerEvents.length ? providerEvents.reduce((sum, event) => sum + (event.output_tokens || 0), 0) : null,
    reasoning_tokens: providerEvents.length ? providerEvents.reduce((sum, event) => sum + (event.reasoning_tokens || 0), 0) : null,
    total_tokens: providerEvents.length ? providerEvents.reduce((sum, event) => sum + event.total_tokens, 0) : null,
    measurement_type: providerEvents.length ? 'exact' : 'unavailable',
    source: providerEvents.length ? [...new Set(providerEvents.map(event => event.source))].join(', ') : 'provider usage absent',
    timestamp: new Date().toISOString()
  };

  await evaluateAlerts(root, {
    tokens: tokenUsage,
    executors: Object.fromEntries(groups.agents.map(item => [item.agent, { tokens: item.tokens || 0 }])),
    agents: Object.fromEntries(groups.agents.map(item => [item.agent, { tokens: item.tokens || 0 }])),
    plugins: Object.fromEntries(groups.plugins.map(item => [item.plugin, { tokens: item.tokens || 0 }])),
    mcps: Object.fromEntries(groups.mcps.map(item => [item.mcp, { tokens: item.tokens || 0 }])),
    ides: Object.fromEntries(groups.ides.map(item => [item.ide, { tokens: item.tokens || 0 }])),
    runtimes: Object.fromEntries(groups.runtimes.map(item => [item.runtime, { tokens: item.tokens || 0 }])),
    tools: Object.fromEntries(groups.tools.map(item => [item.tool, { tokens: item.tokens || 0 }]))
  });
  await evaluateAnomalies(root, events, tasks);

  const now = Date.now();
  const contextTokensWithin = days => contextMetrics.compiles
    .filter(event => event.timestamp && now - Date.parse(event.timestamp) <= days * 86_400_000)
    .reduce((sum, event) => sum + Math.ceil(Math.max(0, event.input_chars - event.output_chars) / 4), 0);

  const trust = validation?.trust || trustScore({
    baseline: {},
    mcg: {},
    context_recall: null,
    evidence_grounding: null,
    hallucination_rate: null
  });

  const workflow_token_savings = validation?.baseline?.total_tokens != null
    && validation?.mcg?.total_tokens != null
    && validation.baseline.total_tokens > 0
    ? Number(((validation.baseline.total_tokens - validation.mcg.total_tokens) / validation.baseline.total_tokens * 100).toFixed(2))
    : null;

  const workflowMeasurement = workflow_token_savings == null
    ? 'unavailable'
    : validation?.baseline?.measurement_type === 'exact' && validation?.mcg?.measurement_type === 'exact'
      ? 'exact'
      : 'estimated';

  const efficiency = validation?.baseline && validation?.mcg
    ? efficiencyScore({
        real_token_saving: workflow_token_savings,
        task_success: validation.mcg.task_success ? 100 : 0,
        context_retention: validation.mcg.context_recall,
        evidence_grounding: validation.mcg.evidence_grounding,
        hallucination_rate: validation.mcg.hallucination_rate,
        dataset_size: validation.trust?.dataset_size ?? 0
      })
    : efficiencyScore({});

  const regression = validation?.baseline && validation?.mcg
    ? regressionWatch(validation.baseline, validation.mcg, { dataset_size: validation.trust?.dataset_size ?? 0 })
    : { status: 'UNVALIDATED', regressions: [], source: 'baseline vs MCG', measurement_type: 'unavailable', timestamp: new Date().toISOString() };

  const result = {
    ...summary,
    observed_tokens,
    tasks,
    periods: {
      today: contextMetrics.compiles.length ? contextTokensWithin(1) : null,
      seven_days: contextMetrics.compiles.length ? contextTokensWithin(7) : null,
      all_time: contextMetrics.estimated_context_savings.estimated_tokens_avoided
    },
    by_tool: resources.tools,
    by_plugin: resources.plugins,
    by_mcp: resources.mcps,
    by_ide: resources.ides,
    agents: resources.agents,
    runtimes: resources.runtimes,
    metrics: {
      compression_ratio: contextMetrics.compression_ratio,
      mcg_coverage: contextMetrics.mcg_coverage,
      coverage_basis: {
        eligible_tasks: contextMetrics.eligible_tasks,
        covered_tasks: contextMetrics.covered_tasks
      },
      estimated_context_savings: contextMetrics.estimated_context_savings,
      real_workflow_token_savings: workflow_token_savings,
      workflow_token_savings,
      workflow_token_savings_percent: workflow_token_savings,
      source: 'context.compile task coverage + paired evaluation',
      measurement_type: workflowMeasurement,
      timestamp: new Date().toISOString()
    },
    efficiency,
    regression,
    coverage: coverage(events, resources),
    trust,
    telemetry: {
      event_count: events.length,
      source: 'state/telemetry/events.jsonl',
      measurement_type: events.length ? events.reduce((best, event) => event.measurement_type === 'exact' ? 'exact' : best, 'estimated') : 'unavailable',
      timestamp: new Date().toISOString()
    },
    alerts: await alertHistory(root),
    ceo_inbox: await ceoInbox(root),
    warnings: tasks.filter(task => !task.measurable && task.active).map(task => `${task.task_id}: resultado final ausente`)
  };

  await mkdir(join(root, 'state', 'dashboard'), { recursive: true, mode: 0o700 });
  await writeFile(join(root, 'state', 'dashboard', 'snapshot.json'), `${JSON.stringify(result, null, 2)}\n`, { mode: 0o600 });
  return result;
}


async function cacheView(root) {
  const rows = await getHistoryStore(root).query('cache_metrics', { period: 'ALL_TIME', limit: 5000 });
  const latest = rows.at(-1)?.data || null;
  const observed = rows.length > 0;
  return {
    status: observed ? 'OBSERVED' : 'UNAVAILABLE',
    samples: observed ? rows.length : null,
    period: 'ALL_TIME',
    record_limit: 5000,
    limit_reached: rows.length === 5000,
    last_observed_at: latest?.timestamp || rows.at(-1)?.timestamp || null,
    latest: latest ? {
      cache_hits: Number.isFinite(latest.cache_hits) ? latest.cache_hits : null,
      cache_misses: Number.isFinite(latest.cache_misses) ? latest.cache_misses : null,
      cache_hit_rate: Number.isFinite(latest.cache_hit_rate) ? latest.cache_hit_rate : null,
      tokens_avoided_estimated: Number.isFinite(latest.tokens_avoided_estimated) ? latest.tokens_avoided_estimated : null,
      context_reused: typeof latest.context_reused === 'boolean' ? latest.context_reused : null
    } : null,
    measurement_type: latest?.measurement_type || 'unavailable',
    scope: 'All retained cache_metrics history; up to 5,000 records',
    limitations: rows.length === 5000 ? 'The 5,000-record query limit was reached; older records may be omitted.' : 'No source timestamp is inferred when history rows omit one.',
    source: 'HistoryStore cache_metrics',
    timestamp: new Date().toISOString()
  };
}

async function historyView(root) {
  const store = getHistoryStore(root);
  const available = new Set(await store.listAvailableTypes());
  const types = {};
  for (const type of HISTORY_TYPES) {
    if (!available.has(type)) {
      types[type] = { status: 'UNAVAILABLE', records: null, period: 'ALL_TIME', record_limit: 5000, limit_reached: false, last_observed_at: null, measurement_type: 'unavailable', source: `state/history/raw/${type}.jsonl` };
      continue;
    }
    const rows = await store.query(type, { period: 'ALL_TIME', limit: 5000 });
    types[type] = { status: 'OBSERVED', records: rows.length, period: 'ALL_TIME', record_limit: 5000, limit_reached: rows.length === 5000, last_observed_at: rows.at(-1)?.timestamp || null, measurement_type: rows.every(row => row.measurement_type === 'exact') ? 'exact' : 'estimated', source: `state/history/raw/${type}.jsonl` };
  }
  const measurements = Object.values(types).map(type => type.measurement_type);
  const measurement_type = measurements.includes('unavailable')
    ? 'unavailable'
    : measurements.includes('estimated') ? 'estimated' : 'exact';
  const hasObserved = Object.values(types).some(type => type.status === 'OBSERVED');
  const hasUnavailable = Object.values(types).some(type => type.status === 'UNAVAILABLE');
  const status = hasObserved && hasUnavailable ? 'PARTIAL' : hasObserved ? 'OBSERVED' : 'UNAVAILABLE';
  return { status, types, period: 'ALL_TIME', scope: 'All retained records per history type; up to 5,000 records per type', limitations: 'Each subtype reports its own limit_reached and last_observed_at; missing sources remain unavailable.', source: 'HistoryStore', measurement_type, timestamp: new Date().toISOString() };
}

async function memoryView(root) {
  const [events, retrievals] = await Promise.all([memoryEvents(root), retrievalHistory(root)]);
  const latest = new Map();
  for (const event of events) if (event.memory?.id) latest.set(event.memory.id, event.memory);
  const records = [...latest.values()];
  const count = filter => records.filter(filter).length;
  return {
    status: events.length ? 'OBSERVED' : 'UNAVAILABLE',
    scope: 'All retained memory events and retrieval records; record totals use latest event per memory ID',
    limitations: 'No time-window or retention guarantee is provided by the local event files.',
    records: events.length ? records.length : null,
    event_count: events.length || null,
    retrieval_count: retrievals.length || null,
    layers: Object.fromEntries(MEMORY_LAYERS.map(layer => [layer, events.length ? count(item => item.layer === layer) : null])),
    namespaces: Object.fromEntries(MEMORY_NAMESPACES.map(namespace => [namespace, events.length ? count(item => item.namespace?.startsWith(namespace)) : null])),
    statuses: events.length ? Object.fromEntries([...new Set(records.map(item => item.status))].map(status => [status, count(item => item.status === status)])) : null,
    source: 'state/memory/events.jsonl + retrieval.jsonl',
    measurement_type: events.length ? 'exact' : 'unavailable',
    timestamp: new Date().toISOString()
  };
}

async function validationView(root) {
  const [runs, aggregate] = await Promise.all([evaluationRuns(root), aggregatePairedEvaluations(root)]);
  const trust = trustScore({ ...aggregate, dataset_size: aggregate.dataset_size, last_validation: runs.at(-1)?.timestamp || null });
  return {
    status: trust.status,
    scope: 'All paired evaluation runs currently readable by the evaluation store',
    limitations: aggregate.dataset_size < trust.minimum_dataset ? `At least ${trust.minimum_dataset} valid pairs are required before the minimum sample gate is met.` : 'The sample gate does not replace interactive or provider-backed validation.',
    paired_runs: aggregate.dataset_size || null,
    minimum_dataset: trust.minimum_dataset,
    sample_coverage: aggregate.dataset_size > 0 && trust.minimum_dataset > 0 ? {
      observed_pairs: aggregate.dataset_size,
      required_pairs: trust.minimum_dataset,
      coverage_percent: Number((Math.min(aggregate.dataset_size / trust.minimum_dataset, 1) * 100).toFixed(2)),
      minimum_met: aggregate.dataset_size >= trust.minimum_dataset,
      coverage_scope: 'minimum benchmark pairs'
    } : null,
    categories: Object.keys(aggregate.categories).length ? aggregate.categories : null,
    trust,
    latest_run_id: runs.at(-1)?.run_id || null,
    source: aggregate.source,
    measurement_type: aggregate.measurement_type,
    timestamp: new Date().toISOString()
  };
}

export function createCoreExecutionFeed(baseUrl = process.env.LUMENVA_CORE_URL) {
  if (!baseUrl) return null;
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'http:' || !['127.0.0.1', 'localhost', '::1'].includes(origin.hostname)) throw new Error('Core API must be loopback HTTP');
  return async () => {
    const response = await fetch(new URL('/executions', origin), { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Core execution feed HTTP ${response.status}`);
    const body = await response.json();
    return Array.isArray(body?.executions) ? body.executions : [];
  };
}

export async function executionEvidence(executionFeed) {
  const source = 'Core GET /executions; read-only execution feed';
  const unavailableUsage = { input_tokens: null, cached_tokens: null, output_tokens: null, duration_ms: null, cost_usd: null, measurement_type: 'unavailable', source: 'Core GET /executions usage' };
  if (!executionFeed) return { status: 'UNAVAILABLE', count: null, executions: null, usage: unavailableUsage, scope: 'No Core execution feed configured', limitations: 'Provider executions and usage are not observable from this dashboard.', measurement_type: 'unavailable', source, timestamp: new Date().toISOString() };
  try {
    const raw = await executionFeed();
    const executions = Array.isArray(raw) ? raw : Array.isArray(raw?.executions) ? raw.executions : [];
    const usageRows = executions.map(execution => execution?.result?.usage).filter(usage => usage && Number.isFinite(usage.input_tokens) && Number.isFinite(usage.output_tokens));
    const sumObserved = field => usageRows.length && usageRows.every(usage => Number.isFinite(usage[field])) ? usageRows.reduce((sum, usage) => sum + usage[field], 0) : null;
    const usage = usageRows.length ? { input_tokens: sumObserved('input_tokens'), cached_tokens: sumObserved('cached_tokens'), output_tokens: sumObserved('output_tokens'), duration_ms: sumObserved('duration_ms'), cost_usd: sumObserved('cost_usd'), measurement_type: 'exact', source: 'Core GET /executions usage' } : unavailableUsage;
    return { status: executions.length ? 'OBSERVED' : 'UNAVAILABLE', count: executions.length || null, executions: executions.length ? executions : null, usage, scope: 'Entries returned by the configured Core GET /executions endpoint', limitations: 'Pagination and retention are defined by Core; missing usage values remain unavailable.', measurement_type: executions.length ? 'exact' : 'unavailable', source, timestamp: new Date().toISOString() };
  } catch { return { status: 'UNAVAILABLE', count: null, executions: null, usage: unavailableUsage, scope: 'Configured Core GET /executions endpoint', limitations: 'Core endpoint request failed; no execution or usage values are inferred.', measurement_type: 'unavailable', source, timestamp: new Date().toISOString() }; }
}

export async function dashboardViews(root = ROOT, { graphView, executionFeed, registryOptions = {} } = {}) {
  const [stats, history, traces, cache, memory, validation, registries, executionEvidenceView] = await Promise.all([
    dashboardStats(root), historyView(root), listTraces(root), cacheView(root), memoryView(root), validationView(root), refreshRegistries(root, registryOptions), executionEvidence(executionFeed)
  ]);
  const unavailable = (source, limitations = 'The configured source is not available.') => ({ status: 'UNAVAILABLE', observations: null, scope: 'No source records observed', limitations, measurement_type: 'unavailable', source, timestamp: new Date().toISOString() });
  const registryView = (rows, source) => {
    const observed = rows.filter(row => row.health === 'OBSERVED');
    const measurements = observed.map(row => row.measurement_type);
    const measurement_type = !observed.length || measurements.includes('unavailable')
      ? 'unavailable'
      : measurements.includes('estimated') ? 'estimated' : 'exact';
    return { status: observed.length ? 'OBSERVED' : 'UNAVAILABLE', count: observed.length || null, registered_count: rows.length || null, items: rows, scope: 'Current refreshed registry snapshot; observed count is separate from registered count', limitations: 'Registration does not imply a live health probe; fields unsupported by a source remain unavailable.', measurement_type, source, timestamp: new Date().toISOString() };
  };
  const tasksWithResult = stats.tasks.filter(task => task.measurable).length;
  const taskResultCoverage = stats.tasks.length ? {
    tasks_with_result: tasksWithResult,
    total_tasks: stats.tasks.length,
    coverage_percent: Number((tasksWithResult / stats.tasks.length * 100).toFixed(2)),
    coverage_basis: 'result.json evidence exists'
  } : null;
  return {
    Overview: { status: 'OBSERVED', tasks_processed: stats.tasks_processed, tasks_active: stats.tasks_active, metrics: stats.metrics, scope: 'Telemetry from the last 7 days; task states from all locally retained task records', limitations: 'Telemetry outside the 7-day window is excluded; task metrics are estimates when derived from evidence bytes.', measurement_type: stats.telemetry.measurement_type, source: stats.telemetry.source, timestamp: new Date().toISOString() },
    History: history,
    Traces: traces.length ? { status: 'OBSERVED', count: traces.length, traces, scope: 'All readable trace files currently retained under state/telemetry/traces', limitations: 'Malformed or unreadable trace files are skipped; no retention window is configured here.', measurement_type: 'exact', source: 'state/telemetry/traces/*.jsonl', timestamp: new Date().toISOString() } : unavailable('state/telemetry/traces/*.jsonl', 'No readable trace files are currently available.'),
    Tasks: { status: stats.tasks.length ? 'OBSERVED' : 'UNAVAILABLE', count: stats.tasks.length || null, period: 'ALL_TIME', scope: 'All task directories with a readable state.json', limitations: 'Directories without readable state.json are excluded; result coverage reports evidence availability separately.', result_coverage: taskResultCoverage, tasks: stats.tasks.length ? stats.tasks : null, measurement_type: stats.tasks.length ? 'estimated' : 'unavailable', source: 'tasks/*/state.json + evidence', timestamp: new Date().toISOString() },
    Agents: registryView(registries.agents, 'state/registry/agents.json + telemetry/process discovery'),
    Tools: registryView(registries.tools, 'state/registry/tools.json + telemetry discovery'),
    Plugins: registryView(registries.plugins, 'state/registry/plugins.json + telemetry discovery'),
    MCPs: registryView(registries.mcps, 'state/registry/mcps.json + telemetry discovery'),
    Graph: graphView ? { ...await graphView(), scope: 'Read-only snapshot returned by Core GET /graph', limitations: 'Graph completeness and pagination depend on the configured Core provider.', measurement_type: 'exact', source: 'Core GET /graph; read-only', timestamp: new Date().toISOString() } : unavailable('Core GET /graph; graph provider not configured', 'Graph provider is not configured; no graph values are inferred.'),
    Executions: executionEvidenceView,
    Cache: cache,
    Memory: memory,
    Validation: validation,
    Alerts: { status: stats.alerts.length || stats.ceo_inbox.length ? 'OBSERVED' : 'UNAVAILABLE', count: stats.alerts.length + stats.ceo_inbox.length || null, scope: 'All alert-history and CEO-inbox records readable from local alert files', limitations: 'Alert delivery outside the local dashboard is not verified by these records.', items: stats.alerts.length || stats.ceo_inbox.length ? [...stats.alerts, ...stats.ceo_inbox] : null, measurement_type: stats.alerts.length || stats.ceo_inbox.length ? 'estimated' : 'unavailable', source: 'state/alerts/*.jsonl', timestamp: new Date().toISOString() }
  };
}

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lumenva Context Gateway</title><style>
:root{color-scheme:dark;--bg:#09090B;--head:#0D0D0F;--section:#111113;--card:#161619;--inner:#1C1C20;--hover:#232328;--line:#2B2B31;--strong:#3A3A42;--muted:#787880;--sub:#A1A1AA;--text:#E4E4E7;--white:#FAFAFA;--green:#5EEAD4;--orange:#FBBF24;--red:#FB7185;--blue:#60A5FA}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top right,#18181B 0%,#09090B 42%);color:var(--text);font:14px/1.45 ui-sans-serif,system-ui,sans-serif}main{max-width:1500px;margin:auto;padding:24px;min-width:0}header{display:flex;justify-content:space-between;align-items:end;padding:0 0 22px;border-bottom:1px solid var(--line);min-width:0}h1,h2,h3,p{margin:0}h1{font-size:24px;letter-spacing:.08em;color:var(--white)}h2{font-size:12px;letter-spacing:.12em;color:var(--sub);text-transform:uppercase;margin-bottom:12px}.sub{margin-top:5px;color:var(--sub)}.live{font-size:12px;color:var(--green)}.grid{display:grid;gap:12px;margin-top:18px;min-width:0}.kpis{grid-template-columns:repeat(6,minmax(120px,1fr))}.trio{grid-template-columns:repeat(3,minmax(0,1fr))}.two{grid-template-columns:repeat(2,minmax(0,1fr))}.card,.panel{border:1px solid var(--line);border-radius:10px;background:linear-gradient(145deg,#1C1C20 0%,#111113 100%);min-width:0}.card{padding:15px}.panel{padding:18px;min-width:0}#view-panel{min-width:0;max-width:100%;overflow-x:auto}.view-tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 0 10px;scrollbar-width:thin}.view-tab{flex:0 0 auto;border:1px solid var(--line);border-radius:7px;background:var(--inner);color:var(--text);padding:7px 11px;font:inherit;cursor:pointer}.view-tab[aria-selected="true"]{border-color:var(--blue);color:var(--white);background:#172554}.view-tab:focus-visible{outline:2px solid var(--blue);outline-offset:2px}.view-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:4px 0 10px}.view-json{max-width:100%;margin:0;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font:12px/1.5 ui-monospace,monospace;color:var(--sub)}.label{color:var(--muted);font-size:11px;letter-spacing:.08em}.value{font-size:25px;font-weight:750;margin-top:5px}.good{color:var(--green)}.important{color:var(--orange)}.muted{color:var(--muted)}.health{display:flex;gap:16px;flex-wrap:wrap;color:var(--sub)}.health b{color:var(--text)}.dot{color:var(--green)}table{width:100%;border-collapse:collapse;font-size:12px;min-width:1060px}th,td{text-align:left;padding:9px;border-bottom:1px solid var(--line)}th{color:var(--muted);font-weight:500}.scroll{overflow:auto}.badge{font-size:10px;border:1px solid currentColor;border-radius:999px;padding:2px 6px;white-space:nowrap}.exact{color:var(--green)}.estimated{color:var(--orange)}.unavailable{color:var(--muted)}.resource{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:9px}.resource .card{background:var(--inner)}.empty{color:var(--muted);padding:4px 0}.bar{height:8px;border-radius:8px;background:var(--line);overflow:hidden;margin-top:8px}.bar i{display:block;height:100%;background:var(--green)}@media(max-width:1000px){main{padding:16px}.kpis,.trio,.two{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.kpis,.trio,.two{grid-template-columns:1fr}header{align-items:start;gap:10px;flex-direction:column}}
</style></head><body><main><header><div><h1>LUMENVA CONTEXT GATEWAY</h1><p class="sub">Workspace: <b>Lumenva</b></p></div><div class="live" id="live">● CONECTANDO</div></header><section class="grid kpis" id="kpis"></section><section class="grid"><div class="panel"><div class="health" id="health"></div></div></section><section class="grid trio" id="periods"></section><section class="grid two"><div class="panel"><h2>Volume de contexto</h2><div id="volume"></div></div><div class="panel"><h2>Contexto evitado por executor (estimado)</h2><div id="executors"></div></div></section><section class="grid two"><div class="panel"><h2>Maiores consumidores</h2><div id="tools"></div></div><div class="panel"><h2>Agentes ativos</h2><div id="agents"></div></div></section><section class="grid"><div class="panel"><h2>Tasks recentes</h2><div class="scroll" id="tasks"></div></div></section><section class="grid"><div class="panel"><h2>Cobertura de telemetria</h2><div class="resource" id="coverage"></div></div></section><section class="grid"><div class="panel"><h2>MCG TRUST SCORE</h2><div id="trust"></div></div></section><section class="grid"><div class="panel"><h2>Alertas globais e CEO</h2><div id="alerts"></div></div></section></main><script>
const $=id=>document.getElementById(id),n=value=>Number.isFinite(value)?value.toLocaleString('pt-BR'):'—',p=value=>Number.isFinite(value)?value.toFixed(2)+'%':'—',e=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),tag=type=>'<span class="badge '+type+'">'+({exact:'EXATO',estimated:'ESTIMADO',unavailable:'INDISPONÍVEL'}[type]||'INDISPONÍVEL')+'</span>',state={DONE:'CONCLUÍDA',RUNNING:'EM EXECUÇÃO',DISPATCHED:'ENVIADA',BLOCKED:'BLOQUEADA',FAILED:'FALHOU',CANCELLED:'CANCELADA',INCOMPLETE:'INCOMPLETA'};
function cards(target,items){$(target).innerHTML=items.map(item=>'<div class="card"><div class="label">'+item[0]+'</div><div class="value '+(item[2]||'')+'">'+(item[3]==='percent'?p(item[1]):n(item[1]))+'</div></div>').join('')}
function resource(items,key){return items.length?'<div class="resource">'+items.map(item=>'<div class="card"><b>'+e(item[key])+'</b><br><span class="muted">'+n(item.tokens)+' tokens · '+n(item.calls)+' calls</span><br>'+tag(item.measurement_type)+'</div>').join('')+'</div>':'<p class="empty">Sem observação atribuída.</p>'}
function render(data){cards('kpis',[['TAREFAS CONCLUÍDAS',data.tasks_processed],['TAREFAS ATIVAS',data.tasks_active],['TOKENS CONTEXTO ORIGINAL (EST.)',data.estimated_tokens_original],['TOKENS CONTEXTO ENTREGUE (EST.)',data.estimated_tokens_delivered],['TOKENS CONTEXTO EVITADOS (EST.)',data.estimated_tokens_saved,'good'],['COMPRESSÃO %',data.metrics.compression_ratio,'important','percent']]);$('health').innerHTML=[['MCG DAEMON',data.health.daemon],['WIRE',data.health.wire],['WORKSPACE',data.health.workspace],['SSE / AO VIVO',$('live').textContent.includes('AO VIVO')?'ONLINE':'POLLING']].map(item=>'<span><i class="dot">●</i> '+item[0]+': <b>'+e(item[1])+'</b></span>').join('');cards('periods',[['CONTEXTO EVITADO HOJE (EST.)',data.periods.today,'good'],['CONTEXTO EVITADO 7 DIAS (EST.)',data.periods.seven_days,'good'],['CONTEXTO EVITADO ALL TIME (EST.)',data.periods.all_time,'good']]);$('volume').innerHTML=[['Original',data.original_chars,'var(--blue)'],['Entregue',data.delivered_chars,'var(--orange)'],['Economizado',data.saved_chars,'var(--green)']].map(item=>'<p>'+item[0]+' <b>'+n(item[1])+'</b><span class="bar"><i style="width:'+Math.min(100,data.original_chars?item[1]/data.original_chars*100:0)+'%;background:'+item[2]+'"></i></span></p>').join('');$('executors').innerHTML=Object.values(data.by_executor).filter(item=>item.tasks_processed||item.tasks_active).map(item=>'<div class="card"><b>'+e(item.executor)+'</b><br>'+n(item.estimated_tokens_saved)+' economizados · '+p(item.reduction_percent)+'<br>'+tag(item.measurement_type)+'</div>').join('')||'<p class="empty">Sem executor concluído.</p>';$('tools').innerHTML=resource(data.by_tool,'tool');$('agents').innerHTML=data.agents.length?'<div class="resource">'+data.agents.map(agent=>'<div class="card"><b>'+e(agent.name)+'</b><br>'+e(agent.status)+' · '+e(agent.runtime||'runtime não identificado')+'<br>'+tag(agent.measurement_type)+'</div>').join('')+'</div>':'<p class="empty">Sem agente ativo observado.</p>';$('tasks').innerHTML=data.tasks.length?'<table><thead><tr><th>TASK</th><th>EXECUTOR</th><th>AGENT</th><th>RUNTIME</th><th>PLUGIN</th><th>STATUS</th><th>ORIGINAL</th><th>ENTREGUE</th><th>ECONOMIZADOS</th><th>REDUÇÃO</th><th>MEDIÇÃO</th></tr></thead><tbody>'+data.tasks.map(task=>'<tr><td>'+e(task.task_id)+'</td><td>'+e(task.executor)+'</td><td>'+e(task.agent)+'</td><td>'+e(task.runtime)+'</td><td>'+e(task.plugin)+'</td><td>'+e(state[task.status]||task.status)+'</td><td>'+n(task.original_chars)+'</td><td>'+n(task.delivered_chars)+'</td><td>'+n(task.tokens_saved)+'</td><td>'+p(task.reduction_percent)+'</td><td>'+tag(task.measurement_type)+'</td></tr>').join('')+'</tbody></table>':'<p class="empty">Sem tasks.</p>';$('coverage').innerHTML=data.coverage.map(item=>'<div class="card"><b>'+e(item.name)+'</b><br>'+tag(item.measurement_type)+'<br><span class="muted">'+e(item.source)+'</span></div>').join('');$('trust').innerHTML='<div class="resource"><div class="card"><b>'+e(data.trust.status)+'</b><br>Score: '+n(data.trust.score)+'<br>Recall: '+n(data.trust.context_recall)+' · Grounding: '+n(data.trust.evidence_grounding)+'<br>Economia qualificada: '+p(data.trust.quality_preserving_saving)+'</div></div>';const all=[...data.alerts,...data.ceo_inbox];$('alerts').innerHTML=all.length?all.map(alert=>'<p class="card">'+e(alert.severity||alert.level)+' · '+e(alert.message)+' · '+e(alert.delivery_status||'dashboard')+'</p>').join(''):'<p class="empty">Sem alertas ativos.</p>'}
async function load(){const [stats,tasks,health]=await Promise.all(['/api/stats','/api/tasks','/api/health'].map(path=>fetch(path).then(response=>response.json())));render({...stats,tasks:tasks.tasks,health})}let poll;function fallback(){if(poll)return;$('live').textContent='● POLLING · 2s';poll=setInterval(()=>load().catch(()=>{$('live').textContent='● DESCONECTADO'}),2000)}const stream=new EventSource('/api/events');stream.onopen=()=>{$('live').textContent='● AO VIVO';if(poll){clearInterval(poll);poll=null}};stream.addEventListener('update',()=>load().catch(fallback));stream.onerror=()=>{stream.close();fallback()};load().catch(fallback);
</script></body></html>`;

const dashboardNav = '<section class="grid"><div class="panel"><h2>Command Center</h2><nav class="view-tabs" aria-label="Dashboard views" role="tablist">' +
  ['Overview', 'History', 'Traces', 'Tasks', 'Agents', 'Tools', 'Plugins', 'MCPs', 'Graph', 'Executions', 'Cache', 'Memory', 'Validation', 'Alerts']
    .map((view, index) => `<button class="view-tab" type="button" role="tab" data-view="${view}" aria-selected="${index === 0 ? 'true' : 'false'}" aria-controls="view-panel">${view}</button>`)
    .join('') +
  '</nav><div id="view-panel" role="tabpanel" tabindex="0"><p class="empty">Carregando views observadas.</p></div></div></section>';

const dashboardScript = `<script>
const viewData = {};
const viewPanel = document.getElementById('view-panel');
const viewTabs = [...document.querySelectorAll('[data-view]')];
const viewValue = value => value === null || value === undefined ? 'INDISPONÍVEL' : typeof value === 'object' ? value : String(value);
function renderView(name) {
  const view = viewData[name];
  viewTabs.forEach(tab => tab.setAttribute('aria-selected', String(tab.dataset.view === name)));
  if (!view) { viewPanel.innerHTML = '<p class="empty">View indisponível.</p>'; return; }
  if (name === 'Graph' && view.readOnly && Array.isArray(view.nodes) && Array.isArray(view.edges)) {
    const nodes = view.nodes.map(node => '<div class="card"><b>' + e(node.label) + '</b><br><span class="muted">' + e(node.kind) + ' · ' + e(node.id) + '</span></div>').join('');
    const edges = view.edges.map(edge => '<div class="card"><b>' + e(edge.sourceId) + '</b><br><span class="muted">confidence ' + e(edge.confidence) + ' · ' + e(edge.validFrom || 'sem início') + ' → ' + e(edge.validUntil || 'atual') + '</span></div>').join('');
    viewPanel.innerHTML = '<div class="view-meta"><b>Graph</b> ' + tag(view.measurement_type) + '<span class="muted">READ-ONLY · ' + e(view.namespace) + ' · ' + e(view.query) + '</span></div><h3>Entidades</h3><div class="resource">' + (nodes || '<p class="empty">Nenhum nó encontrado.</p>') + '</div><h3>Fontes / relações</h3><div class="resource">' + (edges || '<p class="empty">Nenhuma relação encontrada.</p>') + '</div>';
    return;
  }
  const entries = Object.entries(view).filter(([key]) => !['timestamp', 'source'].includes(key));
  viewPanel.innerHTML = '<div class="view-meta"><b>' + e(name) + '</b> ' + tag(view.measurement_type) + '<span class="muted">' + e(view.status || 'OBSERVED') + '</span></div>' +
    '<pre class="view-json">' + e(JSON.stringify(Object.fromEntries(entries.map(([key, value]) => [key, viewValue(value)])), null, 2)) + '</pre>';
}
async function loadViewRegistry() {
  try {
    const response = await fetch('/api/views');
    if (!response.ok) throw new Error('view registry unavailable');
    Object.assign(viewData, (await response.json()).views || {});
    renderView('Overview');
  } catch {
    viewPanel.innerHTML = '<p class="empty">Não foi possível carregar views. <button id="view-retry" type="button">Tentar novamente</button></p>';
    document.getElementById('view-retry').addEventListener('click', loadViewRegistry);
  }
}
viewTabs.forEach(tab => tab.addEventListener('click', () => renderView(tab.dataset.view)));
loadViewRegistry();
</script>`;

const legacyDashboardHtml = html
  .replace('</header><section class="grid kpis"', `</header>${dashboardNav}<section class="grid kpis"`)
  .replace('</script></body></html>', `</script>${dashboardScript}</body></html>`);

function sendJson(res, body) { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }

export function createDashboardServer({ root = ROOT, port = PORT, wireProbe, graphView, executionFeed, registryOptions = {} } = {}) {
  const clients = new Set(); let previous = '';
  const registryResponse = async (type, key, source) => {
    const rows = (await refreshRegistries(root, registryOptions))[type];
    const observed = rows.filter(row => row.health === 'OBSERVED');
    const measurements = observed.map(row => row.measurement_type);
    const measurement_type = !observed.length || measurements.includes('unavailable')
      ? 'unavailable'
      : measurements.includes('estimated') ? 'estimated' : 'exact';
    return { [key]: rows, source, measurement_type, timestamp: new Date().toISOString() };
  };
  const snapshot = async () => ({ stats: await dashboardStats(root), health: await health(root, wireProbe, actualPort()) });
  const publish = async () => { const data = await snapshot(); const encoded = JSON.stringify(data); if (encoded === previous) return; previous = encoded; for (const client of clients) client.write(`event: update\ndata: ${encoded}\n\n`); };
  const unsubscribe = getEventBus(root).subscribe(() => { publish().catch(() => {}); });
  let eventWatcher; try { eventWatcher = watch(join(root, 'state', 'events', 'events.jsonl'), () => { publish().catch(() => {}); }); } catch { /* polling remains fallback */ }
  const timer = setInterval(() => { publish().catch(() => {}); }, 2000);
  const server = createServer(async (req, res) => {
    if (req.method !== 'GET') { res.writeHead(405, { Allow: 'GET' }); return res.end('Method Not Allowed'); }
    try {
      const requestPath = new URL(req.url || '/', 'http://127.0.0.1').pathname;
      if (requestPath === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(dashboardHtml); }
      if (requestPath === '/api/events') { res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', Connection: 'keep-alive', 'Cache-Control': 'no-cache' }); clients.add(res); await publish(); req.on('close', () => clients.delete(res)); return; }
      if (requestPath === '/api/stats') return sendJson(res, await dashboardStats(root));
      if (requestPath === '/api/views') return sendJson(res, { views: await dashboardViews(root, { graphView, executionFeed, registryOptions }), source: 'dashboard view registry', measurement_type: 'exact', timestamp: new Date().toISOString() });
      if (requestPath === '/api/executions') return sendJson(res, await executionEvidence(executionFeed));
      if (requestPath === '/api/graph') return graphView ? sendJson(res, await graphView()) : sendJson(res, { error: 'GRAPH_UNAVAILABLE', readOnly: true, measurement_type: 'unavailable', source: 'Core GET /graph' });
      if (requestPath === '/api/history') return sendJson(res, await historyView(root));
      if (requestPath === '/api/cache') return sendJson(res, await cacheView(root));
      if (requestPath === '/api/memory') return sendJson(res, await memoryView(root));
      if (requestPath === '/api/validation') return sendJson(res, await validationView(root));
      if (requestPath === '/api/tasks') return sendJson(res, { tasks: await taskStats(root), source: 'tasks/*/state.json + evidence', measurement_type: 'estimated', timestamp: new Date().toISOString() });
      if (requestPath === '/api/health') return sendJson(res, await health(root, wireProbe, actualPort()));
      if (requestPath === '/api/trust') return sendJson(res, (await dashboardStats(root)).trust);
      if (requestPath === '/api/traces') return sendJson(res, { traces: await listTraces(root), source: 'state/telemetry/traces/*.jsonl', measurement_type: 'exact', timestamp: new Date().toISOString() });
      if (requestPath.startsWith('/api/traces/')) {
        const traceId = decodeURIComponent(requestPath.slice('/api/traces/'.length));
        if (!/^trace-[A-Za-z0-9-]+$/.test(traceId)) return sendJson(res, { error: 'invalid trace_id', measurement_type: 'unavailable', source: 'dashboard', timestamp: new Date().toISOString() });
        return sendJson(res, await loadTrace(root, traceId));
      }
      if (requestPath === '/api/agents') return sendJson(res, await registryResponse('agents', 'agents', 'state/registry/agents.json + telemetry/process discovery'));
      if (requestPath === '/api/tools') return sendJson(res, await registryResponse('tools', 'tools', 'state/registry/tools.json + telemetry discovery'));
      if (requestPath === '/api/plugins') {
        const [registry, resources] = await Promise.all([registryResponse('plugins', 'plugins', 'state/registry/plugins.json + telemetry discovery'), discoverResources(root)]);
        return sendJson(res, { ...registry, skills: resources.skills });
      }
      if (requestPath === '/api/mcps') return sendJson(res, await registryResponse('mcps', 'mcps', 'state/registry/mcps.json + telemetry discovery'));
      if (requestPath === '/api/runtimes') {
        const [registry, resources] = await Promise.all([registryResponse('runtimes', 'runtimes', 'state/registry/runtimes.json + telemetry/process discovery'), discoverResources(root)]);
        return sendJson(res, { ...registry, ides: resources.ides });
      }
      if (requestPath === '/api/models') return sendJson(res, await registryResponse('models', 'models', 'state/registry/models.json + telemetry discovery'));
      if (requestPath === '/api/alerts') return sendJson(res, { alerts: await alertHistory(root), source: 'state/alerts/alerts.jsonl', measurement_type: 'estimated', timestamp: new Date().toISOString() });
      if (requestPath === '/api/alerts/ceo') return sendJson(res, { alerts: await ceoInbox(root), source: 'state/alerts/ceo-inbox.jsonl', measurement_type: 'estimated', timestamp: new Date().toISOString() });
      res.writeHead(404); res.end('Not Found');
    } catch { sendJson(res, { error: 'falha ao ler dashboard', measurement_type: 'unavailable', source: 'dashboard', timestamp: new Date().toISOString() }); }
  });
  const actualPort = () => server.address()?.port ?? port;
  server.on('close', () => { clearInterval(timer); eventWatcher?.close(); unsubscribe(); for (const client of clients) client.end(); clients.clear(); });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, HOST, () => resolve(server)); });
}
