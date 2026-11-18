/**
 * Browser-side image compression and resizing to WebP before uploading to Cloudflare R2.
 * Keeps uploaded product images lightweight (~50-100 KB) and avoids server-side image processing.
 */
export async function compressImageToWebP(
  file: File,
  options: { maxWidth?: number; quality?: number } = {}
): Promise<File> {
  const maxWidth = options.maxWidth ?? 900;
  const quality = options.quality ?? 0.82;

  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return file;
  }

  const imageBitmap = await createImageBitmap(file);
  const scale = imageBitmap.width > maxWidth ? maxWidth / imageBitmap.width : 1;
  const targetWidth = Math.round(imageBitmap.width * scale);
  const targetHeight = Math.round(imageBitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    imageBitmap.close();
    return file;
  }

  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
  imageBitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality)
  );

  if (!blob) return file;

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
}

