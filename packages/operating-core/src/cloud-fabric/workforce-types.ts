/** Planning-domain concepts; execution contracts remain in execution-port.ts. */
export type RiskLevel = 'R0' | 'R1' | 'R2' | 'R3' | 'R4';
export type TaskComplexity = 'TINY' | 'LIGHT' | 'NORMAL' | 'HEAVY' | 'EXCLUSIVE';

export interface MasterPlanTask {
  task_id: string;
  objective: string;
  depends_on?: string[];
  capabilities?: string[];
  risk: RiskLevel;
  complexity: TaskComplexity;
  acceptance_criteria: string[];
  evidence_requirements?: string[];
  allowed_paths?: string[];
  read_only?: boolean;
}

export interface MasterPlan {
  plan_id: string;
  objective: string;
  business_context?: string;
  assumptions: string[];
  requirements: string[];
  architecture: string[];
  decisions: string[];
  constraints: string[];
  risks: string[];
  dependencies: string[];
  tasks: MasterPlanTask[];
  validation_strategy: string[];
  escalation_policy: string[];
  created_at: string;
  source_agent?: string;
  source_model?: string;
}
