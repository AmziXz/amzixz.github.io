# amzixz.github.io

Personal site for **AmziXz**, served by GitHub Pages at **<https://amzixz.id.lv>**.

The repository is named `amzixz.github.io`, but the live host is the custom
domain `amzixz.id.lv`, set by the `CNAME` file here. **Do not delete `CNAME`**:
the domain drops and the site falls back to `github.io`. Every canonical URL,
`hreflang`, `og:` tag and sitemap entry uses `amzixz.id.lv`.

## Editing the words

Every word on the site is in two files:

- `_data/lang/en.yml`, English
- `_data/lang/lv.yml`, Latvian

Open one on github.com, press the pencil, change the text between the quotes,
commit. The site updates in about a minute. The top of each file explains the
rules; the short version: keep the quotes, keep the keys, and keep both files
in step.

If something breaks (a lost quote, a key missing from one language), GitHub
refuses to publish and emails you. The previous version stays live, so a
mistake never shows on the site.

Other things you can switch without touching code:

| File | What it holds |
|---|---|
| `_data/live.yml` | `streaming: true` while you are live on TikTok: the status light turns on and links to the stream |
| `_data/links.yml` | Every outside link and handle; the Kick address goes here when the channel is live |
| `_data/photos.yml` | Your portrait for the ring on the first screen and the About page, and the two photos in "The work" |

## How the pages are built

GitHub Pages runs Jekyll on every push. There is no other build step and
nothing to install for the site itself.

```
_config.yml           Strict mode, the domain, the asset version, what not to publish
_data/
  lang/en.yml         Every English word
  lang/lv.yml         Every Latvian word (same keys)
  languages.yml       The two languages and their address prefix ("" and "/lv")
  links.yml           Outside links and handles
  live.yml            The status light
  photos.yml          Photo slots
_layouts/
  base.html           <head>, top bar, floating menu, loading screen, footer
  home.html           The home page: first screen and its seven chapters
  about.html          About   } the calmer page design: a page head, then
  uses.html           Uses    } numbered sections with their label in a
  contact.html        Contact } column on the left
  redirect.html       Old addresses that moved
_includes/
  setup.html          The variables every layout starts with
  page-head.html      The top of every page except home
  section-head.html   A numbered chapter head on the home page
  channels.html       The grid of channels (home and contact)
  discord.html        The Discord box with the live widget
  icon.html           Every icon, by name
index.html            Front matter only: which layout, language and address
about.html, uses.html, contact.html    the same
lv/                   The same files for Latvian
projects.html, ventures.html, catch-the-baltic.html (and lv/)
                      Redirects: old addresses now go to the home page
404.html              Not found, with both home pages
sitemap.xml           Every page in both languages, built from a list
robots.txt            Allows everything, points at the sitemap
assets/
  site.css            The whole design: tokens for both themes, every component
  site.js             Loading screen, clock, the light and ring, name fitting,
                      reveals, card light, the TikTok loader
  theme.js            Dark/light, remembered; runs before first paint
  lang.js             Remembers EN/LV across pages
  fonts/              Unbounded, Geist, Geist Mono (OFL); latin + latin-ext
  logos/              Venture logos, see its README
  photos/             Photos, see its README
  logo.png, logo-512.png, og-image.png
docs/                 Notes from the August 2026 redesign, superseded; kept for history
serve.js, check.js, package.json, tsconfig.json
                      Local tooling, never published
```

A page file is front matter only:

```yaml
---
layout: about     # which template
lang: lv          # which language file
slug: /about      # address without the language prefix
key: about        # which meta: entry holds its title and description
nav: about        # which floating-menu item is lit (or none)
---
```

Strict mode (`_config.yml`) makes a missing key a failed build instead of a
blank on the page. Every output in a template goes through `| escape` (or
`| jsonify` in JSON-LD), so a quote or `&` in the wording can never break the
markup.

## The design

Direction, from the owner's references: dark cinematic. Near-black with grain
and a dot grid, a purple-and-blue light that follows the pointer, a giant
AmziXz, glass pill controls, a floating menu at the bottom, and small "live"
details: a status light, a Tallinn clock, a ticker, a loading counter.

- **The home page** is the show: the first screen is a camera viewfinder
  (corners, REC-style status, pointer readout, clock) with a ring light behind
  the name and the portrait inside it once there is one. Then seven numbered
  chapters: the work, latest uploads, channels, ventures, work with me, shop,
  support.
- **The other pages** are calmer on purpose, as on the old site: a page head
  with a breadcrumb, a big title and one paragraph, then sections that read
  like a document, labels in a left column.
- **Type**: Unbounded for display (the name at 420, headlines lighter still),
  Geist for text, Geist Mono for labels. The name is always written
  **AmziXz**; nothing that shows it is ever uppercased.
- **Colour**: tokens per theme at the top of `site.css`. Purple and blue from
  the logo, warm orange for live and soon, green for running. Every text
  colour is measured against its theme's background (AA or better).

### Motion

All of it is optional. Under `prefers-reduced-motion` nothing moves, follows
the pointer or rises in, and the loading screen never shows. Without
JavaScript nothing is hidden: the reveals, the arrival sequence and the
loading screen are all switched on by script.

### Themes

Dark is the default. `assets/theme.js` sets `data-theme` before first paint
from the remembered choice; the sun/moon switch flips it. It must stay a
synchronous `<head>` script, or the wrong theme flashes first.

## Languages

English at the root, Latvian under `/lv/`, paired one to one (`/about` and
`/lv/about`). Once you are in Latvian, every link keeps you there; and
`assets/lang.js` remembers the switch, reading the other version's address
from the page's own `hreflang` link.

**Adding a page:** a layout, a front-matter file in each language, its
`meta:` entry and wording in both language files, and its slug in
`sitemap.xml`'s list.

## Local preview and checks

Node only (Python is not on every machine here):

```bash
npm install       # once per machine: liquidjs + js-yaml for the preview
npm start         # http://localhost:8000, renders the templates like Jekyll
npm run check     # both language files: same keys, same list lengths, the
                  # name written AmziXz, the Uses "for sale" box in range
npm run typecheck # serve.js and check.js
```

`serve.js` renders the Jekyll templates with liquidjs in strict mode and
serves extensionless URLs and the 404 page like Pages does. It matches the
real build; still, build once with real Jekyll after changing a template.

Do not open the files directly: they are templates, and root-absolute paths
(`/assets/site.css`) do not resolve under `file://`.

## Cache busting

Every `/assets` reference carries `?v={{ site.asset_version }}`. Pages caches
assets for ten minutes and browsers far longer, so after changing anything in
`/assets`, add one to `asset_version` in `_config.yml`. Every page follows.
Currently `10`.

## Embeds

- **Latest from Phone Guru** plays the channel's uploads playlist
  (`youtube_phone_uploads` in `links.yml`: the channel ID with UC changed to
  UU), so the newest video is always first, with no updating by hand.
- **TikTok** loads its script only when the box scrolls near.
- **Discord** is the server widget, lazy-loaded, following the theme.

Brave Shields and uBlock often block these. That is expected, not a bug in the
page: test with shields down first.

## Notes

- Anything committed here is public. Local tooling output stays out of the
  repo (`.gitignore`, and `exclude` in `_config.yml`).
- Icons are from Simple Icons (CC0) for brand marks, drawn by hand otherwise.
