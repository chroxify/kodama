import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('kodama API', () => {
  it('returns SVG for a name', async () => {
    const res = await SELF.fetch('https://example.com/alice');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/svg+xml; charset=utf-8');
    const body = await res.text();
    expect(body).toContain('<svg');
    expect(body).toContain('</svg>');
  });

  it('returns deterministic output', async () => {
    const a = await (await SELF.fetch('https://example.com/alice')).text();
    const b = await (await SELF.fetch('https://example.com/alice')).text();
    expect(a).toBe(b);
  });

  it('returns different SVG for different names', async () => {
    const a = await (await SELF.fetch('https://example.com/alice')).text();
    const b = await (await SELF.fetch('https://example.com/bob')).text();
    expect(a).not.toBe(b);
  });

  it('sets cache headers', async () => {
    const res = await SELF.fetch('https://example.com/alice');
    expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('cdn-cache-control')).toBe('max-age=31536000');
    expect(res.headers.get('etag')).toBeTruthy();
  });

  it('sets CORS header', async () => {
    const res = await SELF.fetch('https://example.com/alice');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('handles OPTIONS preflight', async () => {
    const res = await SELF.fetch('https://example.com/alice', { method: 'OPTIONS' });
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-methods')).toBe('GET');
  });

  it('returns 404 for empty path', async () => {
    const res = await SELF.fetch('https://example.com/');
    expect(res.status).toBe(404);
  });

  it('returns 405 for POST', async () => {
    const res = await SELF.fetch('https://example.com/alice', { method: 'POST' });
    expect(res.status).toBe(405);
  });

  it('applies mood param', async () => {
    const plain = await (await SELF.fetch('https://example.com/test')).text();
    const happy = await (await SELF.fetch('https://example.com/test?mood=happy')).text();
    expect(plain).not.toBe(happy);
  });

  it('applies variant param', async () => {
    const gradient = await (await SELF.fetch('https://example.com/test?variant=gradient')).text();
    const solid = await (await SELF.fetch('https://example.com/test?variant=solid')).text();
    expect(gradient).not.toBe(solid);
  });

  it('ignores invalid params gracefully', async () => {
    const res = await SELF.fetch('https://example.com/alice?mood=invalid&variant=nope&detailLevel=xxx');
    expect(res.status).toBe(200);
    // Falls back to defaults — same as no params
    const plain = await (await SELF.fetch('https://example.com/alice')).text();
    expect(await res.text()).toBe(plain);
  });
});
