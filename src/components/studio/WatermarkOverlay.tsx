"use client";

import React, { useEffect, useRef } from "react";
import { WatermarkSettings } from "@/types/studio";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { useStudioStore } from "@/store/studioStore";
import { screenToCanvas, canvasToNormalized } from "@/lib/canvas/coordinates";

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
  const { updateWatermarkPosition } = useStudioStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
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
      ? width * 0.85
      : width * 0.5;

    let anchorY = settings.isManualPosition
      ? height * settings.normalizedY
      : settings.smartPlacement
      ? height * 0.88
      : height * 0.5;

    if (settings.preset === "MÂY Logo") {
      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.rotate(((settings.rotation || 0) * Math.PI) / 180);

      const fontSize = Math.max(14, Math.round(width * 0.022 * settings.scale));
      ctx.fillStyle = MAY_BRAND_CONFIG.colors.rosegold;
      ctx.font = `600 ${fontSize}px "Cinzel", "Playfair Display", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(MAY_BRAND_CONFIG.name, 0, -fontSize * 0.4);

      const subFontSize = Math.max(9, Math.round(fontSize * 0.45));
      ctx.font = `400 ${subFontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = MAY_BRAND_CONFIG.colors.muted;
      ctx.fillText(MAY_BRAND_CONFIG.tagline, 0, fontSize * 0.6);
      ctx.fillText(MAY_BRAND_CONFIG.contactPhone, 0, fontSize * 1.3);

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
            continue; // Avoid protected center product area
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
  }, [settings, width, height]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!settings.enabled) return;
    e.stopPropagation();
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasPt = screenToCanvas({ x: e.clientX, y: e.clientY }, rect);
    const norm = canvasToNormalized(canvasPt, rect.width, rect.height);
    updateWatermarkPosition(norm.x, norm.y);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  if (!settings.enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-auto z-10">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
      />
      {settings.isManualPosition && (
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono tracking-wider shadow-sm pointer-events-none">
          MANUAL WATERMARK POSITION
        </span>
      )}
    </div>
  );
};
