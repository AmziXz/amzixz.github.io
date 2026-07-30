# amzixz.github.io

Personal site for **AmziXz** — a static, dependency-free site served straight from
this repository by GitHub Pages at <https://amzixz.github.io>.

## Structure

```
index.html      Home — hero, quick links, Discord + support
about.html      About
projects.html   Project cards
contact.html    Contact details + Discord widget
404.html        Not-found page (uses root-absolute paths)
assets/
  style.css     The entire stylesheet — design tokens live in :root
  logo.png      Logo + favicon
```

There is no build step. Edit the HTML/CSS and push to `main`; Pages redeploys.

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Use a server rather than opening the files directly — `file://` breaks the
root-absolute paths in `404.html`.

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
