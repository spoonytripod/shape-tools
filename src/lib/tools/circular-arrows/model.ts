import { computeCanvas, RATIO_PRESETS } from '@/lib/shared/canvas';
import { COLOR_PRESETS, distributePalette } from '@/lib/shared/color';

export type ArrowsState = {
  arrowCount: number;
  thickness: number;
  gapDeg: number;
  headPercent: number;
  direction: 'cw' | 'ccw';
  colors: string[];
  ratioIdx: number;
};

export function defaultArrowsState(): ArrowsState {
  return {
    arrowCount: 3,
    thickness: 36,
    gapDeg: 10,
    headPercent: 20,
    direction: 'cw',
    colors: distributePalette(COLOR_PRESETS.Spectrum.colors, 3, '#1f2937'),
    ratioIdx: 0,
  };
}

function ptOnCircle(
  cx: number,
  cy: number,
  r: number,
  angleRad: number,
): number[] {
  return [cx + r * Math.sin(angleRad), cy - r * Math.cos(angleRad)];
}

function buildArrowPath(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  headExtra: number,
  startA: number,
  endA: number,
  headA: number,
  dir: number,
): string {
  const sgn = dir;
  const aStart = sgn > 0 ? startA : -startA;
  const aHeadStart = sgn > 0 ? endA - headA : -(endA - headA);
  const aTip = sgn > 0 ? endA : -endA;
  const midR = (rIn + rOut) / 2;
  const headROut = rOut + headExtra;
  const headRIn = rIn - headExtra;
  const p1 = ptOnCircle(cx, cy, rOut, aStart);
  const p2 = ptOnCircle(cx, cy, rOut, aHeadStart);
  const p3 = ptOnCircle(cx, cy, headROut, aHeadStart);
  const p4 = ptOnCircle(cx, cy, midR, aTip);
  const p5 = ptOnCircle(cx, cy, headRIn, aHeadStart);
  const p6 = ptOnCircle(cx, cy, rIn, aHeadStart);
  const p7 = ptOnCircle(cx, cy, rIn, aStart);
  const sweepOuter = sgn > 0 ? 1 : 0;
  const sweepInner = sgn > 0 ? 0 : 1;
  const largeArc = Math.abs(aHeadStart - aStart) > Math.PI ? 1 : 0;
  const fmt = (p: number[]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  return [
    `M ${fmt(p1)}`,
    `A ${rOut} ${rOut} 0 ${largeArc} ${sweepOuter} ${fmt(p2)}`,
    `L ${fmt(p3)}`,
    `L ${fmt(p4)}`,
    `L ${fmt(p5)}`,
    `L ${fmt(p6)}`,
    `A ${rIn} ${rIn} 0 ${largeArc} ${sweepInner} ${fmt(p7)}`,
    'Z',
  ].join(' ');
}

export function buildArrowsSvg({
  arrowCount: N,
  thickness,
  gapDeg,
  headPercent,
  direction,
  colors,
  ratioIdx,
}: ArrowsState): string {
  const padding = 24;
  const baseR = 180;
  const half = thickness / 2;
  const rIn = baseR - half;
  const rOut = baseR + half;
  const headExtra = thickness * 0.55;
  const outerMost = rOut + headExtra;
  const artW = outerMost * 2;
  const artH = outerMost * 2;
  const { canvasW, canvasH } = computeCanvas(
    artW,
    artH,
    padding,
    RATIO_PRESETS[ratioIdx],
  );
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const TAU = Math.PI * 2;
  const segment = TAU / N;
  const gapRad = (gapDeg * Math.PI) / 180;
  const usable = Math.max(0.05, segment - gapRad);
  const headRatio = headPercent / 100;
  const headA = usable * headRatio;
  const dir = direction === 'cw' ? 1 : -1;
  const parts: string[] = [];
  for (let i = 0; i < N; i++) {
    const startA = i * segment + gapRad / 2;
    const endA = startA + usable;
    const path = buildArrowPath(
      cx,
      cy,
      rIn,
      rOut,
      headExtra,
      startA,
      endA,
      headA,
      dir,
    );
    const color = colors[i] || '#1f2937';
    parts.push(`<path d="${path}" fill="${color}"/>`);
  }
  const cw = canvasW.toFixed(2);
  const ch = canvasH.toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">
  ${parts.join('\n  ')}
</svg>`;
}
