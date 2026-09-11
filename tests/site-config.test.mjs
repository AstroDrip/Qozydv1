import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSiteConfig } from '../lib/site-config.ts';

test('production uses the canonical origin without a trailing path', () => {
  const site = resolveSiteConfig({ SITE_URL: 'https://qozyd.example/', VERCEL_ENV: 'production' });
  assert.equal(site.url, 'https://qozyd.example');
  assert.equal(site.indexable, true);
});

test('preview deployments cannot be indexed even with a public canonical origin', () => {
  const site = resolveSiteConfig({ SITE_URL: 'https://qozyd.example', VERCEL_ENV: 'preview' });
  assert.equal(site.indexable, false);
});

test('unconfigured local builds do not advertise a fictitious public domain', () => {
  const site = resolveSiteConfig({});
  assert.equal(site.url, 'http://localhost:3000');
  assert.equal(site.indexable, false);
});

test('production stays non-indexable until an explicit public site URL is configured', () => {
  const site = resolveSiteConfig({ VERCEL_PROJECT_PRODUCTION_URL: 'qozyd.example', VERCEL_URL: 'preview.example', VERCEL_ENV: 'production' });
  assert.equal(site.url, 'http://localhost:3000');
  assert.equal(site.indexable, false);
});

test('invalid origins and unsafe Instagram URLs are rejected', () => {
  for (const value of ['javascript:alert(1)', 'https://user:password@example.com', 'https://example.com/path', 'https://example.com?x=1']) {
    assert.throws(() => resolveSiteConfig({ SITE_URL:value }));
  }
  assert.throws(() => resolveSiteConfig({ INSTAGRAM_URL:'https://instagram.com.attacker.example/qozyd' }));
});

test('Instagram accepts only a HTTPS profile URL and normalizes it', () => {
  const site = resolveSiteConfig({ INSTAGRAM_URL:'https://www.instagram.com/qozyd_studio/?igsh=tracking' });
  assert.equal(site.instagram, 'https://www.instagram.com/qozyd_studio/');
});

test('the configured launch Instagram profile is available by default', () => {
  assert.equal(resolveSiteConfig({}).instagram, 'https://www.instagram.com/qozyd.co/');
});
