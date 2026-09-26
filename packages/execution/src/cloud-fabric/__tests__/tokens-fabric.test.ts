import { describe, expect, it } from 'vitest';
import { ModelRegistry } from '../model-registry';
import { scoreModel } from '../routing-policy';
import { quotaState } from '../quota-router';
import { nextEscalation } from '../escalation-engine';
import { createMasterPlan, readyTasks } from '../master-plan';
import { evaluateIndependentReview } from '../independent-review';
import { ContextEngine } from '@nexus-brain/brain/context-engine';
import { evidenceGate } from '../evidence-gate';
import { budgetSnapshot } from '../budget-policy';
import { LazyToolRegistry } from '../tool-registry';
import { IdempotencyStore } from '../idempotency';
import { requiresOwnerApproval } from '../approval-gate';
import { WorktreePolicy } from '../worktree-policy';
import { runtimePolicy } from '../runtime-policy';
import { validateMasterPlan, validateTaskContract } from '../contract-validation';
import { MemoryRetriever } from '../memory-retriever';
import { autonomousDecision } from '../autonomous-policy';
import { buildValidationCorpus, DEFAULT_VALIDATION_SEEDS } from '../validation-corpus';
import { ContextResolver } from '../context-resolver';
import { executeIndependentReview } from '../reviewer-executor';
import { executeWithRetry } from '../execution-loop';
import { redactSecrets } from '../redaction';
import { filterHistory } from '../history-query';
import { executeWithEscalation } from '../escalating-executor';
import { ApprovalStore } from '../approval-store';
import { createApprovalRequest } from '../approval-gate';
import { telemetryEvent } from '../telemetry-event';
import { validationReport } from '../validation-report';
import { InMemoryRunStore } from '../persistent-run-store';
import { initializeRun } from '../run-state';
import { LearningRouter } from '../learning-router';
import type { ExecutionPort, ExecutionResult, TaskContract } from '../execution-port';

const makeContract = (overrides: Partial<TaskContract> = {}): TaskContract => ({
  task_id: 't', goal: 'g', scope: 's', allowed_paths: [], constraints: [], capabilities: [],
  risk: 'low', base_sha: 'sha', context_budget: {}, tool_budget: {}, execution_budget: {}, evidence_required: [],
  ...overrides,
});

const makeExecutionPort = (name: string, run: (contract: TaskContract) => Promise<ExecutionResult>): ExecutionPort => ({
  name, execute: run,
  resume: async (taskId) => ({ task_id: taskId, status: 'unavailable', summary: 'resume unavailable', files_changed: [], commands: [], tests: [], evidence: [] }),
  cancel: async (taskId) => ({ task_id: taskId, status: 'cancelled', summary: 'cancelled', files_changed: [], commands: [], tests: [], evidence: [] }),
  health: async () => ({ ok: true, status: 'healthy' }),
  capabilities: async () => ['coding', 'review', 'tests'],
  usage: async () => ({ input_tokens: 0, cached_tokens: 0, output_tokens: 0, duration_ms: 0, cost_usd: 0 }),
  quota: async () => ({ provider: name, tokens_used: 0, cost_usd: 0, remaining_budget: 1 }),
  checkQuota: async () => ({ provider: name, tokens_used: 0, cost_usd: 0, remaining_budget: 1 }),
});

describe('TOKENS workforce fabric', () => {
  it('prefers frontier models for planning', () => {
    const registry = new ModelRegistry();
    const models = registry.candidates({
      capabilities: ['architecture'],
      risk: 'R3',
      complexity: 'HEAVY',
      minTier: 2,
      maxTier: 3,
    });
    const decisions = models.map((model) => scoreModel(model, {
      capabilities: ['architecture'],
      risk: 'R3',
      complexity: 'HEAVY',
      phase: 'plan',
      providerQuota: { claude: 'GREEN', codex: 'GREEN' },
    }));
    expect(decisions.some((decision) => decision.tier === 3)).toBe(true);
  });

  it('classifies quota thresholds', () => {
    expect(quotaState({ remaining_percent: 80 })).toBe('GREEN');
    expect(quotaState({ remaining_percent: 30 })).toBe('YELLOW');
    expect(quotaState({ remaining_percent: 15 })).toBe('RED');
    expect(quotaState({ remaining_percent: 5 })).toBe('RESERVE');
  });

  it('bounds escalation', () => {
    expect(nextEscalation({ worker_attempts: 0, professional_attempts: 0, frontier_attempts: 0, replans: 0 })).toBe('retry-worker');
    expect(nextEscalation({ worker_attempts: 2, professional_attempts: 1, frontier_attempts: 1, replans: 1 })).toBe('blocked');
  });

  it('validates master plan dependencies and ready tasks', () => {
    const plan = createMasterPlan({
      objective: 'ship feature',
      tasks: [
        { task_id: 'a', objective: 'db', acceptance_criteria: ['done'] },
        { task_id: 'b', objective: 'api', depends_on: ['a'], acceptance_criteria: ['done'] },
      ],
    });
    expect(readyTasks(plan, []).map((task) => task.task_id)).toEqual(['a']);
    expect(readyTasks(plan, ['a']).map((task) => task.task_id)).toEqual(['b']);
  });

  it('rejects same-provider independent review', () => {
    const review = evaluateIndependentReview({
      implementation: {
        task_id: 't1',
        provider: 'codex',
        status: 'success',
        files_changed: [],
        tests: [{ passed: true, report: 'ok' }],
        summary: 'completed', commands: [], evidence: ['evidence'],
      },
      reviewer_provider: 'codex',
      risk: 'R2',
      deterministic_checks: [{ name: 'test', passed: true }],
    });
    expect(review.accepted).toBe(false);
  });

  it('compiles bounded context packets', () => {
    const packet = new ContextEngine().compilePacket({
      contract: makeContract({ task_id: 't1', goal: 'test', scope: 'test', base_sha: 'abc' }),
      token_budget: 256,
      expansion_level: 1,
      sources: [
        { id: 'a', kind: 'instruction', source: 'AGENTS.md', reason: 'rules', content: 'x'.repeat(40), priority: 10 },
        { id: 'b', kind: 'file', source: 'big.ts', reason: 'code', content: 'x'.repeat(4000), priority: 1 },
      ],
    });
    expect((packet.references ?? []).map((ref) => ref.id)).toEqual(['a']);
  });
  it('blocks PASS without evidence and tests for non-R0 work', () => {
    expect(evidenceGate({
      task_id: 't',
      status: 'success',
      summary: 'completed',
      files_changed: [],
      commands: [],
      tests: [],
      evidence: [],
    }, 'R2').passed).toBe(false);
  });

  it('enforces PAYG budget states', () => {
    expect(budgetSnapshot(10, { monthly_limit_usd: 50, warning_percent: 50, critical_percent: 80, reserve_percent: 90 }).state).toBe('GREEN');
    expect(budgetSnapshot(46, { monthly_limit_usd: 50, warning_percent: 50, critical_percent: 80, reserve_percent: 90 }).state).toBe('RESERVE');
  });

  it('loads tool schemas lazily within budget', () => {
    const tools = new LazyToolRegistry();
    tools.register({ id: 'small', capabilities: ['coding'], risk: 'R1', schema_token_estimate: 50, enabled: true });
    tools.register({ id: 'large', capabilities: ['coding'], risk: 'R1', schema_token_estimate: 500, enabled: true });
    expect(tools.resolve(['coding'], 100).map((tool) => tool.id)).toEqual(['small']);
  });

  it('deduplicates idempotent execution', async () => {
    const store = new IdempotencyStore<number>();
    let calls = 0;
    const first = await store.once('x', async () => ++calls);
    const second = await store.once('x', async () => ++calls);
    expect(first).toBe(1);
    expect(second).toBe(1);
    expect(calls).toBe(1);
  });

  it('requires owner approval for high risk and protected constraints', () => {
    expect(requiresOwnerApproval(makeContract({ risk: 'high' }))).toBe(true);
    expect(requiresOwnerApproval(makeContract({ constraints: ['production deploy'] }))).toBe(true);
  });

  it('prevents concurrent worktree writers', () => {
    const policy = new WorktreePolicy();
    policy.acquire('j1', 'a1', '/tmp/w');
    expect(() => policy.acquire('j1', 'a2', '/tmp/w')).toThrow();
  });

  it('gates protected runtime actions', () => {
    expect(runtimePolicy({ risk: 'R1' }).allowed).toBe(true);
    expect(runtimePolicy({ risk: 'R1', touches_secrets: true }).requires_approval).toBe(true);
    expect(runtimePolicy({ risk: 'R4' }).requires_approval).toBe(true);
  });

  it('validates canonical contracts', () => {
    expect(validateTaskContract(makeContract()).valid).toBe(true);
    const plan = createMasterPlan({ objective: 'x', tasks: [{ task_id: 'a', objective: 'a', acceptance_criteria: [] }] });
    expect(validateMasterPlan(plan).valid).toBe(true);
  });

  it('retrieves only relevant validated memory inside budget', () => {
    const retriever = new MemoryRetriever([
      { id: '1', text: 'a', provenance: 'test', validated: true, tags: ['coding'], token_estimate: 10, updated_at: '2026-01-01T00:00:00Z' },
      { id: '2', text: 'b', provenance: 'test', validated: false, tags: ['coding'], token_estimate: 10, updated_at: '2026-01-02T00:00:00Z' },
    ]);
    expect(retriever.retrieve({ tags: ['coding'], token_budget: 20, require_validated: true }).map(x => x.id)).toEqual(['1']);
  });

  it('keeps R2 autonomous but independently reviewed', () => {
    expect(autonomousDecision('R2')).toEqual({ automatic: true, requires_review: true, requires_owner: false });
    expect(autonomousDecision('R4').requires_owner).toBe(true);
  });

  it('builds a 30-case validation corpus across six categories', () => {
    const corpus = buildValidationCorpus(DEFAULT_VALIDATION_SEEDS, 'sha');
    expect(corpus).toHaveLength(30);
    expect(new Set(corpus.map(x => x.task_type)).size).toBe(6);
  });

  it('resolves only relevant memory and tool schemas into context', () => {
    const memory = new MemoryRetriever([{ id:'m', text:'known', provenance:'validated:test', validated:true, tags:['coding'], token_estimate:5, updated_at:'2026-01-01T00:00:00Z' }]);
    const tools = new LazyToolRegistry();
    tools.register({ id:'git', capabilities:['coding'], risk:'R1', schema_token_estimate:10, enabled:true });
    const resolved = new ContextResolver(memory, tools).resolve(makeContract({ capabilities:['coding'] }));
    expect(resolved.allowed_tools).toEqual(['git']);
    expect(resolved.sources.map(x => x.id)).toEqual(['m']);
  });

  it('executes review through a distinct reviewer port', async () => {
    const reviewer = makeExecutionPort('gemini', async (contract) => ({ task_id: contract.task_id, provider: 'gemini', status: 'success', summary: 'reviewed', files_changed: [], commands: [], tests: [{ passed: true, report: 'review-ok' }], evidence: ['review-evidence'] }));
    const implementation: ExecutionResult = { task_id:'t', provider:'codex', status:'success', summary:'implemented', files_changed:['a.ts'], commands:[], tests:[{passed:true,report:'ok'}], evidence:['impl-evidence'] };
    const { reviewExecution, review } = await executeIndependentReview({ implementation, contract:makeContract(), risk:'R2', target:{provider:'gemini',port:reviewer} });
    expect(reviewExecution.provider).toBe('gemini');
    expect(review.accepted).toBe(true);
  });

  it('retries failures with a hard bound', async () => {
    let calls = 0;
    const port = makeExecutionPort('worker', async (contract) => { calls++; return {task_id:contract.task_id,provider:'worker',status:calls<2?'failure':'success',summary:'result',files_changed:[],commands:[],tests:[],evidence:['e']}; });
    const result = await executeWithRetry(port,makeContract(),{max_attempts:2,base_delay_ms:0,max_delay_ms:0,retryable_statuses:['failure']},async()=>{});
    expect(result.attempts).toHaveLength(2);
    expect(result.result.status).toBe('success');
  });

  it('redacts common secret shapes before persistence', () => {
    expect(redactSecrets('api_key=super-secret-value token=abcdef123456')).not.toContain('super-secret-value');
  });

  it('filters persisted history by time window', () => {
    const now = Date.parse('2026-09-22T12:00:00Z');
    const rows = [{created_at:'2026-09-22T10:00:00Z',id:1},{created_at:'2026-08-01T00:00:00Z',id:2}];
    expect(filterHistory(rows,'TODAY',now).map(x=>x.id)).toEqual([1]);
    expect(filterHistory(rows,'ALL',now)).toHaveLength(2);
  });

  it('escalates from worker to professional with a hard ceiling', async () => {
    const worker=makeExecutionPort('worker',async c=>({task_id:c.task_id,provider:'worker',status:'failure',summary:'failed',files_changed:[],commands:[],tests:[],evidence:['failed']}));
    const professional=makeExecutionPort('pro',async c=>({task_id:c.task_id,provider:'pro',status:'success',summary:'passed',files_changed:[],commands:[],tests:[],evidence:['passed']}));
    const result=await executeWithEscalation(makeContract(),{worker,professional});
    expect(result.result.provider).toBe('pro');
    expect(result.history).toContain('use-professional');
  });

  it('stores and resolves owner approvals', () => {
    const store=new ApprovalStore();
    const request=store.create(createApprovalRequest(makeContract({risk:'high'})));
    expect(store.resolve(request.approval_id,true,'owner').status).toBe('APPROVED');
  });

  it('redacts telemetry payloads before emission', () => {
    const event=telemetryEvent({event_type:'test',payload:{value:'api_key=super-secret-value'}});
    expect(JSON.stringify(event)).not.toContain('super-secret-value');
  });

  it('does not validate benchmark claims below 30 samples', () => {
    expect(validationReport({ total:29, successes:29, success_rate:1, test_pass_rate:1, average_latency_ms:1, total_cost_usd:0 }).state).toBe('VALIDATING');
    expect(validationReport({ total:30, successes:30, success_rate:1, test_pass_rate:1, average_latency_ms:1, total_cost_usd:0 }).state).toBe('VALIDATED');
  });

  it('preserves explicit write scope in each MasterPlan task', () => {
    const plan = createMasterPlan({
      objective: 'scoped change',
      tasks: [{ task_id: 'scoped', objective: 'change one package', allowed_paths: ['packages/demo/src'], acceptance_criteria: ['tests pass'] }],
    });

    expect(plan.tasks[0]?.allowed_paths).toEqual(['packages/demo/src']);
  });

  it('does not route using unvalidated model history', () => {
    const learning = new LearningRouter();
    const observation = { model_id: 'codex-sol', task_type: 'coding', complexity: 'NORMAL' as const, risk: 'R1' as const, success: true, reviewer_accepted: true, deterministic_passed: true, retries: 0 };
    learning.record(observation);

    expect(learning.historicalSuccess()).toEqual({});

    for (let sample = 1; sample < 30; sample += 1) learning.record(observation);
    expect(learning.historicalSuccess()).toEqual({ 'codex-sol': 1 });
  });

  it('round-trips resumable run state', async () => {
    const plan=createMasterPlan({objective:'x',tasks:[{task_id:'a',objective:'a',acceptance_criteria:[]}]});
    const store=new InMemoryRunStore();
    const state=initializeRun(plan,'run-1');
    await store.save(state);
    expect((await store.get('run-1'))?.plan_id).toBe(plan.plan_id);
  });
});
