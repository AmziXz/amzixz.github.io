# Working notes for this repo

Read `README.md` first — it documents the site itself (structure, design,
languages, checks). This file covers the things that bite when picking the
work up on a different machine, and the rules for changing it.

## The repo is not where you think it is

The git repository is the **inner** folder:

```
<drive>:\- Projects\Majaslapas\amzixz.github.io\amzixz.github.io\   <- repo root
                                              ^ outer folder, not a repo
```

Opening the outer folder gives you a working directory that reports "not a git
repository". `cd` into the inner one.

## This repo lives on an external drive

Work moves between computers on the drive, so the drive letter changes and the
filesystem does not record ownership. Git refuses to touch it until you tell it
the directory is trusted — **once per machine**:

```bash
git config --global --add safe.directory "F:/- Projects/Majaslapas/amzixz.github.io/amzixz.github.io"
```

Without this every git command fails with "detected dubious ownership".

Two consequences worth remembering:

- **Push before switching machines.** History has diverged here once already:
  a redesign was committed locally, never pushed, and then re-uploaded through the
  GitHub web UI as a single "Add files via upload" commit. Same files, two
  histories. The local branch `redesign-2026` is kept as the archive of the real
  authored history; `main` is the live branch.
- Line endings differ between the two histories, so `git diff` against
  `redesign-2026` looks enormous. It isn't — use
  `git diff --ignore-cr-at-eol --ignore-all-space` to see the real changes.

## The live domain is not the repo name

The repo is called `amzixz.github.io`; the site is served at
**<https://amzixz.id.lv>**, set by the `CNAME` file at the repo root.

- **Never delete `CNAME`.** It has been deleted and recreated several times
  already; each time the custom domain drops.
- Every canonical URL, `hreflang`, `og:url`, `og:image`, the JSON-LD `url`, and
  all of `sitemap.xml` and `robots.txt` must use `amzixz.id.lv`. A canonical
  pointing at `amzixz.github.io` redirects away from the page it is on.
- `https://github.com/AmziXz` links are the **profile** and stay as they are.
  Never blanket-replace "github.io" without checking which of the two you have.

## services.amzixz.id.lv is a different repo

Pages serves one custom domain per repository, and this one's `CNAME` is spent,
so the services site lives in **`AmziXz/AmziXz-Services`**. Don't try to host it
here, even in a `/services/` folder.

- The "Services" link in the footer and the ventures card are absolute
  (`https://services.amzixz.id.lv/`) for that reason. A root-relative
  `/services` would resolve to this site and 404. Latvian pages link to the
  Latvian services page, `https://services.amzixz.id.lv/lv/`.
- `AmziXz/amzixz-sites` was an attempt to build both sites from one repo. Its
  workflow **force-pushes over this repo** on every run. It never deployed. Do
  not add its `PAGES_TOKEN` secret or revive it.

## Running it locally

Python is not installed on every machine here, so the tooling is Node only:

```bash
npm install     # once per machine: liquidjs + js-yaml for the preview
npm start       # http://localhost:8000, renders the templates like Jekyll
npm run check   # translation files: same keys, same lists, the name as AmziXz
```

Do not open the HTML files directly: they are Jekyll templates, and under
`file://` the root-absolute `/assets/...` paths resolve against the drive
root, so no CSS loads.

**On a fresh machine**, if `git` or `node` reports "not recognized" right after
installing them, the shell has a stale PATH — restart the terminal or VS Code.
They are on the machine PATH already.

## The pages are templates

Like the services site: the page files are front matter only, the layouts are
in `_layouts/`, and **every word** is in `_data/lang/en.yml` and
`_data/lang/lv.yml`. GitHub Pages builds them with Jekyll in strict mode, so a
missing key fails the build instead of publishing a blank.

- Never put wording in a template. Add a key to **both** language files.
- The owner edits the `.yml` files directly on github.com. Keep their
  comments, their order (top to bottom = the page), and the quoting rules.
- Every output in a template goes through `| escape` (or `| jsonify` inside
  JSON-LD).
- Strict mode also fails on a missing key inside a list item (`item.sale` on
  an item without `sale:`). Give every item the same keys, or keep such
  switches outside the list (see `uses.sale_group`).
- The home page is the cinematic one; About, Uses and Contact share a calmer
  design. The owner asked for that difference; keep it.

## Before you commit

- Anything committed here is **public and served by Pages**. `.claude/` and
  `node_modules/` are gitignored for that reason; keep it that way.
  `_config.yml` keeps the notes and local tooling (`package.json`,
  `serve.js`, `check.js`, `tsconfig.json`, `docs/`) from being published; add
  any new tooling file to its `exclude` list.
- The name is always written **AmziXz**: never "AMZIXZ" or "amzixz" on the
  page, so never put `text-transform: uppercase` on anything that shows it.
  `npm run check` catches it in the language files.
- After changing anything in `/assets`, add one to `asset_version` in
  `_config.yml`. Every page follows. Currently `11`.
- Run `npm run check`, and build once with real Jekyll if you changed a
  template: the preview matches it, but GitHub is the one that publishes.
- New text colours are tokens defined for both themes; measure each against
  its theme's `--bg` and `--surface`.
- **Nothing goes on the page that the owner hasn't confirmed.** Catch The
  Baltic was removed at the owner's request; its old addresses redirect home.
- `package.json` is local tooling only (`"private": true`). The site itself has
  no build step beyond Pages' Jekyll and ships no dependencies; keep it that
  way.
- Commit messages and pull request descriptions never include a link to the
  Claude session.
