import assert from 'node:assert/strict';
import { it } from 'vitest';
import { ContextRecoveryEngine, SessionStateMachine } from '../src/sessions/session-engine.ts';

it('rebuilds the session phase and merges recovery evidence', () => {
  const machine = new SessionStateMachine();
  machine.transition('planning');
  assert.equal(machine.currentPhase, 'planning');

  const recovered = new ContextRecoveryEngine().rebuildTaskState({
    objective: 'recover', current_phase: 'execution', completed_work: [], current_work: 'test',
    remaining_work: [], decisions: [], assumptions: [], tests_passed: [], tests_failed: [],
    blockers: [], branches: ['main'], commits: [], prs: [], evidence: [], next_action: 'verify', checkpoint_version: 1,
  }, { branches: ['main', 'feature'], commits: ['abc'] }, { tests_passed: ['unit'], evidence: ['run-1'] });
  assert.equal(recovered.checkpoint_version, 2);
  assert.deepEqual(recovered.branches, ['main', 'feature']);
});
