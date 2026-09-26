/** Canonical scope identity; task and agent are never inferred from session alone. */
export interface NexusIdentity {
  project_id: string;
  task_id: string;
  agent_id: string;
  session_id?: string;
  trace_id?: string;
}
