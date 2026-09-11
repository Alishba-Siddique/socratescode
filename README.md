# SocratesCode landing page

A complete, responsive Next.js 15 landing page following the product and design requirements in the root Markdown documents. The editorial layout and scroll choreography are inspired by https://contralabs.com/. SocratesCode has its own content, brand, original AI-generated artwork, and interactive learning demo.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For the production preview on port 3002: `npm run build` then `npm start -- --port 3002`.

```sh
npm run build
npm start
npm run typecheck
npm run test:e2e
```

Browser checks use an installed Chrome browser. On a machine without Chrome, install it with `npx playwright install chrome`. Tests start a local development server on port 3001 if one is not running.

Set `NEXT_PUBLIC_SITE_URL` to your deployed site's absolute URL before the production build to generate correct social-preview image URLs. No API keys or backend services are needed for this landing page.

Animations are always enabled: Lenis, scroll scenes, CSS reveals, and the laptop GIF run on every visit. System motion settings, old saved preferences, and `?motion=off` links do not disable them.

## Features

- Lenis smooth wheel scrolling and in-page navigation, with native touch inertia on mobile.
- Custom column-and-code-brackets logo, fixed navigation, reading progress, staggered line reveals, rolling button labels, and image wipe reveals.
- Restrained line reveals, image curtain reveals, small image hover zooms, and parallax contained inside image frames.
- A scroll-speed-responsive PRIMM type ribbon, scroll-filled editorial headlines, and subtle magnetic button labels on fine pointers. The ribbon pauses outside the viewport.
- Warm ivory and the SocratesCode brand color `#754934`.
- A pinned editorial sequence with separate copy and artwork columns, three text transitions, and a final composition.
- Parallax galleries, large text reveals, and a cinematic academy image expanding to fill the viewport.
- Original Socrates illustrations, including two new ivory-and-cocoa laptop and mentoring scenes with code confined to interior displays.
- A live three-step hero code preview, pulsing indicators, staggered hero words, and continuous artwork zoom within fixed frames. The incorrect laptop GIF has been retired.
- Five PRIMM stages advance and reverse with scroll; tabs remain clickable and keyboard accessible.
- The practice demo loops automatically while visible. Choosing a prediction or using a control stops autoplay; Try it yourself starts a fresh manual exercise, and Watch walkthrough restarts the loop.
- Responsive navigation, descriptive metadata, and locally hosted artwork and fonts.

The learning exercise is a deterministic browser demonstration of the loop shown on the page. It does not execute arbitrary code, call an AI service, create accounts, or claim backend integration. The full platform remains in the separate `web-app` folder.

## Artwork and provenance

All final illustrations were generated using the built-in image generation tool from text prompts, with no input/reference images. They use classical philosophical imagery as a creative theme. No downloaded Contra, Pinterest, or museum art remains in `public/images`.

- Final assets: `public/images/socratic-*.webp`.
- Corrected laptop artwork: `public/images/socratic-coder-v2.webp`.
- New teaching scene: `public/images/socratic-mentoring-v2.webp`.
- Full original prompt set: `docs/artwork-prompts.json`.
- Asset manifest: `public/images/sources.json`.
- On-site attribution and inspiration note: `/artwork-credits`.
- Self-hosted font licenses: `public/fonts/*-LICENSE.txt`.

The earlier GIF and generation script are retained as unused source artifacts. The live site animates its artwork inside clipped frames and uses a separate HTML code preview.

A concise portfolio credit: “SocratesCode — a Socratic coding lab. Layout and scroll storytelling inspired by Contra Labs; original AI-assisted illustrations, custom animations, and an interactive PRIMM demo.”

## Implementation

`components/motion.tsx` uses one shared requestAnimationFrame loop and native sticky positioning. Scroll updates modify element styles without React re-renders. Time-based interpolation keeps motion consistent across screen refresh rates. Lenis shares the same frame clock; expensive layout reads run only while scrolling or scene interpolation is settling. The clock pauses while the document is hidden. Animations always run; the previous preference switch and before-paint preference script have been removed. Scroll reveals replay on re-entry. Phones use shorter sticky scenes, larger touch targets, and stacked code/trace panes.

The app uses strict TypeScript, React 19, and Tailwind CSS 4 with custom editorial CSS. Frontend work stays within `landing-page`; no backend or database dependencies were added. Root tracker checkboxes are unchanged because their instructions require verified, committed work and this task does not create a commit.

Production builds use the standard `.next` output expected by Vercel; the development server uses `.next-dev`. This lets production checks run without overwriting a live development server cache. The laptop and mentoring artwork has been replaced with correctly oriented screen compositions.

## Vercel

Use the Next.js framework preset with `npm run build` and the default output directory (`.next`). If deploying this monorepo, set Root Directory to `landing-page`; if the repository contains the landing app at its root, leave Root Directory as `.`. Deploy a commit containing the updated `next.config.ts`.

Section layout and motion refinements live in `app/sections.css`, which reserves separate space for copy and artwork at desktop and mobile sizes. The current development preview is http://localhost:3000.

The hero and understanding section use an editorial composition in `app/hero.css`: oversized masked typography, a rotating question seal, contained pointer movement, a staged image reveal, and stacked mobile layouts. The original laptop artwork is reused without overlays on the laptop or hands.
