# Repository Guidelines

## Project Structure & Module Organization

- `index.html` contains the complete application: inline CSS, tool-page markup, shared JavaScript helpers, and pyramid, stairs, and circular-arrow generators. Graphics are generated as inline SVG; there is no separate asset directory.
- `legacy/` holds the original standalone pyramid and arrow tools for reference; the main app does not load them.
- `README.md` describes usage and the live demo; `CLAUDE.md` provides additional architecture guidance.
- Read docs/README.md for goals, migration stages, conventions, and decisions. Source, build, and test directories are planned, not implemented. The agreed direction is Next.js, TypeScript, shadcn/ui, and Vercel, with browser-side asset generation.

## Build, Test, and Development Commands

- Open `index.html` directly in a browser to run the app without installation.
- Alternatively, run `python -m http.server 8000` from the repository root and visit `http://localhost:8000` (requires Python).
- Run `git diff --check` before submitting changes to catch whitespace errors.

There is no build step, package manifest, automated test command, linter, or formatter configured.

## Coding Style & Naming Conventions

Follow the surrounding formatting: two-space indentation, JavaScript semicolons, single-quoted strings, and template literals for SVG markup. Use camelCase for variables/functions and uppercase names for constants such as `PNG_LONG_EDGE`.

Until migrated, keep each generator inside its named initializer IIFE (`initPyramid`, `initStairs`, `initArrows`). Namespace DOM IDs with `pyr-`, `str-`, or `arr-`. Migrated code uses React components and TypeScript modules following docs/conventions.md; the old IIFE pattern applies only to unmigrated code.

Reuse existing CSS classes and shared palette, canvas-sizing, and download helpers. Keep `buildSvg()` as the common source for preview and export. Generated SVG colors must use hex values for PowerPoint compatibility; preserve transparent backgrounds and the PNG export's 2048-pixel long edge.

## Testing Guidelines

Validation is manual; no test framework, test naming convention, or coverage threshold exists. Check all three tabs, hash-based navigation, slider extremes, color pickers, palette presets, arrow directions, and every aspect ratio. Inspect narrow and wide layouts and check the browser console for errors.

Download both SVG and PNG after relevant changes. Verify appearance, transparency, dimensions, and agreement with the preview. Recheck every generator when changing shared helpers.

## Commit & Pull Request Guidelines

Recent commits use prefixes such as `docs:` and `feat(stairs):`; older commits use plain summaries. Prefer concise, scoped messages such as `fix(arrows): prevent clipped arrowheads`.

PRs should describe the behavior changed, link related issues when applicable, and list manual checks performed. Include before/after screenshots for visual changes and export examples when rendering or download behavior changes.
