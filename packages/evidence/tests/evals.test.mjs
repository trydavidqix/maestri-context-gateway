import assert from 'node:assert/strict';
import test from 'node:test';
import { gradeContextRecall } from '@nexus-brain/evidence/evals';

test('context recall grader reports exact matches from supplied evidence', () => {
  const result = gradeContextRecall('project = Nexus\nstatus = ready', 'Nexus is ready.');
  assert.equal(result.recall, 100);
  assert.equal(result.measurement_type, 'exact');
});
