"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { MainModule } from "@/types/studio";
import { Sparkles, Download, ArrowRight, Layers } from "lucide-react";

const MODULES: { key: MainModule; label: string }[] = [
  { key: "CREATE", label: "CREATE" },
  { key: "EDIT", label: "EDIT" },
  { key: "CONTENT", label: "CONTENT" },
  { key: "BATCH", label: "BATCH" },
  { key: "LIBRARY", label: "LIBRARY" },
];

export const Header: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    assets,
    demoMode,
    jobStatusMessage,
  } = useStudioStore();

  const readyCount = assets.filter((a) => a.jobStatus === "ready").length;

  return (
    <header className="h-16 border-b border-may-border bg-white/90 backdrop-blur px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left Brand Identifier */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-may-rosegold/10 text-may-rosegold font-serif font-bold text-lg border border-may-rosegold/20 flex items-center justify-center">
          M
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg tracking-wider font-semibold text-may-dark">
              {MAY_BRAND_CONFIG.name}
            </h1>
            <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-may-blush text-may-dark font-medium border border-may-rosegold/30">
              STUDIO
            </span>
          </div>
          <p className="text-[10px] text-may-muted tracking-wider">
            {MAY_BRAND_CONFIG.tagline}
          </p>
        </div>
      </div>

      {/* Center 5 Primary Navigation Modules */}
      <nav className="flex items-center gap-1 bg-may-surface p-1 rounded-xl border border-may-border">
        {MODULES.map((item) => {
          const isActive = activeModule === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                isActive
                  ? "bg-white text-may-dark shadow-soft border border-may-rosegold/30"
                  : "text-may-muted hover:text-may-dark hover:bg-white/50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Honest Status & Primary Action */}
      <div className="flex items-center gap-3">
        {/* Status Line: Concise, no technical jargon */}
        <div className="text-right hidden sm:block">
          <div className="text-[11px] font-medium text-may-dark">
            {assets.length > 0 ? `${readyCount} images ready` : "No assets loaded"}
          </div>
          <div className="text-[9px] text-may-muted font-mono">
            {demoMode ? "DEMO MODE (LOCAL CANVAS)" : jobStatusMessage}
          </div>
        </div>

        {activeModule === "CREATE" && assets.length > 0 && (
          <button
            onClick={() => setActiveModule("CONTENT")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-may-dark text-white hover:bg-may-dark/90 text-xs font-semibold shadow-soft transition-all"
          >
            <span>Create Content Pack</span>
            <ArrowRight className="w-3.5 h-3.5 text-may-blush" />
          </button>
        )}

        {activeModule === "EDIT" && assets.length > 0 && (
          <button
            onClick={() => setActiveModule("CONTENT")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-may-rosegold text-white hover:bg-may-rosegold/90 text-xs font-semibold shadow-soft transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Asset</span>
          </button>
        )}

        {activeModule === "BATCH" && assets.length > 0 && (
          <button
            onClick={() => setActiveModule("CONTENT")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-may-dark text-white hover:bg-may-dark/90 text-xs font-semibold shadow-soft transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-may-blush" />
            <span>Export Batch Pack</span>
          </button>
        )}
      </div>
    </header>
  );
};
