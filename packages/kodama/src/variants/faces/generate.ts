import type {
  FacesAccessoryType,
  FacesCheekType,
  FacesData,
  FacesDetailLevel,
  FacesEyebrowType,
  FacesEyeType,
  FacesMood,
  FacesMouthType,
  FacesSlots,
} from './types';

export const EYE_TYPES: readonly FacesEyeType[] = [
  'round',
  'cross',
  'line',
  'curved',
  'wink',
  'heart',
] as const;

export const EYEBROW_TYPES: readonly FacesEyebrowType[] = ['arched', 'flat', 'raised', 'none'] as const;

export const MOUTH_TYPES: readonly FacesMouthType[] = [
  'smile',
  'grin',
  'o',
  'cat',
  'tongue',
  'smirk',
  'flat',
] as const;

export const CHEEK_TYPES: readonly FacesCheekType[] = ['blush', 'none'] as const;

export const ACCESSORY_TYPES: readonly FacesAccessoryType[] = ['none', 'glasses', 'sunglasses'] as const;

const SPHERE_POSITIONS = [
  { x: -1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
] as const;

export const MOOD_OVERRIDES: Record<FacesMood, Partial<FacesSlots>> = {
  happy: { eyes: 'curved', mouth: 'grin', eyebrows: 'arched' },
  surprised: { eyes: 'round', mouth: 'o', eyebrows: 'raised' },
  sleepy: { eyes: 'line', mouth: 'flat', eyebrows: 'flat' },
  cool: { eyes: 'round', accessory: 'sunglasses', mouth: 'smirk' },
  cheeky: { eyes: 'wink', mouth: 'tongue', cheeks: 'blush' },
};

export const SLOT_MIN_DETAIL: Record<keyof FacesSlots, FacesDetailLevel> = {
  eyes: 'minimal',
  mouth: 'basic',
  eyebrows: 'standard',
  cheeks: 'full',
  accessory: 'full',
};

const DETAIL_ORDER: readonly FacesDetailLevel[] = ['minimal', 'basic', 'standard', 'full'] as const;

export function canRenderSlot(slot: keyof FacesSlots, detailLevel: FacesDetailLevel): boolean {
  return DETAIL_ORDER.indexOf(detailLevel) >= DETAIL_ORDER.indexOf(SLOT_MIN_DETAIL[slot]);
}

export function getAutoDetailLevel(size: number): FacesDetailLevel {
  if (size < 32) {
    return 'minimal';
  }

  if (size < 48) {
    return 'basic';
  }

  if (size < 64) {
    return 'standard';
  }

  return 'full';
}

export function generateFacesData(options: { name: string; colorsLength: number; seed: number }): FacesData {
  const { name, colorsLength, seed } = options;

  const eyeIndex = seed % EYE_TYPES.length;
  const eyebrowIndex = (seed * 7) % EYEBROW_TYPES.length;
  const mouthIndex = (seed * 13) % MOUTH_TYPES.length;
  const cheekIndex = (seed * 19) % CHEEK_TYPES.length;
  const accessoryIndex = (seed * 31) % ACCESSORY_TYPES.length;
  const colorIndex = (seed * 37) % colorsLength;
  const positionIndex = (seed * 43) % SPHERE_POSITIONS.length;

  const position = SPHERE_POSITIONS[positionIndex] ?? { x: 0, y: 0 };

  return {
    slots: {
      eyes: EYE_TYPES[eyeIndex] ?? 'round',
      eyebrows: EYEBROW_TYPES[eyebrowIndex] ?? 'arched',
      mouth: MOUTH_TYPES[mouthIndex] ?? 'smile',
      cheeks: CHEEK_TYPES[cheekIndex] ?? 'none',
      accessory: ACCESSORY_TYPES[accessoryIndex] ?? 'none',
    },
    colorIndex,
    rotation: position,
    initial: name.charAt(0).toUpperCase(),
  };
}

export function applyMood(slots: FacesSlots, mood: FacesMood): FacesSlots {
  return { ...slots, ...MOOD_OVERRIDES[mood] };
}
