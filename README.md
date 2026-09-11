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

If system settings disable animations, open `http://localhost:3002/?motion=on` or select **Enable animations** in the page corner. The switch remembers your choice in this browser; **Animations on** pauses the effects. New visitors follow their system motion preference by default.

## Features

- Lenis smooth wheel scrolling and in-page navigation, with native touch inertia on mobile.
- Custom column-and-code-brackets logo, fixed navigation, reading progress, staggered line reveals, rolling button labels, and image wipe reveals.
- Pointer-driven 3D feature cards and scroll-driven depth, rotation, and text drift.
- Warm ivory and the SocratesCode brand color `#754934`.
- A pinned, scroll-scrubbed collage with independently moving images, three text transitions, and a final editorial composition.
- Parallax galleries, large text reveals, and a cinematic academy image expanding to fill the viewport.
- Eight original Socrates illustrations, including Socrates using a laptop and teaching students to code.
- A custom 26-frame looping laptop GIF, with typed code, a cursor, and output; a static alternative for reduced motion.
- Keyboard-accessible PRIMM tabs and a functioning prediction, variable tracing, question, and reset demo.
- Responsive navigation, reduced-motion layouts, descriptive metadata, and locally hosted artwork and fonts.

The learning exercise is a deterministic browser demonstration of the loop shown on the page. It does not execute arbitrary code, call an AI service, create accounts, or claim backend integration. The full platform remains in the separate `web-app` folder.

## Artwork and provenance

All final illustrations were generated using the built-in image generation tool from text prompts, with no input/reference images. They use classical philosophical imagery as a creative theme. No downloaded Contra, Pinterest, or museum art remains in `public/images`.

- Final assets: `public/images/socratic-*.webp`.
- Animated laptop: `public/images/socratic-laptop-loop.gif`.
- Static animation poster: `public/images/socratic-laptop-poster.webp`.
- Full original prompt set: `docs/artwork-prompts.json`.
- Asset manifest: `public/images/sources.json`.
- On-site attribution and inspiration note: `/artwork-credits`.
- Self-hosted font licenses: `public/fonts/*-LICENSE.txt`.

Rebuild the screen animation from its original base illustration:

```sh
npm run artwork:animate
```

The GIF is suitable as a standalone looping visual. The script preserves the generated illustration and composites only the custom screen animation.

A concise portfolio credit: “SocratesCode — a Socratic coding lab. Layout and scroll storytelling inspired by Contra Labs; original AI-assisted illustrations, custom animations, and an interactive PRIMM demo.”

## Implementation

`components/motion.tsx` uses one shared requestAnimationFrame loop and native sticky positioning. Scroll updates modify element styles without React re-renders. Time-based interpolation keeps motion consistent across screen refresh rates. Lenis shares the same frame clock; expensive layout reads run only while scrolling or scene interpolation is settling. The clock pauses while the document is hidden. A shared motion preference controls Lenis, CSS, scroll scenes, and the GIF. It follows `prefers-reduced-motion` unless the visitor explicitly enables or pauses animations. The preference is applied before paint and persists locally. Scroll reveals replay on re-entry. Phones use shorter sticky scenes, larger touch targets, and stacked code/trace panes.

The app uses strict TypeScript, React 19, and Tailwind CSS 4 with custom editorial CSS. Frontend work stays within `landing-page`; no backend or database dependencies were added. Root tracker checkboxes are unchanged because their instructions require verified, committed work and this task does not create a commit.

Production builds use `.next-production`; the development server uses `.next`. This lets production checks run without overwriting a live development server cache. Current artwork is retained; picture composition and laptop-perspective revisions are deferred.
