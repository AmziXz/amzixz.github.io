# Logo folder

Venture logos. They sit on a dark rounded tile on the ventures cards, shown at
64×64.

| File | Used for |
|---|---|
| `blue-eye-energy.png` | Blue Eye Energy |

AmziXz Services uses the site's own `assets/logo.png`.

## Requirements

- **PNG with a transparent background**, or artwork made for a dark tile. A
  JPEG with a white background shows as a white square.
- Square, at least 256×256 so it stays sharp on high-DPI screens; under about
  100 KB.
- Lowercase names with hyphens.

A new logo needs a line in `_layouts/home.html` where the card is; after
replacing a file under the same name, add one to `asset_version` in
`_config.yml`.
