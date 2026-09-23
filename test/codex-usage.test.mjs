import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseCodexJsonl, parseCodexTools } from '../src/codex-usage.mjs';

function usageFields(usage) {
  const { field_provenance, ...fields } = usage;
  return fields;
}

test('parseCodexJsonl handles usage correctly', () => {
  // Existing case
  const usage = parseCodexJsonl('{"type":"turn.started"}\n{"type":"turn.completed","usage":{"input_tokens":81011,"cached_input_tokens":60672,"output_tokens":464,"reasoning_output_tokens":216}}\n');
  assert.deepEqual(usageFields(usage), { input_tokens: 81011, cached_input_tokens: 60672, context_tokens: 141683, output_tokens: 464, reasoning_tokens: 216, total_tokens: 81475, measurement_type: 'exact', source: 'codex.exec.jsonl' });

  // Provider supplies total_tokens exactly
  const providerTotal = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":100,"output_tokens":50,"total_tokens":150}}\n');
  assert.deepEqual(usageFields(providerTotal), { input_tokens: 100, cached_input_tokens: null, context_tokens: null, output_tokens: 50, reasoning_tokens: null, total_tokens: 150, measurement_type: 'exact', source: 'codex.exec.jsonl' });

  // Missing output cannot be silently treated as zero for total usage.
  const missingOutput = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":100}}\n');
  assert.deepEqual(usageFields(missingOutput), { input_tokens: 100, cached_input_tokens: null, context_tokens: null, output_tokens: null, reasoning_tokens: null, total_tokens: null, measurement_type: 'exact', source: 'codex.exec.jsonl' });
  assert.deepEqual(missingOutput.field_provenance.total_tokens, { source: 'codex.exec.jsonl', measurement_type: 'unavailable' });

  // Reasoning as breakdown, should not be double-counted if we compute total_tokens
  const reasoningBreakdown = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":100,"output_tokens":50,"reasoning_tokens":10}}\n');
  assert.deepEqual(usageFields(reasoningBreakdown), { input_tokens: 100, cached_input_tokens: null, context_tokens: null, output_tokens: 50, reasoning_tokens: 10, total_tokens: 150, measurement_type: 'exact', source: 'codex.exec.jsonl' });

  // The documented event shape has no turn ID; multi-event aggregate is estimated.
  const multiTurn = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":10,"output_tokens":5}}\n{"type":"turn.completed","usage":{"input_tokens":10,"output_tokens":5}}\n');
  assert.deepEqual(usageFields(multiTurn), { input_tokens: 20, cached_input_tokens: null, context_tokens: null, output_tokens: 10, reasoning_tokens: null, total_tokens: 30, measurement_type: 'estimated', source: 'codex.exec.jsonl' });

  // Identical-looking events cannot be deduplicated safely without a documented ID.
  const repeatedShape = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":10,"output_tokens":5}}\n{"type":"turn.completed","usage":{"input_tokens":10,"output_tokens":5}}\n');
  assert.deepEqual(usageFields(repeatedShape), { input_tokens: 20, cached_input_tokens: null, context_tokens: null, output_tokens: 10, reasoning_tokens: null, total_tokens: 30, measurement_type: 'estimated', source: 'codex.exec.jsonl' });

  // No identifier claims estimated aggregate if multiple lines, but single line can be exact
  const noIdMulti = parseCodexJsonl('{"type":"turn.completed","usage":{"input_tokens":10,"output_tokens":5}}\n{"type":"turn.completed","usage":{"input_tokens":20,"output_tokens":10}}\n');
  assert.deepEqual(usageFields(noIdMulti), { input_tokens: 30, cached_input_tokens: null, context_tokens: null, output_tokens: 15, reasoning_tokens: null, total_tokens: 45, measurement_type: 'estimated', source: 'codex.exec.jsonl' });
  // Malformed line
  assert.equal(parseCodexJsonl('{bad}\n'), null);
});

test('parseCodexTools parses tool events', () => {
  assert.deepEqual(parseCodexTools('{"type":"item.completed","item":{"type":"command_execution"}}\n{"type":"item.completed","item":{"type":"agent_message"}}\n'), ['command_execution']);
});
