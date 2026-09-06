"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import {
  RotateCw,
  Undo,
  Redo,
  RefreshCw,
  Lock,
  Unlock,
  Move,
  Check,
  X,
  Maximize,
} from "lucide-react";

export const EditToolPanel: React.FC = () => {
  const {
    assets,
    activeAssetId,
    updateEditAdjustmentsPreview,
    updateImageTransform,
    applyEnhancementCommit,
    cancelEnhancementPreview,
    undo,
    redo,
    canUndo,
    canRedo,
    resetActiveAssetTool,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);
  if (!activeAsset) return null;

  const adj = activeAsset.editAdjustments;
  const tf = activeAsset.imageTransform;

  const handleWidthChange = (w: number) => {
    updateImageTransform({ widthPx: w });
  };

  const handleHeightChange = (h: number) => {
    updateImageTransform({ heightPx: h });
  };

  const toggleAspectLock = () => {
    updateImageTransform({ lockAspectRatio: !tf.lockAspectRatio });
  };

  const resetImagePosition = () => {
    updateImageTransform({ normalizedX: 0.5, normalizedY: 0.5 });
  };

  return (
    <div className="space-y-5">
      {/* Action Bar: Undo, Redo, Reset */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-may-border">
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded-lg text-may-dark hover:bg-may-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded-lg text-may-dark hover:bg-may-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={resetActiveAssetTool}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-may-muted hover:text-may-dark hover:bg-may-surface transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Tool</span>
        </button>
      </div>

      {/* Image Dimensions & Aspect Lock */}
      <div className="p-4 rounded-xl bg-white border border-may-border space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-may-dark">
          <div className="flex items-center gap-1.5">
            <Maximize className="w-3.5 h-3.5 text-may-rosegold" />
            <span>Resize &amp; Dimensions</span>
          </div>
          <button
            onClick={toggleAspectLock}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] ${
              tf.lockAspectRatio
                ? "bg-may-blushLight border-may-rosegold text-may-rosegold font-bold"
                : "bg-may-surface border-may-border text-may-muted"
            }`}
          >
            {tf.lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>{tf.lockAspectRatio ? "Locked" : "Free"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-may-muted uppercase font-semibold block mb-1">
              Width (px)
            </label>
            <input
              type="number"
              value={tf.widthPx}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 100)}
              className="w-full p-2 rounded-lg bg-may-surface border border-may-border text-may-dark font-mono text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-may-muted uppercase font-semibold block mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={tf.heightPx}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 100)}
              className="w-full p-2 rounded-lg bg-may-surface border border-may-border text-may-dark font-mono text-xs"
            />
          </div>
        </div>

        <button
          onClick={resetImagePosition}
          className="w-full py-2 px-3 rounded-lg bg-may-surface border border-may-border text-may-dark text-xs font-medium hover:bg-may-blushLight transition-all flex items-center justify-center gap-2"
        >
          <Move className="w-3.5 h-3.5 text-may-muted" />
          <span>Snap Image to Center</span>
        </button>
      </div>

      {/* Crop Ratio */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted block">
          Crop Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-may-border">
          {(["Original", "1:1", "4:5", "9:16", "16:9", "Free"] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => updateEditAdjustmentsPreview({ cropRatio: ratio })}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                adj.cropRatio === ratio
                  ? "bg-may-blush text-may-rosegold shadow-sm"
                  : "text-may-muted hover:text-may-dark"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="p-4 rounded-xl bg-white border border-may-border space-y-3">
        <h4 className="text-xs font-semibold text-may-dark border-b border-may-border pb-2">
          Color &amp; Light Adjustments
        </h4>

        {[
          { key: "exposure", label: "Exposure", min: -100, max: 100 },
          { key: "contrast", label: "Contrast", min: -100, max: 100 },
          { key: "highlights", label: "Highlights", min: -100, max: 100 },
          { key: "shadows", label: "Shadows", min: -100, max: 100 },
          { key: "temperature", label: "Temperature", min: -100, max: 100 },
          { key: "saturation", label: "Saturation", min: -100, max: 100 },
          { key: "sharpness", label: "Sharpness", min: 0, max: 100 },
        ].map((item) => (
          <div key={item.key}>
            <div className="flex justify-between text-[10px] font-semibold uppercase text-may-muted mb-1">
              <span>{item.label}</span>
              <span>{(adj as any)[item.key]}</span>
            </div>
            <input
              type="range"
              min={item.min}
              max={item.max}
              value={(adj as any)[item.key]}
              onChange={(e) => updateEditAdjustmentsPreview({ [item.key]: parseInt(e.target.value) })}
              className="w-full accent-may-rosegold cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Commit & Discard Bar */}
      {activeAsset.hasUncommittedPreview && (
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={cancelEnhancementPreview}
            className="flex-1 py-2.5 px-3 rounded-xl bg-may-surface text-may-muted hover:text-may-dark text-xs font-semibold border border-may-border transition-all"
          >
            Discard
          </button>
          <button
            onClick={applyEnhancementCommit}
            className="flex-1 py-2.5 px-3 rounded-xl bg-may-rosegold text-white text-xs font-semibold shadow-card hover:bg-may-rosegold/90 transition-all"
          >
            Apply Edit
          </button>
        </div>
      )}
    </div>
  );
};
