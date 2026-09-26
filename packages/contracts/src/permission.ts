import type { RiskLevel } from './workforce/types.js';

export type PermissionState = 'APPROVAL_REQUIRED' | 'APPROVED' | 'DENIED' | 'REVOKED';

export interface NexusPermission {
  permission_id: string;
  project_id: string;
  task_id: string;
  agent_id: string;
  capability: string;
  actions: string[];
  risk_level: RiskLevel;
  state: PermissionState;
  approval_id?: string;
  policy_id?: string;
  expires_at: string;
  issued_by: string;
}
