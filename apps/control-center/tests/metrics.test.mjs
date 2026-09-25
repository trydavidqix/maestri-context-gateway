import assert from 'node:assert/strict';
import test from 'node:test';
import { contextMetricsFromEvents } from '../src/dashboard.mjs';

test('control center preserves measured context metrics', () => {
  const result = contextMetricsFromEvents([
    { task_id: 'a', operation: 'context.compile', input_chars: 100, output_chars: 0 },
    { task_id: 'b', operation: 'context.compile', input_chars: 900, output_chars: 450 },
    { task_id: 'c', operation: 'ingest', input_chars: 20, output_chars: 10 },
  ]);
  assert.equal(result.compression_ratio, 55);
  assert.equal(result.estimated_context_savings.measurement_type, 'estimated');
});
