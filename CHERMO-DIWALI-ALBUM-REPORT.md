# CHERMO — A Diya for You: implementation report

Date: 24 October 2026

Project: `C:\Users\Vansh kashyap\OneDrive\Desktop\every-february\chermo-diwali-album`

## Delivered

Independent React 19 / TypeScript 5.9 / Vite 7.3.7 application, a decorated Indian Diwali entrance, hardcover, eight distinct chapters and a three-step session-only creator. All content is typed and separated from the presentation. CHERMO ownership remains in the UI. No Git initialisation, push or deployment was performed.

Three.js 0.180 is dynamically imported only for the entrance: door and home geometry, spatial camera movement, rangoli, garlands, framed altar and lamps. DPR is capped at 1.5, frame scheduling is throttled, hidden-tab rendering stops, and resources are disposed on exit. Quiet mode, import/WebGL failure and context loss have a CSS/SVG fallback. These are implementation safeguards, not measured device-performance guarantees.

The book uses React state and CSS perspective/left-edge rotations with front/back leaf faces, paper shadows, spine and thickness. Pending-turn locking prevents rapid repeated actions from skipping pages. Visited chapter state persists while browsing the book. The chapter compositions are diya lighting, two homes, blessings, shared sky, memory prints, envelope/letter, folded wishes and an emotional closing with replay.

The creator is lazy-loaded, uses draft state and traps/restores keyboard focus. Local photos are resized to 1600px maximum and encoded to JPEG quality .82; up to three are supported. The full-photo dialog uses contain sizing, Escape handling, focus restoration and makes the background inert/hidden to assistive technology. Optional sound requires an explicit interaction. No customer data is uploaded.

## Validation actually performed

- Dependency installation succeeded earlier; npm 10 hit an arborist issue during a Vitest update, resolved using npm 11. The resulting audit reported zero vulnerabilities. No fresh vulnerability audit is claimed for this final handoff.
- Final `npm run build`: passed TypeScript and Vite, 57 transformed modules, no build errors.
- `npm test`: 12 tests in 4 files passed. Covers navigation bounds/rapid turns/state retention, keyboard and chapter navigation, creator draft behavior, photo validation/dimensions, letter skip/reopen/quiet behavior, folded wishes, photo dialog Escape/focus, diya lighting and city labels.
- Dev server was previously exercised on port 4196. Final `npm run preview` started successfully. Agent-started port 4198 timed out from the browser; user-started production port 4199 loaded successfully.
- Earlier browser session exercised the entire normal-motion story, creator text changes, a local synthetic photo upload/enlarge, optional sound toggle, fallback and quiet mode. Sound fidelity was not physically audited.
- Final compiled preview on 4199: creator loaded, a 2,460-character custom letter committed, letter opened at 320px and scrolled to its visible signature. Document scroll width equalled 320px; letter page scroll width equalled client width, with 5,458px of scrollable content inside a 650px page. Ending replay returned to entrance. Reload restored default content and WebGL entrance. Captured production warning/error log list was empty.
- Earlier dev-tab stale module and failed HMR connection were observed after reconnection; the separately loaded compiled preview did not reproduce these errors.
- Automated Playwright E2E source is included, but its CLI run remains unverified: sandbox browser process permissions prevented launching Edge. CUA browser checks above are separate and were actually performed.

## Responsive results

The earlier completed browser sweep visited all eight chapters in quiet mode at every size below. No document/page horizontal overflow or broken images were found; cover layouts were also checked. This sweep was retained rather than repeated. It does not constitute physical-device or all-browser certification.

| Viewport | Eight chapters / horizontal overflow | Cover |
|---|---|---|
| 320 × 844 | Passed | Passed |
| 360 × 800 | Passed | Passed |
| 375 × 812 | Passed | Passed |
| 390 × 844 | Passed | Passed |
| 414 × 896 | Passed | Passed |
| 430 × 932 | Passed | Passed |
| 768 × 1024 | Passed | Passed |
| 844 × 390 | Passed | Passed |
| 1024 × 768 | Passed | Passed |
| 1280 × 800 | Passed | Passed |

The entrance was visually reviewed on desktop and mobile, including its rangoli/altar composition. A 1px fallback overflow at 320px was corrected. Not every entrance size was independently verified after viewport settling, so the table describes book/cover checks only. Final mobile headline spacing was corrected and inspected in the production preview.

## Measured production size

Final dist: **1,313,207 bytes across 20 files**, including alternative font formats and the artwork. This is disk size, not initial transfer size.

| Bundle | Raw kB | Gzip kB |
|---|---:|---:|
| Main JavaScript | 251.93 | 78.90 |
| Lazy Three entrance | 487.43 | 123.92 |
| Lazy creator | 7.62 | 2.95 |
| Main CSS | 38.02 | 9.87 |
| Creator CSS | 4.73 | 1.54 |
| HTML | 0.68 | 0.41 |

Local altar artwork is 183,130 bytes. Fonts total approximately 359 kB on disk; browsers select a supported font format rather than fetching every alternative. No Lighthouse, memory, frame-time or low-end-device benchmark is claimed.

## Asset provenance

- `public/art/lakshmi-ganesh.webp`: original AI-generated devotional painting using the built-in image generation tool, reviewed visually and converted with Pillow to 1000×667 WebP, quality 86. No external hotlink.
- Generation prompt: original landscape 3:2 traditional Indian miniature on warm ivory in vermilion and gold; Lakshmi seated on a lotus on the left, four arms with lotuses, blessing and offering; Ganesha on the right, elephant head and curved trunk, four arms with traditional objects and modak; dignified attire and gold crowns/halos, marigold offerings; no text, frame, extra people, cartoon or fantasy styling.
- Original generation output: `C:\Users\Vansh kashyap\.codex\generated_images\01a0f34d-956e-75d3-a688-a7144ee0ae0b\exec-c8dd61c4-4419-4a73-b679-2fbf9bab06be.png`.
- Architecture, rangoli, lamps, folds, envelopes, paper and other decorative art are project-authored SVG/CSS/Three geometry. The fixture PNG is a synthetic edge-visibility test image, not a customer photograph.
- Cormorant Garamond, DM Sans and Caveat are bundled locally through Fontsource (5.3), under their SIL Open Font License package notices. No font CDN request is required.

## Limitations and future integrations

Personalisation lives only in React memory and resets on reload. Customer publishing, persistent/shareable links, backend, storage, authentication, payments and export remain future work. The sequence is a typed code configuration rather than a database editor. No deployment was requested for this album.

Physical iOS/Android, Safari/Firefox, assistive-technology testing and real low-end GPU performance remain unverified. Long letters intentionally scroll within the paper. CSS depth and artwork are an authored approximation rather than a physics simulation. The generated cultural artwork should receive the brand's final editorial approval before sale.

## Files created

Generated `node_modules/`, `dist/`, temporary test files and build caches are ignored. Source and deliverable manifest:

- `.gitignore`
- `CHERMO-DIWALI-ALBUM-CHECKPOINT.md`
- `CHERMO-DIWALI-ALBUM-REPORT.md`
- `README.md`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/art/lakshmi-ganesh.webp`
- `public/favicon.svg`
- `src/App.tsx`
- `src/app/album-flow.ts`
- `src/components/AlbumCover.tsx`
- `src/components/AlbumPage.tsx`
- `src/components/CinematicEntry.tsx`
- `src/components/Creator.tsx`
- `src/components/FestiveArt.tsx`
- `src/components/FoldedNote.tsx`
- `src/components/HandmadeLetter.tsx`
- `src/components/PageTurn.tsx`
- `src/components/PhysicalBook.tsx`
- `src/data/album-schema.ts`
- `src/data/default-album.ts`
- `src/main.tsx`
- `src/styles/book.css`
- `src/styles/creator.css`
- `src/styles/entry.css`
- `src/styles/global.css`
- `src/styles/scenes.css`
- `src/three/DiwaliEntrance.ts`
- `src/utils/photos.ts`
- `tests/AlbumPage.test.tsx`
- `tests/Creator.test.tsx`
- `tests/PhysicalBook.test.tsx`
- `tests/e2e/journey.spec.ts`
- `tests/fixtures/memory.png`
- `tests/photos.test.ts`
- `tests/setup.ts`
- `tsconfig.json`
- `vite.config.ts`
