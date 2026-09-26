import type { NexusIdentity } from './identity.js';
import type { ReachStatus } from './brain.js';

export interface ReachRequest extends NexusIdentity {
  capability: string;
  input: Record<string, unknown>;
  policy: Record<string, unknown>;
  constraints?: string[];
}

export interface ReachOutcome extends NexusIdentity {
  status: ReachStatus;
  provider: string;
  capability: string;
  output: Record<string, unknown>;
  evidence_ids: string[];
  error?: Record<string, unknown>;
}
