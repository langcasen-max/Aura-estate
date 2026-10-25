/**
 * Client-side image processing utility for property photos.
 * Compresses and scales real device uploads into optimized base64 Data URLs,
 * preventing storage overflows and ensuring fast responsive rendering.
 */
export async function processImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image (PNG, JPG, WEBP).'));
    }

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        return reject(new Error('Failed to read image data.'));
      }

      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(result);
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.src = result;
    };

    reader.onerror = () => reject(new Error('Could not read file from device.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validates whether a string is a valid image URL or base64 data URL
 */
export function isValidImageSource(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('data:image/')) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
