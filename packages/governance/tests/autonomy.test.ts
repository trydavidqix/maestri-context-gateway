import { describe, expect, it } from 'vitest';
import { AutonomyController, AutonomyLevel } from '../src/autonomy/autonomy-engine.js';

describe('AutonomyController', () => {
  it('does not raise autonomy without management approval or the score threshold', () => {
    const controller = new AutonomyController();
    expect(controller.requestLevelIncrease(AutonomyLevel.AUTO_LOW_RISK, { managementApproved: false, evalScore: 79 })).toBe(false);
    expect(controller.getLevel()).toBe(AutonomyLevel.SHADOW);
  });

  it('allows a change after explicit management approval', () => {
    const controller = new AutonomyController();
    expect(controller.requestLevelIncrease(AutonomyLevel.ASSISTED, { managementApproved: true, evalScore: 0 })).toBe(true);
    expect(controller.getLevel()).toBe(AutonomyLevel.ASSISTED);
  });
});
