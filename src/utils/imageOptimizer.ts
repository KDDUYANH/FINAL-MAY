/**
 * Image Performance Optimization Utilities
 * (Aligned with AGENT_SYSTEM_V2 # 14. PERFORMANCE)
 */

const createdObjectUrls = new Set<string>();
const thumbnailCache = new Map<string, string>();

/**
 * Creates an object URL and registers it for lifecycle management
 */
export function createManagedObjectURL(blob: Blob | File): string {
  const url = URL.createObjectURL(blob);
  createdObjectUrls.add(url);
  return url;
}

/**
 * Revokes a managed object URL to prevent memory leaks
 */
export function revokeManagedObjectURL(url: string): void {
  if (createdObjectUrls.has(url)) {
    URL.revokeObjectURL(url);
    createdObjectUrls.delete(url);
  }
  // Clear any cached thumbnail associated with this URL
  if (thumbnailCache.has(url)) {
    const thumbUrl = thumbnailCache.get(url);
    if (thumbUrl && thumbUrl.startsWith('blob:')) {
      URL.revokeObjectURL(thumbUrl);
    }
    thumbnailCache.delete(url);
  }
}

/**
 * Revokes any object URLs associated with an asset (before, after, preview)
 */
export function revokeAssetObjectURLs(asset: { beforeImg?: string; afterImg?: string; previewImg?: string }): void {
  if (asset.beforeImg && asset.beforeImg.startsWith('blob:')) {
    revokeManagedObjectURL(asset.beforeImg);
  }
  if (asset.afterImg && asset.afterImg.startsWith('blob:')) {
    revokeManagedObjectURL(asset.afterImg);
  }
  if (asset.previewImg && asset.previewImg.startsWith('blob:')) {
    revokeManagedObjectURL(asset.previewImg);
  }
}

/**
 * Revokes all managed object URLs (e.g., on app teardown)
 */
export function revokeAllManagedObjectURLs(): void {
  createdObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  createdObjectUrls.clear();
  thumbnailCache.clear();
}

/**
 * Generates a lightweight downscaled thumbnail (max dimension default 320px)
 * to avoid loading multi-megabyte master textures into every small UI thumbnail.
 */
export async function generateDownscaledThumbnail(imageUrl: string, maxDim = 320): Promise<string> {
  if (!imageUrl) return '';
  if (thumbnailCache.has(imageUrl)) {
    return thumbnailCache.get(imageUrl)!;
  }

  // If Unsplash CDN, URL resizing is instant and bandwidth-friendly
  if (imageUrl.includes('images.unsplash.com')) {
    const optimized = imageUrl.replace(/w=\d+/, `w=${maxDim}`).replace(/q=\d+/, 'q=70');
    thumbnailCache.set(imageUrl, optimized);
    return optimized;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const { width, height } = img;
        if (width <= maxDim && height <= maxDim) {
          thumbnailCache.set(imageUrl, imageUrl);
          resolve(imageUrl);
          return;
        }

        const scale = Math.min(maxDim / width, maxDim / height);
        const targetW = Math.round(width * scale);
        const targetH = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const thumbData = canvas.toDataURL('image/webp', 0.75);
        thumbnailCache.set(imageUrl, thumbData);
        resolve(thumbData);
      } catch {
        resolve(imageUrl);
      }
    };

    img.onerror = () => resolve(imageUrl);
  });
}

/**
 * Derives a lightweight, bandwidth-optimized thumbnail URL
 * Prevents loading multi-megabyte master assets into every small thumbnail.
 */
export function getOptimizedThumbnail(url: string, width = 240): string {
  if (!url) return '';
  if (thumbnailCache.has(url)) {
    return thumbnailCache.get(url)!;
  }
  // If Unsplash CDN, downscale resolution and quality for thumbnails
  if (url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, 'q=70');
  }
  return url;
}
