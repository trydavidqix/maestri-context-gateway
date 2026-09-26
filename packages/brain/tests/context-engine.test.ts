import { describe, expect, it } from 'vitest';
import { ContextEngine } from '../src/context/context-engine.js';
import type { TaskContract } from '@nexus-brain/contracts/execution/port';

const contract: TaskContract = {
  task_id: 'stable-context', goal: 'inspect task', scope: 'read-only', allowed_paths: [], constraints: [],
  capabilities: ['read_only'], risk: 'low', base_sha: 'base', context_budget: {}, tool_budget: {}, execution_budget: {}, evidence_required: [],
};

describe('ContextEngine packet determinism', () => {
  it('produces the same packet when equal-priority sources arrive in a different order', () => {
    const engine = new ContextEngine();
    const sources = [
      { id: 'z-rule', kind: 'instruction' as const, source: 'z.md', reason: 'rule', content: 'z', priority: 5 },
      { id: 'a-rule', kind: 'instruction' as const, source: 'a.md', reason: 'rule', content: 'a', priority: 5 },
    ];

    const first = engine.compilePacket({ contract, sources, token_budget: 256 });
    const second = engine.compilePacket({ contract, sources: [...sources].reverse(), token_budget: 256 });

    expect(first.packet_id).toBe(second.packet_id);
    expect(first.references?.map((reference) => reference.id)).toEqual(['a-rule', 'z-rule']);
  });
});
