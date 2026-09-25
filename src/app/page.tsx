import Link from 'next/link';
import { LegacyHashRedirect } from '@/components/legacy-hash-redirect';

const tools = [
  {
    href: '/tools/pyramid',
    title: '3D Pyramid',
    description: 'Stacked layers with adjustable gaps and colors.',
    glyph: '△',
  },
  {
    href: '/tools/stairs',
    title: '3D Stairs',
    description: 'Isometric steps for progress and process diagrams.',
    glyph: '▥',
  },
  {
    href: '/tools/circular-arrows',
    title: 'Circular Arrows',
    description: 'Radial arrows for cycles and repeated flows.',
    glyph: '↻',
  },
];

export default function HomePage() {
  return (
    <main className="home-page">
      <LegacyHashRedirect />
      <div className="home-intro">
        <p className="eyebrow">Presentation & document graphics</p>
        <h1>Make the shape you need.</h1>
        <p>
          Choose a tool, adjust its details, and download a transparent SVG or
          PNG.
        </p>
      </div>
      <div className="tool-grid">
        {tools.map((tool) => (
          <Link className="tool-card" href={tool.href} key={tool.href}>
            <span className="tool-glyph" aria-hidden="true">
              {tool.glyph}
            </span>
            <span className="tool-card-title">
              {tool.title} <span aria-hidden="true">↗</span>
            </span>
            <span className="tool-card-description">{tool.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
