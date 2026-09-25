// Compatibility bridge. Migrate callers to @nexus-brain/contracts before removing.
export {
  assertContract,
  contractSchema,
  contractTypes,
  normalizeLegacy,
  validateContract,
} from '../packages/contracts/src/index.mjs';
