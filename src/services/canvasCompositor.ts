import { Asset, WatermarkPosition } from '../types/studio';

export class CanvasCompositor {
  /**
   * Renders the asset with exact recipe adjustments (lighting, exposure, contrast)
   * and composites the official brand logo watermark before exporting.
   */
  public static async exportAsset(
    asset: Asset,
    format: 'png' | 'jpg' | 'webp' = 'png',
    resolution: 'original' | '2k' | '4k' = '4k'
  ): Promise<void> {
    const targetWidth = resolution === '4k' ? 3840 : resolution === '2k' ? 2048 : asset.width;
    
    // Calculate aspect ratio target height
    let targetRatio = 4 / 5;
    if (asset.recipe.aspectRatio === '1:1') targetRatio = 1;
    if (asset.recipe.aspectRatio === '3:4') targetRatio = 3 / 4;
    if (asset.recipe.aspectRatio === '9:16') targetRatio = 9 / 16;
    if (asset.recipe.aspectRatio === '16:9') targetRatio = 16 / 9;
    if (asset.recipe.aspectRatio === 'original' && asset.height > 0) {
      targetRatio = asset.width / asset.height;
    }

    const targetHeight = Math.round(targetWidth / targetRatio);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Không thể khởi tạo Canvas Context.');

    // 1. Load source image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = asset.afterImg || asset.beforeImg;

    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => resolve(null);
    });

    try {
      // Apply recipe lighting adjustments
      const brightness = 1 + (asset.recipe.exposure || 0) / 100;
      const contrast = 1 + (asset.recipe.contrast || 0) / 100;
      ctx.filter = `brightness(${brightness}) contrast(${contrast})`;

      // Draw background / product image centered
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      ctx.filter = 'none';
    } catch {
      // Fallback
      ctx.fillStyle = '#FAF5F2';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    // 2. Composite Real Brand Logo Watermark if enabled
    if (asset.brand?.watermarkEnabled) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/assets/brand/may_logo_mark.png';

      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = () => resolve(null);
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.save();
        const opacity = (asset.brand.watermarkOpacity || 25) / 100;
        const scale = (asset.brand.watermarkScale || 35) / 100;
        const logoWidth = Math.round(targetWidth * 0.15 * scale * 2);
        const logoHeight = Math.round(logoWidth * (logoImg.naturalHeight / logoImg.naturalWidth));

        const margin = Math.round(targetWidth * 0.04);
        let x = targetWidth - logoWidth - margin;
        let y = targetHeight - logoHeight - margin;

        const pos: WatermarkPosition = asset.brand.watermarkPosition || 'bottom_right';
        if (pos === 'top_left') {
          x = margin;
          y = margin;
        } else if (pos === 'top_right') {
          x = targetWidth - logoWidth - margin;
          y = margin;
        } else if (pos === 'bottom_left') {
          x = margin;
          y = targetHeight - logoHeight - margin;
        } else if (pos === 'center') {
          x = Math.round((targetWidth - logoWidth) / 2);
          y = Math.round((targetHeight - logoHeight) / 2);
        }

        ctx.globalAlpha = opacity;
        if (asset.brand.watermarkRotation) {
          ctx.translate(x + logoWidth / 2, y + logoHeight / 2);
          ctx.rotate((asset.brand.watermarkRotation * Math.PI) / 180);
          ctx.drawImage(logoImg, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
        } else {
          ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
        }
        ctx.restore();
      }
    }

    // 3. Export to Blob and trigger browser download
    const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const filename = `${asset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${resolution}.${format}`;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, mimeType, 0.96);
    } catch {
      // Fallback
      const a = document.createElement('a');
      a.href = asset.afterImg || asset.beforeImg;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
