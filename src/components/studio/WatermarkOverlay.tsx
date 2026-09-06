"use client";

import React, { useEffect, useRef } from "react";
import { WatermarkSettings } from "@/types/studio";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";

interface WatermarkOverlayProps {
  settings: WatermarkSettings;
  width: number;
  height: number;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  settings,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Pre-load real brand logo asset
    const img = new Image();
    img.src = MAY_BRAND_CONFIG.logoUrl;
    img.onload = () => {
      logoImgRef.current = img;
      render();
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !settings.enabled) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = settings.opacity;

      let anchorX = settings.isManualPosition
        ? width * settings.normalizedX
        : settings.smartPlacement
        ? width * 0.82
        : width * 0.5;

      let anchorY = settings.isManualPosition
        ? height * settings.normalizedY
        : settings.smartPlacement
        ? height * 0.85
        : height * 0.5;

      if (settings.preset === "MÂY Logo") {
        ctx.save();
        ctx.translate(anchorX, anchorY);
        ctx.rotate(((settings.rotation || 0) * Math.PI) / 180);

        if (logoImgRef.current && logoImgRef.current.naturalWidth > 0) {
          // Use the real MÂY logo brand asset
          const logoImg = logoImgRef.current;
          const drawW = Math.max(60, Math.round(width * 0.22 * settings.scale));
          const drawH = Math.round(drawW * (logoImg.naturalHeight / logoImg.naturalWidth));
          ctx.drawImage(logoImg, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          // Fallback typography while asset loads
          const fontSize = Math.max(14, Math.round(width * 0.022 * settings.scale));
          ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
          ctx.font = `600 ${fontSize}px "Cinzel", serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(MAY_BRAND_CONFIG.name, 0, 0);
        }

        ctx.restore();
      } else if (settings.preset === "Security Grid") {
        const gap = Math.max(80, settings.spacing * (width / 1024));
        const fontSize = Math.max(11, Math.round(width * 0.012 * settings.scale));
        ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
        ctx.font = `600 ${fontSize}px "Cinzel", serif`;
        ctx.textAlign = "center";

        for (let x = gap / 2; x < width; x += gap) {
          for (let y = gap / 2; y < height; y += gap) {
            if (
              settings.smartPlacement &&
              x > width * 0.25 &&
              x < width * 0.75 &&
              y > height * 0.2 &&
              y < height * 0.8
            ) {
              continue; // Avoid protected product center area
            }
            ctx.fillText(MAY_BRAND_CONFIG.name, x, y);
          }
        }
      } else if (settings.preset === "Diagonal Security") {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((-30 * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);

        const gapX = Math.max(140, settings.spacing * 1.8 * (width / 1024));
        const gapY = Math.max(70, settings.spacing * 0.9 * (height / 1024));
        const fontSize = Math.max(11, Math.round(width * 0.014 * settings.scale));
        ctx.fillStyle = MAY_BRAND_CONFIG.colors.muted;
        ctx.font = `500 ${fontSize}px "Cinzel", serif`;
        ctx.textAlign = "center";

        for (let x = -width; x < width * 2; x += gapX) {
          for (let y = -height; y < height * 2; y += gapY) {
            ctx.fillText(`${MAY_BRAND_CONFIG.name} PROTECTED`, x, y);
          }
        }
        ctx.restore();
      }

      ctx.restore();
    };

    render();
  }, [settings, width, height]);

  if (!settings.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
