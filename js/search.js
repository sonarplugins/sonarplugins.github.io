/* Search the server-rendered catalog without downloading or rebuilding an index. */
(() => {
  'use strict';
  const form = document.getElementById('plugin-search');
  const results = document.getElementById('search-results');
  if (!form || !results) return;

  const input = document.getElementById('search-box');
  const filters = document.getElementById('catalog-filters');
  const category = document.getElementById('category-filter');
  const license = document.getElementById('license-filter');
  const sort = document.getElementById('sort-order');
  const count = document.getElementById('result-count');
  const empty = document.getElementById('no-results');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const entries = Array.from(results.querySelectorAll('.plugin-row'), row => ({
    row,
    text: normalize(row.dataset.search),
    title: row.dataset.title,
    date: row.dataset.date
  }));

  function readLocation() {
    const params = new URLSearchParams(window.location.search);
    input.value = params.get('query') || '';
    for (const [control, key, fallback] of [[category, 'category', ''], [license, 'license', ''], [sort, 'sort', 'updated']]) {
      const value = params.get(key) || fallback;
      control.value = Array.from(control.options).some(option => option.value === value) ? value : fallback;
    }
  }

  function writeLocation() {
    const url = new URL(window.location.href);
    for (const [key, value] of [['query', input.value.trim()], ['category', category.value], ['license', license.value], ['sort', sort.value === 'updated' ? '' : sort.value]]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }

  function render(updateUrl = true) {
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    const ordered = entries.slice().sort((a, b) => sort.value === 'name'
      ? a.title.localeCompare(b.title)
      : b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
    const fragment = document.createDocumentFragment();
    let visible = 0;
    for (const entry of ordered) {
      const matches = terms.every(term => entry.text.includes(term))
        && (!category.value || entry.row.dataset.category === category.value)
        && (!license.value || entry.row.dataset.license === license.value);
      entry.row.hidden = !matches;
      if (matches) visible += 1;
      fragment.append(entry.row);
    }
    results.append(fragment);
    count.textContent = `${visible} ${visible === 1 ? 'plugin' : 'plugins'}${visible !== entries.length ? ` of ${entries.length}` : ''}`;
    empty.hidden = visible !== 0;
    if (updateUrl) writeLocation();
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
    document.getElementById('portfolio').scrollIntoView({ block: 'start' });
  });
  input.addEventListener('input', () => render());
  filters.addEventListener('submit', event => event.preventDefault());
  filters.addEventListener('change', () => render());
  document.getElementById('reset-filters').addEventListener('click', () => {
    input.value = '';
    category.value = '';
    license.value = '';
    sort.value = 'updated';
    render();
    input.focus();
  });
  window.addEventListener('popstate', () => { readLocation(); render(false); });
  readLocation();
  render(false);
  filters.hidden = false;
})();
