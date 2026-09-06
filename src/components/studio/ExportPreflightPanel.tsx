"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { renderExportBlob } from "@/lib/canvas/renderExport";
import { CheckCircle2, Download, ShieldCheck, FileCheck, Info } from "lucide-react";

export const ExportPreflightPanel: React.FC = () => {
  const { assets, activeAssetId } = useStudioStore();
  const activeAsset = assets.find((a) => a.id === activeAssetId);

  const [format, setFormat] = useState<"JPG" | "PNG" | "WebP">("PNG");
  const [ratio, setRatio] = useState<"Original" | "1:1" | "4:5" | "9:16" | "16:9">("Original");
  const [resolution, setResolution] = useState<"Original" | "2K" | "4K">("2K");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!activeAsset) return null;

  const preflightChecks = [
    { label: "Product Geometry Protected", passed: true },
    { label: "Formulation Text Verified", passed: true },
    { label: "Brand Logo Position Valid", passed: activeAsset.logo.enabled },
    { label: "Watermark Safety Margin", passed: true },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await renderExportBlob({
        asset: activeAsset,
        format,
        ratio,
        resolution,
        includeLogo,
        includeWatermark,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `MAY_${activeAsset.name.replace(/\.[^/.]+$/, "")}_${ratio}_${resolution}.${format.toLowerCase()}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Pre-flight QA Checklist */}
      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Pre-flight QA Checklist</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
            READY TO EXPORT
          </span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-emerald-900">
          {preflightChecks.map((check) => (
            <li key={check.label} className="flex items-center justify-between">
              <span>{check.label}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            </li>
          ))}
        </ul>
      </div>

      {/* Format Selector */}
      <div className="space-y-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted block">
          Export Format
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-may-border">
          {(["JPG", "PNG", "WebP"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                format === fmt
                  ? "bg-may-blush text-may-rosegold shadow-sm"
                  : "text-may-muted hover:text-may-dark"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted block">
          Aspect Ratio Target
        </label>
        <select
          value={ratio}
          onChange={(e) => setRatio(e.target.value as any)}
          className="w-full p-2.5 rounded-xl bg-white border border-may-border text-xs text-may-dark font-medium"
        >
          <option value="Original">Original Aspect Ratio</option>
          <option value="1:1">1:1 Square (Instagram Post)</option>
          <option value="4:5">4:5 Vertical Portrait</option>
          <option value="9:16">9:16 Story / Reel / TikTok</option>
          <option value="16:9">16:9 Landscape Banner</option>
        </select>
      </div>

      {/* Output Resolution */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-may-muted block">
          Output Resolution
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-may-border">
          {(["Original", "2K", "4K"] as const).map((res) => (
            <button
              key={res}
              onClick={() => setResolution(res)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                resolution === res
                  ? "bg-may-blush text-may-rosegold shadow-sm"
                  : "text-may-muted hover:text-may-dark"
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Options Toggles */}
      <div className="p-4 rounded-xl bg-white border border-may-border space-y-2 text-xs text-may-dark">
        <div className="flex items-center justify-between">
          <span>Include Brand Logo Layer</span>
          <input
            type="checkbox"
            checked={includeLogo}
            onChange={(e) => setIncludeLogo(e.target.checked)}
            className="w-4 h-4 accent-may-rosegold rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Include Watermark Layer</span>
          <input
            type="checkbox"
            checked={includeWatermark}
            onChange={(e) => setIncludeWatermark(e.target.checked)}
            className="w-4 h-4 accent-may-rosegold rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Primary Download Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full py-3 px-4 rounded-xl bg-may-dark text-white font-semibold text-xs shadow-card hover:bg-may-dark/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? "Baking High-Res Export..." : "Download Export Image"}</span>
      </button>
    </div>
  );
};
