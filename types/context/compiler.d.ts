export type ContextFragment = {
  id: string;
  category: string;
  priority: number;
  content: string;
};

export declare function compileContext(input: {
  fragments: ContextFragment[];
  budget_chars: number;
}): {
  context_version: string;
  fragments: Array<{ id: string; content: string }>;
  measurement_type: "exact" | "estimated" | "unavailable";
  source: string;
};
