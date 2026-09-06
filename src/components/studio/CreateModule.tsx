"use client";

import React, { useRef } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { StudioCanvas } from "./StudioCanvas";
import { Upload, ShieldCheck, ArrowRight, Sparkles, Sliders } from "lucide-react";

export const CreateModule: React.FC = () => {
  const {
    assets,
    activeAssetId,
    addAssetsFromFiles,
    addSampleAsset,
    setActiveModule,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-may-surface overflow-hidden relative">
      {assets.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-may-blush text-may-rosegold flex items-center justify-center mb-6 shadow-soft">
            <Upload className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-3xl font-semibold text-may-dark tracking-wide mb-3">
            Create beautiful product content
          </h2>

          <p className="text-sm text-may-muted leading-relaxed mb-8 max-w-md">
            Upload your product image. MÂY will automatically detect and protect your packaging, label text, and formulation details.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3.5 rounded-xl bg-may-dark text-white text-sm font-semibold shadow-card hover:bg-may-dark/90 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Product</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && addAssetsFromFiles(e.target.files)}
            className="hidden"
          />

          {/* Sample Brand Assets Selector */}
          <div className="mt-12 pt-8 border-t border-may-border/60 w-full">
            <span className="text-[11px] font-mono uppercase tracking-widest text-may-muted block mb-4">
              Or start with sample MÂY cosmetics
            </span>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {MAY_BRAND_CONFIG.sampleProducts.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => addSampleAsset(sample)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-may-border hover:border-may-rosegold shadow-soft hover:shadow-card transition-all text-left"
                >
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="pr-2">
                    <div className="text-xs font-semibold text-may-dark max-w-[120px] truncate">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-may-rosegold">Sample Asset</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Loaded State with Dominant Canvas and One Main CTA */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Protection & Hero Status Bar */}
          <div className="h-12 border-b border-may-border bg-white/70 backdrop-blur px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Product detected ✓</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Label protected ✓</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Logo preserved ✓</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveModule("EDIT")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-may-border bg-white hover:bg-may-blushLight text-xs font-semibold text-may-dark transition-all"
              >
                <Sliders className="w-3.5 h-3.5 text-may-rosegold" />
                <span>Fine-tune in Edit</span>
              </button>
              <button
                onClick={() => setActiveModule("CONTENT")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-may-dark text-white hover:bg-may-dark/90 text-xs font-semibold shadow-soft transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-may-rosegold" />
                <span>Create Content Pack</span>
                <ArrowRight className="w-3.5 h-3.5 text-may-blush" />
              </button>
            </div>
          </div>

          {/* Central Hero Canvas */}
          <div className="flex-1 relative overflow-hidden">
            <StudioCanvas />
          </div>
        </div>
      )}
    </div>
  );
};
