import type { ExecutionPort,ExecutionResult,TaskContract } from './execution-port';
export async function resumeExecution(port:ExecutionPort,executionId:string,contract:TaskContract):Promise<ExecutionResult>{return port.resume(executionId)}
