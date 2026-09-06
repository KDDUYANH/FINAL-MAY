"use client";

import React, { useEffect, useRef } from "react";
import { LogoSettings } from "@/types/studio";
import { useStudioStore } from "@/store/studioStore";
import { screenToCanvas, canvasToNormalized } from "@/lib/canvas/coordinates";

interface LogoOverlayProps {
  settings: LogoSettings;
  width: number;
  height: number;
}

export const LogoOverlay: React.FC<LogoOverlayProps> = ({ settings, width, height }) => {
  const { updateLogoPosition } = useStudioStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const imgCacheRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !settings.enabled || !settings.url) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    const drawLogo = (img: HTMLImageElement) => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = settings.opacity;

      const baseLogoW = width * (settings.scale / 100) * 0.35;
      const logoAspect = img.naturalHeight / (img.naturalWidth || 1);
      const logoW = baseLogoW;
      const logoH = logoW * logoAspect;

      let x = width * 0.85;
      let y = height * 0.15;

      if (settings.isManualPosition) {
        x = width * settings.normalizedX;
        y = height * settings.normalizedY;
      } else {
        const marginPxX = (width * (settings.margin || 5)) / 100;
        const marginPxY = (height * (settings.margin || 5)) / 100;

        switch (settings.anchorPosition) {
          case "top-left":
            x = marginPxX + logoW / 2;
            y = marginPxY + logoH / 2;
            break;
          case "top-center":
            x = width / 2;
            y = marginPxY + logoH / 2;
            break;
          case "top-right":
            x = width - marginPxX - logoW / 2;
            y = marginPxY + logoH / 2;
            break;
          case "center-left":
            x = marginPxX + logoW / 2;
            y = height / 2;
            break;
          case "center":
            x = width / 2;
            y = height / 2;
            break;
          case "center-right":
            x = width - marginPxX - logoW / 2;
            y = height / 2;
            break;
          case "bottom-left":
            x = marginPxX + logoW / 2;
            y = height - marginPxY - logoH / 2;
            break;
          case "bottom-center":
            x = width / 2;
            y = height - marginPxY - logoH / 2;
            break;
          case "bottom-right":
            x = width - marginPxX - logoW / 2;
            y = height - marginPxY - logoH / 2;
            break;
        }

        if (settings.smartPlacement && settings.anchorPosition === "center") {
          y = height * 0.15; // Avoid center product region by default
        }
      }

      ctx.translate(x, y);
      ctx.rotate(((settings.rotation || 0) * Math.PI) / 180);
      ctx.drawImage(img, -logoW / 2, -logoH / 2, logoW, logoH);

      // Subtle feedback outline if manual position
      if (settings.isManualPosition) {
        ctx.strokeStyle = "#B76E79";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-logoW / 2 - 2, -logoH / 2 - 2, logoW + 4, logoH + 4);
      }

      ctx.restore();
    };

    if (imgCacheRef.current && imgCacheRef.current.src === settings.url && imgCacheRef.current.complete) {
      drawLogo(imgCacheRef.current);
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = settings.url;
      imgCacheRef.current = img;
      img.onload = () => drawLogo(img);
    }
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
    updateLogoPosition(norm.x, norm.y);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  if (!settings.enabled || !settings.url) return null;

  return (
    <div className="absolute inset-0 pointer-events-auto z-15">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
      />
      {settings.isManualPosition && (
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-may-rosegold text-white text-[9px] font-mono tracking-wider shadow-sm pointer-events-none">
          MANUAL LOGO POSITION
        </span>
      )}
    </div>
  );
};
