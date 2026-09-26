export type MemoryScope = 'GLOBAL' | 'PROJECT' | 'SESSION' | 'TASK';
export type MemoryStatus = 'OBSERVED' | 'CANDIDATE' | 'VERIFIED' | 'CANONICAL' | 'SUPERSEDED' | 'CONFLICTED' | 'REVOKED';

export interface NexusMemoryRecord {
  memory_id: string;
  project_id?: string;
  scope: MemoryScope;
  scope_id: string;
  status: MemoryStatus;
  content: string;
  evidence_ids: string[];
  provenance: Record<string, unknown>;
}
