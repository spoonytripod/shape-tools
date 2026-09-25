'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers3,
  Triangle,
  ChartNoAxesColumnIncreasing,
  RefreshCw,
} from 'lucide-react';

const links = [
  { href: '/tools/pyramid', label: '3D Pyramid', icon: Triangle },
  {
    href: '/tools/stairs',
    label: '3D Stairs',
    icon: ChartNoAxesColumnIncreasing,
  },
  { href: '/tools/circular-arrows', label: 'Circular Arrows', icon: RefreshCw },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="topnav">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="topnav-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <Layers3 size={21} strokeWidth={1.7} />
          </span>
          Asset Tools
        </Link>
        <nav className="nav-tabs" aria-label="Tools">
          {links.map((link) => (
            <Link
              className={`nav-tab${pathname === link.href ? ' active' : ''}`}
              href={link.href}
              key={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              <link.icon size={15} aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="header-note">A little shape goes a long way.</span>
      </div>
    </header>
  );
}
