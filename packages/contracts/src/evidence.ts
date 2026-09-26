export interface NexusEvidence {
  evidence_id: string;
  project_id: string;
  run_id: string;
  source: string;
  provider: string;
  capability: string;
  url?: string;
  canonical_url?: string;
  title?: string;
  body?: string;
  snippet?: string;
  author?: string;
  published_at?: string;
  fetched_at: string;
  engagement?: Record<string, unknown> | null;
  relevance?: number;
  freshness?: number;
  authority?: number;
  query?: string;
  extraction_method?: string;
  backend?: string;
  content_hash?: string;
  trust_level: 'UNTRUSTED';
  provenance: Record<string, unknown>;
}
