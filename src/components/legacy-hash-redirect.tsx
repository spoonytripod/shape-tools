'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const legacyRoutes: Record<string, string> = {
  '#page-pyramid': '/tools/pyramid',
  '#page-stairs': '/tools/stairs',
  '#page-arrows': '/tools/circular-arrows',
};

export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    const route = legacyRoutes[window.location.hash];
    if (route) router.replace(route);
  }, [router]);
  return null;
}
