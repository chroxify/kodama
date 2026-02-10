import type { Animation, DetailLevel, GradientPair, Mood, Variant } from 'kodama-id';
import { createKodama } from 'kodama-id';

const VALID_VARIANTS: ReadonlySet<string> = new Set(['gradient', 'solid']);
const VALID_MOODS: ReadonlySet<string> = new Set(['happy', 'surprised', 'sleepy', 'cool', 'cheeky']);
const VALID_DETAILS: ReadonlySet<string> = new Set(['minimal', 'basic', 'standard', 'full']);
const VALID_ANIMATIONS: ReadonlySet<string> = new Set([
  'blink',
  'float',
  'entrance',
  'sway',
  'eyeWander',
  'eyebrowBounce',
]);

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

    // Parse & validate params
    const p = url.searchParams;
    const size = Math.min(Math.max(Number(p.get('size')) || 128, 16), 512);
    const variant = VALID_VARIANTS.has(p.get('variant') ?? '') ? (p.get('variant') as Variant) : 'gradient';
    const mood = VALID_MOODS.has(p.get('mood') ?? '') ? (p.get('mood') as Mood) : undefined;
    const detailLevel = VALID_DETAILS.has(p.get('detailLevel') ?? '')
      ? (p.get('detailLevel') as DetailLevel)
      : undefined;
    const showMouth = p.get('showMouth') !== 'false';
    const animations = p
      .get('animations')
      ?.split(',')
      .filter((a) => VALID_ANIMATIONS.has(a)) as Animation[] | undefined;

    // Parse gradients: ?gradients=E8D5F5-C7A4E0,FFE0D0-FFB899
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

    const etag = `"${fnv1a(`${name}:${size}:${variant}:${mood ?? ''}:${detailLevel ?? ''}:${showMouth}:${animations?.join(',') ?? ''}:${gradientsParam ?? ''}`).toString(36)}"`;

    if (request.headers.get('if-none-match') === etag) {
      return new Response(null, { status: 304, headers: CACHE_HEADERS });
    }

    const { svg } = createKodama({
      name,
      size,
      variant,
      mood,
      detailLevel,
      showMouth,
      animations,
      gradients,
    });

    const response = new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
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
