# 25 West Gallery

A minimal, editorial-style gallery website for **25 West Gallery** — serif-led
(Times New Roman), monochrome by default, art-first, and built to serve the
fine art world and the local community at once.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## What's inside

- **Stack:** Vite + React + React Router. No CSS framework — one hand-written
  stylesheet drives the whole identity.
- **Pages:** Home, Exhibitions (Current + Archive), exhibition detail,
  Community & Events, event detail, Artists, artist detail, Opportunities
  (open + curatorial calls), opportunity detail, About, Contact, 404.
- **Palette toggler:** the round button in the bottom-right corner cycles
  through 7 preset palettes (Gallery, After Dark, Archive, Blueprint, Celadon,
  Reading Room, Ultraviolet). Every color on the site is driven by CSS
  variables, so the whole site cross-fades when you switch. The choice
  persists in `localStorage`.
- **Dummy artwork photos:** `src/components/Artwork.jsx` loads seeded photos
  from [Lorem Picsum](https://picsum.photos) — the same seed (per
  artist/work/exhibition) always resolves to the same photo. Swap for real
  photography later by mapping the seeds to image files.
- **Content model:** all site content lives in `src/data/content.js` —
  exhibitions, events, artists, opportunities, and works, matching the
  planning doc's content types. Swap in real data/CMS later without touching
  the components.

## Navigation notes (per the planning doc)

- The logo is the route home on desktop; there is no "Home" menu item.
- Mobile gets a full-screen menu with an explicit Home link.
- Exhibitions has a hover dropdown (Current / Archive) on desktop.
