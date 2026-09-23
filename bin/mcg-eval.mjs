#!/usr/bin/env node
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runValidationSuite } from '../src/eval-runner.mjs';
const root = process.env.MCG_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), '..', '.mcg-state');
const binary = process.env.CODEX_BIN || join(homedir(), '.codex', 'packages', 'standalone', 'current', 'bin', 'codex.exe');
const mode = process.argv[2] || 'smoke';
const datasetName = ({ validation: 'validation.jsonl', 'validation-v2': 'validation-v2.jsonl' })[mode] || 'smoke.jsonl';
const dataset = fileURLToPath(new URL('../evals/datasets/' + datasetName, import.meta.url));
const offset = Number(process.env.MCG_EVAL_OFFSET || 0);
const result = await runValidationSuite({ root, binary, dataset, model: process.env.MCG_EVAL_MODEL || 'gpt-5.5', effort: process.env.MCG_EVAL_EFFORT || 'medium', offset, limit: mode === 'smoke' ? 6 : null, onProgress: progress => process.stderr.write(`Validation ${progress.completed}/${progress.total}: ${progress.caseId}\n`) });
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
