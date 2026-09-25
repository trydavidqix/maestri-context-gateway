import type {
  CapabilitySnapshot,
  ExecutionPort,
  ExecutionResult,
  QuotaSnapshot,
  TaskContract,
} from './execution-port';

export interface GatewayClient {
  execute(input: {
    provider: string;
    model: string;
    contract: TaskContract;
  }): Promise<ExecutionResult>;
  quota?(): Promise<QuotaSnapshot>;
  health?(): Promise<'healthy' | 'degraded' | 'unavailable'>;
}

export class GatewayAdapter implements ExecutionPort {
  public readonly name = 'gateway';

  constructor(
    private readonly client?: GatewayClient,
    private readonly model = 'auto',
    private readonly provider = 'gateway',
  ) {}

  async execute(contract: TaskContract): Promise<ExecutionResult> {
    if (!this.client) {
      return {
        task_id: contract.task_id,
        provider: this.provider,
        model: this.model,
        status: 'blocked',
        summary: 'Gateway execution client is not configured.',
        files_changed: [],
        tests: [],
        commands: [],
        evidence: ['gateway_client_unconfigured'],
        risks: ['external_credentials_or_runtime_required'],
      };
    }
    return this.client.execute({ provider: this.provider, model: this.model, contract });
  }

  async checkQuota(): Promise<QuotaSnapshot> {
    if (!this.client?.quota) {
      return {
        provider: this.provider,
        model: this.model,
        tokens_used: 0,
        cost_usd: 0,
        health: 'degraded',
        observed_at: new Date().toISOString(),
      };
    }
    return this.client.quota();
  }

  quota(): Promise<QuotaSnapshot> { return this.checkQuota(); }

  async usage() {
    return { input_tokens: 0, cached_tokens: 0, output_tokens: 0, duration_ms: 0, cost_usd: 0 };
  }

  capabilities(): Promise<string[]> {
    return Promise.resolve(['coding', 'research', 'classification', 'documents', 'frontend', 'tests']);
  }

  resume(taskId: string): Promise<ExecutionResult> {
    return Promise.resolve({ task_id: taskId, status: 'unavailable', summary: 'Gateway resume handle is not configured.', files_changed: [], commands: [], tests: [], evidence: [], error: { code: 'resume_unavailable', message: 'Gateway resume handle is not configured.' } });
  }

  cancel(taskId: string): Promise<ExecutionResult> {
    return Promise.resolve({ task_id: taskId, status: 'cancelled', summary: 'Gateway execution cancelled.', files_changed: [], commands: [], tests: [], evidence: [] });
  }

  async getCapabilities(): Promise<CapabilitySnapshot> {
    return {
      provider: this.provider,
      model: this.model,
      capabilities: ['coding', 'research', 'classification', 'documents', 'frontend', 'tests'],
      supports_tools: true,
      supports_vision: true,
      health: (await this.health()).status,
      observed_at: new Date().toISOString(),
    };
  }

  async health(): Promise<{ ok: boolean; status: 'healthy' | 'degraded' | 'unavailable' }> {
    const status = !this.client ? 'degraded' : this.client.health ? await this.client.health() : 'healthy';
    return { ok: status === 'healthy', status };
  }
}
