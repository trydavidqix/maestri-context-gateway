import type { EngineeringAutonomyLevel } from './engineering/plan.js';
import type { RiskLevel } from './workforce/types.js';

export interface BrowserPlan {
  browser_task_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  engineering_plan_id?: string;
  intent: string;
  risk_level: RiskLevel;
  autonomy_level: EngineeringAutonomyLevel;
  allowed_origins: string[];
  allowed_redirect_origins: string[];
  blocked_origins: string[];
  download_origins: string[];
  upload_origins: string[];
  interaction_mode: string;
  observation_mode: string;
  backend_preference: string[];
  host_requirements: Record<string, unknown>;
  profile_policy: Record<string, unknown>;
  secret_policy: Record<string, unknown>;
  tool_profile: string[];
  context_budget: Record<string, unknown>;
  max_actions: number;
  max_pages: number;
  max_runtime: number;
  max_browser_seconds: number;
  max_cost: number;
  approval_gates: string[];
  success_assertions: string[];
  stop_conditions: string[];
}

export interface BrowserTask {
  browser_task_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  plan_id: string;
  intent: string;
  status: string;
  created_at: string;
}

export interface BrowserSession {
  session_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  host_id: string;
  backend_id: string;
  profile_id: string;
  lease_expires_at: string;
  state: string;
}

export interface BrowserObservation {
  observation_id: string;
  session_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  url: string;
  origin: string;
  title?: string;
  content_hash: string;
  trust_level: 'UNTRUSTED';
  provenance: Record<string, unknown>;
  content?: string;
  accessibility?: string;
  dom_excerpt?: string;
}

export interface BrowserAction {
  action_id: string;
  session_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  action_type: string;
  risk_level: RiskLevel;
  target_origin: string;
  parameters: Record<string, unknown>;
}

export interface BrowserBackend {
  backend_id: string;
  backend_type: string;
  capabilities: string[];
  health: 'healthy' | 'degraded' | 'unavailable';
  version?: string;
}

export interface BrowserHost {
  host_id: string;
  host_type: string;
  online: boolean;
  resources: Record<string, unknown>;
  browser_slots: number;
  active_sessions: number;
  supported_backends: string[];
  profiles: string[];
  region: string;
  heartbeat: string;
}

export interface BrowserProfile {
  profile_id: string;
  project_id: string;
  allowed_origins: string[];
  credential_refs: string[];
  storage_state_ref?: string;
  isolation: 'TASK_AGENT';
}

export interface BrowserRecipeAction {
  action_type: string;
  parameters: Record<string, unknown>;
}

export interface BrowserRecipe {
  recipe_id: string;
  project_id: string;
  version: number;
  origin: string;
  actions: BrowserRecipeAction[];
  evidence_id: string;
  validated_at: string;
  content_hash: string;
}
