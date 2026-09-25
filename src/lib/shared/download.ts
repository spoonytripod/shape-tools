const PNG_LONG_EDGE = 2048;

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function downloadSvg(svg: string, filename: string): void {
  triggerDownload(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
    filename,
  );
}

export async function downloadPng(
  svg: string,
  filename: string,
): Promise<void> {
  const parsed = new DOMParser().parseFromString(
    svg,
    'image/svg+xml',
  ).documentElement;
  const width = Number(parsed.getAttribute('width'));
  const height = Number(parsed.getAttribute('height'));
  if (!width || !height) throw new Error('Invalid SVG dimensions');
  const scale = PNG_LONG_EDGE / Math.max(width, height);
  const sourceUrl = URL.createObjectURL(
    new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }),
  );
  try {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (value) =>
          value ? resolve(value) : reject(new Error('PNG export failed')),
        'image/png',
      );
    });
    triggerDownload(blob, filename);
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
