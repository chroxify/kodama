import type { GradientPair, KodamaShape } from '../types';

// ── Shape elements ───────────────────────────────────────────────────────────

// Apple-style squircle with continuous curvature (no straight-to-curve seams).
// Based on the iOS icon superellipse algorithm with r1/r2 ratios.
// r1 = 0.0586 (bezier control-point inset), r2 = 0.44 (curve onset).
// Coordinates are for a 0-100 viewBox.
const SQUIRCLE_D =
  'M 0 44 C 0 5.86 5.86 0 44 0 L 56 0 C 94.14 0 100 5.86 100 44 L 100 56 C 100 94.14 94.14 100 56 100 L 44 100 C 5.86 100 0 94.14 0 56 Z';

function shapeClip(shape: KodamaShape): string {
  switch (shape) {
    case 'circle':
      return '<circle cx="50" cy="50" r="50"/>';
    case 'squircle':
      return `<path d="${SQUIRCLE_D}"/>`;
    case 'square':
      return '<rect x="0" y="0" width="100" height="100"/>';
  }
}

function shapeFill(shape: KodamaShape, fill: string): string {
  switch (shape) {
    case 'circle':
      return `<circle cx="50" cy="50" r="50" fill="${fill}"/>`;
    case 'squircle':
      return `<path d="${SQUIRCLE_D}" fill="${fill}"/>`;
    case 'square':
      return `<rect x="0" y="0" width="100" height="100" fill="${fill}"/>`;
  }
}

// ── Shell options ────────────────────────────────────────────────────────────

export type SvgShellOptions = {
  seed: number;
  shape: KodamaShape;
  background: 'gradient' | 'solid';
  gradient: GradientPair;
  content: string;
  keyframes?: string;
  svgStyle?: string;
  rootStyle?: string;
};

// ── Renderer ─────────────────────────────────────────────────────────────────

export function renderSvgShell(options: SvgShellOptions): string {
  const { seed, shape, background, gradient, content, keyframes, svgStyle, rootStyle } = options;

  const cid = `kodama-c-${seed.toString(36)}`;
  const gid = `kodama-g-${seed.toString(36)}`;

  // ── Defs ──

  const clipDef = `<clipPath id="${cid}">${shapeClip(shape)}</clipPath>`;

  const gradientDefs =
    background === 'gradient'
      ? `<radialGradient id="${gid}" cx="40%" cy="40%" r="85%"><stop offset="0%" stop-color="${gradient.from}"/><stop offset="100%" stop-color="${gradient.to}"/></radialGradient><radialGradient id="${gid}-s" cx="50%" cy="50%" r="100%"><stop offset="0%" stop-color="rgba(255,255,255,0.15)"/><stop offset="60%" stop-color="rgba(255,255,255,0)"/></radialGradient>`
      : '';

  // ── Background + shine ──

  const bgFill = background === 'gradient' ? `url(#${gid})` : gradient.from;
  const shine = background === 'gradient' ? shapeFill(shape, `url(#${gid}-s)`) : '';

  // ── Root div ──

  const baseRootStyle = 'width:100%;height:100%;position:relative;overflow:hidden';
  const rootDivStyle = rootStyle ? `${baseRootStyle};${rootStyle}` : baseRootStyle;

  // ── Compose ──

  const svgAttr = svgStyle ? ` style="${svgStyle}"` : '';
  const styleBlock = keyframes ? `<style>${keyframes}</style>` : '';

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%"${svgAttr}>`,
    styleBlock,
    `<defs>${clipDef}${gradientDefs}</defs>`,
    `<g clip-path="url(#${cid})">`,
    shapeFill(shape, bgFill),
    shine,
    `<foreignObject x="0" y="0" width="100" height="100">`,
    `<div xmlns="http://www.w3.org/1999/xhtml" style="${rootDivStyle}">`,
    content,
    `</div>`,
    `</foreignObject>`,
    `</g>`,
    `</svg>`,
  ].join('');
}
