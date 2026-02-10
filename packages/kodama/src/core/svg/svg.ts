import { applyMood, generate } from '../generation/generate';
import { DEFAULT_GRADIENTS, getGradient } from '../palette/gradients';
import type { CreateKodamaOptions, CreateKodamaResult, DetailLevel, FeatureShape } from '../types';
import { hash } from '../utils/hash';
import { ACCESSORY_SHAPES, CHEEK_SHAPES, EYE_SHAPES, EYEBROW_SHAPES, MOUTH_SHAPES } from './features';

const SVG_KEYFRAMES = `
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
`;

function toFixed(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function styleAttr(style: string): string {
  const trimmed = style.trim();
  if (!trimmed) {
    return '';
  }

  return ` style="${trimmed}"`;
}

function getAutoDetailLevel(size: number): DetailLevel {
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

function renderShape(
  featureShape: FeatureShape,
  width: number,
  fill: string,
  stroke: string,
  style = ''
): string {
  const [, , vbWidth = 1, vbHeight = 1] = featureShape.viewBox.split(' ').map(Number);
  const aspectRatio = vbWidth / vbHeight;
  const height = width / aspectRatio;

  const paths = featureShape.paths
    .map((path) => {
      if (typeof path === 'string') {
        return `<path d="${path}" fill="${fill}" />`;
      }
      return `<path d="${path.d}" fill="${path.fill ?? fill}"${path.opacity ? ` opacity="${path.opacity}"` : ''} />`;
    })
    .join('');

  const strokes =
    featureShape.strokes
      ?.map(
        (path) =>
          `<path d="${path.d}" fill="${path.fill ?? 'none'}" stroke="${stroke}" stroke-width="${path.strokeWidth}"${
            path.strokeLinecap ? ` stroke-linecap="${path.strokeLinecap}"` : ''
          } />`
      )
      .join('') ?? '';

  const circles =
    featureShape.circles
      ?.map(
        (circle) =>
          `<circle cx="${circle.cx}" cy="${circle.cy}" r="${circle.r}" fill="${circle.fill ?? fill}"${
            circle.opacity ? ` opacity="${circle.opacity}"` : ''
          }${
            circle.stroke || circle.strokeWidth
              ? ` stroke="${circle.stroke ?? stroke}"${
                  circle.strokeWidth ? ` stroke-width="${circle.strokeWidth}"` : ''
                }`
              : ''
          } />`
      )
      .join('') ?? '';

  const ellipses =
    featureShape.ellipses
      ?.map(
        (ellipse) =>
          `<ellipse cx="${ellipse.cx}" cy="${ellipse.cy}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="${ellipse.fill ?? 'none'}" stroke="${ellipse.stroke ?? stroke}"${
            ellipse.strokeWidth ? ` stroke-width="${ellipse.strokeWidth}"` : ''
          } />`
      )
      .join('') ?? '';

  const rects =
    featureShape.rects
      ?.map(
        (rect) =>
          `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${rect.fill ?? fill}"${
            rect.rx ? ` rx="${rect.rx}"` : ''
          }${rect.opacity ? ` opacity="${rect.opacity}"` : ''} />`
      )
      .join('') ?? '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${featureShape.viewBox}" width="${toFixed(width)}" height="${toFixed(
    height
  )}"${styleAttr(style)}>${paths}${strokes}${circles}${ellipses}${rects}</svg>`;
}

function withTransform(x: number, y: number, body: string, style = ''): string {
  return `<g transform="translate(${toFixed(x)} ${toFixed(y)})"${styleAttr(style)}>${body}</g>`;
}

function renderShapeContent(featureShape: FeatureShape, fill: string, stroke: string): string {
  const paths = featureShape.paths
    .map((path) => {
      if (typeof path === 'string') {
        return `<path d="${path}" fill="${fill}" />`;
      }
      return `<path d="${path.d}" fill="${path.fill ?? fill}"${path.opacity ? ` opacity="${path.opacity}"` : ''} />`;
    })
    .join('');

  const strokes =
    featureShape.strokes
      ?.map(
        (path) =>
          `<path d="${path.d}" fill="${path.fill ?? 'none'}" stroke="${stroke}" stroke-width="${path.strokeWidth}"${
            path.strokeLinecap ? ` stroke-linecap="${path.strokeLinecap}"` : ''
          } />`
      )
      .join('') ?? '';

  const circles =
    featureShape.circles
      ?.map(
        (circle) =>
          `<circle cx="${circle.cx}" cy="${circle.cy}" r="${circle.r}" fill="${circle.fill ?? fill}"${
            circle.opacity ? ` opacity="${circle.opacity}"` : ''
          }${
            circle.stroke || circle.strokeWidth
              ? ` stroke="${circle.stroke ?? stroke}"${
                  circle.strokeWidth ? ` stroke-width="${circle.strokeWidth}"` : ''
                }`
              : ''
          } />`
      )
      .join('') ?? '';

  const ellipses =
    featureShape.ellipses
      ?.map(
        (ellipse) =>
          `<ellipse cx="${ellipse.cx}" cy="${ellipse.cy}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="${ellipse.fill ?? 'none'}" stroke="${ellipse.stroke ?? stroke}"${
            ellipse.strokeWidth ? ` stroke-width="${ellipse.strokeWidth}"` : ''
          } />`
      )
      .join('') ?? '';

  const rects =
    featureShape.rects
      ?.map(
        (rect) =>
          `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${rect.fill ?? fill}"${
            rect.rx ? ` rx="${rect.rx}"` : ''
          }${rect.opacity ? ` opacity="${rect.opacity}"` : ''} />`
      )
      .join('') ?? '';

  return `${paths}${strokes}${circles}${ellipses}${rects}`;
}

/**
 * Renders a FeatureShape as a standalone SVG string suitable for embedding in HTML.
 * Unlike renderShape (which sizes in SVG units), this outputs 100% width for CSS layout.
 * The optional innerGroupStyle wraps all content in a `<g>` with that style (e.g., for blink animation).
 * The optional svgStyle overrides the default inline style on the `<svg>` element.
 */
export function renderFeature(
  featureShape: FeatureShape,
  fill: string,
  stroke: string,
  innerGroupStyle?: string,
  svgStyle?: string
): string {
  const content = renderShapeContent(featureShape, fill, stroke);
  const wrappedContent = innerGroupStyle ? `<g style="${innerGroupStyle}">${content}</g>` : content;
  const style = svgStyle ?? 'width:100%;height:auto';
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="${featureShape.viewBox}" style="${style}">${wrappedContent}</svg>`;
}

export function createKodama(options: CreateKodamaOptions): CreateKodamaResult {
  const {
    name,
    size = 40,
    variant = 'gradient',
    showMouth = true,
    mood,
    detailLevel: detailLevelOption,
    gradients,
    animations = [],
  } = options;

  const detailLevel = detailLevelOption ?? getAutoDetailLevel(size);
  const h = hash(name);

  const colorsLength = gradients?.length ?? DEFAULT_GRADIENTS.length;
  const data = generate({ name, colorsLength });
  const gradient = getGradient(gradients, data.colorIndex);
  const face = mood ? applyMood(data.face, mood) : data.face;

  const set = new Set(animations);
  const has = {
    blink: set.has('blink'),
    float: set.has('float'),
    entrance: set.has('entrance'),
    sway: set.has('sway'),
    eyeWander: set.has('eyeWander'),
    eyebrowBounce: set.has('eyebrowBounce'),
  };

  const blinkSeed = h * 31;
  const blinkDelay = (blinkSeed % 40) / 10;
  const blinkDuration = 2 + (blinkSeed % 40) / 10;

  const eyebrowSvg = EYEBROW_SHAPES[face.eyebrows];
  const eyeSvg = EYE_SHAPES[face.eyes] ?? EYE_SHAPES.round;
  const mouthSvg = MOUTH_SHAPES[face.mouth] ?? MOUTH_SHAPES.smile;
  const cheekSvg = CHEEK_SHAPES[face.cheeks];
  const accessorySvg = ACCESSORY_SHAPES[face.accessory];

  const showEyebrows = detailLevel === 'standard' || detailLevel === 'full';
  const showMainMouth = detailLevel !== 'minimal' && showMouth;
  const showCheeks = detailLevel === 'full';
  const showAccessories = detailLevel === 'full';
  const hasGlasses = face.accessory === 'glasses' || face.accessory === 'sunglasses';
  const showEyes = !(showAccessories && hasGlasses);
  const glassesActive = showAccessories && hasGlasses;

  const eyeWidth = 60;
  const eyebrowWidth = 55;
  const mouthWidth = 35;
  const cheekWidth = 65;
  const accessoryWidth = 66;

  const eyeX = (100 - eyeWidth) / 2;
  const eyeY = 37;
  const eyebrowX = (100 - eyebrowWidth) / 2;
  const eyebrowY = glassesActive ? 24 : 21.5;
  const mouthX = (100 - mouthWidth) / 2;
  const mouthY = glassesActive ? 61 : 58;
  const cheekX = (100 - cheekWidth) / 2;
  const cheekY = 72;
  const accessoryX = (100 - accessoryWidth) / 2;
  const accessoryY = 36;

  const offsetMagnitude = 2;
  const offsetX = data.rotation.y * offsetMagnitude;
  const offsetY = -data.rotation.x * offsetMagnitude;

  const svgFill = '#111111';
  const svgStroke = '#111111';

  const eyesAnimation = has.eyeWander
    ? has.entrance
      ? 'animation:kodama-entrance-eyes 0.3s ease-out 0.2s both, kodama-eye-wander 8s ease-in-out 0.5s infinite;'
      : 'animation:kodama-eye-wander 8s ease-in-out infinite;'
    : has.entrance
      ? 'animation:kodama-entrance-eyes 0.3s ease-out 0.2s both;'
      : '';

  const eyeBlinkStyle = has.blink
    ? `animation:kodama-blink ${toFixed(blinkDuration)}s ease-in-out ${toFixed(
        blinkDelay
      )}s infinite;transform-origin:center center;`
    : '';

  const faceBody = [
    showEyebrows && eyebrowSvg
      ? withTransform(
          eyebrowX,
          eyebrowY,
          renderShape(
            eyebrowSvg,
            eyebrowWidth,
            svgFill,
            svgStroke,
            has.eyebrowBounce ? 'animation:kodama-eyebrow-bounce 4s ease-in-out infinite;' : ''
          )
        )
      : '',
    showEyes
      ? withTransform(
          eyeX,
          eyeY,
          renderShape(eyeSvg, eyeWidth, svgFill, svgStroke, eyeBlinkStyle),
          eyesAnimation
        )
      : '',
    showAccessories && accessorySvg
      ? withTransform(accessoryX, accessoryY, renderShape(accessorySvg, accessoryWidth, svgFill, svgStroke))
      : '',
    showMainMouth ? withTransform(mouthX, mouthY, renderShape(mouthSvg, mouthWidth, svgFill, svgStroke)) : '',
    showCheeks && cheekSvg
      ? withTransform(cheekX, cheekY, renderShape(cheekSvg, cheekWidth, '#FF9EBB', '#FF9EBB'))
      : '',
  ].join('');

  const gradientId = `kodama-g-${h.toString(36)}`;

  const defs =
    variant === 'gradient'
      ? `<defs>
          <radialGradient id="${gradientId}" cx="40%" cy="40%" r="80%">
            <stop offset="0%" stop-color="${gradient.from}" />
            <stop offset="100%" stop-color="${gradient.to}" />
          </radialGradient>
          <radialGradient id="${gradientId}-shine" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.15)" />
            <stop offset="60%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>`
      : '';

  const rootAnimation = has.entrance ? 'animation:kodama-entrance-scale 0.4s ease-out forwards;' : '';
  const swayStyle = has.sway ? 'animation:kodama-sway 5s ease-in-out infinite;' : '';
  const floatStyle = has.float ? 'animation:kodama-float 3s ease-in-out infinite;' : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"${styleAttr(
    rootAnimation
  )}>
    <style>${SVG_KEYFRAMES}</style>
    ${defs}
    <circle cx="50" cy="50" r="50" fill="${variant === 'gradient' ? `url(#${gradientId})` : gradient.from}" />
    ${variant === 'gradient' ? `<circle cx="50" cy="50" r="50" fill="url(#${gradientId}-shine)" />` : ''}
    <g${styleAttr(swayStyle)}>
      <g transform="translate(${toFixed(offsetX)} ${toFixed(offsetY)})">
        <g${styleAttr(floatStyle)}>${faceBody}</g>
      </g>
    </g>
  </svg>`;

  return {
    svg,
    data: {
      ...data,
      face,
    },
    face,
    rotation: data.rotation,
    gradient,
    detailLevel,
  };
}
