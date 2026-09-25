# Asset Tools

Create customizable diagrams for presentations and documents, then download transparent SVG or PNG files.

The new Next.js app is available locally. The [GitHub Pages demo](https://spoonytripod.github.io/asset-tools/) still serves the original single-file version while deployment moves to Vercel.

## Tools

- **3D Pyramid:** 2–8 layers, adjustable gaps, color pickers, and palette presets.
- **3D Stairs:** 2–8 steps, adjustable height, individual colors, and presets.
- **Circular Arrows:** 1–5 arrows, thickness, gap, head size, direction, and colors.

Each tool supports five aspect ratios. SVG and PNG exports have transparent backgrounds; PNG uses a 2048 px long edge. Generated SVG colors use hex values for broad presentation-software compatibility.

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

The app uses Next.js App Router, TypeScript, shadcn/ui, and browser-side SVG/PNG generation. `src/app/` contains routes and styles, `src/components/` contains UI, and `src/lib/` contains shared and tool-specific generation code. `tests/` contains regression and browser tests. The original `index.html` remains at the root for the current GitHub Pages demo; `legacy/` holds earlier standalone tools.

See [project documentation](docs/README.md) for goals, migration status, conventions, and decisions. [AGENTS.md](AGENTS.md) is the contributor guide.

## License

MIT
