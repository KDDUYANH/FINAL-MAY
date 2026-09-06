"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { Sparkles, ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export const AnalysisRecommendationCard: React.FC = () => {
  const { assets, activeAssetId, applyRecommendation, runProductAnalysis, setActiveTool } =
    useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);
  if (!activeAsset || !activeAsset.recommendation) return null;

  const rec = activeAsset.recommendation;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-may-champagne/80 via-white to-may-blushLight/50 border border-may-rosegold/30 shadow-soft space-y-3">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-may-dark">
          <Sparkles className="w-4 h-4 text-may-rosegold" />
          <span>Product Analysis Complete</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          PROTECTED
        </span>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/80 border border-may-border text-[11px]">
        <div>
          <span className="text-may-muted block text-[10px]">Product Geometry:</span>
          <span className="font-semibold text-may-dark flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Detected
          </span>
        </div>
        <div>
          <span className="text-may-muted block text-[10px]">Image Quality:</span>
          <span className="font-semibold text-may-dark">Good</span>
        </div>
        <div>
          <span className="text-may-muted block text-[10px]">Background:</span>
          <span className="font-semibold text-amber-700">Needs refinement</span>
        </div>
        <div>
          <span className="text-may-muted block text-[10px]">Product Integrity:</span>
          <span className="font-semibold text-emerald-700">Protected</span>
        </div>
      </div>

      {/* Recommendation Action Box */}
      <div className="p-3 rounded-xl bg-white border border-may-rosegold/40 space-y-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-may-rosegold">
          Recommended Next Step
        </div>
        <h4 className="text-xs font-bold text-may-dark">{rec.title}</h4>
        <p className="text-[11px] text-may-muted leading-relaxed">{rec.reason}</p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => applyRecommendation(activeAsset.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-may-rosegold text-white font-semibold text-xs shadow-sm hover:bg-may-rosegold/90 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Apply Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool("EDIT")}
            className="py-2 px-3 rounded-lg bg-may-surface text-may-muted hover:text-may-dark border border-may-border text-xs font-medium transition-all"
          >
            Change Direction
          </button>
        </div>
      </div>
    </div>
  );
};
