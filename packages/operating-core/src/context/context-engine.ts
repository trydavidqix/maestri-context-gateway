export interface ContextPackage {
  agent: unknown;
  identity: unknown;
  goal: unknown;
  rules: unknown;
  session: unknown;
  customer_facts: unknown;
  memory: unknown;
  relationships: unknown;
  knowledge: unknown;
  code_context: unknown;
  skills: unknown;
  tools: unknown;
  permissions: unknown;
  budget: unknown;
  provenance: unknown;
  freshness: unknown;
}

export interface ContextSource {
  id: string;
  kind: ContextReference['kind'];
  source: string;
  reason: string;
  content?: string;
  token_estimate?: number;
  hash?: string;
  priority?: number;
}

export interface ContextBuildInput {
  contract: TaskContract;
  sources?: ContextSource[];
  allowed_tools?: string[];
  token_budget?: number;
  expansion_level?: 0 | 1 | 2 | 3 | 4;
  provenance?: string[];
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function normalizeSource(source: ContextSource): ContextSource {
  if (source.token_estimate !== undefined) return source;
  return { ...source, token_estimate: estimateTokens(source.content ?? '') };
}

export class ContextEngine {
  async buildContext(agentId: string, task: string, tokenBudget: number = 8000): Promise<ContextPackage> {
    // Stub implementation that satisfies the interface
    return {
      agent: { id: agentId },
      identity: {},
      goal: { task },
      rules: [],
      session: {},
      customer_facts: {},
      memory: {},
      relationships: {},
      knowledge: {},
      code_context: {},
      skills: {},
      tools: {},
      permissions: {},
      budget: { token_budget: tokenBudget },
      provenance: {},
      freshness: new Date().toISOString(),
    };
  }

  compilePacket(input: ContextBuildInput): ContextPacket {
    const tokenBudget = Math.max(256, input.token_budget ?? 8000);
    const level = input.expansion_level ?? 1;
    const ranked = (input.sources ?? [])
      .map(normalizeSource)
      .filter((source) => this.allowedAtLevel(source.kind, level))
      .sort((a, b) => {
        const priority = (b.priority ?? 0) - (a.priority ?? 0);
        if (priority !== 0) return priority;
        if (a.id !== b.id) return a.id < b.id ? -1 : 1;
        if (a.source !== b.source) return a.source < b.source ? -1 : 1;
        return 0;
      });

    let used = 0;
    const references: ContextReference[] = [];
    for (const source of ranked) {
      const estimate = source.token_estimate ?? 0;
      if (used + estimate > tokenBudget) continue;
      references.push({ id: source.id, kind: source.kind, source: source.source, reason: source.reason, token_estimate: estimate, hash: source.hash });
      used += estimate;
    }

    const packetId = this.packetId(input.contract.task_id, references);
    return {
      packet_id: packetId,
      task_id: input.contract.task_id,
      context_version: '1',
      level,
      objective: input.contract.goal,
      relevant_instructions: references.filter((item) => item.kind === 'instruction').map((item) => item.source),
      relevant_files: references.filter((item) => item.kind === 'file' || item.kind === 'snippet').map((item) => ({ path: item.source, symbols: [], score: 0 })),
      relevant_symbols: references.filter((item) => item.kind === 'symbol').map((item) => item.source),
      prior_decisions: references.filter((item) => item.kind === 'memory').map((item) => item.source),
      constraints: input.contract.constraints,
      available_tools: [...new Set(input.allowed_tools ?? [])],
      evidence: references.filter((item) => item.kind === 'evidence').map((item) => item.source),
      token_budget: tokenBudget,
      character_count: used * 4,
      references,
    };
  }

  expandPacket(input: ContextBuildInput, nextLevel: 1 | 2 | 3 | 4): ContextPacket {
    return this.compilePacket({ ...input, expansion_level: nextLevel });
  }

  private allowedAtLevel(kind: ContextReference['kind'], level: 0 | 1 | 2 | 3 | 4): boolean {
    if (level === 0) return kind === 'instruction' || kind === 'evidence';
    if (level === 1) return ['instruction', 'symbol', 'memory', 'evidence', 'tool'].includes(kind);
    if (level === 2) return kind !== 'file';
    return true;
  }

  private packetId(taskId: string, references: ContextReference[]): string {
    const fingerprint = references.map((reference) => reference.hash ?? reference.id).join('|');
    let hash = 2166136261;
    const input = `${taskId}:${fingerprint}`;
    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `ctx_${taskId}_${(hash >>> 0).toString(16)}`;
  }
}
import type { ContextPacket, ContextReference } from '../cloud-fabric/context-packet.js';
import type { TaskContract } from '../cloud-fabric/execution-port.js';
