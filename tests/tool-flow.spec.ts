import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import {
  COLOR_PRESETS,
  distributePalette,
  SHARED_PRESETS,
} from '../src/lib/shared/color';

const cases = [
  {
    route: '/tools/pyramid',
    title: '3D Pyramid Generator',
    slider: 'pyr-layersSlider',
    max: '8',
  },
  {
    route: '/tools/stairs',
    title: '3D Stairs Generator',
    slider: 'str-stepsSlider',
    max: '8',
  },
  {
    route: '/tools/circular-arrows',
    title: 'Circular Arrows Generator',
    slider: 'arr-arrowsSlider',
    max: '5',
  },
];

for (const tool of cases) {
  test(`${tool.title}: controls and both exports work`, async ({ page }) => {
    page.on('pageerror', (error) =>
      console.error(`Browser error: ${error.message}`),
    );
    page.on('console', (message) => {
      if (message.type() === 'error')
        console.error(`Console error: ${message.text()}`);
    });
    await page.goto(tool.route);
    await expect(page.getByRole('heading', { name: tool.title })).toBeVisible();
    const preview = page
      .getByRole('img', { name: `${tool.title} preview` })
      .locator('svg');
    await expect(preview).toBeVisible();
    const original = await preview.getAttribute('viewBox');
    await page.getByLabel('Aspect ratio').selectOption('2');
    await expect(preview).not.toHaveAttribute('viewBox', original!);
    for (const ratio of ['0', '1', '2', '3', '4']) {
      await page.getByLabel('Aspect ratio').selectOption(ratio);
      await expect(preview).toBeVisible();
      const canvas = await page.locator('.svg-bg').boundingBox();
      const stage = await page.locator('.preview-stage').boundingBox();
      expect(canvas!.width).toBeLessThanOrEqual(stage!.width);
      expect(canvas!.height).toBeLessThanOrEqual(stage!.height);
    }

    const beforeBackground = await preview.innerHTML();
    await page
      .getByRole('button', { name: 'dark preview background', exact: true })
      .click();
    await expect(
      page.getByRole('button', {
        name: 'dark preview background',
        exact: true,
      }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(preview).toHaveJSProperty('innerHTML', beforeBackground);

    const slider = page.locator(`#${tool.slider}`);
    await slider.focus();
    await slider.press('End');
    await expect(slider).toHaveValue(tool.max);

    const beforePalette = await preview.innerHTML();
    await page.getByRole('button', { name: /Ocean/ }).click();
    await expect(preview).not.toHaveJSProperty('innerHTML', beforePalette);

    if (tool.route === '/tools/circular-arrows') {
      const beforeDirection = await preview.innerHTML();
      await page.getByRole('button', { name: 'Counter-clockwise' }).click();
      await expect(preview).not.toHaveJSProperty('innerHTML', beforeDirection);
    }

    const svgPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download SVG' }).click();
    const svgDownload = await svgPromise;
    const svg = await readFile(await svgDownload.path(), 'utf8');
    expect(svg).toContain('<svg ');
    expect(svg).toContain('viewBox=');

    const pngPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG' }).click();
    const pngDownload = await pngPromise;
    const png = await readFile(await pngDownload.path());
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(Math.max(png.readUInt32BE(16), png.readUInt32BE(20))).toBe(2048);
  });
}

test('mobile layouts keep the canvas and controls within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const tool of cases) {
    await page.goto(tool.route);
    await expect(page.getByRole('heading', { name: tool.title })).toBeVisible();
    const stage = await page.locator('.preview-stage').boundingBox();
    const controls = await page.locator('.control-panel').boundingBox();
    expect(stage!.y).toBeLessThan(controls!.y);
    for (const ratio of ['0', '1', '2', '3', '4']) {
      await page.getByLabel('Aspect ratio').selectOption(ratio);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(360);
      const canvas = await page.locator('.svg-bg').boundingBox();
      expect(canvas!.width / canvas!.height).toBeCloseTo(
        [1, 4 / 3, 16 / 9, 3 / 4, 9 / 16][Number(ratio)],
        1,
      );
    }
  }
});

test('download actions stay in the first screen with the workspace panels', async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 800 },
    { width: 1280, height: 720 },
    { width: 1024, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    for (const tool of cases) {
      await page.goto(tool.route);
      for (const selector of [
        '.shape-panel',
        '.color-panel',
        '.preview-panel',
        '.download-panel',
      ]) {
        const panel = await page.locator(selector).boundingBox();
        expect(
          panel!.y + panel!.height,
          `${tool.route} ${selector} at ${viewport.width}×${viewport.height}`,
        ).toBeLessThanOrEqual(viewport.height);
      }
      await expect(
        page.getByRole('button', { name: 'Download PNG' }),
      ).toBeInViewport();
      await expect(
        page.getByRole('button', { name: 'Download SVG' }),
      ).toBeInViewport();
    }
  }

  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/tools/circular-arrows');
  const download = await page.locator('.download-panel').boundingBox();
  expect(download!.y + download!.height).toBeLessThanOrEqual(700);
  await expect(
    page.getByRole('button', { name: 'Download SVG' }),
  ).toBeInViewport();
});

test('custom preview background accepts a picker and HEX value without changing SVG output', async ({
  page,
}) => {
  await page.goto('/tools/pyramid');
  const preview = page.getByRole('img', {
    name: '3D Pyramid Generator preview',
  });
  const originalSvg = await preview.innerHTML();

  await page.getByRole('button', { name: 'dark preview background' }).click();
  await expect(page.locator('.svg-bg')).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );

  await page
    .getByLabel('Custom preview background color picker')
    .fill('#123456');
  await expect(page.locator('.svg-bg')).toHaveCSS(
    'background-color',
    'rgb(18, 52, 86)',
  );
  await page.getByLabel('Custom preview background hex color').fill('#abcdef');
  await expect(page.locator('.svg-bg')).toHaveCSS(
    'background-color',
    'rgb(171, 205, 239)',
  );

  await page.getByRole('button', { name: 'dark preview background' }).click();
  await expect(page.locator('.svg-bg')).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
  await page.getByLabel('Custom preview background hex color').click();
  await expect(page.locator('.svg-bg')).toHaveCSS(
    'background-color',
    'rgb(171, 205, 239)',
  );
  expect(await preview.innerHTML()).toBe(originalSvg);
});

test('changing shape counts redistributes the active palette in every tool', async ({
  page,
}) => {
  const palettes = [
    {
      route: '/tools/pyramid',
      slider: 'pyr-layersSlider',
      min: '2',
      max: '8',
      fallback: '#3BAA9C',
      defaultColors: ['#E8A33D', '#4D7CC7', '#3BAA9C'],
      oceanColors: ['#0F3460', '#16537e', '#3a86ff', '#8ecae6'],
    },
    {
      route: '/tools/stairs',
      slider: 'str-stepsSlider',
      min: '2',
      max: '8',
      fallback: '#6366f1',
      defaultColors: ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc'],
      oceanColors: ['#0F3460', '#16537e', '#3a86ff', '#8ecae6'],
    },
    {
      route: '/tools/circular-arrows',
      slider: 'arr-arrowsSlider',
      min: '1',
      max: '5',
      fallback: '#1f2937',
      defaultColors: [
        '#ef4444',
        '#f59e0b',
        '#10b981',
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#14b8a6',
      ],
      oceanColors: ['#0F3460', '#16537e', '#3a86ff', '#8ecae6'],
    },
  ];

  for (const tool of palettes) {
    await page.goto(tool.route);
    const slider = page.locator(`#${tool.slider}`);
    const colorInputs = page.locator('.item-colors input[type="color"]');
    const displayedColors = () =>
      colorInputs.evaluateAll((inputs) =>
        inputs.map((input) => (input as HTMLInputElement).value.toLowerCase()),
      );
    const expectedColors = (source: string[], count: number) =>
      distributePalette(source, count, tool.fallback).map((color) =>
        color.toLowerCase(),
      );
    const setCount = async (key: 'Home' | 'End') => {
      await slider.focus();
      await slider.press(key);
    };

    await setCount('End');
    expect(await displayedColors()).toEqual(
      expectedColors(tool.defaultColors, Number(tool.max)),
    );
    await setCount('Home');
    expect(await displayedColors()).toEqual(
      expectedColors(tool.defaultColors, Number(tool.min)),
    );
    await setCount('End');
    expect(await displayedColors()).toEqual(
      expectedColors(tool.defaultColors, Number(tool.max)),
    );

    await page.getByRole('button', { name: 'Ocean' }).click();
    await setCount('Home');
    await setCount('End');
    const oceanColors = expectedColors(tool.oceanColors, Number(tool.max));
    expect(await displayedColors()).toEqual(oceanColors);
    await expect(page.getByRole('button', { name: 'Ocean' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await colorInputs.first().fill('#123456');
    const customColors = ['#123456', ...oceanColors.slice(1)];
    await setCount('Home');
    await setCount('End');
    expect(await displayedColors()).toEqual(
      expectedColors(customColors, Number(tool.max)),
    );
  }
});

test('all three tools offer the same nine palettes and apply their colors', async ({
  page,
}) => {
  const expectedNames = [
    'Default',
    'Mono',
    'Ocean',
    'Sunset',
    'Forest',
    'Pastel',
    'Spectrum',
    'Indigo',
    'Corporate',
  ];
  expect(SHARED_PRESETS.map((preset) => preset.name)).toEqual(expectedNames);

  for (const tool of cases) {
    await page.goto(tool.route);
    const presetButtons = page.locator('.preset-row button');
    expect(
      (await presetButtons.allTextContents()).map((name) => name.trim()),
    ).toEqual(expectedNames);
    const colorInputs = page.locator('.item-colors input[type="color"]');
    const count = await colorInputs.count();

    for (const name of expectedNames) {
      await page.getByRole('button', { name, exact: true }).click();
      const colors = await colorInputs.evaluateAll((inputs) =>
        inputs.map((input) => (input as HTMLInputElement).value.toLowerCase()),
      );
      expect(colors).toEqual(
        distributePalette(
          COLOR_PRESETS[name as keyof typeof COLOR_PRESETS].colors,
          count,
          '#1f2937',
        ).map((color) => color.toLowerCase()),
      );
      await expect(
        page.getByRole('button', { name, exact: true }),
      ).toHaveAttribute('aria-pressed', 'true');
    }
  }
});

test('tool cards and old hash links reach the new routes', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: /3D Pyramid/ })
    .last()
    .click();
  await expect(page).toHaveURL(/\/tools\/pyramid$/);
  await page.goto('/#page-stairs');
  await expect(page).toHaveURL(/\/tools\/stairs$/);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: '3D Stairs Generator' }),
  ).toBeVisible();
});
