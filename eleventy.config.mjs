export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'site/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2': 'assets/fonts/manrope-latin.woff2',
    'node_modules/@fontsource-variable/manrope/LICENSE': 'assets/fonts/OFL.txt',
    'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2': 'assets/fonts/jetbrains-mono-latin.woff2',
    'node_modules/@fontsource/jetbrains-mono/LICENSE': 'assets/fonts/JetBrains-Mono-OFL.txt',
  });
  eleventyConfig.addWatchTarget('source/_posts');
  eleventyConfig.addWatchTarget('lib');
  eleventyConfig.setServerOptions({ showAllHosts: false });
  eleventyConfig.addFilter('xml', value => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&apos;'));
  return {
    dir: { input: 'site', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
  };
}
