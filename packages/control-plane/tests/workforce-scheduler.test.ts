import { describe, expect, it } from 'vitest';
import { WorkforceScheduler } from '../src/workforce/workforce-scheduler.js';

describe('Control Plane workforce shifts', () => {
  it('keeps scheduled shifts scoped to the requested agent', () => {
    const scheduler = new WorkforceScheduler();
    scheduler.scheduleShift({ id: 'shift-a', agentId: 'agent-a', startTime: '09:00', endTime: '17:00', timezone: 'UTC', daysOfWeek: [1] });
    scheduler.scheduleShift({ id: 'shift-b', agentId: 'agent-b', startTime: '10:00', endTime: '18:00', timezone: 'UTC', daysOfWeek: [2] });
    expect(scheduler.getShiftsForAgent('agent-a').map((shift) => shift.id)).toEqual(['shift-a']);
  });
});
