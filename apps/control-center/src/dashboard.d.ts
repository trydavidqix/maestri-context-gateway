export declare function dashboardStats(root: string): Promise<{
  telemetry: { event_count: number; source: string; measurement_type: string; timestamp: string };
  by_mcp: Array<{ mcp: string; [key: string]: unknown }>;
  metrics: { mcg_coverage: number | null; measurement_type: string; [key: string]: unknown };
  [key: string]: unknown;
}>;
