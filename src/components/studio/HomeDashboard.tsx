"use client";

import React, { useRef } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  Stamp,
  Download,
  Image as ImageIcon,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";
import { ActiveTool } from "@/types/studio";

export const HomeDashboard: React.FC = () => {
  const {
    assets,
    setViewMode,
    setActiveAssetId,
    setActiveTool,
    addAssetsFromFiles,
    addSampleAsset,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickAction = (tool: ActiveTool) => {
    setActiveTool(tool);
    setViewMode("studio");
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-may-surface text-may-dark font-sans overflow-y-auto select-none">
      {/* Top Bar Header */}
      <header className="h-16 border-b border-may-border bg-white/80 backdrop-blur px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-may-rosegold/10 text-may-rosegold font-serif font-bold text-lg border border-may-rosegold/20 flex items-center justify-center">
            M
          </div>
          <div>
            <h1 className="font-serif text-lg tracking-wider font-semibold text-may-dark">
              {MAY_BRAND_CONFIG.name} IMAGE STUDIO
            </h1>
            <p className="text-[10px] text-may-muted tracking-wider">
              {MAY_BRAND_CONFIG.tagline}
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-may-rosegold text-white text-xs font-semibold shadow-soft hover:bg-may-rosegold/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Images</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && addAssetsFromFiles(e.target.files)}
          className="hidden"
        />
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-may-champagne via-white to-may-blushLight border border-may-border shadow-card flex items-center justify-between">
          <div className="max-w-xl space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-widest text-may-rosegold uppercase">
              Creative Production Studio
            </span>
            <h2 className="font-serif text-2xl font-semibold text-may-dark">
              What would you like to edit today?
            </h2>
            <p className="text-xs text-may-muted leading-relaxed">
              Enhance cosmetic product photography while preserving original packaging, bottle shape, and formulation text.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-may-dark text-white text-xs font-semibold shadow-card hover:bg-may-dark/90 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import New Asset</span>
            </button>
          </div>
        </div>

        {/* Quick Action Workspaces */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-may-muted mb-4">
            Production Workflows
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              {
                tool: "ENHANCE" as ActiveTool,
                title: "AI Enhance",
                desc: "Studio lighting & backdrop",
                icon: Sparkles,
              },
              {
                tool: "EDIT" as ActiveTool,
                title: "Smart Edit",
                desc: "Crop, color & exposure",
                icon: Zap,
              },
              {
                tool: "LOGO" as ActiveTool,
                title: "Add Brand Logo",
                desc: "Position 9-grid anchor mark",
                icon: ImageIcon,
              },
              {
                tool: "PROTECT" as ActiveTool,
                title: "Protect Packaging",
                desc: "Lock label text & geometry",
                icon: ShieldCheck,
              },
              {
                tool: "EXPORT" as ActiveTool,
                title: "Multi-Ratio Export",
                desc: "1:1, 4:5, 9:16, 16:9 formats",
                icon: Download,
              },
            ].map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.title}
                  onClick={() => handleQuickAction(qa.tool)}
                  className="p-5 rounded-2xl bg-white border border-may-border hover:border-may-rosegold/60 shadow-soft hover:shadow-card transition-all text-left group flex flex-col justify-between h-36"
                >
                  <div className="w-10 h-10 rounded-xl bg-may-blushLight text-may-rosegold flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-may-dark group-hover:text-may-rosegold transition-colors">
                      {qa.title}
                    </h4>
                    <p className="text-[10px] text-may-muted mt-0.5 leading-snug">
                      {qa.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Assets & Active Batch */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-may-muted">
              Recent Assets ({assets.length})
            </h3>
            {assets.length > 0 && (
              <button
                onClick={() => setViewMode("studio")}
                className="text-xs font-semibold text-may-rosegold hover:underline flex items-center gap-1"
              >
                <span>Open Studio Canvas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {assets.length === 0 ? (
            <div className="p-12 rounded-2xl border-2 border-dashed border-may-border bg-white text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-may-blush flex items-center justify-center text-may-rosegold mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-semibold text-may-dark">
                No active images in session
              </h4>
              <p className="text-xs text-may-muted max-w-sm mt-1 mb-5">
                Upload your cosmetic product photography or pick sample MÂY assets to begin editing.
              </p>
              <div className="flex items-center gap-3">
                {MAY_BRAND_CONFIG.sampleProducts.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => addSampleAsset(sample)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-may-surface border border-may-border hover:border-may-rosegold text-xs font-medium text-may-dark transition-all"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="truncate max-w-[100px]">{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    setActiveAssetId(asset.id);
                    setViewMode("studio");
                  }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-may-border hover:border-may-rosegold shadow-soft hover:shadow-card cursor-pointer transition-all bg-white"
                >
                  <img
                    src={asset.previewUrl}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/50 self-start">
                      {asset.status}
                    </span>
                    <div>
                      <h5 className="text-xs font-semibold truncate">{asset.name}</h5>
                      <span className="text-[10px] text-white/80">
                        {asset.width}×{asset.height}px
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
