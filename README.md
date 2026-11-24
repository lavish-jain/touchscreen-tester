# Free Touchscreen Test

A free, in-browser touchscreen diagnostic suite — built with [Astro](https://astro.build) and Tailwind CSS v4. No install, no account, nothing tracked.

## Tests

- **Home** (`/`) — touch support summary, device & browser info, links to every test, FAQ.
- **Multi-Touch Tracking** (`/multi-touch-test`) — live labeled circles per active touch point (ID, coordinates, pressure).
- **Gesture Recognition** (`/gesture-test`) — tap, double-tap, long press, 4-way swipe, pinch-in/out, rotate.
- **Draw / Finger Paint** (`/draw-test`) — multi-finger free-draw canvas with color/size controls.
- **Tap Accuracy Grid** (`/tap-accuracy-test`) — sequential target grid with hit/miss and an average accuracy score.
- **Dead Zone Map** (`/dead-zone-test`) — drag-to-fill coverage grid that reveals unresponsive screen areas.
- **Response Latency** (`/latency-test`) — prompt-to-tap timing over multiple rounds (avg/min/max).
- **Scroll & Pan** (`/scroll-test`) — live scroll direction/velocity readout over an oversized pannable grid.
- **Touch Event Log** — a site-wide console drawer (top-right "Event Log" button) logging raw `touchstart`/`touchmove`/`touchend`/`touchcancel` events from anywhere on the page.

## Stack

- [Astro](https://astro.build) (static output) + [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`.
- Design tokens in `src/styles/global.css` (`@theme`), derived from `DESIGN.md`.
- Vanilla TypeScript per test (`<script>` modules), no UI framework — see `src/scripts/` for shared logic (gesture recognition, touch capability detection, fullscreen).

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`              | Install dependencies                             |
| `npm run dev`               | Start local dev server at `localhost:4321`       |
| `npm run build`              | Build production site to `./dist/`               |
| `npm run preview`             | Preview the production build locally             |
| `npx astro check`           | Type-check `.astro` files                        |

## Notes

- True multi-touch/gesture/pressure behavior can only be verified on a real touchscreen device (or with touch emulation enabled in devtools) — a mouse can drive the Tap Accuracy and Latency tests, but the touch-only tests (Multi-Touch, Gesture, Draw, Dead Zone) show an inline notice on non-touch devices.
- Everything runs client-side; nothing is uploaded anywhere.
