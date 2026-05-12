# Legacy Estate Sales — Website

A single-page marketing site for Legacy Estate Sales, a family-run estate sale firm
in Albuquerque, New Mexico. Pure static HTML + CSS + JS — no build step, no dependencies.

## Run it

Just open `index.html` in any modern browser. There is no server or build required.

```
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

For the smoothest local experience (some browsers gate features like `loading="lazy"`
behind an `http://` origin), run any tiny static server in this folder, e.g.:

```
npx serve .
# or
python -m http.server 8000
```

## File layout

```
index.html        single-page document
styles.css        all styling, custom properties, responsive rules
script.js         sticky nav, smooth scroll, reveals, parallax, lightbox
images/           web-friendly slugs of the originals in /assets
assets/           original PNGs from the brand kit (untouched)
```

## Before you launch — replace the placeholders

The site ships with clearly-marked placeholder values. Search for each
string and replace globally before going live.

| Placeholder | Where it lives | Replace with |
|---|---|---|
| `(505) 555-0123` | hero phone pill, contact section, footer | real phone number, displayed format |
| `+15055550123` | `tel:` href values | E.164 format of the real number |
| `info@legacyestatesalesnm.com` | contact section, footer | real business email |
| `https://facebook.com/REPLACE` | contact, footer | Facebook page URL |
| `https://instagram.com/REPLACE` | contact, footer | Instagram profile URL |
| `https://www.estatesales.net/organizers/REPLACE` | upcoming-sales CTA, contact, footer | EstateSales.net organizer URL |
| `<!-- PLACEHOLDER -->` HTML comments | testimonials section | three real client quotes |

The about-section paragraph and team sign-off (`— The Legacy Estate Sales Family`)
are written generically. Edit them to match the actual founder's voice when ready.

## Image optimization (recommended before launch)

The `images/` folder currently holds full-resolution PNGs (~2–3 MB each for the
photos), totaling ~20 MB across the page. For production, run the photo mockups
through a JPG compressor (Squoosh, ImageOptim, or `cwebp`) at quality ~80 and
max 1920px on the long edge for the hero, 1200px for gallery tiles. Logos can stay PNG.

Targets after optimization:
- hero background: ≤ 350 KB
- gallery tiles: ≤ 200 KB each
- total page weight: ≤ 2 MB

If you swap any image to JPG, also update its filename in `index.html` and
`styles.css` (the crest watermark in `.service-card__crest` and `.why::before`
references `images/logo-crest.png`).

## Brand colors (for reference, e.g. matching email signatures)

- Deep racing-green ink: `#1C3A2D`
- Cream background: `#F4ECD8`
- Warm cream: `#E8E0CC`
- Brass-gold accent: `#B8924A`
- Gold-leaf highlight: `#D4A95C`

## Accessibility

- Single `<h1>` (the hero), proper heading hierarchy throughout
- All decorative imagery has `alt=""` + `aria-hidden="true"`
- Skip-to-main-content link as the first focusable element
- `:focus-visible` brass outlines on every interactive element
- Lightbox and mobile nav both trap focus and restore on close
- Full `prefers-reduced-motion` support — disables ken-burns, parallax, and reveal animations
- Color contrast: green on cream and cream on green both ≈ 11.4:1 (WCAG AAA)

## Browser support

Latest evergreen Chrome, Firefox, Edge, Safari. `backdrop-filter` is used on the
sticky nav and lightbox; older Firefox falls back to a solid cream background with
no functional impact.
