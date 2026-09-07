import { AssetItem, WatermarkSettings } from "@/types/studio";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";

export interface ExportRenderOptions {
  asset: AssetItem;
  format: "JPG" | "PNG" | "WebP";
  ratio: "Original" | "1:1" | "4:5" | "9:16" | "16:9";
  resolution: "Original" | "2K" | "4K";
  includeWatermark: boolean;
}

function getPresetFilter(preset: string): string {
  switch (preset) {
    case "Clean Luxury":
      return "brightness(1.05) contrast(1.04) saturate(1.02)";
    case "Soft Pink":
    case "Soft Beauty":
      return "sepia(0.08) hue-rotate(-15deg) brightness(1.03) contrast(1.02)";
    case "Editorial":
      return "contrast(1.10) saturate(1.08) brightness(1.01)";
    case "Natural":
      return "brightness(1.02) contrast(1.02)";
    default:
      return "none";
  }
}

export async function renderExportBlob(options: ExportRenderOptions): Promise<Blob> {
  const { asset, format, ratio, resolution, includeWatermark } = options;

  // 1. Load source image
  const imgUrl = asset.committedUrl || asset.previewUrl || asset.originalUrl;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;

  await new Promise((resolve, reject) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(null);
    } else {
      img.onload = () => resolve(null);
      img.onerror = reject;
    }
  });

  const srcW = img.naturalWidth || asset.width || 1024;
  const srcH = img.naturalHeight || asset.height || 1024;

  // 2. Determine target dimensions based on target resolution
  let baseLongEdge = Math.max(srcW, srcH);
  if (resolution === "2K") {
    baseLongEdge = 2048;
  } else if (resolution === "4K") {
    baseLongEdge = 3840;
  }

  let canvasW = srcW;
  let canvasH = srcH;

  // Calculate canvas dimensions according to requested Aspect Ratio
  if (ratio === "1:1") {
    canvasW = baseLongEdge;
    canvasH = baseLongEdge;
  } else if (ratio === "4:5") {
    canvasW = Math.round(baseLongEdge * 0.8);
    canvasH = baseLongEdge;
  } else if (ratio === "9:16") {
    canvasW = Math.round(baseLongEdge * (9 / 16));
    canvasH = baseLongEdge;
  } else if (ratio === "16:9") {
    canvasW = baseLongEdge;
    canvasH = Math.round(baseLongEdge * (9 / 16));
  } else {
    // Original aspect ratio
    const scaleRatio = baseLongEdge / Math.max(srcW, srcH);
    canvasW = Math.round(srcW * scaleRatio);
    canvasH = Math.round(srcH * scaleRatio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not initialize 2D canvas context for export");

  // 3. Render Aesthetic Studio Background Base
  ctx.save();
  const scenePreset = asset.scenePreset || "Clean Studio";
  if (scenePreset === "Clean Studio") {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
    bgGrad.addColorStop(0, "#FFFFFF");
    bgGrad.addColorStop(1, "#FAF5F5");
    ctx.fillStyle = bgGrad;
  } else if (scenePreset === "Soft Silk") {
    const bgGrad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
    bgGrad.addColorStop(0, "#FFF5EB");
    bgGrad.addColorStop(0.6, "#FDF7F7");
    bgGrad.addColorStop(1, "#FADCD9");
    ctx.fillStyle = bgGrad;
  } else if (scenePreset === "Marble") {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
    bgGrad.addColorStop(0, "#FBF9F9");
    bgGrad.addColorStop(1, "#EFE8E6");
    ctx.fillStyle = bgGrad;
  } else {
    ctx.fillStyle = "#FFFFFF";
  }
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.restore();

  // 4. Draw Product Image (Scaled to fit neatly inside canvas)
  ctx.save();
  ctx.filter = getPresetFilter(asset.beautifyPreset || "Clean Luxury");

  const scale = Math.min(canvasW / srcW, canvasH / srcH) * 0.92;
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const drawX = (canvasW - drawW) / 2;
  const drawY = (canvasH - drawH) / 2;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();

  // 5. Draw Watermark Layer if enabled
  if (includeWatermark && asset.watermark?.enabled) {
    const wm = asset.watermark;
    ctx.save();
    ctx.globalAlpha = wm.opacity;

    if (wm.preset === "MÂY Logo") {
      let wx = wm.isManualPosition
        ? canvasW * wm.normalizedX
        : wm.smartPlacement
        ? canvasW * 0.82
        : canvasW * 0.5;

      let wy = wm.isManualPosition
        ? canvasH * wm.normalizedY
        : wm.smartPlacement
        ? canvasH * 0.85
        : canvasH * 0.5;

      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(((wm.rotation || 0) * Math.PI) / 180);

      // Load real MÂY brand logo
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = MAY_BRAND_CONFIG.logoUrl;
        await new Promise((r) => {
          if (logoImg.complete && logoImg.naturalWidth > 0) r(null);
          else {
            logoImg.onload = () => r(null);
            logoImg.onerror = () => r(null);
          }
        });

        if (logoImg.naturalWidth > 0) {
          const lW = Math.max(80, Math.round(canvasW * 0.22 * wm.scale));
          const lH = Math.round(lW * (logoImg.naturalHeight / logoImg.naturalWidth));
          ctx.drawImage(logoImg, -lW / 2, -lH / 2, lW, lH);
        } else {
          const fontSize = Math.max(16, Math.round(canvasW * 0.022 * wm.scale));
          ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
          ctx.font = `600 ${fontSize}px "Cinzel", serif`;
          ctx.textAlign = "center";
          ctx.fillText(MAY_BRAND_CONFIG.name, 0, 0);
        }
      } catch {
        const fontSize = Math.max(16, Math.round(canvasW * 0.022 * wm.scale));
        ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
        ctx.font = `600 ${fontSize}px "Cinzel", serif`;
        ctx.textAlign = "center";
        ctx.fillText(MAY_BRAND_CONFIG.name, 0, 0);
      }

      ctx.restore();
    } else if (wm.preset === "Security Grid") {
      const gap = Math.max(80, wm.spacing * (canvasW / 1024));
      const fontSize = Math.max(11, Math.round(canvasW * 0.012 * wm.scale));
      ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
      ctx.font = `600 ${fontSize}px "Cinzel", serif`;
      ctx.textAlign = "center";

      for (let x = gap / 2; x < canvasW; x += gap) {
        for (let y = gap / 2; y < canvasH; y += gap) {
          if (
            wm.smartPlacement &&
            x > canvasW * 0.25 &&
            x < canvasW * 0.75 &&
            y > canvasH * 0.2 &&
            y < canvasH * 0.8
          ) {
            continue; // Protected product region safe avoidance
          }
          ctx.fillText(MAY_BRAND_CONFIG.name, x, y);
        }
      }
    } else if (wm.preset === "Diagonal Security") {
      ctx.save();
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.translate(-canvasW / 2, -canvasH / 2);

      const gapX = Math.max(140, wm.spacing * 1.8 * (canvasW / 1024));
      const gapY = Math.max(70, wm.spacing * 0.9 * (canvasH / 1024));
      const fontSize = Math.max(11, Math.round(canvasW * 0.014 * wm.scale));
      ctx.fillStyle = MAY_BRAND_CONFIG.colors.muted;
      ctx.font = `500 ${fontSize}px "Cinzel", serif`;
      ctx.textAlign = "center";

      for (let x = -canvasW; x < canvasW * 2; x += gapX) {
        for (let y = -canvasH; y < canvasH * 2; y += gapY) {
          ctx.fillText(`${MAY_BRAND_CONFIG.name} PROTECTED`, x, y);
        }
      }
      ctx.restore();
    }

    ctx.restore();
  }

  const mimeType =
    format === "PNG"
      ? "image/png"
      : format === "WebP"
      ? "image/webp"
      : "image/jpeg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas blob conversion failed"));
      },
      mimeType,
      0.95
    );
  });
}
