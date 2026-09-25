export type Ratio = { label: string; w: number; h: number };

export const RATIO_PRESETS: readonly Ratio[] = [
  { label: 'Square 1:1', w: 1, h: 1 },
  { label: 'Landscape 4:3', w: 4, h: 3 },
  { label: 'Landscape 16:9', w: 16, h: 9 },
  { label: 'Portrait 3:4', w: 3, h: 4 },
  { label: 'Portrait 9:16', w: 9, h: 16 },
];

export function computeCanvas(
  artW: number,
  artH: number,
  padding: number,
  ratio: Ratio,
) {
  const minW = artW + 2 * padding;
  const minH = artH + 2 * padding;
  const targetAR = ratio.w / ratio.h;
  if (minW / minH > targetAR) {
    return { canvasW: minW, canvasH: minW / targetAR };
  }
  return { canvasW: minH * targetAR, canvasH: minH };
}
