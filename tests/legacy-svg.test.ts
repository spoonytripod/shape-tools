import { describe, expect, it } from 'vitest';
import baseline from './fixtures/legacy-svg.json';
import { resizeColors } from '@/lib/shared/color';
import {
  buildPyramidSvg,
  defaultPyramidState,
} from '@/lib/tools/pyramid/model';
import { buildStairsSvg, defaultStairsState } from '@/lib/tools/stairs/model';
import {
  buildArrowsSvg,
  defaultArrowsState,
} from '@/lib/tools/circular-arrows/model';

const normalize = (svg: string) => svg.replace(/\r\n/g, '\n');

describe('SVG output preserved from the original application', () => {
  it('matches the pyramid across aspect ratios and slider boundaries', () => {
    const state = defaultPyramidState();
    expect(normalize(buildPyramidSvg(state))).toBe(
      normalize(baseline.pyramid.default),
    );
    baseline.pyramid.ratios.forEach((svg, ratioIdx) => {
      expect(normalize(buildPyramidSvg({ ...state, ratioIdx }))).toBe(
        normalize(svg),
      );
    });
    for (const caseData of baseline.pyramid.extremes) {
      if (caseData.control === 'layersSlider') {
        state.layerCount = caseData.value;
        state.colors = resizeColors(state.colors, state.layerCount, '#3BAA9C');
      } else state.layerGap = caseData.value;
      expect(normalize(buildPyramidSvg(state))).toBe(normalize(caseData.svg));
    }
  });

  it('matches the stairs across aspect ratios and slider boundaries', () => {
    const state = defaultStairsState();
    expect(normalize(buildStairsSvg(state))).toBe(
      normalize(baseline.stairs.default),
    );
    baseline.stairs.ratios.forEach((svg, ratioIdx) => {
      expect(normalize(buildStairsSvg({ ...state, ratioIdx }))).toBe(
        normalize(svg),
      );
    });
    for (const caseData of baseline.stairs.extremes) {
      if (caseData.control === 'stepsSlider') {
        state.stepCount = caseData.value;
        state.colors = resizeColors(state.colors, state.stepCount, '#6366f1');
      } else state.stepHeight = caseData.value;
      expect(normalize(buildStairsSvg(state))).toBe(normalize(caseData.svg));
    }
  });

  it('matches arrows across aspect ratios, boundaries, and direction', () => {
    const state = defaultArrowsState();
    expect(normalize(buildArrowsSvg(state))).toBe(
      normalize(baseline['circular-arrows'].default),
    );
    baseline['circular-arrows'].ratios.forEach((svg, ratioIdx) => {
      expect(normalize(buildArrowsSvg({ ...state, ratioIdx }))).toBe(
        normalize(svg),
      );
    });
    for (const caseData of baseline['circular-arrows'].extremes) {
      switch (caseData.control) {
        case 'arrowsSlider':
          state.arrowCount = caseData.value;
          state.colors = resizeColors(
            state.colors,
            state.arrowCount,
            '#1f2937',
          );
          break;
        case 'thicknessSlider':
          state.thickness = caseData.value;
          break;
        case 'gapSlider':
          state.gapDeg = caseData.value;
          break;
        case 'headSlider':
          state.headPercent = caseData.value;
          break;
      }
      expect(normalize(buildArrowsSvg(state))).toBe(normalize(caseData.svg));
    }
    state.direction = 'ccw';
    expect(normalize(buildArrowsSvg(state))).toBe(
      normalize(baseline['circular-arrows'].counterClockwise),
    );
  });
});
