export type MgcTrace = { trace_id: string; session_id: string; task_id?: string | null };
export type MgcSpan = { span_id: string };

export declare function createTrace(root: string, input: Record<string, unknown>): Promise<MgcTrace>;
export declare function startSpan(root: string, trace: MgcTrace, input: Record<string, unknown>): Promise<MgcSpan>;
export declare function finishSpan(root: string, trace: MgcTrace, spanId: string, update: Record<string, unknown>): Promise<unknown>;
