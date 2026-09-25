import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';
import { LegacyHashRedirect } from '@/components/legacy-hash-redirect';
import {
  buildPyramidSvg,
  defaultPyramidState,
} from '@/lib/tools/pyramid/model';
import { buildStairsSvg, defaultStairsState } from '@/lib/tools/stairs/model';
import {
  buildArrowsSvg,
  defaultArrowsState,
} from '@/lib/tools/circular-arrows/model';

const tools = [
  {
    href: '/tools/pyramid',
    title: '3D Pyramid',
    description:
      'Give hierarchies, priorities, and big ideas a little perspective.',
    category: 'Hierarchy & structure',
    className: 'pyramid',
    svg: buildPyramidSvg(defaultPyramidState()),
  },
  {
    href: '/tools/stairs',
    title: '3D Stairs',
    description:
      'Show the next step. Make progress and milestones easy to see.',
    category: 'Progress & milestones',
    className: 'stairs',
    svg: buildStairsSvg(defaultStairsState()),
  },
  {
    href: '/tools/circular-arrows',
    title: 'Circular Arrows',
    description:
      'Connect the dots between cycles, processes, and repeatable flows.',
    category: 'Cycles & processes',
    className: 'arrows',
    svg: buildArrowsSvg(defaultArrowsState()),
  },
];

export default function HomePage() {
  return (
    <main className="home-page" id="main-content">
      <LegacyHashRedirect />
      <div className="home-intro">
        <h1>
          Good ideas deserve
          <br />a better shape.
        </h1>
        <div className="home-intro-copy">
          <p>
            A small collection of tools for clearer presentations. Shape it,
            color it, make it yours.
          </p>
          <span>
            <Check size={15} aria-hidden="true" /> Free SVG & PNG exports. No
            sign-up.
          </span>
        </div>
      </div>
      <div className="collection-heading">
        <h2>Your creative toolkit</h2>
        <span>3 tools, endless possibilities</span>
      </div>
      <div className="tool-grid">
        {tools.map((tool) => (
          <Link
            className={`tool-card tool-card-${tool.className}`}
            href={tool.href}
            key={tool.href}
          >
            <div
              className="tool-art"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: tool.svg }}
            />
            <div className="tool-card-copy">
              <span className="tool-category">{tool.category}</span>
              <div className="tool-card-title">
                <h3>{tool.title}</h3>
                <span className="open-tool">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
              <p className="tool-card-description">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <footer className="home-footer">
        <span>Made for the ideas you want to share.</span>
        <span>Custom colors. Crisp vectors. Transparent backgrounds.</span>
      </footer>
    </main>
  );
}
