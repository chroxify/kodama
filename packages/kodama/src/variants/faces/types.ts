import type { GradientPair, Rotation } from '../../core/types';

export type FacesBackgroundStyle = 'gradient' | 'solid';

export type FacesEyeType = 'round' | 'cross' | 'line' | 'curved' | 'wink' | 'heart';
export type FacesEyebrowType = 'arched' | 'flat' | 'raised' | 'none';
export type FacesMouthType = 'smile' | 'grin' | 'o' | 'cat' | 'tongue' | 'smirk' | 'flat';
export type FacesCheekType = 'blush' | 'none';
export type FacesAccessoryType = 'none' | 'glasses' | 'sunglasses';

export type FacesMood = 'happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky';

export type FacesDetailLevel = 'minimal' | 'basic' | 'standard' | 'full';
export type FacesDepth = 'none' | 'subtle' | 'medium' | 'dramatic';

export type FacesAnimation =
  | 'blink'
  | 'float'
  | 'entrance'
  | 'sway'
  | 'eyeWander'
  | 'eyebrowBounce'
  | 'glance';

export type FacesAnimationConfig = {
  type: FacesAnimation;
  delay?: number;
  duration?: number;
};

export type FacesAnimationInput = FacesAnimation | FacesAnimationConfig;

export type FacesSlots = {
  eyes: FacesEyeType;
  eyebrows: FacesEyebrowType;
  mouth: FacesMouthType;
  cheeks: FacesCheekType;
  accessory: FacesAccessoryType;
};

export type FacesProps = {
  background?: FacesBackgroundStyle;
  mood?: FacesMood;
  detailLevel?: FacesDetailLevel;
  gradients?: readonly GradientPair[];
  animations?: readonly FacesAnimationInput[];
  depth?: FacesDepth;
};

export type FacesNormalizedProps = {
  background: FacesBackgroundStyle;
  mood?: FacesMood;
  detailLevel: FacesDetailLevel;
  gradients?: readonly GradientPair[];
  animations: readonly FacesAnimationConfig[];
  depth: FacesDepth;
};

export type FacesData = {
  slots: FacesSlots;
  colorIndex: number;
  rotation: Rotation;
  initial: string;
};

export type FacesResult = {
  variant: 'faces';
  svg: string;
  data: FacesData;
  slots: FacesSlots;
  rotation: Rotation;
  gradient: GradientPair;
  detailLevel: FacesDetailLevel;
  depth: FacesDepth;
};
