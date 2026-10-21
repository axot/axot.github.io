import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const output = new URL('../_site/', import.meta.url);

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function targetExists(path) {
  const target = new URL(`.${path}`, output);
  return existsSync(target) || existsSync(new URL(`.${path.replace(/\/$/, '')}/index.html`, output));
}

test('every generated local navigation and asset reference resolves', () => {
  assert.ok(existsSync(output), 'Run npm run build before npm test');
  for (const file of files(output.pathname).filter(file => file.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const [, attribute, url] of html.matchAll(/\b(href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      assert.ok(targetExists(url), `${attribute}="${url}" is missing in ${file}`);
    }
    assert.doesNotMatch(html, /(?:src|href)="(?:http:)?\/\/(?:fonts|ajax|platform|apis)\./);
    assert.doesNotMatch(html, /\{%|\{\{/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one main heading in ${file}`);
    assert.match(html, /<main id="main">/);
    assert.match(html, /class="skip-link"/);
  }
});

test('CSS font URLs are local and available', () => {
  const css = readFileSync(new URL('assets/site.css', output), 'utf8');
  for (const [, path] of css.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g)) {
    assert.ok(targetExists(path), `Missing stylesheet asset: ${path}`);
  }
  assert.match(css, /prefers-reduced-motion/);
});

test('code uses a locally hosted monospace font without ligatures', () => {
  const css = readFileSync(new URL('assets/site.css', output), 'utf8');
  assert.match(css, /font-family: 'JetBrains Mono';/);
  assert.match(css, /--font-mono: 'JetBrains Mono',/);
  assert.match(css, /\.prose code \{ font-family: var\(--font-mono\);/);
  assert.match(css, /font-variant-ligatures: none;/);
  assert.ok(targetExists('/assets/fonts/jetbrains-mono-latin.woff2'));
});

test('the feed includes each original article and valid XML escaping', () => {
  const feed = readFileSync(new URL('atom.xml', output), 'utf8');
  assert.equal((feed.match(/<entry>/g) || []).length, 3);
  assert.match(feed, /<updated>2012-04-30T18:50:50\.000Z<\/updated>/);
  assert.doesNotMatch(feed, /&(?!amp;|lt;|gt;|quot;|apos;)/);
});

test('homepage content is readable without client-side JavaScript', () => {
  const homepage = readFileSync(new URL('index.html', output), 'utf8');
  assert.equal((homepage.match(/class="post-row"/g) || []).length, 3);
  assert.match(homepage, /Notes from<br>under the hood\./);
  assert.match(homepage, /href="#writing"/);
  assert.doesNotMatch(homepage, /jquery|modernizr|gravatar/);
});
