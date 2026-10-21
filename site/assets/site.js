const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)');
let savedTheme;
try {
  savedTheme = localStorage.getItem('axot-theme');
} catch {
  // Storage can be disabled; the theme still works for this visit.
}

function setTheme(theme) {
  root.dataset.theme = theme;
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }
}

setTheme(['light', 'dark'].includes(savedTheme) ? savedTheme : preferredTheme.matches ? 'dark' : 'light');
if (themeToggle) {
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(savedTheme);
    try {
      localStorage.setItem('axot-theme', savedTheme);
    } catch {
      // Storage can be disabled; keep the in-memory preference.
    }
  });
}
preferredTheme.addEventListener('change', event => {
  if (!savedTheme) setTheme(event.matches ? 'dark' : 'light');
});

const filters = document.querySelector('.archive-filters');
if (filters) {
  const rows = [...document.querySelectorAll('.post-row')];
  const status = document.querySelector('.filter-status');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    for (const filter of filters.querySelectorAll('button')) {
      filter.setAttribute('aria-pressed', String(filter === button));
    }
    let visible = 0;
    for (const row of rows) {
      row.hidden = button.dataset.filter !== 'all' && row.dataset.topic !== button.dataset.filter;
      if (!row.hidden) visible++;
    }
    status.textContent = `${visible} ${visible === 1 ? 'article' : 'articles'} shown.`;
  });
}

for (const block of document.querySelectorAll('.prose pre')) {
  block.tabIndex = 0;
  block.setAttribute('aria-label', 'Code example; scroll horizontally to read long lines');
}
