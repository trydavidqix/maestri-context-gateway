import { describe, expect, it } from 'vitest';
import { InMemoryJobEngine } from '../src/tasks/job-engine.js';

describe('Control Plane job engine package boundary', () => {
  it('enqueues and claims a job within its organization', () => {
    const engine = new InMemoryJobEngine({ id: () => 'job-1' });
    const job = engine.enqueue({ organizationId: 'org-1', kind: 'audit', payload: null });
    expect(engine.claim(job.id, 'worker-1', 'org-1').status).toBe('claimed');
  });
});
