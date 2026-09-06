"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { StudioCanvas } from "./StudioCanvas";
import {
  HeroEditAction,
  CanvasHistoryStage,
  EnhancementPreset,
  CleanPreset,
  LightingPreset,
  ScenePreset,
  AlignPreset,
  QualityPreset,
} from "@/types/studio";
import {
  Sparkles,
  Eraser,
  Sun,
  Layers,
  Crop,
  ArrowUpCircle,
  Shield,
  Stamp,
  Sliders,
  Maximize2,
  Eye,
  RotateCcw,
} from "lucide-react";

interface HeroActionDef {
  key: HeroEditAction;
  label: string;
  icon: React.ElementType;
}

const HERO_ACTIONS: HeroActionDef[] = [
  { key: "BEAUTIFY", label: "Làm đẹp", icon: Sparkles },
  { key: "CLEAN", label: "Làm sạch", icon: Eraser },
  { key: "LIGHTING", label: "Ánh sáng", icon: Sun },
  { key: "SCENE", label: "Bối cảnh", icon: Layers },
  { key: "ALIGN", label: "Căn ảnh", icon: Crop },
  { key: "UPSCALE", label: "Nâng chất lượng", icon: ArrowUpCircle },
];

const HISTORY_STAGES: CanvasHistoryStage[] = [
  "Original",
  "Clean",
  "Scene",
  "Brand",
  "Final",
];

export const EditModule: React.FC = () => {
  const {
    assets,
    activeAssetId,
    activeHeroAction,
    setActiveHeroAction,
    setBeautifyPreset,
    setCleanPreset,
    setLightingPreset,
    setScenePreset,
    setAlignPreset,
    setQualityPreset,
    updateAdjustments,
    updateWatermark,
    toggleShowProtectedArea,
    setHistoryStage,
    resetActiveAsset,
    isLoupeActive,
    setLoupeActive,
    resetCanvasView,
  } = useStudioStore();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  if (!activeAsset) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-may-muted">
        Vui lòng tải ảnh lên ở mục CREATE để bắt đầu chỉnh sửa.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-may-surface overflow-hidden">
      {/* Workspace Body: Left Actions + Center Hero Canvas + Right Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Hero Actions Selector (6 actions) */}
        <aside className="w-56 border-r border-may-border bg-white flex flex-col justify-between shrink-0 select-none p-3 overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-may-muted px-2 py-1 block">
              6 Tác vụ chính
            </span>
            {HERO_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isActive = activeHeroAction === action.key;
              return (
                <button
                  key={action.key}
                  onClick={() => setActiveHeroAction(action.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-may-blush text-may-dark shadow-soft border border-may-rosegold/30"
                      : "text-may-muted hover:text-may-dark hover:bg-may-surface"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      isActive ? "bg-white text-may-rosegold" : "bg-may-blushLight"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Inspection View Controls */}
          <div className="pt-4 border-t border-may-border space-y-1.5">
            <button
              onClick={() => setLoupeActive(!isLoupeActive)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                isLoupeActive
                  ? "bg-may-rosegold text-white border-may-rosegold shadow-sm"
                  : "bg-white border-may-border text-may-dark hover:bg-may-blushLight"
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>Kính soi 200%</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10">
                {isLoupeActive ? "BẬT" : "TẮT"}
              </span>
            </button>

            <button
              onClick={resetCanvasView}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-may-border text-may-dark hover:bg-may-blushLight transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5 text-may-muted" />
              <span>Căn vừa màn hình</span>
            </button>

            <button
              onClick={resetActiveAsset}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-may-border text-may-muted hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục gốc</span>
            </button>
          </div>
        </aside>

        {/* Center Hero Canvas */}
        <main className="flex-1 relative overflow-hidden bg-may-surface flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <StudioCanvas />
          </div>

          {/* Bottom History Pills */}
          <div className="h-12 border-t border-may-border bg-white/90 backdrop-blur px-6 flex items-center justify-center gap-2 select-none shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-may-muted mr-3">
              Giai đoạn:
            </span>
            {HISTORY_STAGES.map((stage) => {
              const isActive = activeAsset.historyStage === stage;
              return (
                <button
                  key={stage}
                  onClick={() => setHistoryStage(stage)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-may-dark text-white shadow-soft"
                      : "bg-may-surface text-may-muted hover:text-may-dark border border-may-border"
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </main>

        {/* Right Preset & Action Controls Panel */}
        <aside className="w-72 border-l border-may-border bg-white p-5 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
          <div className="space-y-6">
            {/* Header for Active Action */}
            <div className="border-b border-may-border pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-may-rosegold block mb-1">
                Tùy biến nhanh
              </span>
              <h3 className="font-serif text-lg font-semibold text-may-dark">
                {HERO_ACTIONS.find((a) => a.key === activeHeroAction)?.label}
              </h3>
            </div>

            {/* Presets based on Active Action */}
            {activeHeroAction === "BEAUTIFY" && (
              <div className="space-y-2">
                {(["Auto", "Natural", "Clean Luxury", "Soft Beauty"] as EnhancementPreset[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setBeautifyPreset(p)}
                      className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                        activeAsset.beautifyPreset === p
                          ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                          : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                      }`}
                    >
                      <span>{p}</span>
                      {activeAsset.beautifyPreset === p && (
                        <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}

            {activeHeroAction === "CLEAN" && (
              <div className="space-y-2">
                {(["Original", "Cleaned", "Spotless"] as CleanPreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCleanPreset(p)}
                    className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                      activeAsset.cleanPreset === p
                        ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                        : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                    }`}
                  >
                    <span>{p}</span>
                    {activeAsset.cleanPreset === p && (
                      <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeHeroAction === "LIGHTING" && (
              <div className="space-y-2">
                {(["Natural", "Soft Studio", "Editorial", "Warm"] as LightingPreset[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setLightingPreset(p)}
                      className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                        activeAsset.lightingPreset === p
                          ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                          : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                      }`}
                    >
                      <span>{p}</span>
                      {activeAsset.lightingPreset === p && (
                        <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}

            {activeHeroAction === "SCENE" && (
              <div className="space-y-2">
                {(
                  [
                    "Original",
                    "Clean Studio",
                    "Soft Silk",
                    "Marble",
                    "Editorial",
                  ] as ScenePreset[]
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setScenePreset(p)}
                    className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                      activeAsset.scenePreset === p
                        ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                        : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                    }`}
                  >
                    <span>{p}</span>
                    {activeAsset.scenePreset === p && (
                      <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {activeHeroAction === "ALIGN" && (
              <div className="space-y-2">
                {(["Fit", "1:1", "4:5", "9:16", "16:9", "Center"] as AlignPreset[]).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setAlignPreset(p)}
                      className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                        activeAsset.alignPreset === p
                          ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                          : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                      }`}
                    >
                      <span>{p}</span>
                      {activeAsset.alignPreset === p && (
                        <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                      )}
                    </button>
                  )
                )}
              </div>
            )}

            {activeHeroAction === "UPSCALE" && (
              <div className="space-y-2">
                {(["Standard", "2K", "4K"] as QualityPreset[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setQualityPreset(p)}
                    className={`w-full p-3 rounded-xl text-left border text-xs font-medium transition-all flex items-center justify-between ${
                      activeAsset.qualityPreset === p
                        ? "bg-may-blush text-may-dark border-may-rosegold shadow-soft font-semibold"
                        : "border-may-border hover:bg-may-surface text-may-muted hover:text-may-dark"
                    }`}
                  >
                    <span>{p}</span>
                    {activeAsset.qualityPreset === p && (
                      <span className="w-2 h-2 rounded-full bg-may-rosegold" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Advanced Toggle */}
            <div className="pt-4 border-t border-may-border">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-semibold text-may-muted hover:text-may-dark py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cài đặt nâng cao (Advanced)</span>
                </div>
                <span>{showAdvanced ? "▲" : "▼"}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-4 text-xs">
                  {/* Watermark Controls */}
                  <div className="p-3 rounded-xl bg-may-surface border border-may-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-may-dark">Watermark</span>
                      <input
                        type="checkbox"
                        checked={activeAsset.watermark.enabled}
                        onChange={(e) => updateWatermark({ enabled: e.target.checked })}
                      />
                    </div>
                    {activeAsset.watermark.enabled && (
                      <>
                        <select
                          value={activeAsset.watermark.preset}
                          onChange={(e) =>
                            updateWatermark({ preset: e.target.value as any })
                          }
                          className="w-full p-1.5 rounded-lg border border-may-border bg-white text-xs"
                        >
                          <option value="MÂY Logo">MÂY Logo</option>
                          <option value="Security Grid">Security Grid</option>
                          <option value="Diagonal Security">Diagonal Security</option>
                        </select>
                        <div className="flex items-center justify-between text-[11px] text-may-muted">
                          <span>Độ mờ:</span>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={activeAsset.watermark.opacity}
                            onChange={(e) =>
                              updateWatermark({ opacity: parseFloat(e.target.value) })
                            }
                            className="w-28"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Product Protection Inspector */}
                  <div className="p-3 rounded-xl bg-may-surface border border-may-border space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-may-dark">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bảo vệ sản phẩm</span>
                    </div>
                    <div className="text-[11px] text-may-muted space-y-1">
                      <div className="flex justify-between">
                        <span>Bao bì:</span>
                        <span className="text-emerald-700 font-medium">Đã phát hiện ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tem nhãn:</span>
                        <span className="text-emerald-700 font-medium">Đã bảo vệ ✓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hình dáng:</span>
                        <span className="text-emerald-700 font-medium">Đã khóa ✓</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleShowProtectedArea}
                      className="w-full py-1.5 rounded-lg bg-white border border-may-border text-[11px] font-medium text-may-dark hover:bg-may-blushLight transition-all"
                    >
                      {activeAsset.protection.showProtectedArea
                        ? "Ẩn vùng bảo vệ"
                        : "Hiển thị vùng bảo vệ"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Protection Honest Guarantee */}
          <div className="p-3 rounded-xl bg-may-champagne border border-amber-200/60 text-may-dark text-[11px] mt-4">
            <div className="font-semibold text-amber-900 mb-0.5">Product Integrity</div>
            <p className="text-amber-800/90 leading-relaxed text-[10px]">
              Bảo toàn 100% chi tiết tem nhãn và logo từ file gốc khi render bối cảnh.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
