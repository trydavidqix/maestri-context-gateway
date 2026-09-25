import { ExecutionPort } from './execution-port.js';

export type QuotaState = 'GREEN' | 'YELLOW' | 'RED' | 'RESERVE' | 'UNKNOWN';

export function quotaState(snapshot: { remaining_percent?: number; remaining_budget?: number }): QuotaState {
  if (typeof snapshot.remaining_percent !== 'number') {
    if (snapshot.remaining_budget === undefined) return 'UNKNOWN';
    return snapshot.remaining_budget > 0 ? 'GREEN' : 'RESERVE';
  }
  if (snapshot.remaining_percent > 50) return 'GREEN';
  if (snapshot.remaining_percent > 20) return 'YELLOW';
  if (snapshot.remaining_percent >= 10) return 'RED';
  return 'RESERVE';
}

export class QuotaRouter {
  async selectProviderBasedOnQuota(providers: ExecutionPort[], requiredCapabilities: string[] = []): Promise<ExecutionPort> {
    for (const provider of providers) {
      const health = await provider.health();
      if (!health.ok || health.status === 'unavailable') continue;
      const capabilities = await provider.capabilities();
      if (requiredCapabilities.some((capability) => !capabilities.includes(capability))) continue;
      const quota = await provider.quota();
      if (quota.available === false || quota.remaining_budget === undefined || quota.remaining_budget <= 0) continue;
      return provider;
    }
    throw new Error('No healthy providers with verified quota.');
  }
}
