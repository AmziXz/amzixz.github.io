# amzixz.github.io

Personal site for **AmziXz** — a static, dependency-free site served straight from
this repository by GitHub Pages at <https://amzixz.github.io>.

## Structure

```
index.html            Home — hero, socials, TikTok + Discord embeds, support
about.html            About
projects.html         What I do
contact.html          Contact details, socials, FAQ
uses.html             Gear and software
catch-the-baltic.html Event page
404.html              Not-found page
lv/                   Latvian versions of every page above except 404
serve.py              Local preview server (mimics Pages URL handling)
assets/
  style.css           The entire stylesheet — design tokens live in :root
  fonts.css           Self-hosted @font-face rules
  fonts/              woff2 files (latin + latin-ext; latin-ext = Latvian)
  lang.js             Remembers the EN/LV choice across pages
  menu.js             Mobile navigation menu
  logo.png            256px circular badge — header icon and favicon
  logo-512.png        512px — apple-touch-icon
  logo-source.png     Original 1254px master, not referenced by any page
  og-image.png        1200x630 share banner
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

## Languages

English lives at the root, Latvian under `/lv/`. Pages pair up one-to-one:
`/about` <-> `/lv/about`.

Language persists two ways, deliberately layered:

1. **Structurally.** Every link on an LV page points at another LV page, so once
   you are in Latvian you stay there. Works with JavaScript off, and it is what
   search engines follow.
2. **`assets/lang.js`.** Records the choice when the EN/LV switch is clicked,
   and on a later visit sends you to the version you picked. It reads the
   counterpart URL from the page's own `<link rel="alternate" hreflang>` rather
   than constructing it, so a page without a translation stays put.

**Adding a page:** create both versions, give each the `hreflang` pair pointing
at the other, and set the switch hrefs in the header. Miss the `hreflang` and
the switch still works, but the remembered preference will not follow.

## Cache busting

Everything in `/assets` is referenced with a `?v=N` query string:

```html
<link rel="stylesheet" href="/assets/style.css?v=2" />
```

GitHub Pages serves assets with `Cache-Control: max-age=600`, and browsers hold
images and stylesheets far longer than that. Without the version, editing
`style.css` or replacing `logo.png` leaves returning visitors on the old copy —
new HTML with stale CSS, which breaks the layout rather than just looking dated.

**After changing anything in `/assets`, bump the number in every page.** From
the repo root:

```bash
python -c "import glob,re,pathlib
for f in glob.glob('*.html')+glob.glob('lv/*.html'):
    p=pathlib.Path(f); p.write_text(re.sub(r'\?v=\d+','?v=3',p.read_text(encoding='utf-8')),encoding='utf-8')"
```

## Conventions

- **Design tokens** are CSS custom properties in `:root`, with a
  `prefers-color-scheme: dark` override block. Change colours there, not inline.
- **Motion** uses the shared `--ease-out` / `--dur-*` variables. UI transitions
  stay under ~300ms; hover effects are gated behind
  `@media (hover: hover) and (pointer: fine)` so they don't stick on touch.
- **Accessibility**: every page has a skip link, a `:focus-visible` ring, and
  `aria-current="page"` on the active nav item. Keep those when adding pages.
- **Header**: below 760px the nav links collapse behind the menu button; the
  language switch stays in the bar. The links are a plain `<ul>` that CSS hides
  at narrow widths, so they still work with JavaScript off.
- **Adding a page**: copy an existing page's `<head>` block and update `<title>`,
  `description`, `canonical`, and the `og:` tags. Add the link to both the header
  nav and the footer nav.

## Notes

- Anything committed here is publicly served. Keep local tooling output out of
  the repo.
- Third-party embeds (TikTok `embed.js`, the Discord widget, Buy Me a Coffee)
  are commonly blocked by Brave Shields and uBlock. That is expected and not a
  bug in the page — test with shields down before investigating.
