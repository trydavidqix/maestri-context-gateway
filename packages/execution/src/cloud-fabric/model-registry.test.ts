import { describe, expect, it } from 'vitest';
import { defaultModels } from './model-registry.js';

describe('default model profiles', () => {
  it('does not treat internal tier labels as native provider model IDs', () => {
    expect(defaultModels().every(profile => profile.model === undefined)).toBe(true);
  });
});
