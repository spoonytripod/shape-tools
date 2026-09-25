import { computeCanvas, RATIO_PRESETS } from '@/lib/shared/canvas';
import { COLOR_PRESETS, distributePalette, rgbToHex } from '@/lib/shared/color';

export type PyramidState = {
  layerCount: number;
  layerGap: number;
  colors: string[];
  ratioIdx: number;
};

export function defaultPyramidState(): PyramidState {
  return {
    layerCount: 3,
    layerGap: 8,
    colors: distributePalette(COLOR_PRESETS.Default.colors, 3, '#888888'),
    ratioIdx: 0,
  };
}

function hexToHsl(hex: string): [number, number, number] {
  const raw = hex.replace('#', '');
  const value =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const r = parseInt(value.substring(0, 2), 16) / 255;
  const g = parseInt(value.substring(2, 4), 16) / 255;
  const b = parseInt(value.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (hp < 1) {
    r1 = c;
    g1 = x;
  } else if (hp < 2) {
    r1 = x;
    g1 = c;
  } else if (hp < 3) {
    g1 = c;
    b1 = x;
  } else if (hp < 4) {
    g1 = x;
    b1 = c;
  } else if (hp < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  const m = l - c / 2;
  return [(r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255];
}

function shade(hex: string, delta: number): string {
  const [h, s, l] = hexToHsl(hex);
  const [r, g, b] = hslToRgb(h, s, Math.max(0, Math.min(100, l + delta)));
  return rgbToHex(r, g, b);
}

export function buildPyramidSvg({
  layerCount: N,
  layerGap: gap,
  colors,
  ratioIdx,
}: PyramidState): string {
  const W = 220;
  const totalH = 260;
  const H = Math.max(1, (totalH - gap * (N - 1)) / N);
  const tilt = 0.42;
  const padding = 28;
  const shadowOffset = Math.max(3, gap * 0.8);
  const artW = 2 * W;
  const artH = totalH + W * tilt;
  const { canvasW, canvasH } = computeCanvas(
    artW,
    artH,
    padding,
    RATIO_PRESETS[ratioIdx],
  );
  const cx = canvasW / 2;
  const groundY = canvasH / 2 + artH / 2 - W * tilt;
  const fmt = (p: number[]) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const defs: string[] = [];
  const bodyParts: string[] = [];

  defs.push(`<filter id="layerShadow" x="-20%" y="-20%" width="140%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${(gap * 0.6).toFixed(2)}"/>
    </filter>`);
  const widthAt = (yFromGround: number) => W * (1 - yFromGround / totalH);

  for (let i = 0; i < N; i++) {
    const yBaseFromGround = i * (H + gap);
    const yTopFromGround = yBaseFromGround + H;
    const Wb = widthAt(yBaseFromGround);
    const Wt = widthAt(yTopFromGround);
    const yB = groundY - yBaseFromGround;
    const yT = groundY - yTopFromGround;
    const bF = [cx, yB + Wb * tilt];
    const bR = [cx + Wb, yB];
    const bL = [cx - Wb, yB];
    const tF = [cx, yT + Wt * tilt];
    const tR = [cx + Wt, yT];
    const tB = [cx, yT - Wt * tilt];
    const tL = [cx - Wt, yT];
    const base = colors[N - 1 - i] || '#888888';
    const colorTop = shade(base, 10);
    const colorRight = shade(base, -4);
    const colorLeft = shade(base, -20);
    let dropShadow = '';
    if (i < N - 1) {
      const Wu = widthAt(yTopFromGround + gap);
      const yShadow = yT - gap;
      const sF = [cx, yShadow + Wu * tilt + shadowOffset];
      const sR = [cx + Wu, yShadow + shadowOffset];
      const sB = [cx, yShadow - Wu * tilt + shadowOffset];
      const sL = [cx - Wu, yShadow + shadowOffset];
      dropShadow = `<polygon points="${fmt(sF)} ${fmt(sR)} ${fmt(sB)} ${fmt(sL)}" fill="#000000" fill-opacity="0.28" filter="url(#layerShadow)"/>`;
    }
    bodyParts.push(
      `<polygon points="${fmt(bL)} ${fmt(bF)} ${fmt(tF)} ${fmt(tL)}" fill="${colorLeft}"/>`,
    );
    bodyParts.push(
      `<polygon points="${fmt(bF)} ${fmt(bR)} ${fmt(tR)} ${fmt(tF)}" fill="${colorRight}"/>`,
    );
    if (Wt > 0.01)
      bodyParts.push(
        `<polygon points="${fmt(tF)} ${fmt(tR)} ${fmt(tB)} ${fmt(tL)}" fill="${colorTop}"/>`,
      );
    if (i < N - 1) bodyParts.push(dropShadow);
  }
  const cw = canvasW.toFixed(2);
  const ch = canvasH.toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">
  <defs>
    ${defs.join('\n    ')}
  </defs>
  ${bodyParts.join('\n  ')}
</svg>`;
}
