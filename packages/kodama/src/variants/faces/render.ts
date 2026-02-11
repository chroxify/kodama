import { renderSvgShell } from '../../core/render/shell';
import type { FeatureShape, KodamaShape } from '../../core/types';
import { ACCESSORY_SHAPES, CHEEK_SHAPES, EYE_SHAPES, EYEBROW_SHAPES, MOUTH_SHAPES } from './features';
import { applyMood, canRenderSlot, generateFacesData } from './generate';
import { DEFAULT_GRADIENTS, getGradient } from './palette';
import type { FacesAnimation, FacesAnimationConfig, FacesNormalizedProps, FacesResult } from './types';

// ── Keyframes ────────────────────────────────────────────────────────────────

const FACES_KEYFRAMES = `
@keyframes kodama-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.05); }
}
@keyframes kodama-eyebrow-bounce {
  0%, 88%, 100% { transform: translateY(0); }
  94% { transform: translateY(-2px); }
}
@keyframes kodama-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes kodama-sway {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
@keyframes kodama-eye-wander {
  0%, 100% { transform: translateX(0) translateY(0); }
  20% { transform: translateX(1.5px) translateY(-0.5px); }
  40% { transform: translateX(0.5px) translateY(0.5px); }
  60% { transform: translateX(-1.5px) translateY(0); }
  80% { transform: translateX(-0.5px) translateY(-0.5px); }
}
@keyframes kodama-entrance-scale {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes kodama-entrance-eyes {
  0% { transform: scaleY(0.05); }
  100% { transform: scaleY(1); }
}
@keyframes kodama-glance {
  0%, 82%, 100% { transform: var(--kodama-rest); }
  88%, 92% { transform: var(--kodama-facing); }
}
`;

// ── Depth presets (same as React) ────────────────────────────────────────────

const DEPTH_PRESETS = {
  none: { rotateRange: 0, translateZ: 0, perspective: 'none', contentScale: 1 },
  subtle: { rotateRange: 5, translateZ: 4, perspective: '800px', contentScale: 0.97 },
  medium: { rotateRange: 10, translateZ: 8, perspective: '500px', contentScale: 0.94 },
  dramatic: { rotateRange: 15, translateZ: 12, perspective: '300px', contentScale: 0.9 },
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderShapeContent(shape: FeatureShape, fill: string, stroke: string): string {
  const paths = shape.paths
    .map((p) => {
      if (typeof p === 'string') return `<path d="${p}" fill="${fill}"/>`;
      return `<path d="${p.d}" fill="${p.fill ?? fill}"${p.opacity ? ` opacity="${p.opacity}"` : ''}/>`;
    })
    .join('');

  const strokes =
    shape.strokes
      ?.map(
        (s) =>
          `<path d="${s.d}" fill="${s.fill ?? 'none'}" stroke="${stroke}" stroke-width="${s.strokeWidth}"${s.strokeLinecap ? ` stroke-linecap="${s.strokeLinecap}"` : ''}/>`
      )
      .join('') ?? '';

  const circles =
    shape.circles
      ?.map(
        (c) =>
          `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${c.fill ?? fill}"${c.opacity ? ` opacity="${c.opacity}"` : ''}${
            c.stroke || c.strokeWidth
              ? ` stroke="${c.stroke ?? stroke}"${c.strokeWidth ? ` stroke-width="${c.strokeWidth}"` : ''}`
              : ''
          }/>`
      )
      .join('') ?? '';

  const ellipses =
    shape.ellipses
      ?.map(
        (e) =>
          `<ellipse cx="${e.cx}" cy="${e.cy}" rx="${e.rx}" ry="${e.ry}" fill="${e.fill ?? 'none'}" stroke="${e.stroke ?? stroke}"${e.strokeWidth ? ` stroke-width="${e.strokeWidth}"` : ''}/>`
      )
      .join('') ?? '';

  const rects =
    shape.rects
      ?.map(
        (r) =>
          `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${r.fill ?? fill}"${r.rx ? ` rx="${r.rx}"` : ''}${r.opacity ? ` opacity="${r.opacity}"` : ''}/>`
      )
      .join('') ?? '';

  return `${paths}${strokes}${circles}${ellipses}${rects}`;
}

function renderFeature(
  shape: FeatureShape,
  fill: string,
  stroke: string,
  innerGroupStyle?: string,
  svgStyle?: string
): string {
  const content = renderShapeContent(shape, fill, stroke);
  const wrapped = innerGroupStyle ? `<g style="${innerGroupStyle}">${content}</g>` : content;
  const style = svgStyle ?? 'width:100%;height:auto';
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="${shape.viewBox}" style="overflow:visible;${style}">${wrapped}</svg>`;
}

function getAnimationFlags(animations: readonly FacesAnimationConfig[]): Record<FacesAnimation, boolean> {
  const set = new Set(animations.map((a) => a.type));
  return {
    blink: set.has('blink'),
    float: set.has('float'),
    entrance: set.has('entrance'),
    sway: set.has('sway'),
    eyeWander: set.has('eyeWander'),
    eyebrowBounce: set.has('eyebrowBounce'),
    glance: set.has('glance'),
  };
}

function getAnimConfig(
  animations: readonly FacesAnimationConfig[],
  type: FacesAnimation
): FacesAnimationConfig | undefined {
  return animations.find((a) => a.type === type);
}

// ── Main renderer ────────────────────────────────────────────────────────────

export function renderFacesSvg(input: {
  name: string;
  size: number;
  seed: number;
  shape: KodamaShape;
  props: FacesNormalizedProps;
}): FacesResult {
  const { name, seed, shape, props } = input;
  const { background, mood, detailLevel, gradients, animations, depth } = props;

  const colorsLength = gradients?.length ?? DEFAULT_GRADIENTS.length;
  const data = generateFacesData({ name, colorsLength, seed });
  const gradient = getGradient(gradients, data.colorIndex);
  const slots = mood ? applyMood(data.slots, mood) : data.slots;
  const { rotation } = data;

  // ── Animations ──

  const has = getAnimationFlags(animations);
  const hasAnyAnimation = animations.length > 0;

  const blinkConf = getAnimConfig(animations, 'blink');
  const blinkSeed = seed * 31;
  const blinkDelay = blinkConf?.delay ?? (blinkSeed % 40) / 10;
  const blinkDuration = blinkConf?.duration ?? 2 + (blinkSeed % 40) / 10;
  const blinkStyle = `animation:kodama-blink ${blinkDuration}s ease-in-out ${blinkDelay}s infinite;transform-origin:center center;`;

  const glanceConf = getAnimConfig(animations, 'glance');
  const glanceSeed = seed * 37;
  const glanceDuration = glanceConf?.duration ?? 6 + (glanceSeed % 30) / 10;
  const glanceDelay = glanceConf?.delay ?? (glanceSeed % 20) / 10;
  const glanceAnim = `kodama-glance ${glanceDuration}s ease-in-out ${glanceDelay}s infinite`;

  // ── Depth ──

  const preset = DEPTH_PRESETS[depth];
  const transform =
    depth === 'none'
      ? undefined
      : `scale(${preset.contentScale}) rotateX(${rotation.x * preset.rotateRange}deg) rotateY(${rotation.y * preset.rotateRange}deg) translateZ(${preset.translateZ}px)`;
  const facingTransform =
    depth === 'none'
      ? undefined
      : `scale(${preset.contentScale}) rotateX(0deg) rotateY(0deg) translateZ(${preset.translateZ}px)`;

  // ── Feature shapes ──

  const eyeShape = EYE_SHAPES[slots.eyes] ?? EYE_SHAPES.round;
  const eyebrowShape = EYEBROW_SHAPES[slots.eyebrows];
  const mouthShape = MOUTH_SHAPES[slots.mouth] ?? MOUTH_SHAPES.smile;
  const cheekShape = CHEEK_SHAPES[slots.cheeks];
  const accessoryShape = ACCESSORY_SHAPES[slots.accessory];

  // ── Detail visibility ──

  const showEyebrows = canRenderSlot('eyebrows', detailLevel);
  const showMouth = canRenderSlot('mouth', detailLevel);
  const showCheeks = canRenderSlot('cheeks', detailLevel);
  const showAccessories = canRenderSlot('accessory', detailLevel);
  const hasGlasses = slots.accessory === 'glasses' || slots.accessory === 'sunglasses';
  const showEyes = !(showAccessories && hasGlasses);
  const glassesActive = showAccessories && hasGlasses;

  // ── Render features (same as React) ──

  const fill = 'currentColor';
  const stroke = 'currentColor';

  const eyeHtml = renderFeature(
    eyeShape,
    fill,
    stroke,
    has.blink ? blinkStyle : undefined,
    'width:100%;height:auto;max-width:90%;max-height:40%'
  );
  const eyebrowHtml = eyebrowShape ? renderFeature(eyebrowShape, fill, stroke) : null;
  const mouthHtml = renderFeature(mouthShape, fill, stroke);
  const cheekHtml = cheekShape ? renderFeature(cheekShape, '#FF9EBB', '#FF9EBB') : null;
  const accessoryHtml = accessoryShape
    ? renderFeature(accessoryShape, fill, stroke, undefined, 'width:110%;height:auto')
    : null;

  // ── Build face content HTML (mirrors React JSX) ──

  // Eyebrows
  const eyebrowConf = getAnimConfig(animations, 'eyebrowBounce');
  const eyebrowDuration = eyebrowConf?.duration ?? 4;
  const eyebrowDelay = eyebrowConf?.delay ?? 0;

  const eyebrowsBlock =
    showEyebrows && eyebrowHtml
      ? `<div style="width:55%;margin-bottom:${glassesActive ? '6%' : '2%'}${has.eyebrowBounce ? `;animation:kodama-eyebrow-bounce ${eyebrowDuration}s ease-in-out ${eyebrowDelay}s infinite` : ''}">${eyebrowHtml}</div>`
      : '';

  // Eyes container animation (skip entrance-eyes when glasses are active)
  const eyeWanderConf = getAnimConfig(animations, 'eyeWander');
  const eyeWanderDuration = eyeWanderConf?.duration ?? 8;
  const eyeWanderDelay = eyeWanderConf?.delay ?? 0;
  const entranceConf = getAnimConfig(animations, 'entrance');
  const entranceDuration = entranceConf?.duration ?? 0.3;
  const entranceDelay = entranceConf?.delay ?? 0.2;

  const entranceEyes = has.entrance && !glassesActive;
  let eyesAnim = '';
  if (has.eyeWander && entranceEyes) {
    eyesAnim = `;animation:kodama-entrance-eyes ${entranceDuration}s ease-out ${entranceDelay}s both, kodama-eye-wander ${eyeWanderDuration}s ease-in-out 0.5s infinite`;
  } else if (entranceEyes) {
    eyesAnim = `;animation:kodama-entrance-eyes ${entranceDuration}s ease-out ${entranceDelay}s both`;
  } else if (has.eyeWander) {
    eyesAnim = `;animation:kodama-eye-wander ${eyeWanderDuration}s ease-in-out ${eyeWanderDelay}s infinite`;
  }

  const eyesBlock = [
    `<div style="width:60%;position:relative;display:flex;align-items:center;justify-content:center${eyesAnim}">`,
    showEyes ? `<div style="display:contents">${eyeHtml}</div>` : '',
    showAccessories && accessoryHtml
      ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none">${accessoryHtml}</div>`
      : '',
    `</div>`,
  ].join('');

  // Mouth
  const mouthBlock = showMouth
    ? `<div style="margin-top:${glassesActive ? '8%' : '4%'};width:35%;display:flex;align-items:center;justify-content:center">${mouthHtml}</div>`
    : '';

  // Cheeks
  const cheeksBlock =
    showCheeks && cheekHtml
      ? `<div style="position:absolute;bottom:18%;left:5%;right:5%;pointer-events:none">${cheekHtml}</div>`
      : '';

  // ── Face div (transform + float/glance) ──

  const faceStyles: string[] = [
    'position:absolute',
    'inset:0',
    'display:flex',
    'flex-direction:column',
    'align-items:center',
    'justify-content:center',
    'z-index:2',
  ];

  const floatConf = getAnimConfig(animations, 'float');
  const floatDuration = floatConf?.duration ?? 3;
  const floatDelay = floatConf?.delay ?? 0;

  if (has.float && !has.glance) {
    faceStyles.push(`animation:kodama-float ${floatDuration}s ease-in-out ${floatDelay}s infinite`);
  } else if (has.glance && depth !== 'none') {
    faceStyles.push(`--kodama-rest:${transform}`);
    faceStyles.push(`--kodama-facing:${facingTransform}`);
    faceStyles.push(`transform:${transform}`);
    faceStyles.push(`animation:${glanceAnim}`);
  } else {
    if (transform) faceStyles.push(`transform:${transform}`);
  }

  if (depth !== 'none') faceStyles.push('transform-style:preserve-3d');

  const faceDiv = [
    `<div style="${faceStyles.join(';')}">`,
    eyebrowsBlock,
    eyesBlock,
    mouthBlock,
    cheeksBlock,
    `</div>`,
  ].join('');

  // ── Sway wrapper ──

  const swayConf = getAnimConfig(animations, 'sway');
  const swayDuration = swayConf?.duration ?? 5;
  const swayDelay = swayConf?.delay ?? 0;
  const swayStyle = `position:absolute;inset:0${has.sway ? `;animation:kodama-sway ${swayDuration}s ease-in-out ${swayDelay}s infinite` : ''}`;
  const content = `<div style="${swayStyle}">${faceDiv}</div>`;

  // ── Root style (depth perspective) ──

  const rootParts: string[] = ['color:#000'];
  if (depth !== 'none') {
    rootParts.push(`perspective:${preset.perspective}`);
    rootParts.push('transform-style:preserve-3d');
  }

  // ── Compose via shell ──

  const svg = renderSvgShell({
    seed,
    shape,
    background,
    gradient,
    content,
    keyframes: hasAnyAnimation ? FACES_KEYFRAMES : undefined,
    svgStyle: has.entrance
      ? `animation:kodama-entrance-scale ${entranceConf?.duration ?? 0.4}s ease-out ${entranceConf?.delay ?? 0}s forwards`
      : undefined,
    rootStyle: rootParts.join(';'),
  });

  return {
    variant: 'faces',
    svg,
    data: { ...data, slots },
    slots,
    rotation: data.rotation,
    gradient,
    detailLevel,
    depth: props.depth,
  };
}
