'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Download,
  Image as ImageIcon,
  Palette,
  SlidersHorizontal,
  Square,
  Circle,
  RotateCw,
  RotateCcw,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RATIO_PRESETS } from '@/lib/shared/canvas';
import {
  COLOR_PRESETS,
  distributePalette,
  SHARED_PRESETS,
  type Preset,
} from '@/lib/shared/color';
import { downloadPng, downloadSvg } from '@/lib/shared/download';
import {
  buildPyramidSvg,
  defaultPyramidState,
} from '@/lib/tools/pyramid/model';
import { buildStairsSvg, defaultStairsState } from '@/lib/tools/stairs/model';
import {
  buildArrowsSvg,
  defaultArrowsState,
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
        name={id}
        style={
          {
            '--range-progress': `${((value - min) / (max - min)) * 100}%`,
          } as CSSProperties
        }
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function PresetControls({
  presets,
  count,
  fallback,
  colors,
  onSelect,
}: {
  presets: readonly Preset[];
  count: number;
  fallback: string;
  colors: readonly string[];
  onSelect: (preset: Preset) => void;
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
          aria-pressed={distributePalette(preset.colors, count, fallback).every(
            (color, index) =>
              color.toLowerCase() === colors[index]?.toLowerCase(),
          )}
          onClick={() => onSelect(preset)}
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
              name={`color-${index}`}
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
  const [paletteSources, setPaletteSources] = useState<
    Record<ToolId, readonly string[]>
  >({
    pyramid: COLOR_PRESETS.Default.colors,
    stairs: COLOR_PRESETS.Indigo.colors,
    'circular-arrows': COLOR_PRESETS.Spectrum.colors,
  });
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [background, setBackground] = useState('transparent');
  const [customBackground, setCustomBackground] = useState('#d9e7f3');
  const [customHex, setCustomHex] = useState('#D9E7F3');

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
    setPaletteSources((current) => ({
      ...current,
      [tool]: update(state.colors),
    }));
    if (tool === 'pyramid')
      setPyramid((current) => ({ ...current, colors: update(current.colors) }));
    else if (tool === 'stairs')
      setStairs((current) => ({ ...current, colors: update(current.colors) }));
    else
      setArrows((current) => ({ ...current, colors: update(current.colors) }));
  };
  const setColors = (preset: Preset) => {
    const colors = distributePalette(
      preset.colors,
      state.colors.length,
      fallback,
    );
    setPaletteSources((current) => ({ ...current, [tool]: preset.colors }));
    if (tool === 'pyramid') setPyramid((current) => ({ ...current, colors }));
    else if (tool === 'stairs')
      setStairs((current) => ({ ...current, colors }));
    else setArrows((current) => ({ ...current, colors }));
  };
  const fallback =
    tool === 'pyramid' ? '#888888' : tool === 'stairs' ? '#6366f1' : '#1f2937';
  const colors = state.colors;
  const previewStyle = {
    '--preview-ratio': `${ratio.w} / ${ratio.h}`,
    '--preview-w': ratio.w,
    '--preview-h': ratio.h,
    '--custom-preview-color': customBackground,
  } as CSSProperties;
  const normalizeHex = (value: string) =>
    /^#?[0-9a-f]{6}$/i.test(value)
      ? `#${value.replace(/^#/, '').toLowerCase()}`
      : null;

  return (
    <main className="tool-page" id="main-content">
      <div className="editor-heading">
        <div>
          <Link href="/" className="back-link">
            <ArrowLeft size={14} aria-hidden="true" /> All tools
          </Link>
          <h1>{names[tool].title}</h1>
          <p>{names[tool].subtitle}.</p>
        </div>
        <span className="workspace-note">
          <Check size={15} aria-hidden="true" /> Ready for your next
          presentation
        </span>
      </div>
      <div className="container">
        <div className="control-panel">
          <section
            className="panel control-section shape-panel"
            aria-labelledby="shape-heading"
          >
            <h2 id="shape-heading" className="section-heading">
              <SlidersHorizontal size={16} aria-hidden="true" /> Shape
            </h2>

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
                      colors: distributePalette(
                        paletteSources.pyramid,
                        layerCount,
                        '#3BAA9C',
                      ),
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
                      colors: distributePalette(
                        paletteSources.stairs,
                        stepCount,
                        '#6366f1',
                      ),
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
                      colors: distributePalette(
                        paletteSources['circular-arrows'],
                        arrowCount,
                        '#1f2937',
                      ),
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
                      variant={
                        arrows.direction === 'cw' ? 'default' : 'outline'
                      }
                      aria-pressed={arrows.direction === 'cw'}
                      onClick={() =>
                        setArrows((current) => ({
                          ...current,
                          direction: 'cw',
                        }))
                      }
                    >
                      <RotateCw aria-hidden="true" />
                      Clockwise
                    </Button>
                    <Button
                      type="button"
                      variant={
                        arrows.direction === 'ccw' ? 'default' : 'outline'
                      }
                      aria-pressed={arrows.direction === 'ccw'}
                      onClick={() =>
                        setArrows((current) => ({
                          ...current,
                          direction: 'ccw',
                        }))
                      }
                    >
                      <RotateCcw aria-hidden="true" />
                      Counter-clockwise
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
          <section
            className="panel control-section color-panel"
            aria-labelledby="palette-heading"
          >
            <h2 id="palette-heading" className="section-heading">
              <Palette size={16} aria-hidden="true" /> Color palette
            </h2>
            <PresetControls
              presets={SHARED_PRESETS}
              count={colors.length}
              fallback={fallback}
              colors={colors}
              onSelect={setColors}
            />
            <h3 className="color-heading">
              {tool === 'pyramid'
                ? 'Layer Colors (Top → Bottom)'
                : tool === 'stairs'
                  ? 'Step Colors (Front → Back)'
                  : 'Arrow Colors'}
            </h3>
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
          </section>
        </div>

        <div className="right-stack">
          <Card className="panel download-panel">
            <div className="export-caption">
              <Download size={18} aria-hidden="true" />
              <div>
                <h2>Take it to your slide</h2>
                <p>Transparent SVG or 2048 px PNG.</p>
              </div>
            </div>
            <div className="export-actions">
              <Button
                type="button"
                className="download-btn secondary"
                disabled={exporting}
                aria-label="Download PNG"
                onClick={async () => {
                  setError('');
                  setExporting(true);
                  try {
                    await downloadPng(svg, `${filename}.png`);
                  } catch {
                    setError('Could not render PNG. Please try SVG download.');
                  } finally {
                    setExporting(false);
                  }
                }}
              >
                {exporting ? (
                  <LoaderCircle className="export-spinner" aria-hidden="true" />
                ) : (
                  <ImageIcon aria-hidden="true" />
                )}
                {exporting ? 'Preparing…' : 'Download PNG'}
              </Button>
              <Button
                type="button"
                className="download-btn"
                onClick={() => downloadSvg(svg, `${filename}.svg`)}
              >
                <Download aria-hidden="true" />
                Download SVG
              </Button>
            </div>
            <p className="export-detail" aria-live="polite">
              {exporting ? 'Rendering your PNG…' : ''}
            </p>
            {error && (
              <p className="download-error" role="alert">
                {error}
              </p>
            )}
          </Card>
          <Card className="panel preview-panel">
            <div className="preview-header">
              <h2 className="preview-title">
                <span className="live-dot" /> Live preview
              </h2>
              <div className="preview-controls">
                <label htmlFor="ratio-select">Aspect ratio</label>
                <select
                  className="ratio-select"
                  id="ratio-select"
                  name="aspect-ratio"
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
            <div className="preview-stage">
              <div
                className={`svg-bg preview-${background}`}
                style={previewStyle}
              >
                <div
                  className="svg-out"
                  role="img"
                  aria-label={`${names[tool].title} preview`}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            </div>
            <div className="preview-footer">
              <div
                className="background-options"
                role="group"
                aria-label="Preview background"
              >
                <span>Background</span>
                {['transparent', 'light', 'dark'].map((value) => (
                  <Button
                    key={value}
                    variant="ghost"
                    size="icon"
                    className={`background-option background-${value}`}
                    aria-label={`${value} preview background`}
                    aria-pressed={background === value}
                    onClick={() => setBackground(value)}
                  >
                    {value === 'transparent' ? (
                      <Square aria-hidden="true" />
                    ) : (
                      <Circle aria-hidden="true" />
                    )}
                  </Button>
                ))}
                <div
                  className="custom-background"
                  data-selected={background === 'custom'}
                >
                  <input
                    type="color"
                    className="background-option background-custom"
                    name="preview-custom-color"
                    aria-label="Custom preview background color picker"
                    value={customBackground}
                    onClick={() => setBackground('custom')}
                    onChange={(event) => {
                      setCustomBackground(event.target.value);
                      setCustomHex(event.target.value.toUpperCase());
                      setBackground('custom');
                    }}
                  />
                  <label htmlFor="preview-custom-hex">HEX</label>
                  <input
                    id="preview-custom-hex"
                    type="text"
                    className="custom-hex-input"
                    name="preview-custom-hex"
                    aria-label="Custom preview background hex color"
                    value={customHex}
                    maxLength={7}
                    spellCheck={false}
                    autoComplete="off"
                    onClick={() => setBackground('custom')}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCustomHex(value);
                      const color = normalizeHex(value);
                      if (color) {
                        setCustomBackground(color);
                        setBackground('custom');
                      }
                    }}
                    onBlur={() => setCustomHex(customBackground.toUpperCase())}
                  />
                </div>
              </div>
              <span>Preview only · Exports stay transparent</span>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
