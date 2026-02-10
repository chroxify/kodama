// Generation
export { applyMood, generate } from './generation/generate';

// Gradients
export { DEFAULT_GRADIENTS, getGradient } from './palette/gradients';

// Feature shape data
export {
  ACCESSORY_SHAPES,
  CHEEK_SHAPES,
  EYE_SHAPES,
  EYEBROW_SHAPES,
  MOUTH_SHAPES,
} from './svg/features';

// SVG rendering
export { createKodama } from './svg/svg';
export type {
  AccessoryType,
  Animation,
  AvatarData,
  CheekType,
  CompoundFaceData,
  CreateKodamaOptions,
  CreateKodamaResult,
  DetailLevel,
  EyebrowType,
  EyeType,
  FeatureShape,
  GenerateOptions,
  GradientPair,
  Mood,
  MouthType,
  Rotation,
  Variant,
} from './types';

// Utility
export { hash } from './utils/hash';
