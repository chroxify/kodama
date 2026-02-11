import { createVariantFactory } from '../../core/engine/factory';
import type { VariantModule } from '../../core/types';
import { getAutoDetailLevel } from './generate';
import { renderFacesSvg } from './render';
import type {
  FacesAnimation,
  FacesAnimationConfig,
  FacesBackgroundStyle,
  FacesDepth,
  FacesDetailLevel,
  FacesMood,
  FacesNormalizedProps,
  FacesProps,
  FacesResult,
} from './types';

const BACKGROUND_STYLES: readonly FacesBackgroundStyle[] = ['gradient', 'solid'] as const;
const DETAIL_LEVELS: readonly FacesDetailLevel[] = ['minimal', 'basic', 'standard', 'full'] as const;
const DEPTH_LEVELS: readonly FacesDepth[] = ['none', 'subtle', 'medium', 'dramatic'] as const;
const MOODS: readonly FacesMood[] = ['happy', 'surprised', 'sleepy', 'cool', 'cheeky'] as const;
const ANIMATIONS: readonly FacesAnimation[] = [
  'blink',
  'float',
  'entrance',
  'sway',
  'eyeWander',
  'eyebrowBounce',
  'glance',
] as const;

function assertValidEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  prop: string,
  variant: string
): asserts value is T {
  if (!allowed.includes(value as T)) {
    throw new Error(
      `Variant "${variant}" received invalid value "${value}" for prop "${prop}". Allowed values: ${allowed.join(', ')}`
    );
  }
}

function normalizeFacesProps(props: Partial<FacesProps>, size: number): FacesNormalizedProps {
  const backgroundValue = props.background ?? 'gradient';
  assertValidEnum(backgroundValue, BACKGROUND_STYLES, 'background', 'faces');

  const detailLevelValue = props.detailLevel ?? getAutoDetailLevel(size);
  assertValidEnum(detailLevelValue, DETAIL_LEVELS, 'detailLevel', 'faces');

  let moodValue: FacesMood | undefined;
  if (props.mood !== undefined) {
    assertValidEnum(props.mood, MOODS, 'mood', 'faces');
    moodValue = props.mood;
  }

  const animationsValue: FacesAnimationConfig[] = (props.animations ?? []).map((a) => {
    if (typeof a === 'string') {
      assertValidEnum(a, ANIMATIONS, 'animations', 'faces');
      return { type: a };
    }
    assertValidEnum(a.type, ANIMATIONS, 'animations', 'faces');
    return { type: a.type, delay: a.delay, duration: a.duration };
  });

  const depthValue = props.depth ?? 'dramatic';
  assertValidEnum(depthValue, DEPTH_LEVELS, 'depth', 'faces');

  let gradientsValue = props.gradients;
  if (gradientsValue !== undefined) {
    gradientsValue = gradientsValue.filter(
      (pair) => typeof pair.from === 'string' && typeof pair.to === 'string'
    );
    if (gradientsValue.length === 0) {
      gradientsValue = undefined;
    }
  }

  return {
    background: backgroundValue,
    mood: moodValue,
    detailLevel: detailLevelValue,
    gradients: gradientsValue,
    animations: animationsValue,
    depth: depthValue,
  };
}

export const facesModule: VariantModule<'faces', FacesProps, FacesNormalizedProps, FacesResult> = {
  id: 'faces',
  propKeys: ['background', 'mood', 'detailLevel', 'gradients', 'animations', 'depth'] as const,
  capabilities: {
    backgrounds: BACKGROUND_STYLES,
    animations: ANIMATIONS,
  },
  normalizeProps: (props, context) => normalizeFacesProps(props, context.size),
  resolve: ({ name, size, seed, shape, props }) => renderFacesSvg({ name, size, seed, shape, props }),
};

export const faces = createVariantFactory(facesModule);

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
} from './types';
