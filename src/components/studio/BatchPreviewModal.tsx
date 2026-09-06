"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { X, Sparkles, CheckCircle2, ShieldCheck, Layers } from "lucide-react";

export const BatchPreviewModal: React.FC = () => {
  const {
    batchPreviewModalOpen,
    closeBatchPreviewModal,
    confirmApplyMasterToAll,
    assets,
    activeAssetId,
    representativeAssetIds,
    selectedAssetIds,
  } = useStudioStore();

  if (!batchPreviewModalOpen) return null;

  const masterAsset = assets.find((a) => a.id === activeAssetId);
  const repAssets = assets.filter((a) => representativeAssetIds.includes(a.id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none">
      <div className="bg-white rounded-2xl border border-may-border shadow-2xl max-w-4xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-may-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-may-blush text-may-rosegold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-may-dark">
                Preview Master Batch Adaptation
              </h3>
              <p className="text-xs text-may-muted">
                Reviewing 3 representative assets from your selected batch ({selectedAssetIds.length} images) before applying master settings.
              </p>
            </div>
          </div>

          <button
            onClick={closeBatchPreviewModal}
            className="p-2 rounded-lg text-may-muted hover:text-may-dark hover:bg-may-surface transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Settings Summary Banner */}
        {masterAsset && (
          <div className="p-3 rounded-xl bg-may-champagne/80 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Master Source:</strong> {masterAsset.name} ({masterAsset.enhancementPreset} • {masterAsset.backgroundPreset} • {masterAsset.watermark.preset})
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-amber-300">
              Normalized Percentage Placement
            </span>
          </div>
        )}

        {/* 3 Representative Assets Grid */}
        <div className="grid grid-cols-3 gap-4">
          {repAssets.map((asset, index) => (
            <div
              key={asset.id}
              className="p-3 rounded-xl bg-may-surface border border-may-border space-y-2 flex flex-col"
            >
              <div className="flex items-center justify-between text-[11px] text-may-dark font-semibold">
                <span>Rep Asset #{index + 1}</span>
                <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Protected
                </span>
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden border border-may-border bg-white">
                <img
                  src={asset.previewUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay simulating Master Watermark & Logo Adaptation */}
                {masterAsset && masterAsset.logo.enabled && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono">
                    Adapted Logo
                  </div>
                )}
              </div>

              <div className="text-[10px] text-may-muted truncate mt-auto">
                {asset.name}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-may-border pt-4">
          <button
            onClick={closeBatchPreviewModal}
            className="px-5 py-2.5 rounded-xl border border-may-border text-may-dark hover:bg-may-surface text-xs font-semibold transition-all"
          >
            Cancel
          </button>

          <button
            onClick={confirmApplyMasterToAll}
            className="px-6 py-2.5 rounded-xl bg-may-rosegold text-white text-xs font-semibold shadow-card hover:bg-may-rosegold/90 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Apply to All ({selectedAssetIds.length} Assets)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
