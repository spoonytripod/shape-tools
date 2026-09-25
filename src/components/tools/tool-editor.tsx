'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RATIO_PRESETS } from '@/lib/shared/canvas';
import {
  distributePalette,
  resizeColors,
  type Preset,
} from '@/lib/shared/color';
import { downloadPng, downloadSvg } from '@/lib/shared/download';
import {
  buildPyramidSvg,
  defaultPyramidState,
  PYRAMID_PRESETS,
} from '@/lib/tools/pyramid/model';
import {
  buildStairsSvg,
  defaultStairsState,
  STAIRS_PRESETS,
} from '@/lib/tools/stairs/model';
import {
  buildArrowsSvg,
  defaultArrowsState,
  ARROWS_PRESETS,
} from '@/lib/tools/circular-arrows/model';

type ToolId = 'pyramid' | 'stairs' | 'circular-arrows';

function RangeControl({
  id,
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="control-group">
      <div className="slider-label">
        <label htmlFor={id}>{label}</label>
        <span className="slider-value">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function PresetControls({
  presets,
  count,
  fallback,
  onSelect,
}: {
  presets: readonly Preset[];
  count: number;
  fallback: string;
  onSelect: (colors: string[]) => void;
}) {
  return (
    <div className="preset-row">
      {presets.map((preset) => (
        <Button
          key={preset.name}
          type="button"
          variant="outline"
          size="sm"
          className="preset"
          onClick={() =>
            onSelect(distributePalette(preset.colors, count, fallback))
          }
        >
          <span className="preset-swatches" aria-hidden="true">
            {preset.colors.map((color, index) => (
              <span
                className="preset-swatch"
                style={{ background: color }}
                key={`${color}-${index}`}
              />
            ))}
          </span>
          {preset.name}
        </Button>
      ))}
    </div>
  );
}

function ColorControls({
  colors,
  labelAt,
  onChange,
}: {
  colors: readonly string[];
  labelAt: (index: number) => string;
  onChange: (index: number, color: string) => void;
}) {
  return (
    <div className="item-colors">
      {colors.map((color, index) => {
        const label = labelAt(index);
        return (
          <div className="item-row" key={index}>
            <label className="item-name" htmlFor={`color-${index}`}>
              {label}
            </label>
            <span className="hex-display">{color.toUpperCase()}</span>
            <input
              id={`color-${index}`}
              type="color"
              value={color}
              aria-label={`${label} color`}
              onChange={(event) => onChange(index, event.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}

export function ToolEditor({ tool }: { tool: ToolId }) {
  const [pyramid, setPyramid] = useState(defaultPyramidState);
  const [stairs, setStairs] = useState(defaultStairsState);
  const [arrows, setArrows] = useState(defaultArrowsState);
  const [error, setError] = useState('');

  const state =
    tool === 'pyramid' ? pyramid : tool === 'stairs' ? stairs : arrows;
  const ratioIdx = state.ratioIdx;
  const ratio = RATIO_PRESETS[ratioIdx];
  const svg = useMemo(() => {
    if (tool === 'pyramid') return buildPyramidSvg(pyramid);
    if (tool === 'stairs') return buildStairsSvg(stairs);
    return buildArrowsSvg(arrows);
  }, [tool, pyramid, stairs, arrows]);

  const names = {
    pyramid: {
      title: '3D Pyramid Generator',
      subtitle: 'Adjust layer count and colors, then export',
    },
    stairs: {
      title: '3D Stairs Generator',
      subtitle: 'Adjust step count, height, and colors, then export',
    },
    'circular-arrows': {
      title: 'Circular Arrows Generator',
      subtitle: 'Adjust arrow count, style, and colors, then export',
    },
  } as const;
  const filename =
    tool === 'pyramid'
      ? `pyramid_${pyramid.layerCount}layers`
      : tool === 'stairs'
        ? `stairs_${stairs.stepCount}steps`
        : `circular_arrows_${arrows.arrowCount}`;
  const setRatio = (value: number) => {
    if (tool === 'pyramid')
      setPyramid((current) => ({ ...current, ratioIdx: value }));
    else if (tool === 'stairs')
      setStairs((current) => ({ ...current, ratioIdx: value }));
    else setArrows((current) => ({ ...current, ratioIdx: value }));
  };
  const updateColor = (index: number, color: string) => {
    const update = (colors: string[]) =>
      colors.map((item, i) => (i === index ? color : item));
    if (tool === 'pyramid')
      setPyramid((current) => ({ ...current, colors: update(current.colors) }));
    else if (tool === 'stairs')
      setStairs((current) => ({ ...current, colors: update(current.colors) }));
    else
      setArrows((current) => ({ ...current, colors: update(current.colors) }));
  };
  const setColors = (colors: string[]) => {
    if (tool === 'pyramid') setPyramid((current) => ({ ...current, colors }));
    else if (tool === 'stairs')
      setStairs((current) => ({ ...current, colors }));
    else setArrows((current) => ({ ...current, colors }));
  };
  const presets =
    tool === 'pyramid'
      ? PYRAMID_PRESETS
      : tool === 'stairs'
        ? STAIRS_PRESETS
        : ARROWS_PRESETS;
  const fallback =
    tool === 'pyramid' ? '#888888' : tool === 'stairs' ? '#6366f1' : '#1f2937';
  const colors = state.colors;
  const previewStyle = {
    '--preview-ratio': `${ratio.w} / ${ratio.h}`,
    '--preview-w': ratio.w,
    '--preview-h': ratio.h,
  } as CSSProperties;

  return (
    <main className="tool-page active">
      <div className="container">
        <Card className="panel control-panel">
          <h1>{names[tool].title}</h1>
          <p className="subtitle">{names[tool].subtitle}</p>

          {tool === 'pyramid' && (
            <>
              <RangeControl
                id="pyr-layersSlider"
                label="Layers"
                value={pyramid.layerCount}
                min={2}
                max={8}
                onChange={(layerCount) =>
                  setPyramid((current) => ({
                    ...current,
                    layerCount,
                    colors: resizeColors(current.colors, layerCount, '#3BAA9C'),
                  }))
                }
              />
              <RangeControl
                id="pyr-gapSlider"
                label="Gap"
                value={pyramid.layerGap}
                min={5}
                max={20}
                onChange={(layerGap) =>
                  setPyramid((current) => ({ ...current, layerGap }))
                }
              />
            </>
          )}
          {tool === 'stairs' && (
            <>
              <RangeControl
                id="str-stepsSlider"
                label="Steps"
                value={stairs.stepCount}
                min={2}
                max={8}
                onChange={(stepCount) =>
                  setStairs((current) => ({
                    ...current,
                    stepCount,
                    colors: resizeColors(current.colors, stepCount, '#6366f1'),
                  }))
                }
              />
              <RangeControl
                id="str-heightSlider"
                label="Step Height"
                value={stairs.stepHeight}
                min={20}
                max={120}
                onChange={(stepHeight) =>
                  setStairs((current) => ({ ...current, stepHeight }))
                }
              />
            </>
          )}
          {tool === 'circular-arrows' && (
            <>
              <RangeControl
                id="arr-arrowsSlider"
                label="Arrows"
                value={arrows.arrowCount}
                min={1}
                max={5}
                onChange={(arrowCount) =>
                  setArrows((current) => ({
                    ...current,
                    arrowCount,
                    colors: resizeColors(current.colors, arrowCount, '#1f2937'),
                  }))
                }
              />
              <RangeControl
                id="arr-thicknessSlider"
                label="Thickness"
                value={arrows.thickness}
                min={14}
                max={140}
                onChange={(thickness) =>
                  setArrows((current) => ({ ...current, thickness }))
                }
              />
              <RangeControl
                id="arr-gapSlider"
                label="Gap"
                value={arrows.gapDeg}
                min={0}
                max={30}
                suffix="°"
                onChange={(gapDeg) =>
                  setArrows((current) => ({ ...current, gapDeg }))
                }
              />
              <RangeControl
                id="arr-headSlider"
                label="Head Size"
                value={arrows.headPercent}
                min={1}
                max={40}
                suffix="%"
                onChange={(headPercent) =>
                  setArrows((current) => ({ ...current, headPercent }))
                }
              />
              <div className="control-group">
                <div className="slider-label">Direction</div>
                <div
                  className="toggle-row"
                  role="group"
                  aria-label="Arrow direction"
                >
                  <Button
                    type="button"
                    variant={arrows.direction === 'cw' ? 'default' : 'outline'}
                    aria-pressed={arrows.direction === 'cw'}
                    onClick={() =>
                      setArrows((current) => ({ ...current, direction: 'cw' }))
                    }
                  >
                    Clockwise
                  </Button>
                  <Button
                    type="button"
                    variant={arrows.direction === 'ccw' ? 'default' : 'outline'}
                    aria-pressed={arrows.direction === 'ccw'}
                    onClick={() =>
                      setArrows((current) => ({ ...current, direction: 'ccw' }))
                    }
                  >
                    Counter-clockwise
                  </Button>
                </div>
              </div>
            </>
          )}

          <h2>Color Presets</h2>
          <PresetControls
            presets={presets}
            count={colors.length}
            fallback={fallback}
            onSelect={setColors}
          />
          <h2>
            {tool === 'pyramid'
              ? 'Layer Colors (Top → Bottom)'
              : tool === 'stairs'
                ? 'Step Colors (Front → Back)'
                : 'Arrow Colors'}
          </h2>
          <ColorControls
            colors={colors}
            labelAt={(index) => {
              if (tool === 'pyramid')
                return `Layer ${index + 1}${index === 0 ? ' (Top)' : index === colors.length - 1 ? ' (Bottom)' : ''}`;
              if (tool === 'stairs')
                return `Step ${index + 1}${index === 0 ? ' (Front)' : index === colors.length - 1 ? ' (Back)' : ''}`;
              return `Arrow ${index + 1}`;
            }}
            onChange={updateColor}
          />
        </Card>

        <div className="right-stack">
          <Card className="panel download-panel">
            <Button
              type="button"
              className="download-btn secondary"
              onClick={async () => {
                setError('');
                try {
                  await downloadPng(svg, `${filename}.png`);
                } catch {
                  setError('Could not render PNG. Please try SVG download.');
                }
              }}
            >
              Download PNG
            </Button>
            <Button
              type="button"
              className="download-btn"
              onClick={() => downloadSvg(svg, `${filename}.svg`)}
            >
              Download SVG
            </Button>
            {error && (
              <p className="download-error" role="alert">
                {error}
              </p>
            )}
          </Card>
          <Card className="panel preview-panel">
            <div className="preview-header">
              <span className="preview-title">Preview</span>
              <div className="preview-controls">
                <label className="sr-only" htmlFor="ratio-select">
                  Aspect ratio
                </label>
                <select
                  className="ratio-select"
                  id="ratio-select"
                  value={ratioIdx}
                  onChange={(event) => setRatio(Number(event.target.value))}
                >
                  {RATIO_PRESETS.map((item, index) => (
                    <option value={index} key={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="svg-bg" style={previewStyle}>
              <div
                className="svg-out"
                role="img"
                aria-label={`${names[tool].title} preview`}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
