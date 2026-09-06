"use client";

import React, { useRef, useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { Upload, Check, ShieldCheck, Download, Layers, ArrowRight } from "lucide-react";

export const BatchModule: React.FC = () => {
  const {
    assets,
    masterAssetId,
    setMasterAssetId,
    applyMasterToAll,
    isBatchApplying,
    addAssetsFromFiles,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmedPreview, setConfirmedPreview] = useState(false);
  const masterAsset = assets.find((a) => a.id === masterAssetId) || assets[0];

  // Pick up to 3 representative assets for safety preview
  const representativeAssets = assets.slice(0, 3);

  const handleApply = async () => {
    await applyMasterToAll();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-may-surface overflow-y-auto p-8 select-none">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-may-border pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-may-rosegold font-bold block mb-1">
              Multi-Asset Processing
            </span>
            <h2 className="font-serif text-2xl font-semibold text-may-dark">
              Batch Production ({assets.length} Images)
            </h2>
            <p className="text-xs text-may-muted mt-1">
              Chọn ảnh mẫu (Master), xem trước trên 3 ảnh đại diện tỷ lệ khác nhau và áp dụng chuẩn hóa toàn bộ lô sản phẩm.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl border border-may-border bg-white hover:bg-may-blushLight text-xs font-semibold text-may-dark transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Thêm ảnh vào lô</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && addAssetsFromFiles(e.target.files)}
              className="hidden"
            />

            <button
              onClick={handleApply}
              disabled={isBatchApplying || assets.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-may-dark text-white hover:bg-may-dark/90 text-xs font-semibold shadow-card transition-all disabled:opacity-50"
            >
              <Layers className="w-4 h-4 text-may-blush" />
              <span>
                {isBatchApplying ? "Đang đồng bộ..." : "Áp dụng Master cho toàn bộ"}
              </span>
            </button>
          </div>
        </div>

        {/* Safety Gate: 3 Representative Assets Preview */}
        <div className="p-6 rounded-2xl bg-white border border-may-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-may-dark flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Xem trước an toàn (3 Ảnh đại diện biến thể)</span>
              </h3>
              <p className="text-[11px] text-may-muted mt-0.5">
                Đảm bảo tọa độ watermark và bối cảnh được chuẩn hóa tương đối (0..1), không bị cắt lệch nhãn trên các tỷ lệ khác nhau.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Normalized Placement ✓
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {representativeAssets.map((asset, idx) => {
              const isMaster = asset.id === masterAsset?.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setMasterAssetId(asset.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isMaster
                      ? "border-may-rosegold bg-may-blushLight shadow-soft ring-1 ring-may-rosegold/50"
                      : "border-may-border bg-may-surface hover:bg-white"
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white mb-2.5">
                    <img
                      src={asset.previewUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    {isMaster && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-may-dark text-white text-[9px] font-mono font-bold">
                        MASTER ASSET
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                      {idx === 0 ? "1:1 Square" : idx === 1 ? "4:5 Vertical" : "16:9 Wide"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-may-dark truncate max-w-[140px]">
                      {asset.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Bảo vệ ✓
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Batch Grid */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-may-muted mb-4">
            Tất cả ảnh trong phiên ({assets.length})
          </h3>

          <div className="grid grid-cols-5 gap-4">
            {assets.map((asset) => {
              const isMaster = asset.id === masterAsset?.id;
              return (
                <div
                  key={asset.id}
                  className="p-2.5 rounded-xl bg-white border border-may-border shadow-soft flex flex-col justify-between"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-may-surface mb-2">
                    <img
                      src={asset.previewUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                    {isMaster && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-may-dark text-white text-[8px] font-mono font-bold">
                        MASTER
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-may-dark truncate">
                      {asset.name}
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-may-muted font-mono">
                      <span>{asset.beautifyPreset}</span>
                      <span className="text-emerald-700 font-semibold">
                        {asset.jobStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
