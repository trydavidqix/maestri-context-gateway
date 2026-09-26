import type { NexusIdentity } from './identity.js';
import type { ReachStatus } from './brain.js';

export interface ResearchLimits {
  max_queries: number;
  max_providers: number;
  max_results_per_provider: number;
  max_browser_escalations: number;
  max_wall_time_seconds: number;
}

export interface ResearchRequest extends NexusIdentity {
  research_id: string;
  query: string;
  time_window: Record<string, unknown>;
  source_budget: Record<string, unknown>;
  limits: ResearchLimits;
  budget: Record<string, unknown>;
  judge_provider?: string;
}

export type ResearchStatus = Extract<ReachStatus, 'OK' | 'EMPTY' | 'PARTIAL' | 'DEGRADED' | 'BLOCKED' | 'TIMEOUT'>;

export interface ResearchResult extends NexusIdentity {
  run_id: string;
  status: ResearchStatus;
  evidence_ids: string[];
  warnings: string[];
  summary?: string;
  provenance?: Record<string, unknown>;
}
