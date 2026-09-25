import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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
