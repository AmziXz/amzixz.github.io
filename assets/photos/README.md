# Photo folder

Photos for the site. Each one has a slot in `_data/photos.yml`: put the file
here, its path there, commit. A slot left `""` simply isn't shown, so nothing
ever looks broken while you gather them.

| Slot in photos.yml | Where it appears | Best shape | Now |
|---|---|---|---|
| `hero` | Stepping out of the ring light on the first screen, behind the giant AmziXz | A cut-out framed on the ring, 800×1224px (below) | `hero-cutout-nobottle.webp` |
| `about` | Beside the title on the About page | Portrait 4:5, about 1000×1250px | empty |
| `work_phone` | "Phone modding on YouTube" on the home page | 16:9 | `work-phone.jpg` (365×209, a bigger copy would look sharper) |
| `work_cars` | "Car content and streams on TikTok" | 4:3 | `work-cars.jpg` |

## The portrait in the ring

You step out of the ring light: your head and shoulders rise above the
ring, the ring passes behind you, and from the ring's middle down you are
cut to the inside of the rim, so your legs stay in the ring. The name runs
across them. For that the file is framed on the ring itself:

- a **cut-out** with a transparent background, as a WebP;
- **as wide as the ring**, you roughly centred in it;
- the **ring's bottom is the bottom edge** of the file (about mid-thigh);
- the file is **1.53 times as tall as it is wide**: the ring is the
  bottom square, and your head and shoulders fill the extra height above
  it, with a little air over your hair. If you change that proportion,
  change `--pop` in `assets/site.css` (0.53) to match.

`hero-cutout-nobottle.webp` (800×1224px, about 60 KB) is the pier photo
(October 2026): background removed with BiRefNet, edges cleaned, a natural
grade (warm skin, black clothes with their folds opened), the bottle taken
out of your hand, framed on the ring at twice the photo's own size so it
stays smooth on sharp screens. `hero-cutout.webp` is the same file with the
bottle still in it: swap the path in `_data/photos.yml` to use it. A sharper photo, eyes open, in soft light,
will look better still.

## What works

- **JPEG** for photos, each **under 400 KB**. Resize before uploading: a phone
  shoots 4000px wide, about four times more than needed.
- **The ring portrait** is the exception: a cut-out as **WebP with
  transparency** (JPEG has none). It stays small; the hero cut-out is
  about 60 KB.
- Lowercase names with hyphens: `me-ring.jpg`, not `Me Ring.JPG`.
- After replacing a file under the same name, add one to `asset_version` in
  `_config.yml`, or returning visitors keep the old copy.
