# Shape Tools

Create customizable diagrams for presentations and documents, then download transparent SVG or PNG files.

The Next.js app is available locally; public deployment to Vercel is planned. Root `index.html` remains the original standalone demo.

## Tools

- **3D Pyramid:** 2–8 layers, adjustable gaps, color pickers, and palette presets.
- **3D Stairs:** 2–8 steps, adjustable height, individual colors, and presets.
- **Circular Arrows:** 1–5 arrows, thickness, gap, head size, direction, and colors.

Each tool supports five aspect ratios. SVG and PNG exports have transparent backgrounds; PNG uses a 2048 px long edge. Generated SVG colors use hex values for broad presentation-software compatibility.

On desktop, shape controls, the live preview and download buttons, and color controls sit side by side so the export actions stay in the first screen. Switch the preview between transparent, white, black, and a custom color (picker or HEX value) to check contrast; this does not change exported files. On mobile, the preview and download actions appear before the controls.

Changing the number of layers, steps, or arrows automatically redistributes the selected color palette. Individual color edits also remain the source for later count changes. The color-order button reverses how colors map to shapes and keeps that order when selecting a preset or changing the count.

All three tools share nine color presets: Default, Mono, Ocean, Sunset, Forest, Pastel, Spectrum, Indigo, and Corporate. Each tool opens with its familiar colors (Default for Pyramid, Indigo for Stairs, Spectrum for Circular Arrows).

## Development

Requires Node.js compatible with the installed Next.js version and npm. From the repository root:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The landing page lists the tools at `/tools/pyramid`, `/tools/stairs`, and `/tools/circular-arrows`. Old `/#page-*` links are recognized on the new app.

```bash
npm run typecheck      # TypeScript diagnostics
npm run lint           # ESLint
npm run format:check   # Prettier verification
npm test               # SVG regression tests
npm run build          # production build
npm run test:e2e       # browser flows; run npx playwright install chromium first
```

The app uses Next.js App Router, TypeScript, shadcn/ui, and browser-side SVG/PNG generation. `src/app/` contains routes and styles, `src/components/` contains UI, and `src/lib/` contains shared and tool-specific generation code. `tests/` contains regression and browser tests. The original `index.html` remains at the root as a local reference; `legacy/` holds earlier standalone tools.

See [project documentation](docs/README.md) for goals, migration status, conventions, and decisions. [AGENTS.md](AGENTS.md) is the contributor guide.

## License

MIT
