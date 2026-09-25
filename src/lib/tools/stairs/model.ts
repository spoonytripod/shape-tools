import { computeCanvas, RATIO_PRESETS } from '@/lib/shared/canvas';
import {
  distributePalette,
  hexToRgb,
  rgbToHex,
  type Preset,
} from '@/lib/shared/color';

export const STAIRS_PRESETS: readonly Preset[] = [
  { name: 'Default', colors: ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc'] },
  { name: 'Ocean', colors: ['#0F3460', '#16537e', '#3a86ff', '#8ecae6'] },
  { name: 'Sunset', colors: ['#6a040f', '#dc2f02', '#f48c06', '#ffba08'] },
  { name: 'Forest', colors: ['#1b4332', '#2d6a4f', '#52b788', '#95d5b2'] },
  { name: 'Mono', colors: ['#212529', '#495057', '#6c757d', '#adb5bd'] },
  { name: 'Growth', colors: ['#047857', '#10b981', '#34d399', '#6ee7b7'] },
];

export type StairsState = {
  stepCount: number;
  stepHeight: number;
  colors: string[];
  ratioIdx: number;
};

export function defaultStairsState(): StairsState {
  return {
    stepCount: 4,
    stepHeight: 56,
    colors: distributePalette(STAIRS_PRESETS[0].colors, 4, '#6366f1'),
    ratioIdx: 0,
  };
}

function shade(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex);
  const t = pct < 0 ? 0 : 255;
  const p = Math.abs(pct) / 100;
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
}

export function buildStairsSvg({
  stepCount: N,
  stepHeight: u,
  colors,
  ratioIdx,
}: StairsState): string {
  const s = 64;
  const tilt = 0.5;
  const padding = 28;
  const vr = s * tilt;
  const tallest = N * u;
  const minX = -s;
  const maxX = N * s;
  const maxY = vr;
  const minY = -N * vr - tallest;
  const artW = maxX - minX;
  const artH = maxY - minY;
  const { canvasW, canvasH } = computeCanvas(
    artW,
    artH,
    padding,
    RATIO_PRESETS[ratioIdx],
  );
  const dx = canvasW / 2 - (minX + maxX) / 2;
  const dy = canvasH / 2 - (minY + maxY) / 2;
  const fmt = (p: number[]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const parts: string[] = [];

  // Draw rear cubes first so the foreground remains visible.
  for (let i = N - 1; i >= 0; i--) {
    const X = i * s + dx;
    const Y = -i * vr + dy;
    const h = (i + 1) * u;
    const Yt = Y - h;
    const bF = [X, Y + vr];
    const bR = [X + s, Y];
    const bL = [X - s, Y];
    const tF = [X, Yt + vr];
    const tR = [X + s, Yt];
    const tB = [X, Yt - vr];
    const tL = [X - s, Yt];
    const base = colors[i] || '#6366f1';
    const colorTop = shade(base, 14);
    const colorRight = shade(base, -8);
    const colorLeft = shade(base, -24);
    parts.push(
      `<polygon points="${fmt(bL)} ${fmt(bF)} ${fmt(tF)} ${fmt(tL)}" fill="${colorLeft}"/>`,
    );
    parts.push(
      `<polygon points="${fmt(bF)} ${fmt(bR)} ${fmt(tR)} ${fmt(tF)}" fill="${colorRight}"/>`,
    );
    parts.push(
      `<polygon points="${fmt(tF)} ${fmt(tR)} ${fmt(tB)} ${fmt(tL)}" fill="${colorTop}"/>`,
    );
  }
  const cw = canvasW.toFixed(2);
  const ch = canvasH.toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">
  ${parts.join('\n  ')}
</svg>`;
}
