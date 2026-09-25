import type { ApprovalRequest } from './approval-gate';
export interface ApprovalPersistence {
  save(request: ApprovalRequest): Promise<void>;
  forTask(taskId: string): Promise<ApprovalRequest | undefined>;
}

export class ApprovalStore implements ApprovalPersistence {
  private readonly approvals = new Map<string, ApprovalRequest>();
  create(request: ApprovalRequest): ApprovalRequest { this.approvals.set(request.approval_id, request); return request; }
  async save(request: ApprovalRequest): Promise<void> { this.create(request); }
  resolve(id: string, approved: boolean, resolvedBy: string): ApprovalRequest {
    const request = this.approvals.get(id);
    if (!request) throw new Error(`approval_not_found:${id}`);
    const next = { ...request, status: (approved ? 'APPROVED' : 'REJECTED') as ApprovalRequest['status'], resolved_at: new Date().toISOString(), resolved_by: resolvedBy };
    this.approvals.set(id, next);
    return next;
  }
  async forTask(taskId: string): Promise<ApprovalRequest | undefined> { return [...this.approvals.values()].find((request) => request.task_id === taskId); }
}
