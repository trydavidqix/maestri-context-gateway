import type { RiskLevel } from './workforce/types.js';
import type { EngineeringTaskType } from './engineering/plan.js';

export interface SkillRegistryEntry {
  skill_id: string;
  purpose: string;
  task_types: EngineeringTaskType[];
  risk_levels: RiskLevel[];
  dependencies: string[];
  conflicts: string[];
  precedence_owner: string;
  estimated_context_cost: number;
  version: string;
  status: string;
}

export interface TaskSkillSet {
  task_id: string;
  agent_id: string;
  required: string[];
  optional: string[];
  forbidden: string[];
  loaded: string[];
  completed: string[];
  context_budget: Record<string, unknown>;
}

export interface SkillEvent {
  event_id: string;
  task_id: string;
  agent_id: string;
  event_type: 'LOADED' | 'COMPLETED' | 'COMPACTED';
  skill_ids: string[];
  occurred_at: string;
  reason?: string;
}
