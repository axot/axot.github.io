# axot’s notebook

A small, static personal website about reverse engineering, networks, and software. Built with [Eleventy](https://www.11ty.dev/), Nunjucks templates, plain CSS, and a little browser JavaScript. No Ruby, Compass, jQuery, or client-side framework is needed for the current site.

## Run it locally

Use Node.js 22 or newer.

```sh
cd ~/dev/axot.github.io
npm ci
npm run dev
```

Open <http://localhost:8080>. Eleventy rebuilds when a template, stylesheet, or article changes.

```sh
npm run build   # Generate the static website in _site/
npm run check   # Build, then run all regression tests
```

`_site/` and `node_modules/` are generated and ignored by Git. Do not edit them.

## How to read this code

Start with these files, in this order:

| File | What it controls |
| --- | --- |
| `site/index.njk` | The homepage: introduction, byte illustration, featured article, writing index, and about section. |
| `site/_includes/base.njk` | Shared HTML document, metadata, navigation, and footer. Every page uses it. |
| `site/assets/site.css` | All active styles. Color tokens are at the top; components follow; responsive and accessibility rules are at the bottom. |
| `site/assets/site.js` | Only browser interactions: light/dark preference, archive topic filters, and keyboard-focusable code blocks. |
| `site/_data/site.json` | Site title, description, public URL, and social links. |
| `site/_data/posts.mjs` | Loads the original articles through the content adapter. |
| `lib/content.mjs` | Reads the old WordPress/Octopress front matter, preserves article URLs and dates, converts legacy formatting, and highlights code at build time. |
| `site/posts.njk` | Article layout. Eleventy renders this once per article. |
| `site/archive.njk` | The searchable-by-topic writing archive. |
| `eleventy.config.mjs` | Template directories, local font/asset copying, watch targets, and XML escaping. |
| `test/` | Content migration and generated-page regression tests. |

The data path is:

```text
source/_posts/*.markdown
        │
        ▼
lib/content.mjs → site/_data/posts.mjs
        │
        ▼
site/*.njk + site/_includes/*.njk
        │
        ▼
_site/ (generated HTML, CSS, JavaScript, fonts, and feeds)
```

`.njk` files are HTML with Nunjucks template expressions:

- `{{ post.title }}` inserts a value, escaped by default.
- `{% for post in posts %} … {% endfor %}` repeats markup.
- `{% include 'post-list.njk' %}` reuses a component.
- The block between `---` markers at the top configures the layout and output URL.

Article HTML is marked `safe` only after being rendered from the repository’s trusted, authored content. This is not an untrusted-content publishing service.

## Change the homepage

Edit `site/index.njk`. The featured write-up is selected by its stable slug in `site/_data/featured.mjs`, currently the 2011 “Can you crack it?” article. Topic pages and archive filters are generated from `site/_data/topics.mjs`, so new articles can share a category without creating duplicate output paths. Its byte-map illustration is generated from the first 160 bytes of that article’s code sample; it is not a randomly generated decoration.

Change colors in the CSS custom properties at the top of `site/assets/site.css`. The light and dark palettes share the same property names. The body font is Manrope, and code uses JetBrains Mono with ligatures disabled to preserve fixed-width alignment. Both are copied from pinned font packages into `_site/assets/fonts/` during the build; visitors do not contact Google Fonts.

## Edit or add an article

The original articles remain in `source/_posts/`. Edit those Markdown files, not the generated HTML.

New filenames follow the existing convention:

```text
2026-10-22-my-new-note.markdown
```

A normal new article needs only:

```yaml
---
title: My new note
date: 2026-10-22 12:00:00 +0900
categories:
  - Reverse Engineering
tags:
  - Debugging
---
```

Then write standard Markdown with fenced code blocks. Add a language after the opening fence, such as `bash`, `c`, `js`, or `asm`, to enable syntax highlighting. Highlight.js runs only during the build; light/dark syntax colors are controlled by the `--syntax-*` tokens in `site/assets/site.css`. Plain-text and unknown language blocks remain safely escaped. The content adapter supports the three historical imports without changing their source files. Their existing `/blog/year/month/day/slug/` URLs remain the same.

Homepage-friendly titles and summaries for the historical posts live in the `summaries` object in `lib/content.mjs`. Article pages retain the original full titles.

## What was broken in the old site

The site previously used Octopress 2, with dependencies dating to Ruby 1.9 and Jekyll 0.12. That build system has been removed. The original pipeline compiled Sass with Compass before generating HTML with Jekyll. Its generated `source/stylesheets/screen.css` was ignored by Git, so serving the source tree directly could not work.

The live HTTPS website requested its Google Fonts stylesheets over HTTP, which modern browsers block as mixed content. The theme also relied on absolutely positioned left/right panels and a nested scrolling area, and referenced retired integrations such as Google Plus.

The articles were imported from WordPress and still contained `[code]`, `[frame]`, and multilingual `[tabs]` shortcodes, binary-encoded YAML dates, and a mixed Markdown/shortcode fence in the networking article. The current content adapter repairs those at build time, keeps all three language versions readable, and does not publish imported commenter identities.

Historical images hosted on `www.axot.org` are **not** present in this repository. They are represented as labeled links to their original sources rather than loaded as broken or mixed-content images. Historical external downloads and links are preserved, not verified or silently replaced. Every article warns that its commands and software versions are historical.

## Octopress removal

The old Sass themes, Ruby plugins and dependencies, HTML/Liquid templates, JavaScript widgets, Flash player, theme images, Travis configuration, and Rake deployment scripts have been deleted. Eleventy is the only site generator.

`source/` now contains only `source/_posts/`: the three original article files, preserved byte-for-byte. This is authored content, not an Octopress dependency. The adapter in `lib/content.mjs` reads those files directly and still supports their historical WordPress formatting.

The original Octopress MIT notice is retained in `THIRD_PARTY_NOTICES.md`. The removed code remains available in Git history; it is not required for building, previewing, or deploying the current site.

## Publishing

This redesign is local until it is committed and pushed. The repository’s GitHub Pages configuration currently uses the legacy branch-based build from `source`. That pipeline does not build Eleventy.

A Pages workflow is provided in `.github/workflows/pages.yml`. It runs checks and uploads only `_site/`, and deploys on a push to `source` or a manual dispatch from `source`. The historical templates and imported front matter are never included in the artifact.

Before the first release:

1. Review and merge the redesign into `source`.
2. In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions** rather than “Deploy from a branch.”
3. Run the workflow on `source` or push a change to that branch.

No Pages settings, remote branches, or deployments were changed during local development.

## Verification

`npm run check` verifies the original article URLs and dates, multilingual shortcode conversion, repaired code fences, exclusion of imported commenter identities, generated local links/assets, one primary heading and skip navigation per page, local font references, RSS entries, and content availability without JavaScript.

Browser verification covers the desktop and narrow-screen homepage, theme control, archive topic filtering, and article navigation. Tests do not claim that the 2011–2012 external resources still exist.
