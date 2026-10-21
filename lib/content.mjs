import { readFileSync, readdirSync } from 'node:fs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import javascript from 'highlight.js/lib/languages/javascript';
import x86asm from 'highlight.js/lib/languages/x86asm';
import { parse } from 'yaml';

for (const [name, grammar] of Object.entries({ bash, c, javascript, x86asm })) {
  hljs.registerLanguage(name, grammar);
}
const aliases = { sh: 'bash', shell: 'bash', js: 'javascript', asm: 'x86asm', masm: 'x86asm' };
const markdown = new MarkdownIt({ html: true, highlight: highlightCode });

function highlightCode(code, language) {
  const resolved = aliases[language] || language;
  return hljs.getLanguage(resolved)
    ? hljs.highlight(code, { language: resolved, ignoreIllegals: true }).value
    : markdown.utils.escapeHtml(code);
}
const postsDirectory = new URL('../source/_posts/', import.meta.url);
const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
});

const summaries = {
  'how-to-resolve-_rb_digest_md5_finish-error-in-ruby-1-9-3': {
    title: 'Fixing Ruby’s missing MD5 symbol',
    topic: 'Ruby & macOS',
    summary: 'Tracing a broken Ruby 1.9.x build back to its digest extensions, and patching the missing source files.',
  },
  'can-you-crack-it-solution': {
    title: 'Can you crack it?',
    topic: 'Reverse engineering',
    summary: 'One byte puzzle, three stages. A walkthrough of GCHQ’s 2011 challenge, from raw machine code to a custom virtual machine.',
  },
  'how-to-pass-through-new-state-packets-on-wan-interface-netgear-wnr854t': {
    title: 'When the route works, but the packets don’t',
    topic: 'Networks & routers',
    summary: 'Following the packet path through a Netgear WNR854T and finding the firewall rule that drops new connections.',
  },
};

function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name) => {
    if (name.startsWith('#x')) return String.fromCodePoint(parseInt(name.slice(2), 16));
    if (name.startsWith('#')) return String.fromCodePoint(Number(name.slice(1)));
    return named[name.toLowerCase()] ?? entity;
  });
}

function cleanCode(text) {
  return decodeEntities(text.replace(/<br\s*\/?>/gi, '').replace(/<\/?p\b[^>]*>/gi, '')).trim();
}

export function renderArticle(body) {
  let input = body.replace(/\[\/?frame\b[^\]]*\]/g, '');
  const codeBlocks = [];

  if (/<p\b/i.test(input)) {
    input = input.replace(/\[code(?: lang="([\w+-]+)")?\]([\s\S]*?)\[\/code\]/g, (_, language, code) => {
      const id = codeBlocks.length;
      codeBlocks.push(`<pre><code class="language-${language || 'text'}">${highlightCode(cleanCode(code), language || 'text')}\n</code></pre>`);
      return `\n\n<div data-code-block="${id}"></div>\n\n`;
    });
    input = input.replace(/<\/?p\b[^>]*>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n');
    input = input.replace(/<strong>((?:Part \d|第\d部分)[^<]*)<\/strong>/g, '<h3>$1</h3>');
  } else {
    input = input.replace(/\[\/code\]/g, '```\n').replace(/\[code lang="([\w+-]+)"\]/g, '```$1');
  }

  input = input.replace(/<img\b[^>]*>/gi, image => {
    if (!/src="http:\/\/www\.axot\.org\//i.test(image)) return image;
    const title = image.match(/title="([^"]+)"/)?.[1] || 'original illustration';
    return `<span class="historical-image">Historical image: ${markdown.utils.escapeHtml(title)} (original source)</span>`;
  });
  input = input.replace(/\[\/?tabs?\b[^\]]*\]/g, '');
  let html = markdown.render(input);
  html = html.replace(/<div data-code-block="(\d+)"><\/div>/g, (_, id) => codeBlocks[Number(id)]);
  return html;
}

function readPost(filename) {
  const source = readFileSync(new URL(filename, postsDirectory), 'utf8');
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!frontMatter) throw new Error(`Missing front matter in ${filename}`);

  // WordPress exported dates as YAML binary scalars and strings with empty tags.
  const metadata = parse(frontMatter[1]
    .replace(/^comments:[\s\S]*$/m, '')
    .replace(/!binary \|-\r?\n\s+([A-Za-z0-9+/=]+)/g, (_, value) => JSON.stringify(Buffer.from(value, 'base64').toString('utf8')))
    .replace(/: ! (?=["'])/g, ': '));
  if (metadata.published === false) return null;

  const [, year, month, day, slug] = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.markdown$/);
  const date = new Date(metadata.date || `${year}-${month}-${day}T12:00:00+09:00`);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid date in ${filename}`);
  const body = frontMatter[2];
  const languages = [...body.matchAll(/\[tab title="([^"]+)"\]([\s\S]*?)\[\/tab\]/g)].map((match, index) => ({
    name: match[1],
    id: ['english', 'chinese', 'japanese'][index] || `language-${index}`,
    lang: { English: 'en', '简体中文': 'zh-Hans', '日本語': 'ja' }[match[1]] || 'en',
    html: renderArticle(match[2]),
  }));
  const byteSource = body.match(/static unsigned char shellcode\[\] = \{([\s\S]*?)\};/)?.[1] || '';
  const bytes = [...byteSource.matchAll(/0x([\da-f]{2})/gi)].slice(0, 160).map(match => ({
    value: match[1].toUpperCase(),
    tone: Math.floor(parseInt(match[1], 16) / 52),
  }));
  const summary = summaries[slug] || {
    title: metadata.title.trim(), topic: metadata.categories?.[0] || 'Notes',
    summary: String(metadata.excerpt || '').trim(),
  };

  return {
    slug, date, year, displayDate: dateFormat.format(date),
    isoDate: `${year}-${month}-${day}`,
    url: `/blog/${year}/${month}/${day}/${slug}/`,
    originalTitle: metadata.title.trim(),
    category: metadata.categories?.[0] || 'Notes',
    categorySlug: (metadata.categories?.[0] || 'Notes').toLowerCase().replace(/\s+/g, '-'),
    tags: metadata.tags || [],
    ...summary,
    languages, bytes,
    html: languages.length ? languages.map(language => `<section id="${language.id}" lang="${language.lang}"><h2>${language.name}</h2>${language.html}</section>`).join('\n') : renderArticle(body),
  };
}

export function loadPosts() {
  return readdirSync(postsDirectory).filter(filename => filename.endsWith('.markdown'))
    .map(readPost).filter(Boolean).sort((a, b) => b.date - a.date);
}
