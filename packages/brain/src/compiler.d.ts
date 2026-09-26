export type ContextFragment = {
  id?: string;
  category?: string;
  classification?: string;
  priority?: number;
  content?: unknown;
  hash?: string;
  source?: string;
  timestamp?: string;
  provenance?: unknown;
  scope?: string;
  level?: string;
  must_keep?: boolean;
};

export type NormalizedContextFragment = {
  id: string;
  hash: string;
  content: string;
  category: string;
  priority: number;
  source: string;
  timestamp: string;
  provenance: unknown;
  scope: string;
  level: string;
  must_keep: boolean;
};

export declare const LEVELS: string[];
export declare function normalizeFragment(fragment?: ContextFragment): NormalizedContextFragment;
export declare function diffContext(previous?: ContextFragment[], next?: ContextFragment[]): {
  added: NormalizedContextFragment[];
  removed: NormalizedContextFragment[];
  changed: Array<{ before: NormalizedContextFragment; after: NormalizedContextFragment }>;
  unchanged: NormalizedContextFragment[];
  delta_chars: number;
};
export declare function compileContext(input: {
  fragments?: ContextFragment[];
  budget_chars?: number;
  previous?: ContextFragment[];
  context_version?: string | null;
}): {
  context_version: string;
  fragments: NormalizedContextFragment[];
  dropped: NormalizedContextFragment[];
  full_context_chars: number;
  delta_chars: number;
  delta_reuse_percent: number;
  estimated_tokens_avoided: number;
  cache_hits: number;
  cache_misses: number;
  measurement_type: "exact" | "estimated" | "unavailable";
  source: string;
  timestamp: string;
};
