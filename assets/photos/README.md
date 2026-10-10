# Photo folder

Photos for the site. Each one has a slot in `_data/photos.yml`: put the file
here, its path there, commit. A slot left `""` simply isn't shown, so nothing
ever looks broken while you gather them.

| Slot in photos.yml | Where it appears | Best shape | Now |
|---|---|---|---|
| `hero` | Inside the ring light on the first screen, behind the giant AmziXz | Square, about 1000×1000px | empty |
| `about` | Beside the title on the About page | Portrait 4:5, about 1000×1250px | empty |
| `work_phone` | "Phone modding on YouTube" on the home page | 16:9 | `work-phone.jpg` (365×209, a bigger copy would look sharper) |
| `work_cars` | "Car content and streams on TikTok" | 4:3 | `work-cars.jpg` |

## The portrait in the ring

It is cropped to a circle and the name runs across its lower half, so:

- keep your face in the **upper half** of the photo, roughly centred;
- head and shoulders works best; any background is fine, it gets a soft
  purple edge and a fade at the bottom;
- a darker photo sits better on the dark theme.

## What works

- **JPEG** for photos, each **under 400 KB**. Resize before uploading: a phone
  shoots 4000px wide, about four times more than needed.
- Lowercase names with hyphens: `me-ring.jpg`, not `Me Ring.JPG`.
- After replacing a file under the same name, add one to `asset_version` in
  `_config.yml`, or returning visitors keep the old copy.
