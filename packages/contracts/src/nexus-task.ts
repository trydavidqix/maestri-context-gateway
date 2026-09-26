import type { MasterPlanTask } from './workforce/types.js';

/** Project-scoped task contract; execution identity is attached by EngineeringPlan. */
export type NexusTask = MasterPlanTask & {
  project_id: string;
  session_id?: string;
};
