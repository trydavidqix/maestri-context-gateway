import { compileContext, diffContext, normalizeFragment, LEVELS, type ContextFragment } from '@nexus-brain/brain/compiler';

const input: ContextFragment = { content: 'context', category: 'recent' };
const normalized = normalizeFragment(input);
const result = compileContext({ fragments: [input], budget_chars: 100 });
const delta = diffContext([], result.fragments);

const typedContract: {
  id: string;
  source: string;
  must_keep: boolean;
  levels: string[];
  changes: number;
} = {
  id: normalized.id,
  source: normalized.source,
  must_keep: normalized.must_keep,
  levels: LEVELS,
  changes: delta.added.length,
};

void typedContract;
