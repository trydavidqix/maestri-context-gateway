export function startDaemonControl(root: string, onStop: () => void | Promise<void>): Promise<{ close(): Promise<void> }>;
export function probeDaemon(root: string): Promise<boolean>;
export function stopDaemon(root: string, options?: { timeoutMs?: number }): Promise<void>;
