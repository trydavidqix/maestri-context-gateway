import { describe, expect, it } from 'vitest';
import { CostLedger } from './cost-ledger.js';
import type { ExecutionResult } from './execution-port.js';

const result: ExecutionResult = { task_id: 'task-1', status: 'success', summary: 'done', files_changed: [], commands: [], tests: [], evidence: [], usage: { input_tokens: 12, cached_tokens: 2, output_tokens: 4, duration_ms: 10, cost_usd: null, measurement_type: 'exact' } };

describe('CostLedger', () => {
  it('keeps unknown provider cost unavailable instead of fabricating zero', () => {
    const ledger = new CostLedger();
    expect(ledger.record(result).cost_usd).toBeNull();
    expect(ledger.totalCost()).toBeNull();
  });
});
