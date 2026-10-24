# A Diya for You · CHERMO

A standalone Diwali keepsake: a cinematic decorated home, a tactile cover and eight interactive chapters. Personalise it with names, cities, blessings, a letter, wishes and up to three photographs.

## Run locally

Use Node.js 22.12+ (tested on 22.23.2) and npm. In this folder:

```powershell
npm install
npm run dev -- --port 4196 --strictPort
```

Open the URL printed by Vite and keep the terminal open. If the preview becomes blank after a stopped server or a source update, restart the server and reload the page.

```powershell
npm run build
npm run preview -- --port 4199 --strictPort
npm test
```

The production files are in `dist/`. Serve them over HTTP; opening `dist/index.html` directly as a file is unsupported. No Git repository or deployment is required to run locally.

## Use the album

Enter the celebration, then open the cover. Use Previous/Next, keyboard arrow keys, the chapter menu or horizontal dragging/swiping on the paper. Interactive buttons, photographs and letter controls retain their own actions. Long letters scroll inside their page. Quiet view reduces movement; the operating-system reduced-motion preference is respected. Add `?fallback` to the URL to inspect the CSS/SVG entrance without WebGL.

Make it yours opens a three-step creator. Changes apply only when Preview my Diwali is selected; Cancel preserves the current album. Photos must be JPG/PNG/WebP, up to 15 MB each. They are processed locally, reduced to at most 1600 pixels on the longest edge, and converted to JPEG. Transparent images receive an ivory background. Full photographs can be enlarged without cropping. Sound is optional and starts only after an explicit Enable sound action.

**This release is a session-only preview.** Reloading clears personalisation. There are no accounts, database, payment flow, customer publishing, persistent links, download/export or cloud uploads. The empty-photo sample uses clearly labelled illustrations.

## Change content and integrate later

- `src/data/default-album.ts`: sample content.
- `src/data/album-schema.ts`: typed album, memories and chapter sequence.
- `src/App.tsx`: in-memory content and entry/cover/book orchestration.
- `src/components/Creator.tsx`: draft editor; `onChange` commits a complete Album.
- `src/components/AlbumPage.tsx`: the eight chapter compositions.
- `src/components/PhysicalBook.tsx`, `PageTurn.tsx`, `src/app/album-flow.ts`: navigation and page state.
- `src/three/DiwaliEntrance.ts`: lazy-loaded entrance only.
- `src/styles/`: global, entrance, book, chapter and creator styles.

A future service can load a validated Album into App and replace local photo data URLs with authorised asset URLs. Add persistence, access control, upload validation and publishing separately. Render customer text as text, as the current React components do. Keep CHERMO ownership notices and asset attribution intact.

## Verification

`npm test` runs the unit/DOM suite. `npm run test:e2e` runs the supplied Playwright suite once a supported browser is installed (`npx playwright install chromium`). An external server can be supplied through PLAYWRIGHT_BASE_URL; otherwise the suite starts port 4197. The Playwright CLI suite was not executed successfully in the restricted development environment; see the report for the browser checks that were actually performed.

In the Codex Windows sandbox only, TEMP/TMP had to point to the ignored project `tmp` directory for Vitest. Ordinary local usage should not require that workaround.

See `CHERMO-DIWALI-ALBUM-REPORT.md` for measured build sizes, responsive checks, artwork provenance and unverified cases.
