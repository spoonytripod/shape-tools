export type Preset = { name: string; colors: readonly string[] };

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
