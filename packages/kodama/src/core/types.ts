export type Variant = 'gradient' | 'solid';

export type EyeType = 'round' | 'cross' | 'line' | 'curved' | 'wink' | 'heart';
export type EyebrowType = 'arched' | 'flat' | 'raised' | 'none';
export type MouthType = 'smile' | 'grin' | 'o' | 'cat' | 'tongue' | 'smirk' | 'flat';
export type CheekType = 'blush' | 'none';
export type AccessoryType = 'none' | 'glasses' | 'sunglasses';

export type Mood = 'happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky';

export type GradientPair = {
  from: string;
  to: string;
};

export type CompoundFaceData = {
  eyes: EyeType;
  eyebrows: EyebrowType;
  mouth: MouthType;
  cheeks: CheekType;
  accessory: AccessoryType;
};

export type Rotation = {
  x: number;
  y: number;
};

export type AvatarData = {
  face: CompoundFaceData;
  colorIndex: number;
  rotation: Rotation;
  initial: string;
};

export type GenerateOptions = {
  name: string;
  colorsLength?: number;
};

export type FeatureShape = {
  viewBox: string;
  paths: Array<string | { d: string; fill?: string; opacity?: string }>;
  strokes?: Array<{
    d: string;
    strokeWidth: string;
    strokeLinecap?: string;
    fill?: string;
  }>;
  circles?: Array<{
    cx: string;
    cy: string;
    r: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    opacity?: string;
  }>;
  ellipses?: Array<{
    cx: string;
    cy: string;
    rx: string;
    ry: string;
    stroke?: string;
    strokeWidth?: string;
    fill?: string;
  }>;
  rects?: Array<{
    x: string;
    y: string;
    width: string;
    height: string;
    rx?: string;
    fill?: string;
    opacity?: string;
  }>;
};

export type DetailLevel = 'minimal' | 'basic' | 'standard' | 'full';

export type Animation = 'blink' | 'float' | 'entrance' | 'sway' | 'eyeWander' | 'eyebrowBounce' | 'glance';

export type CreateKodamaOptions = {
  name: string;
  size?: number;
  variant?: Variant;
  mood?: Mood;
  detailLevel?: DetailLevel;
  gradients?: readonly GradientPair[];
  animations?: readonly Animation[];
};

export type CreateKodamaResult = {
  svg: string;
  data: AvatarData;
  face: CompoundFaceData;
  rotation: Rotation;
  gradient: GradientPair;
  detailLevel: DetailLevel;
};
