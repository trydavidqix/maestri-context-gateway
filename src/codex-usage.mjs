export function parseCodexJsonl(text) {
  if (typeof text !== 'string') return null;
  const usages = [];

  for (const line of text.split(/\r?\n/)) {
    try {
      const event = JSON.parse(line);
      if (event.type === 'turn.completed' && event.usage && Number.isFinite(event.usage.input_tokens)) {
        usages.push(event.usage);
      }
    } catch {}
  }
  if (usages.length === 0) return null;

  const sumIfComplete = (field) => usages.every((usage) => Number.isFinite(usage[field]))
    ? usages.reduce((sum, usage) => sum + usage[field], 0)
    : null;
  const input_tokens = sumIfComplete('input_tokens');
  const cached_input_tokens = sumIfComplete('cached_input_tokens');
  const output_tokens = sumIfComplete('output_tokens');
  const reasoning_tokens = usages.every((usage) => Number.isFinite(usage.reasoning_output_tokens ?? usage.reasoning_tokens))
    ? usages.reduce((sum, usage) => sum + (usage.reasoning_output_tokens ?? usage.reasoning_tokens), 0)
    : null;
  const total_tokens = usages.every((usage) => Number.isFinite(usage.total_tokens)
    || (Number.isFinite(usage.input_tokens) && Number.isFinite(usage.output_tokens)))
    ? usages.reduce((sum, usage) => sum + (Number.isFinite(usage.total_tokens)
      ? usage.total_tokens
      : usage.input_tokens + usage.output_tokens), 0)
    : null;

  // The documented codex exec JSONL turn.completed event has no turn ID, so
  // multi-event aggregates cannot be safely deduplicated.
  const measurement_type = usages.length > 1 ? 'estimated' : 'exact';
  const fields = { input_tokens, cached_input_tokens, output_tokens, reasoning_tokens, total_tokens };
  const field_provenance = Object.fromEntries(Object.entries(fields).map(([field, value]) => [field, {
    source: 'codex.exec.jsonl',
    measurement_type: value === null ? 'unavailable' : measurement_type
  }]));

  return { ...fields, measurement_type, source: 'codex.exec.jsonl', field_provenance };
}

export function parseCodexTools(text) {
  if (typeof text !== 'string') return [];
  const tools = new Set();
  for (const line of text.split(/\r?\n/)) {
    try {
      const item = JSON.parse(line).item;
      if (item?.type === 'command_execution') tools.add('command_execution');
      if (item?.type === 'mcp_tool_call') tools.add(item.server ? `mcp:${item.server}` : 'mcp_tool_call');
    } catch {}
  }
  return [...tools];
}
