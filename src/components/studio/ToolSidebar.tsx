"use client";

import React from "react";
import { useStudioStore } from "@/store/studioStore";
import { ActiveTool } from "@/types/studio";
import {
  Upload,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Shield,
  Stamp,
  Download,
  RotateCcw,
  Maximize2,
  Eye,
  Home,
  Layers,
} from "lucide-react";

interface ToolItem {
  tool: ActiveTool;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const TOOLS: ToolItem[] = [
  {
    tool: "UPLOAD",
    label: "Upload & Select",
    desc: "Import cosmetic photos",
    icon: Upload,
  },
  {
    tool: "ENHANCE",
    label: "AI Enhance",
    desc: "Luxury lighting & backdrop",
    icon: Sparkles,
  },
  {
    tool: "EDIT",
    label: "Smart Edit",
    desc: "Crop, color & exposure",
    icon: Zap,
  },
  {
    tool: "BACKGROUND",
    label: "Environment",
    desc: "Studio backdrop composite",
    icon: Layers,
  },
  {
    tool: "LOGO",
    label: "Add Brand Logo",
    desc: "9-grid anchor mark insert",
    icon: ImageIcon,
  },
  {
    tool: "PROTECT",
    label: "Product Protection",
    desc: "Lock packaging & label text",
    icon: Shield,
  },
  {
    tool: "WATERMARK",
    label: "Watermark Layer",
    desc: "Security grid protection",
    icon: Stamp,
  },
  {
    tool: "EXPORT",
    label: "Multi-Ratio Export",
    desc: "1:1, 4:5, 9:16, 16:9 formats",
    icon: Download,
  },
];

export const ToolSidebar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    setViewMode,
    isLoupeActive,
    setLoupeActive,
    resetCanvasView,
    activeAssetId,
    assets,
    resetActiveAssetAll,
  } = useStudioStore();

  const activeAsset = assets.find((a) => a.id === activeAssetId);

  return (
    <aside className="w-60 border-r border-may-border bg-may-surface flex flex-col justify-between shrink-0 select-none z-20 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Workspace Switcher */}
        <div>
          <button
            onClick={() => setViewMode("home")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-may-border text-xs font-semibold text-may-dark hover:bg-may-blushLight transition-all"
          >
            <Home className="w-4 h-4 text-may-rosegold" />
            <span>Return to Workspace Home</span>
          </button>
        </div>

        {/* Studio Tools */}
        <div>
          <h2 className="text-[11px] font-semibold tracking-wider text-may-muted uppercase px-2 mb-3">
            Studio Tools
          </h2>
          <div className="space-y-1">
            {TOOLS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.tool;
              return (
                <button
                  key={item.tool}
                  onClick={() => setActiveTool(item.tool)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 border ${
                    isActive
                      ? "bg-white border-may-rosegold/40 shadow-soft text-may-dark"
                      : "border-transparent hover:bg-white/60 text-may-muted hover:text-may-dark"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isActive
                        ? "bg-may-blush text-may-rosegold"
                        : "bg-may-blushLight text-may-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-may-muted/80 leading-snug mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Inspection View Controls */}
        <div>
          <h2 className="text-[11px] font-semibold tracking-wider text-may-muted uppercase px-2 mb-2">
            Inspection & View
          </h2>
          <div className="space-y-1.5">
            <button
              onClick={() => setLoupeActive(!isLoupeActive)}
              disabled={!activeAsset}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                isLoupeActive
                  ? "bg-may-rosegold text-white border-may-rosegold shadow-sm"
                  : "bg-white border-may-border text-may-dark hover:bg-may-blushLight"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>200% Inspection Loupe</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10">
                {isLoupeActive ? "ON" : "OFF"}
              </span>
            </button>

            <button
              onClick={resetCanvasView}
              disabled={!activeAsset}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-may-border text-may-dark hover:bg-may-blushLight transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Maximize2 className="w-3.5 h-3.5 text-may-muted" />
              <span>Fit to Viewport</span>
            </button>

            <button
              onClick={resetActiveAssetAll}
              disabled={!activeAsset}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-may-border text-may-muted hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Edits</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Protection Guarantee */}
      <div className="p-4 m-3 rounded-xl bg-may-champagne border border-amber-200/60 text-may-dark">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
          <Shield className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Product Integrity</span>
        </div>
        <p className="text-[10px] text-amber-800/90 leading-relaxed mt-1">
          Source packaging &amp; label text are locked. AI updates background &amp; lighting environment only.
        </p>
      </div>
    </aside>
  );
};
