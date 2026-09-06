"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import {
  CheckSquare,
  Square,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
} from "lucide-react";

export const BatchDock: React.FC = () => {
  const {
    assets,
    activeAssetId,
    setActiveAssetId,
    selectedAssetIds,
    toggleSelectAsset,
    selectAllAssets,
    clearSelectedAssets,
    openBatchPreviewModal,
    removeAsset,
  } = useStudioStore();

  if (assets.length === 0) {
    return null;
  }

  const allSelected = selectedAssetIds.length === assets.length;

  return (
    <div className="h-24 border-t border-may-border bg-white px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left Selection Controls */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={allSelected ? clearSelectedAssets : selectAllAssets}
            className="flex items-center gap-1.5 text-xs font-semibold text-may-dark hover:text-may-rosegold transition-all"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-may-rosegold" />
            ) : (
              <Square className="w-4 h-4 text-may-muted" />
            )}
            <span>Select All ({selectedAssetIds.length}/{assets.length})</span>
          </button>
        </div>

        <button
          onClick={openBatchPreviewModal}
          disabled={selectedAssetIds.length <= 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-may-blush text-may-rosegold hover:bg-may-blush/80 transition-all text-xs font-semibold border border-may-rosegold/30 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Opens representative preview for 3 assets before applying master to all"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Apply Master (Preview Batch)</span>
        </button>
      </div>

      {/* Filmstrip Thumbnails Horizontal Scroll Area */}
      <div className="flex items-center gap-3 overflow-x-auto py-2 px-2 max-w-[65%] no-scrollbar">
        {assets.map((asset) => {
          const isActive = asset.id === activeAssetId;
          const isSel = selectedAssetIds.includes(asset.id);

          return (
            <div
              key={asset.id}
              onClick={() => setActiveAssetId(asset.id)}
              className={`group relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "border-may-rosegold ring-2 ring-may-blush scale-105 shadow-md"
                  : isSel
                  ? "border-may-rosegold/60"
                  : "border-may-border hover:border-may-rosegold/40"
              }`}
            >
              <img
                src={asset.previewUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectAsset(asset.id);
                }}
                className="absolute top-1 left-1 p-0.5 rounded bg-black/50 text-white hover:scale-110 transition-transform"
              >
                {isSel ? (
                  <CheckSquare className="w-3 h-3 text-may-blush" />
                ) : (
                  <Square className="w-3 h-3 text-white/80" />
                )}
              </button>

              <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/60 text-white text-[8px] font-mono tracking-tighter">
                {asset.status}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAsset(asset.id);
                }}
                className="absolute top-1 right-1 p-0.5 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove asset"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right Counter */}
      <div className="flex items-center gap-2 text-xs font-mono text-may-muted shrink-0">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>{assets.length} Protected Assets</span>
      </div>
    </div>
  );
};
