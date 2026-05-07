# Asset Tools

> Parametric SVG/PNG asset generator — clean 3D pyramids and circular arrow diagrams for slides, docs, and presentations.

🔗 **Live demo:** https://spoonytripod.github.io/asset-tools/

## What it does

Asset Tools is a single-page web app that generates customizable graphics directly in the browser. No installation, no signup, no cloud roundtrip — just open the page, tweak the controls, and download an SVG or PNG with a transparent background.

## Tools

### 3D Pyramid Generator
- Stacked frustum pyramid rendered in faux-3D
- 2–8 layers, adjustable inter-layer gap
- Per-layer color picker plus curated palette presets
- Soft inter-layer shadows for depth

### Circular Arrows Generator
- 2–7 arrows arranged radially
- Adjustable thickness, gap angle, head size
- Clockwise / counter-clockwise direction toggle
- Per-arrow color picker plus palette presets

## Common features

- **Aspect ratio presets** — 1:1, 4:3, 16:9, 3:4, 9:16. The preview panel and the exported file both follow the chosen ratio.
- **Transparent background** for both SVG and PNG output.
- **PNG export** at a fixed 2048 px long edge for consistent quality across ratios.
- **PowerPoint-friendly SVG** — hex colors only, no `hsl()` / `rgba()` that some renderers fail on.
- **Smart palette distribution** — preset palettes are interpolated across the active item count without forcing a layer/arrow count change.

## Usage

Open the live demo, or run locally:

```bash
git clone https://github.com/spoonytripod/asset-tools.git
cd asset-tools
# open index.html directly in a browser, or serve with any static server
```

## Tech stack

- Vanilla HTML / CSS / JavaScript — no frameworks, no build step
- CSS `aspect-ratio`, `min()`, and custom properties for the responsive preview
- Inline SVG generation for both preview rendering and export

## Browser support

Latest Chrome, Firefox, Safari, Edge. Requires CSS `aspect-ratio` and `min()` (i.e. browsers from 2021+).

## Repository layout

```
.
├── index.html       # main app
├── legacy/          # original standalone tool versions, kept for reference
└── .gitignore
```

## License

MIT
