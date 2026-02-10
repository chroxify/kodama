import { DEFAULT_GRADIENTS } from '../palette/gradients';
import type {
  AccessoryType,
  AvatarData,
  CheekType,
  CompoundFaceData,
  EyebrowType,
  EyeType,
  GenerateOptions,
  Mood,
  MouthType,
} from '../types';
import { hash } from '../utils/hash';

export const EYE_TYPES: readonly EyeType[] = ['round', 'cross', 'line', 'curved', 'wink', 'heart'] as const;

export const EYEBROW_TYPES: readonly EyebrowType[] = ['arched', 'flat', 'raised', 'none'] as const;

export const MOUTH_TYPES: readonly MouthType[] = [
  'smile',
  'grin',
  'o',
  'cat',
  'tongue',
  'smirk',
  'flat',
] as const;

export const CHEEK_TYPES: readonly CheekType[] = ['blush', 'none'] as const;

export const ACCESSORY_TYPES: readonly AccessoryType[] = ['none', 'glasses', 'sunglasses'] as const;

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

export const MOOD_OVERRIDES: Record<Mood, Partial<CompoundFaceData>> = {
  happy: { eyes: 'curved', mouth: 'grin', eyebrows: 'arched' },
  surprised: { eyes: 'round', mouth: 'o', eyebrows: 'raised' },
  sleepy: { eyes: 'line', mouth: 'flat', eyebrows: 'flat' },
  cool: { eyes: 'round', accessory: 'sunglasses', mouth: 'smirk' },
  cheeky: { eyes: 'wink', mouth: 'tongue', cheeks: 'blush' },
};

export function generate(options: GenerateOptions): AvatarData {
  const { name, colorsLength = DEFAULT_GRADIENTS.length } = options;

  const h = hash(name);

  const eyeIndex = h % EYE_TYPES.length;
  const eyebrowIndex = (h * 7) % EYEBROW_TYPES.length;
  const mouthIndex = (h * 13) % MOUTH_TYPES.length;
  const cheekIndex = (h * 19) % CHEEK_TYPES.length;
  const accessoryIndex = (h * 31) % ACCESSORY_TYPES.length;
  const colorIndex = (h * 37) % colorsLength;
  const positionIndex = (h * 43) % SPHERE_POSITIONS.length;

  const position = SPHERE_POSITIONS[positionIndex] ?? { x: 0, y: 0 };

  return {
    face: {
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

export function applyMood(face: CompoundFaceData, mood: Mood): CompoundFaceData {
  return { ...face, ...MOOD_OVERRIDES[mood] };
}
