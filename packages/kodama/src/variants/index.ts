export type {
  FacesAnimation,
  FacesAnimationConfig,
  FacesAnimationInput,
  FacesBackgroundStyle,
  FacesData,
  FacesDepth,
  FacesDetailLevel,
  FacesMood,
  FacesProps,
  FacesResult,
} from './faces';

export { faces, facesModule } from './faces';

import { faces } from './faces';

export const VARIANT_REGISTRY = {
  faces,
} as const;
