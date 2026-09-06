"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { EnhanceToolPanel } from "./EnhanceToolPanel";
import { EditToolPanel } from "./EditToolPanel";
import { LogoInsertTool } from "./LogoInsertTool";
import { ExportPreflightPanel } from "./ExportPreflightPanel";
import { AnalysisRecommendationCard } from "./AnalysisRecommendationCard";
import { WatermarkPreset } from "@/types/studio";
import {
  Sparkles,
  ShieldCheck,
  Stamp,
  Download,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const InspectorPanel: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    assets,
    activeAssetId,
    updateWatermarkSettings,
    setBackgroundPreset,
    setLightingPreset,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);

  if (!activeAsset) {
    return (
      <aside className="w-80 border-l border-may-border bg-may-surface p-6 flex flex-col items-center justify-center text-center text-may-muted select-none">
        <Info className="w-8 h-8 text-may-rosegold/50 mb-2" />
        <h3 className="text-xs font-semibold text-may-dark">No Active Asset</h3>
        <p className="text-[11px] text-may-muted mt-1 max-w-[200px]">
          Upload or select a cosmetic image from the filmstrip dock to inspect and edit.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-may-border bg-may-surface flex flex-col justify-between shrink-0 select-none z-20 overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Step Header */}
        <div className="flex items-center justify-between pb-3 border-b border-may-border">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-may-blush text-may-rosegold uppercase">
              {activeTool}
            </span>
            <h2 className="text-xs font-semibold text-may-dark">
              Inspector Controls
            </h2>
          </div>
          <span className="text-[10px] text-may-muted font-mono">
            {activeAsset.width}×{activeAsset.height}px
          </span>
        </div>

        {/* Dynamic Tool Content */}
        {activeTool === "UPLOAD" && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white border border-may-border">
              <h3 className="text-xs font-semibold text-may-dark mb-1">
                Asset Metadata
              </h3>
              <p className="text-[11px] text-may-muted truncate">{activeAsset.name}</p>
            </div>
            <AnalysisRecommendationCard />
          </div>
        )}

        {activeTool === "ENHANCE" && <EnhanceToolPanel />}

        {activeTool === "EDIT" && <EditToolPanel />}

        {activeTool === "BACKGROUND" && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted mb-2 block">
                Generative Backdrop Preset
              </label>
              <select
                value={activeAsset.backgroundPreset}
                onChange={(e) => setBackgroundPreset(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-white border border-may-border text-xs text-may-dark font-medium"
              >
                <option value="Original">Original Environment</option>
                <option value="Clean Studio">Clean Studio Seamless</option>
                <option value="Soft Silk">Soft Silk Drapery</option>
                <option value="Marble">Luxury Marble Surface</option>
                <option value="Floral">Botanical Petals</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted mb-2 block">
                Lighting Atmosphere
              </label>
              <select
                value={activeAsset.lightingPreset}
                onChange={(e) => setLightingPreset(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-white border border-may-border text-xs text-may-dark font-medium"
              >
                <option value="Natural">Natural Daylight</option>
                <option value="Soft Luxury">Soft Beauty Diffuser</option>
                <option value="Warm Studio">Warm Champagne Studio</option>
              </select>
            </div>
          </div>
        )}

        {activeTool === "LOGO" && <LogoInsertTool />}

        {activeTool === "PROTECT" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Protected Source Asset</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                The product bottle, pump, label typography, and printed formula (e.g., 25% Mandelic Acid) are locked to original pixels.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-may-border space-y-3">
              <h4 className="text-xs font-semibold text-may-dark">
                Protected Region Diagnostic View
              </h4>
              <ul className="space-y-2 text-[11px] text-may-muted">
                <li className="flex items-center justify-between">
                  <span>Product Geometry:</span>
                  <span className="font-semibold text-emerald-700">LOCKED</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Label Typography:</span>
                  <span className="font-semibold text-emerald-700">LOCKED</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Brand Logo Print:</span>
                  <span className="font-semibold text-emerald-700">LOCKED</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Environment Composite:</span>
                  <span className="font-semibold text-may-rosegold">GENERATIVE</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTool === "WATERMARK" && (
          <div className="p-4 rounded-xl bg-white border border-may-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-may-dark">
                <Stamp className="w-4 h-4 text-may-rosegold" />
                <span>Watermark Security Layer</span>
              </div>
              <input
                type="checkbox"
                checked={activeAsset.watermark.enabled}
                onChange={(e) => updateWatermarkSettings({ enabled: e.target.checked })}
                className="w-4 h-4 accent-may-rosegold rounded cursor-pointer"
              />
            </div>

            {activeAsset.watermark.enabled && (
              <div className="space-y-3 pt-2 border-t border-may-border">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-may-muted mb-1 block">
                    Preset Pattern
                  </label>
                  <select
                    value={activeAsset.watermark.preset}
                    onChange={(e) =>
                      updateWatermarkSettings({
                        preset: e.target.value as WatermarkPreset,
                      })
                    }
                    className="w-full p-2 rounded-lg bg-may-surface border border-may-border text-xs text-may-dark font-medium"
                  >
                    <option value="MÂY Logo">MÂY Signature Logo</option>
                    <option value="Security Grid">Security Grid Pattern</option>
                    <option value="Diagonal Security">Diagonal Security Matrix</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-semibold uppercase text-may-muted mb-1">
                    <span>Opacity ({Math.round(activeAsset.watermark.opacity * 100)}%)</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={activeAsset.watermark.opacity}
                    onChange={(e) =>
                      updateWatermarkSettings({
                        opacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-may-rosegold cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTool === "EXPORT" && <ExportPreflightPanel />}
      </div>

      {/* Action Footer */}
      <div className="p-5 border-t border-may-border bg-white">
        {activeTool !== "EXPORT" ? (
          <button
            onClick={() => {
              if (activeTool === "UPLOAD") setActiveTool("ENHANCE");
              else if (activeTool === "ENHANCE") setActiveTool("EDIT");
              else if (activeTool === "EDIT") setActiveTool("LOGO");
              else if (activeTool === "LOGO") setActiveTool("PROTECT");
              else if (activeTool === "PROTECT") setActiveTool("EXPORT");
              else setActiveTool("EXPORT");
            }}
            className="w-full py-3 px-4 rounded-xl bg-may-rosegold text-white font-semibold text-xs shadow-soft hover:bg-may-rosegold/90 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Next Tool</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTool("EXPORT")}
            className="w-full py-3 px-4 rounded-xl bg-may-dark text-white font-semibold text-xs shadow-soft hover:bg-may-dark/90 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Ready for Export</span>
          </button>
        )}
      </div>
    </aside>
  );
};
