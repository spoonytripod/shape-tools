export type Preset = { name: string; colors: readonly string[] };

// One ordered palette catalog for every shape tool. The color order is significant:
// the first color maps to the first layer, step, or arrow.
export const COLOR_PRESETS = {
  Default: {
    name: 'Default',
    colors: ['#E8A33D', '#4D7CC7', '#3BAA9C'],
  },
  Mono: {
    name: 'Mono',
    colors: ['#212529', '#495057', '#6c757d', '#adb5bd'],
  },
  Ocean: {
    name: 'Ocean',
    colors: ['#0F3460', '#16537e', '#3a86ff', '#8ecae6'],
  },
  Sunset: {
    name: 'Sunset',
    colors: ['#6a040f', '#dc2f02', '#f48c06', '#ffba08'],
  },
  Forest: {
    name: 'Forest',
    colors: ['#1b4332', '#2d6a4f', '#52b788', '#95d5b2'],
  },
  Pastel: {
    name: 'Pastel',
    colors: ['#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff'],
  },
  Spectrum: {
    name: 'Spectrum',
    colors: [
      '#ef4444',
      '#f59e0b',
      '#10b981',
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#14b8a6',
    ],
  },
  Indigo: {
    name: 'Indigo',
    colors: ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc'],
  },
  Corporate: {
    name: 'Corporate',
    colors: ['#0F62FE', '#393939'],
  },
} as const satisfies Record<string, Preset>;

export const SHARED_PRESETS: readonly Preset[] = Object.values(COLOR_PRESETS);

export function applyColorOrder(
  colors: readonly string[],
  reversed: boolean,
): string[] {
  return reversed ? [...colors].reverse() : [...colors];
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const expanded =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  return [
    parseInt(expanded.substring(0, 2), 16),
    parseInt(expanded.substring(2, 4), 16),
    parseInt(expanded.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function distributePalette(
  palette: readonly string[],
  n: number,
  fallback: string,
): string[] {
  if (n <= 0) return [];
  if (palette.length === 0) return new Array<string>(n).fill(fallback);
  if (palette.length === 1) return new Array<string>(n).fill(palette[0]);
  if (n === 1) return [palette[0]];
  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (palette.length - 1);
    const idx = Math.floor(t);
    const frac = t - idx;
    if (idx >= palette.length - 1) {
      result.push(palette[palette.length - 1]);
    } else {
      const [r1, g1, b1] = hexToRgb(palette[idx]);
      const [r2, g2, b2] = hexToRgb(palette[idx + 1]);
      result.push(
        rgbToHex(
          r1 + (r2 - r1) * frac,
          g1 + (g2 - g1) * frac,
          b1 + (b2 - b1) * frac,
        ),
      );
    }
  }
  return result;
}

export function resizeColors(
  colors: readonly string[],
  count: number,
  fallback: string,
): string[] {
  const next = colors.slice(0, count);
  const fill = next[next.length - 1] || fallback;
  while (next.length < count) next.push(fill);
  return next;
}
