# CLAUDE.md

This file gives Claude Code project-specific guidance. Read [AGENTS.md](AGENTS.md) and the [documentation index](docs/README.md) first.

## Current implementation

- The new app uses Next.js App Router, React, TypeScript, and shadcn/ui. Run `npm ci`, then `npm run dev` to develop locally. See README for validation commands.
- Routes are `/` (tool list), `/tools/pyramid`, `/tools/stairs`, and `/tools/circular-arrows`. The home page recognizes the old `#page-*` fragments.
- `src/lib/tools/*/model.ts` holds pure SVG generators. `src/components/tools/tool-editor.tsx` connects controls, preview, and downloads. Shared color, canvas, and download code lives in `src/lib/shared/`.
- The root `index.html` is the original standalone app, kept as a local reference. Do not edit it as the source of the new Next.js app. The older generators in `legacy/` are reference material.

## SVG constraints

- Use one SVG string for preview and download. SVG `width` and `height` match the `viewBox` dimensions.
- Keep the background transparent, use hex colors, and export PNG at a 2048 px long edge.
- Preserve each generator's dimensions, palette distribution, and numeric ranges unless changing behavior intentionally. Compare against `tests/fixtures/legacy-svg.json` using `npm test`.
- Browser APIs such as `document`, `Image`, and canvas belong in Client Components or browser-only helpers. Geometry functions remain independent of the DOM.

## Project direction

The Next.js migration is implemented locally; Vercel deployment is a later step. Track progress in [migration-plan.md](docs/migration-plan.md), and record meaningful decisions under `docs/decisions/`.
