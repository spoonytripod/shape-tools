'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/tools/pyramid', label: '3D Pyramid' },
  { href: '/tools/stairs', label: '3D Stairs' },
  { href: '/tools/circular-arrows', label: 'Circular Arrows' },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            ✦
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
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
