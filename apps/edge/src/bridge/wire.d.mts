export interface WireConfig {
  host: string;
  port: number;
  token?: string;
  securityKeyHex?: string;
  protocolVersion?: number;
}

export interface WireCursor {
  epoch: string | null;
  sequence: number | null;
}

export function buildWireUrl(config: WireConfig, path: string, query?: Record<string, string | number | null | undefined>): URL;
export function loadWireConfig(root?: string): Promise<WireConfig>;
export function acceptWireMutation(event: { epoch: string | null; sequence?: number | null }, state?: WireCursor | null, options?: { snapshot?: boolean }): { accepted: boolean; resync_required: boolean; state: WireCursor };
export function summarizeWireSnapshot(snapshot: any): { workspace_id: string | null; terminal_count: number; attention_terminals: any[]; received_at: string };
export function wireRequest(config: WireConfig, path: string, options?: { method?: string; body?: unknown; query?: Record<string, string | number | null | undefined> }): Promise<any>;
export function wireSnapshot(config: WireConfig, workspaceId: string): Promise<any>;
export function openWireFeed(config: WireConfig, workspaceId: string, onMessage: (message: any) => void): Promise<{ close(): void; send(message: unknown): boolean; closed: Promise<void> }>;
