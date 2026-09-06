"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { EnhancementMode, EnhancementPreset, BackgroundPreset, LightingPreset } from "@/types/studio";
import { Sparkles, CheckCircle2, Check, X } from "lucide-react";

const MODES: { id: EnhancementMode; title: string; desc: string }[] = [
  { id: "AUTO", title: "Auto", desc: "Instant AI adjustment" },
  { id: "BALANCED", title: "Balanced", desc: "Recommended natural blend" },
  { id: "PREMIUM", title: "Premium", desc: "High specular cosmetics glow" },
];

const PRESETS: { id: EnhancementPreset; title: string; desc: string }[] = [
  { id: "Clean Luxury", title: "Clean Luxury", desc: "Pure studio soft glow" },
  { id: "Soft Pink", title: "Soft Pink", desc: "Warm blush highlight" },
  { id: "Marble Studio", title: "Marble Studio", desc: "Architectural tone" },
  { id: "Editorial", title: "Editorial", desc: "High contrast magazine" },
  { id: "Natural", title: "Natural", desc: "Balanced organic daylight" },
];

export const EnhanceToolPanel: React.FC = () => {
  const {
    assets,
    activeAssetId,
    setEnhancementMode,
    setEnhancementPreset,
    setBackgroundPreset,
    setLightingPreset,
    applyEnhancementCommit,
    cancelEnhancementPreview,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);
  if (!activeAsset) return null;

  return (
    <div className="space-y-5">
      {/* Mode Selection */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted mb-2 block">
          Enhancement Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-may-border">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setEnhancementMode(m.id)}
              className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                activeAsset.enhancementMode === m.id
                  ? "bg-may-blush text-may-rosegold shadow-sm"
                  : "text-may-muted hover:text-may-dark"
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Selectors */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted mb-2 block">
          Preset Styles
        </label>
        <div className="space-y-1.5">
          {PRESETS.map((preset) => {
            const isSel = activeAsset.enhancementPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setEnhancementPreset(preset.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSel
                    ? "bg-white border-may-rosegold shadow-soft text-may-dark font-semibold"
                    : "bg-white/50 border-may-border text-may-muted hover:bg-white hover:text-may-dark"
                }`}
              >
                <div>
                  <div className="text-xs">{preset.title}</div>
                  <div className="text-[10px] text-may-muted font-normal mt-0.5">
                    {preset.desc}
                  </div>
                </div>
                {isSel && <CheckCircle2 className="w-4 h-4 text-may-rosegold shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generative Environment Dropdown */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted mb-2 block">
          Generative Environment
        </label>
        <select
          value={activeAsset.backgroundPreset}
          onChange={(e) => setBackgroundPreset(e.target.value as BackgroundPreset)}
          className="w-full p-2.5 rounded-xl bg-white border border-may-border text-xs text-may-dark font-medium focus:outline-none focus:border-may-rosegold"
        >
          <option value="Original">Original Environment</option>
          <option value="Clean Studio">Clean Studio Seamless</option>
          <option value="Soft Silk">Soft Silk Drapery</option>
          <option value="Marble">Luxury Marble Surface</option>
          <option value="Floral">Botanical Petals</option>
        </select>
      </div>

      {/* Preview Commit Bar */}
      {activeAsset.hasUncommittedPreview && (
        <div className="p-3 rounded-xl bg-may-champagne border border-amber-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Uncommitted Preview Active</span>
          </div>
          <p className="text-[10px] text-amber-800">
            Preview is active on canvas. Click Apply to commit to edit history.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={cancelEnhancementPreview}
              className="flex-1 py-2 px-2 rounded-lg bg-white border border-may-border text-may-muted hover:text-may-dark text-xs font-semibold"
            >
              Discard
            </button>
            <button
              onClick={applyEnhancementCommit}
              className="flex-1 py-2 px-2 rounded-lg bg-may-rosegold text-white text-xs font-semibold shadow-sm hover:bg-may-rosegold/90"
            >
              Apply Preset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
