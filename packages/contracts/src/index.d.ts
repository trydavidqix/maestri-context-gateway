export type ContractType =
  | "task" | "event" | "trace" | "telemetry" | "agent" | "runtime"
  | "tool" | "plugin" | "mcp" | "alert" | "eval" | "artifact";

export interface ContractValidationResult {
  valid: boolean;
  errors: string[];
  schema_id: string | null;
}

export function contractSchema(type: ContractType | string): Record<string, unknown> | null;
export function validateContract(type: ContractType | string, value: unknown): ContractValidationResult;
export function assertContract<T>(type: ContractType | string, value: T): T;
export function normalizeLegacy<T extends Record<string, unknown>>(value: T, type: ContractType | string): T & {
  source: string;
  measurement_type: string;
  timestamp: string;
};
export function contractTypes(): ContractType[];
