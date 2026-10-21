import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPosts, renderArticle } from '../lib/content.mjs';

const posts = loadPosts();

test('loads the original articles in date order and preserves all permalinks', () => {
  assert.deepEqual(posts.map(post => post.url), [
    '/blog/2012/05/01/how-to-resolve-_rb_digest_md5_finish-error-in-ruby-1-9-3/',
    '/blog/2011/12/05/can-you-crack-it-solution/',
    '/blog/2011/06/27/how-to-pass-through-new-state-packets-on-wan-interface-netgear-wnr854t/',
  ]);
  assert.equal(posts[0].date.toISOString(), '2012-04-30T18:50:50.000Z');
  assert.equal(posts[0].displayDate, 'May 1, 2012');
});

test('turns WordPress shortcodes into readable code and language sections', () => {
  const challenge = posts.find(post => post.slug === 'can-you-crack-it-solution');
  assert.equal(challenge.languages.length, 3);
  assert.equal(challenge.languages[1].lang, 'zh-Hans');
  assert.equal(challenge.languages[2].lang, 'ja');
  assert.match(challenge.html, /<pre><code class="language-c">/);
  assert.match(challenge.html.replace(/<[^>]+>/g, ''), /#include &lt;stdio\.h&gt;/);
  assert.match(challenge.html.replace(/<[^>]+>/g, ''), /pIns-&gt;opcode/);
  assert.doesNotMatch(challenge.html, /\[(?:\/?code|\/?tab|\/?tabs|\/?frame)\b/);
  assert.doesNotMatch(challenge.html, /<img[^>]*src="http:/);
  assert.match(challenge.html, /Historical image/);
  assert.equal(challenge.bytes.length, 160);
});

test('repairs the mixed Markdown and WordPress fences in the network article', () => {
  const network = posts.find(post => post.category === 'Network');
  assert.equal((network.html.match(/<pre>/g) || []).length, 3);
  assert.match(network.html, /<p>Change the number\(8, 3\) in your case\.\n[^<]*<\/p>/);
  assert.match(network.html, /<p>now, test the connection/);
  assert.doesNotMatch(network.html, /\[\/?code/);
});

test('highlights fenced code while preserving escaped code text', () => {
  const html = renderArticle('```c\nif (a < b) { puts("ok"); }\n```');
  assert.match(html, /class="hljs-keyword">if<\/span>/);
  assert.match(html, /class="hljs-string">&quot;ok&quot;<\/span>/);
  assert.match(html, /a &lt; b/);
  assert.doesNotMatch(html, /a < b/);
});

test('highlights legacy C, JavaScript, shell, and assembly examples at build time', () => {
  const challenge = posts.find(post => post.slug === 'can-you-crack-it-solution');
  assert.match(challenge.html, /class="hljs-keyword"/);
  assert.match(challenge.html, /class="hljs-string"/);
  assert.match(challenge.html, /class="hljs-number"/);
  assert.match(challenge.html, /language-asm/);
  const ruby = posts.find(post => post.topic === 'Ruby & macOS');
  assert.match(ruby.html, /class="hljs-comment"/);
});

test('retains ordinary new images instead of treating them as missing historical assets', () => {
  assert.match(renderArticle('<img src="/assets/new-diagram.svg" alt="Packet path">'), /<img src="\/assets\/new-diagram.svg"/);
});

test('does not publish imported commenter identities in the post data', () => {
  for (const post of posts) {
    assert.equal(post.comments, undefined);
    assert.equal(post.author_email, undefined);
    assert.doesNotMatch(post.html, /shellbomber@gmail|support@sakura|kohyzsc123/);
  }
});
