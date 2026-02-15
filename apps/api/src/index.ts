import type { GradientPair, KodamaShape } from 'kodama-id';
import { createKodama } from 'kodama-id';
import type {
  FacesAnimation,
  FacesBackgroundStyle,
  FacesDepth,
  FacesDetailLevel,
  FacesMood,
} from 'kodama-id/variants';
import { faces } from 'kodama-id/variants';
import { buildPureSvg, initResvg, renderPng } from './png';

const VALID_FORMATS: ReadonlySet<string> = new Set(['svg', 'png']);
const VALID_VARIANTS: ReadonlySet<string> = new Set(['faces']);
const VALID_BACKGROUNDS: ReadonlySet<string> = new Set(['gradient', 'solid']);
const VALID_MOODS: ReadonlySet<string> = new Set(['happy', 'surprised', 'sleepy', 'cool', 'cheeky']);
const VALID_DETAILS: ReadonlySet<string> = new Set(['minimal', 'basic', 'standard', 'full']);
const VALID_ANIMATIONS: ReadonlySet<string> = new Set([
  'blink',
  'float',
  'entrance',
  'sway',
  'eyeWander',
  'eyebrowBounce',
  'glance',
]);
const VALID_SHAPES: ReadonlySet<string> = new Set(['circle', 'squircle', 'square']);
const VALID_DEPTHS: ReadonlySet<string> = new Set(['none', 'subtle', 'medium', 'dramatic']);

const YEAR_IN_SECONDS = 31_536_000;
const CACHE_HEADERS = {
  'Cache-Control': `public, max-age=${YEAR_IN_SECONDS}, immutable`,
  'CDN-Cache-Control': `max-age=${YEAR_IN_SECONDS}`,
  'Access-Control-Allow-Origin': '*',
} as const;

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export default {
  async fetch(request, _env, ctx): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': String(YEAR_IN_SECONDS),
        },
      });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.slice(1));

    if (!name || name.includes('/')) {
      return new Response('Not Found', { status: 404 });
    }

    const p = url.searchParams;
    const format = VALID_FORMATS.has(p.get('format') ?? '') ? p.get('format')! : 'svg';
    const variantName = p.get('variant') ?? 'faces';

    if (!VALID_VARIANTS.has(variantName)) {
      return new Response('Unsupported variant', { status: 400 });
    }

    const size = Math.min(Math.max(Number(p.get('size')) || 128, 16), 512);
    const background = VALID_BACKGROUNDS.has(p.get('background') ?? '')
      ? (p.get('background') as FacesBackgroundStyle)
      : undefined;
    const mood = VALID_MOODS.has(p.get('mood') ?? '') ? (p.get('mood') as FacesMood) : undefined;
    const detailLevel = VALID_DETAILS.has(p.get('detailLevel') ?? '')
      ? (p.get('detailLevel') as FacesDetailLevel)
      : undefined;
    const animations = p
      .get('animations')
      ?.split(',')
      .filter((animation) => VALID_ANIMATIONS.has(animation)) as FacesAnimation[] | undefined;

    const shape = VALID_SHAPES.has(p.get('shape') ?? '') ? (p.get('shape') as KodamaShape) : undefined;
    const depth = VALID_DEPTHS.has(p.get('depth') ?? '') ? (p.get('depth') as FacesDepth) : undefined;

    let gradients: GradientPair[] | undefined;
    const gradientsParam = p.get('gradients');
    if (gradientsParam) {
      const pairs = gradientsParam
        .split(',')
        .map((pair) => {
          const [from, to] = pair.split('-');
          return from && to ? { from: `#${from}`, to: `#${to}` } : null;
        })
        .filter((g): g is GradientPair => g !== null);
      if (pairs.length > 0) gradients = pairs;
    }

    const etag = `"${fnv1a(
      `${name}:${size}:${format}:${variantName}:${shape ?? ''}:${background ?? ''}:${mood ?? ''}:${detailLevel ?? ''}:${depth ?? ''}:${animations?.join(',') ?? ''}:${
        gradientsParam ?? ''
      }`
    ).toString(36)}"`;

    if (request.headers.get('if-none-match') === etag) {
      return new Response(null, { status: 304, headers: CACHE_HEADERS });
    }

    const result = createKodama({
      name,
      size,
      shape,
      variant: faces,
      background,
      mood,
      detailLevel,
      depth,
      animations,
      gradients,
    });

    let body: string | Uint8Array;
    let contentType: string;

    if (format === 'png') {
      await initResvg();
      const { slots } = result;
      const hasGlasses = slots.accessory === 'glasses' || slots.accessory === 'sunglasses';
      const glassesActive = result.detailLevel === 'full' && hasGlasses;
      const pureSvg = buildPureSvg(result.svg, result.detailLevel, slots, glassesActive, size);
      body = renderPng(pureSvg, size);
      contentType = 'image/png';
    } else {
      body = result.svg;
      contentType = 'image/svg+xml; charset=utf-8';
    }

    const response = new Response(body, {
      headers: {
        'Content-Type': contentType,
        ETag: etag,
        ...CACHE_HEADERS,
      },
    });

    if (request.method === 'GET') {
      ctx.waitUntil(cache.put(request, response.clone()));
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
