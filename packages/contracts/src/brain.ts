import type { NexusIdentity } from './identity.js';

export type BrainOperation = 'brain_context' | 'brain_search' | 'brain_reuse' | 'brain_remember' | 'local_search' | 'brain_status';
export type BrainCoverage = 'FULL' | 'PARTIAL' | 'MISSING';
export type ReachStatus = 'OK' | 'EMPTY' | 'PARTIAL' | 'DEGRADED' | 'AUTH_REQUIRED' | 'RATE_LIMITED' | 'QUOTA_EXHAUSTED' | 'PROVIDER_DOWN' | 'BLOCKED' | 'TIMEOUT' | 'SCHEMA_CHANGED' | 'HOST_UNAVAILABLE' | 'POLICY_DENIED' | 'APPROVAL_REQUIRED';

export interface BrainRequest extends NexusIdentity {
  request_id: string;
  operation: BrainOperation;
  input: Record<string, unknown>;
}

export interface BrainResponse extends NexusIdentity {
  request_id: string;
  status: ReachStatus;
  source: string;
  provenance: Record<string, unknown>;
  coverage: BrainCoverage;
  trust_level: string;
  data?: Record<string, unknown>;
}
