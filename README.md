# amzixz.github.io

Personal site for **AmziXz** — a static, dependency-free site served straight from
this repository by GitHub Pages at <https://amzixz.github.io>.

## Structure

```
index.html      Home — hero, socials, TikTok + Discord embeds, support
about.html      About
projects.html   What I do
contact.html    Contact details, socials, FAQ
uses.html       Gear and software
404.html        Not-found page
serve.py        Local preview server (mimics Pages URL handling)
assets/
  style.css     The entire stylesheet — design tokens live in :root
  logo.png      Logo + favicon
```

There is no build step. Edit the HTML/CSS and push to `main`; Pages redeploys.

## URLs

Pages serves **extensionless** URLs: `/about` resolves to `about.html`
automatically. Every internal link uses that form, root-absolute:

```html
<a href="/about">About</a>          <!-- not about.html, not ./about -->
<link rel="stylesheet" href="/assets/style.css" />
```

Keep new links in that shape, and point `canonical` / `og:url` at the
extensionless URL so search engines index one address per page.

The `.html` files are still the real files on disk — Pages does the mapping, so
nothing needs renaming or moving into directories.

## Local preview

```bash
python serve.py        # http://localhost:8000, or `python serve.py 3000`
```

**Do not open the files directly.** Under `file://`:

- root-absolute paths like `/assets/style.css` resolve against your `C:` drive,
  so no CSS loads;
- extensionless links have no server to resolve them, so navigation 404s;
- the TikTok and Discord embeds refuse to load, because `file://` pages are
  treated as unique origins with no host.

`serve.py` exists because Python's built-in `http.server` does not resolve
`/about` to `about.html`, so plain `python -m http.server` would 404 on every
link even though the deployed site works.

## Conventions

- **Design tokens** are CSS custom properties in `:root`, with a
  `prefers-color-scheme: dark` override block. Change colours there, not inline.
- **Motion** uses the shared `--ease-out` / `--dur-*` variables. UI transitions
  stay under ~300ms; hover effects are gated behind
  `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.
- **Accessibility**: every page has a skip link, a `:focus-visible` ring, and
  `aria-current="page"` on the active nav item. Keep those when adding pages.
- **Adding a page**: copy an existing page's `<head>` block and update `<title>`,
  `description`, `canonical`, and the `og:` tags. Add the link to both the header
  nav and the footer nav.

## Notes

- Anything committed here is publicly served. `graphify-out/` is gitignored for
  that reason.
- Third-party embeds (TikTok `embed.js`, the Discord widget, Buy Me a Coffee)
  are commonly blocked by Brave Shields and uBlock. That is expected and not a
  bug in the page — test with shields down before investigating.
