import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyRisk, retryPlan, selectRoute } from '../src/router.mjs';

test('routing applies risk gates and chooses a healthy capable provider', () => {
  assert.equal(classifyRisk({ delete: true }), 'R4');
  const route = selectRoute({ type: 'HEAVY', capability: 'code' }, [
    { id: 'offline', health: 'OFFLINE', capabilities: ['code'], success_rate: 100 },
    { id: 'codex', health: 'OBSERVED', capabilities: ['code'], success_rate: 98, latency: 20 }
  ]);
  assert.equal(route.selected.id, 'codex');
  assert.equal(route.owner_approval_required, false);
  assert.equal(retryPlan(5).strategy, 'BLOCKED');
});
