import { initWasm, Resvg } from '@resvg/resvg-wasm';

// ── WASM init ────────────────────────────────────────────────────────────────

let initialized = false;
export async function initResvg() {
  if (!initialized) {
    const resvgWasm = (await import('../node_modules/@resvg/resvg-wasm/index_bg.wasm')).default;
    await initWasm(resvgWasm);
    initialized = true;
  }
}

// ── Detail visibility (same logic as kodama-id) ─────────────────────────────

const DETAIL_ORDER = ['minimal', 'basic', 'standard', 'full'];
const SLOT_MIN_DETAIL: Record<string, string> = {
  eyes: 'minimal',
  mouth: 'basic',
  eyebrows: 'standard',
  cheeks: 'full',
  accessory: 'full',
};

function canRenderSlot(slot: string, detail: string): boolean {
  return DETAIL_ORDER.indexOf(detail) >= DETAIL_ORDER.indexOf(SLOT_MIN_DETAIL[slot]);
}

// ── SVG surgery helpers ─────────────────────────────────────────────────────

function parseViewBox(svgStr: string): { w: number; h: number } {
  const m = svgStr.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : { w: 1, h: 1 };
}

function positionFeatureSvg(raw: string, x: number, y: number, w: number, h: number): string {
  return raw
    .replace(/<svg([^>]*?) style="[^"]*"/, '<svg$1')
    .replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible" `)
    .replaceAll('currentColor', '#000');
}

// ── Build pure SVG ──────────────────────────────────────────────────────────

export function buildPureSvg(
  svg: string,
  detailLevel: string,
  slots: { eyebrows: string; cheeks: string; accessory: string },
  glassesActive: boolean,
  size: number
): string {
  // 1. Extract structural pieces from the createKodama SVG
  const defs = svg.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? '';
  const clipGroup = svg.match(/<g clip-path="([^"]+)">/)?.[1] ?? '';
  const bgElements = svg.match(/<g clip-path[^>]*>([\s\S]*?)<foreignObject/)?.[1]?.trim() ?? '';

  // 2. Pull out all nested feature <svg> elements from the foreignObject HTML
  const foreign = svg.match(/<foreignObject[\s\S]*?<\/foreignObject>/)?.[0] ?? '';
  const featureRegex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[\s\S]*?<\/svg>/g;
  const rawFeatures = [...foreign.matchAll(featureRegex)].map((m) => m[0]);

  // 3. Map extracted SVGs to their feature role (order matches render.ts output)
  const showEyebrows = canRenderSlot('eyebrows', detailLevel) && slots.eyebrows !== 'none';
  const showMouth = canRenderSlot('mouth', detailLevel);
  const showCheeks = canRenderSlot('cheeks', detailLevel) && slots.cheeks !== 'none';

  let i = 0;
  const eyebrowSvg = showEyebrows ? rawFeatures[i++] : null;
  const eyeSvg = rawFeatures[i++]; // always present (eyes or accessory)
  const mouthSvg = showMouth ? rawFeatures[i++] : null;
  const cheekSvg = showCheeks ? rawFeatures[i++] : null;

  // 4. Compute vertical layout (flexbox column, justify-content: center, in 100×100 space)
  const WIDTHS: Record<string, number> = { eyebrow: 55, eye: 20, mouth: 35, accessory: 60 };
  const GAP_AFTER_BROW = glassesActive ? -2 : 4;
  const GAP_BEFORE_MOUTH = glassesActive ? 2 : 4;

  type LayoutItem = { raw: string; w: number; h: number; gapAfter: number };
  const items: LayoutItem[] = [];

  if (eyebrowSvg) {
    const d = parseViewBox(eyebrowSvg);
    const w = WIDTHS.eyebrow;
    items.push({ raw: eyebrowSvg, w, h: w * (d.h / d.w), gapAfter: GAP_AFTER_BROW });
  }
  if (eyeSvg) {
    const d = parseViewBox(eyeSvg);
    const w = glassesActive ? WIDTHS.accessory : WIDTHS.eye;
    items.push({ raw: eyeSvg, w, h: w * (d.h / d.w), gapAfter: GAP_BEFORE_MOUTH });
  }
  if (mouthSvg) {
    const d = parseViewBox(mouthSvg);
    const w = WIDTHS.mouth;
    items.push({ raw: mouthSvg, w, h: w * (d.h / d.w), gapAfter: 0 });
  }

  let featureH = 0;
  for (let j = 0; j < items.length; j++) {
    featureH += items[j].h + (j < items.length - 1 ? items[j].gapAfter : 0);
  }

  let y = (100 - featureH) / 2;
  let positioned = '';
  for (let j = 0; j < items.length; j++) {
    const it = items[j];
    positioned += positionFeatureSvg(it.raw, (100 - it.w) / 2, y, it.w, it.h);
    y += it.h + (j < items.length - 1 ? it.gapAfter : 0);
  }

  // Cheeks are absolutely positioned (bottom 18%, left 5%, width 90%)
  if (cheekSvg) {
    const d = parseViewBox(cheekSvg);
    const cw = 90;
    const ch = cw * (d.h / d.w);
    positioned += positionFeatureSvg(cheekSvg, 5, 100 - 18 - ch, cw, ch);
  }

  // 5. Compose pure SVG at requested size
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">`,
    defs,
    `<g clip-path="${clipGroup}">`,
    bgElements,
    positioned,
    '</g>',
    '</svg>',
  ].join('');
}

// ── Render to PNG ───────────────────────────────────────────────────────────

export function renderPng(pureSvg: string, size: number): Uint8Array {
  const resvg = new Resvg(pureSvg, {
    fitTo: { mode: 'width' as const, value: size },
  });
  const rendered = resvg.render();
  return rendered.asPng();
}
