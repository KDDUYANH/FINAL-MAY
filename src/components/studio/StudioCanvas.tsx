"use client";

import React, { useRef, useState, useCallback } from "react";
import { useStudioStore } from "@/store/studioStore";
import { UploadZone } from "./UploadZone";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { LogoOverlay } from "./LogoOverlay";
import { screenToCanvas, canvasToNormalized } from "@/lib/canvas/coordinates";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Sparkles,
  Move,
  Hand,
} from "lucide-react";
import { ZoomLevel } from "@/types/studio";

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
    panOffset,
    setPanOffset,
    resetCanvasView,
    interactionMode,
    setInteractionMode,
    updateImageTransform,
    applyEnhancementCommit,
    cancelEnhancementPreview,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplitRef = useRef(false);
  const isDraggingImageRef = useRef(false);
  const isPanningViewportRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  const [loupePos, setLoupePos] = useState<{ x: number; y: number } | null>(null);

  // Handle Split Slider Pointer Drag
  const handleSplitPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingSplitRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Handle Image Transform Drag (Move Image inside editing workspace)
  const handleImagePointerDown = (e: React.PointerEvent) => {
    if (interactionMode === "transform") {
      e.preventDefault();
      isDraggingImageRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // 1. Split slider drag update
      if (isDraggingSplitRef.current) {
        const x = e.clientX - rect.left;
        const newPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSplitPosition(newPos);
        return;
      }

      // 2. Image Position Move (Normalized 0..1)
      if (isDraggingImageRef.current && activeAsset) {
        const canvasPt = screenToCanvas({ x: e.clientX, y: e.clientY }, rect);
        const norm = canvasToNormalized(canvasPt, rect.width, rect.height);
        updateImageTransform({ normalizedX: norm.x, normalizedY: norm.y });
        return;
      }

      // 3. Viewport Pan update
      if (isPanningViewportRef.current) {
        const dx = e.clientX - startPanRef.current.x;
        const dy = e.clientY - startPanRef.current.y;
        startPanRef.current = { x: e.clientX, y: e.clientY };
        setPanOffset({ x: panOffset.x + dx, y: panOffset.y + dy });
        return;
      }

      // 4. Loupe pointer update
      if (isLoupeActive) {
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        if (relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height) {
          setLoupePos({ x: relX, y: relY });
        } else {
          setLoupePos(null);
        }
      }
    },
    [
      isLoupeActive,
      panOffset,
      setPanOffset,
      setSplitPosition,
      activeAsset,
      updateImageTransform,
    ]
  );

  const handlePointerUp = () => {
    isDraggingSplitRef.current = false;
    isDraggingImageRef.current = false;
    isPanningViewportRef.current = false;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingSplitRef.current && interactionMode === "pan") {
      isPanningViewportRef.current = true;
      startPanRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  if (!activeAsset) {
    return <UploadZone />;
  }

  const getScaleFactor = (z: ZoomLevel): number => {
    if (z === "FIT") return 1.0;
    return z;
  };
  const scale = getScaleFactor(zoom);

  const getFilterStyle = (preset: string) => {
    switch (preset) {
      case "Clean Luxury":
        return "brightness(1.05) contrast(1.04) saturate(1.02)";
      case "Soft Pink":
        return "sepia(0.08) hue-rotate(-15deg) brightness(1.03) contrast(1.02)";
      case "Marble Studio":
        return "contrast(1.06) brightness(1.02) saturate(0.95)";
      case "Editorial":
        return "contrast(1.10) saturate(1.08) brightness(1.01)";
      case "Natural":
        return "brightness(1.02) contrast(1.02)";
      default:
        return "none";
    }
  };

  const tf = activeAsset.imageTransform;
  const offsetX = (tf.normalizedX - 0.5) * 100;
  const offsetY = (tf.normalizedY - 0.5) * 100;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseDown={handleCanvasMouseDown}
      className={`relative w-full h-full bg-[#FAF5F5] overflow-hidden flex items-center justify-center select-none ${
        interactionMode === "pan" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
      }`}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#EADAD8 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Floating Uncommitted Preview Banner */}
      {activeAsset.hasUncommittedPreview && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-may-rosegold/40 shadow-card px-4 py-2 rounded-2xl flex items-center gap-3 z-30 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-may-dark">
            <Sparkles className="w-4 h-4 text-may-rosegold" />
            <span>Uncommitted Preview Active</span>
          </div>

          <div className="flex items-center gap-2 border-l border-may-border pl-3">
            <button
              onClick={cancelEnhancementPreview}
              className="px-3 py-1.5 rounded-xl bg-may-surface text-may-muted hover:text-may-dark text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>

            <button
              onClick={applyEnhancementCommit}
              className="px-4 py-1.5 rounded-xl bg-may-rosegold text-white text-xs font-semibold shadow-sm hover:bg-may-rosegold/90 flex items-center gap-1 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Image Viewport Area */}
      <div
        className="relative transition-transform duration-75 flex items-center justify-center max-w-[90%] max-h-[85%]"
        style={{
          transform: `scale(${scale}) translate(${panOffset.x + offsetX}px, ${panOffset.y + offsetY}px)`,
        }}
      >
        <div
          onPointerDown={handleImagePointerDown}
          className="relative shadow-float rounded-2xl overflow-hidden bg-white border border-may-border"
        >
          {/* Layer 1: ORIGINAL */}
          <img
            src={activeAsset.originalUrl}
            alt="Original asset"
            className="max-w-full max-h-[75vh] object-contain block"
          />

          {/* Layer 2: ENHANCED (Clipped Preview) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${splitPosition}%` }}
          >
            <img
              src={activeAsset.previewUrl}
              alt="Enhanced asset"
              style={{
                width: containerRef.current?.offsetWidth
                  ? `${containerRef.current.offsetWidth}px`
                  : "100%",
                maxWidth: "none",
                filter: getFilterStyle(activeAsset.enhancementPreset),
              }}
              className="max-h-[75vh] object-contain block"
            />

            {activeAsset.hasProtectedProduct && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-may-dark/80 backdrop-blur text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-may-rosegold" />
                <span>PRODUCT PROTECTED</span>
              </div>
            )}
          </div>

          {/* Canvas Overlays: Logo Insert & Watermark */}
          <LogoOverlay
            settings={activeAsset.logo}
            width={activeAsset.width}
            height={activeAsset.height}
          />
          <WatermarkOverlay
            settings={activeAsset.watermark}
            width={activeAsset.width}
            height={activeAsset.height}
          />

          {/* Split Handle Divider Line */}
          <div
            onPointerDown={handleSplitPointerDown}
            className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)] flex items-center justify-center"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-white text-may-dark border-2 border-may-rosegold shadow-md flex items-center justify-center hover:scale-110 transition-transform">
              <Sliders className="w-3.5 h-3.5 rotate-90 text-may-rosegold" />
            </div>

            <span className="absolute left-3 top-4 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold tracking-wider backdrop-blur uppercase">
              Enhanced
            </span>
            <span className="absolute right-3 top-4 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold tracking-wider backdrop-blur uppercase">
              Original
            </span>
          </div>
        </div>
      </div>

      {/* 200% Inspection Loupe */}
      {isLoupeActive && loupePos && containerRef.current && (
        <div
          className="absolute pointer-events-none rounded-full border-4 border-white shadow-2xl overflow-hidden z-30"
          style={{
            width: "180px",
            height: "180px",
            left: `${loupePos.x - 90}px`,
            top: `${loupePos.y - 90}px`,
          }}
        >
          <div
            className="w-full h-full relative"
            style={{
              backgroundImage: `url(${activeAsset.originalUrl})`,
              backgroundPosition: `${(loupePos.x / containerRef.current.offsetWidth) * 100}% ${(loupePos.y / containerRef.current.offsetHeight) * 100}%`,
              backgroundSize: `${loupeMagnification * 100}%`,
            }}
          />
          <div className="absolute inset-0 border border-may-rosegold/50 rounded-full" />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-mono">
            {Math.round(loupeMagnification * 100)}% LOUPE
          </span>
        </div>
      )}

      {/* Mode Switcher & Viewport Controls Toolbar */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5 p-1.5 rounded-xl bg-white/90 backdrop-blur border border-may-border shadow-soft z-20">
        <div className="flex items-center gap-1 pr-1 border-r border-may-border">
          <button
            onClick={() => setInteractionMode("pan")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              interactionMode === "pan"
                ? "bg-may-blush text-may-rosegold shadow-sm"
                : "text-may-muted hover:text-may-dark"
            }`}
            title="Pan Viewport Tool"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="text-[10px]">Pan</span>
          </button>
          <button
            onClick={() => setInteractionMode("transform")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              interactionMode === "transform"
                ? "bg-may-blush text-may-rosegold shadow-sm"
                : "text-may-muted hover:text-may-dark"
            }`}
            title="Move Image Transform Tool"
          >
            <Move className="w-3.5 h-3.5" />
            <span className="text-[10px]">Move</span>
          </button>
        </div>

        <button
          onClick={() => setZoom("FIT")}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            zoom === "FIT"
              ? "bg-may-blush text-may-rosegold"
              : "text-may-muted hover:text-may-dark"
          }`}
        >
          FIT
        </button>
        <button
          onClick={() => setZoom(0.5)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            zoom === 0.5
              ? "bg-may-blush text-may-rosegold"
              : "text-may-muted hover:text-may-dark"
          }`}
        >
          50%
        </button>
        <button
          onClick={() => setZoom(1.0)}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            zoom === 1.0
              ? "bg-may-blush text-may-rosegold"
              : "text-may-muted hover:text-may-dark"
          }`}
        >
          100%
        </button>

        <div className="w-px h-4 bg-may-border mx-1" />

        <button
          onClick={() => setLoupeActive(!isLoupeActive)}
          className={`p-1.5 rounded-lg transition-all ${
            isLoupeActive
              ? "bg-may-rosegold text-white"
              : "text-may-muted hover:text-may-dark"
          }`}
          title="200% Inspection Loupe"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={resetCanvasView}
          className="p-1.5 rounded-lg text-may-muted hover:text-may-dark transition-all"
          title="Reset Viewport"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
