"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useStudioStore } from "@/store/studioStore";
import { WatermarkOverlay } from "./WatermarkOverlay";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export const StudioCanvas: React.FC = () => {
  const {
    assets,
    activeAssetId,
    splitPosition,
    setSplitPosition,
    isLoupeActive,
    setLoupeActive,
    loupeMagnification,
    zoom,
    setZoom,
    resetCanvasView,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplitRef = useRef(false);
  const [loupePos, setLoupePos] = useState<{ x: number; y: number } | null>(null);

  // Handle Split Slider Pointer Drag
  const handleSplitPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingSplitRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Split slider drag update
      if (isDraggingSplitRef.current) {
        const x = e.clientX - rect.left;
        const newPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSplitPosition(newPos);
        return;
      }

      // Loupe position update
      if (isLoupeActive) {
        setLoupePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [isLoupeActive, setSplitPosition]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingSplitRef.current) {
      isDraggingSplitRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!activeAsset) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-may-muted">
        Chưa có hình ảnh sản phẩm được chọn.
      </div>
    );
  }

  // Filter effect mapping for aesthetic preview
  const getFilterStyle = (preset: string) => {
    switch (preset) {
      case "Clean Luxury":
        return "brightness(1.04) contrast(1.03) saturate(1.02)";
      case "Soft Beauty":
      case "Soft Pink":
        return "sepia(0.06) hue-rotate(-10deg) brightness(1.03)";
      case "Natural":
        return "brightness(1.02) contrast(1.02)";
      case "Auto":
        return "contrast(1.05) brightness(1.02)";
      default:
        return "none";
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setLoupePos(null)}
      className="w-full h-full relative overflow-hidden bg-may-surface flex items-center justify-center select-none cursor-default"
    >
      {/* Centered Canvas Frame */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative max-w-[90%] max-h-[85%] aspect-square flex items-center justify-center shadow-card rounded-2xl overflow-hidden bg-white border border-may-border/60"
      >
        {/* Layer 1: Enhanced (AFTER) Full View */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={activeAsset.committedUrl || activeAsset.originalUrl}
            alt="Enhanced After View"
            style={{
              filter: getFilterStyle(activeAsset.beautifyPreset),
            }}
            className="w-full h-full object-contain"
          />

          {/* Watermark Overlay on Canvas */}
          {activeAsset.watermark.enabled && (
            <WatermarkOverlay
              settings={activeAsset.watermark}
              width={activeAsset.width || 1024}
              height={activeAsset.height || 1024}
            />
          )}

          {/* Protected Area Visualization (in Advanced) */}
          {activeAsset.protection.showProtectedArea && (
            <div
              style={{
                left: `${activeAsset.protection.boundingBox.x * 100}%`,
                top: `${activeAsset.protection.boundingBox.y * 100}%`,
                width: `${activeAsset.protection.boundingBox.width * 100}%`,
                height: `${activeAsset.protection.boundingBox.height * 100}%`,
              }}
              className="absolute border-2 border-dashed border-emerald-500 bg-emerald-500/15 rounded-xl pointer-events-none flex items-start justify-end p-2"
            >
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">
                PROTECTED REGION
              </span>
            </div>
          )}
        </div>

        {/* Layer 2: Original (BEFORE) View - Clipped via Split Position */}
        <div
          style={{
            clipPath: `polygon(0 0, ${splitPosition}% 0, ${splitPosition}% 100%, 0 100%)`,
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <img
            src={activeAsset.originalUrl}
            alt="Original Before View"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Split Divider Slider Line */}
        <div
          style={{ left: `${splitPosition}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-md cursor-ew-resize z-20"
        >
          {/* Slider Handle Grip */}
          <div
            onPointerDown={handleSplitPointerDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-may-dark shadow-card border border-may-rosegold/50 flex items-center justify-center cursor-ew-resize hover:scale-110 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-0.5 text-[9px] font-mono text-may-rosegold font-bold">
              <span>◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>

        {/* Before / After Badges */}
        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-mono font-bold tracking-wider backdrop-blur pointer-events-none z-10">
          BEFORE
        </div>
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-may-rosegold/80 text-white text-[10px] font-mono font-bold tracking-wider backdrop-blur pointer-events-none z-10">
          AFTER
        </div>
      </div>

      {/* 200% Inspection Loupe Overlay */}
      {isLoupeActive && loupePos && containerRef.current && (
        <div
          style={{
            left: `${loupePos.x - 75}px`,
            top: `${loupePos.y - 75}px`,
            backgroundImage: `url(${activeAsset.committedUrl || activeAsset.originalUrl})`,
            backgroundPosition: `${(loupePos.x / containerRef.current.clientWidth) * 100}% ${(loupePos.y / containerRef.current.clientHeight) * 100}%`,
            backgroundSize: `${containerRef.current.clientWidth * loupeMagnification}px ${containerRef.current.clientHeight * loupeMagnification}px`,
          }}
          className="absolute w-36 h-36 rounded-full border-2 border-may-rosegold shadow-card pointer-events-none z-30 bg-white overflow-hidden"
        >
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono">
            200% LOUPE
          </div>
        </div>
      )}

      {/* Floating Canvas Controls (Bottom Center) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-may-border shadow-card flex items-center gap-3 z-20 text-xs text-may-dark">
        <button
          onClick={() => setZoom(zoom - 0.25)}
          className="p-1 rounded-full hover:bg-may-surface text-may-muted hover:text-may-dark transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="font-mono text-[11px] font-semibold min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom(zoom + 0.25)}
          className="p-1 rounded-full hover:bg-may-surface text-may-muted hover:text-may-dark transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-may-border" />

        <button
          onClick={resetCanvasView}
          className="p-1 rounded-full hover:bg-may-surface text-may-muted hover:text-may-dark transition-all"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setLoupeActive(!isLoupeActive)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
            isLoupeActive
              ? "bg-may-rosegold text-white shadow-soft"
              : "bg-may-surface text-may-muted hover:text-may-dark"
          }`}
        >
          200% Loupe
        </button>
      </div>
    </div>
  );
};
