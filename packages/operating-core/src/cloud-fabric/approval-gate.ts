import { planRiskFromExecutionRisk, type TaskContract } from './execution-port';
import type { RiskLevel } from './workforce-types';
export interface ApprovalRequest{approval_id:string;task_id:string;risk:RiskLevel;reasons:string[];status:'PENDING'|'APPROVED'|'REJECTED';created_at:string;resolved_at?:string;resolved_by?:string}
export function requiresOwnerApproval(c:TaskContract):boolean{return c.risk==='high'||c.risk==='critical'||c.constraints.some(x=>/production|secret|credential|destructive|financial|delete/i.test(x))}
export function createApprovalRequest(c:TaskContract,reasons:string[]=[]):ApprovalRequest{return{approval_id:`approval_${c.task_id}_${Date.now()}`,task_id:c.task_id,risk:planRiskFromExecutionRisk(c.risk),reasons:reasons.length?reasons:['policy_requires_owner_approval'],status:'PENDING',created_at:new Date().toISOString()}}
