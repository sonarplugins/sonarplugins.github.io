# SonarPlugins

An independent, community-maintained SonarQube plugin index, published with Jekyll at [www.sonarplugins.com](https://www.sonarplugins.com).

## Run locally

Install Jekyll and the `jekyll-sitemap` and `jekyll-seo-tag` gems, then run:

```sh
jekyll serve
```

To check the generated site without starting a server:

```sh
jekyll build --strict_front_matter
```

## Content and presentation

- `_posts/*.markdown` is the source of plugin metadata. Keep the existing filenames to preserve public URLs. Quote YAML values containing `: `.
- `_layouts/base.html` owns the shared document, navigation and footer. Home, search and plugin layouts extend it.
- `_includes/plugin_row.html` renders each catalog entry; `_includes/portfolio_grid.html` renders the catalog and its filters.
- `_includes/css/main.css` provides the responsive visual system, compiled into `/style.css` by Jekyll.
- `js/search.js` filters server-rendered rows by text, exact category and license, and sorts by update date or name. URL parameters (`query`, `category`, `license`, `sort`) preserve shareable searches. The full catalog remains available without JavaScript.
- Search covers titles, descriptions, details, organizations, developers, categories and licenses. Licenses containing `commercial` (case insensitive) and `SonarSource` are grouped as commercial; all other license values remain under “Other licenses”.
- The active layouts do not require Bootstrap, jQuery or Lunr. Legacy theme assets remain for reference.
- Contact is handled by Formspree; plugin comments use the configured Disqus shortname.

The design uses an independent SonarPlugins wordmark with blue accents and editorial typography. It does not imply affiliation with SonarSource.
