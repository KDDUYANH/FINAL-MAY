"use client";

import React, { useRef } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { LogoAnchorPosition } from "@/types/studio";
import { Image as ImageIcon, Upload, Sparkles, Check, Move } from "lucide-react";

const ANCHORS: { id: LogoAnchorPosition; label: string }[] = [
  { id: "top-left", label: "TL" },
  { id: "top-center", label: "TC" },
  { id: "top-right", label: "TR" },
  { id: "center-left", label: "CL" },
  { id: "center", label: "C" },
  { id: "center-right", label: "CR" },
  { id: "bottom-left", label: "BL" },
  { id: "bottom-center", label: "BC" },
  { id: "bottom-right", label: "BR" },
];

export const LogoInsertTool: React.FC = () => {
  const { assets, activeAssetId, updateLogoSettings } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAsset = assets.find((a) => a.id === activeAssetId);
  if (!activeAsset) return null;

  const logo = activeAsset.logo;

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      updateLogoSettings({ url, enabled: true });
    }
  };

  return (
    <div className="space-y-5">
      {/* Enable Toggle & Selector */}
      <div className="p-4 rounded-xl bg-white border border-may-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-may-dark">
            <ImageIcon className="w-4 h-4 text-may-rosegold" />
            <span>Brand Logo Insert</span>
          </div>
          <input
            type="checkbox"
            checked={logo.enabled}
            onChange={(e) => updateLogoSettings({ enabled: e.target.checked })}
            className="w-4 h-4 accent-may-rosegold rounded cursor-pointer"
          />
        </div>

        {logo.enabled && (
          <div className="space-y-3 pt-2 border-t border-may-border">
            <label className="text-[10px] font-semibold uppercase text-may-muted block">
              Select Logo Asset
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MAY_BRAND_CONFIG.availableLogos.map((bl) => {
                const isSel = logo.url === bl.url;
                return (
                  <button
                    key={bl.id}
                    onClick={() => updateLogoSettings({ url: bl.url })}
                    className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${
                      isSel
                        ? "bg-may-blushLight border-may-rosegold text-may-dark font-semibold"
                        : "bg-may-surface border-may-border text-may-muted hover:text-may-dark"
                    }`}
                  >
                    <img src={bl.url} alt={bl.title} className="w-5 h-5 object-contain" />
                    <span className="text-[10px] truncate">{bl.title}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-may-surface border border-dashed border-may-border hover:border-may-rosegold text-may-dark text-xs font-medium flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5 text-may-muted" />
              <span>Upload Custom Logo (PNG/SVG)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/svg+xml"
              onChange={handleCustomLogoUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      {logo.enabled && (
        <>
          {/* 9-Grid Position Anchors */}
          <div className="p-4 rounded-xl bg-white border border-may-border space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-may-dark">
              <div className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-may-rosegold" />
                <span>9-Grid Anchor Position</span>
              </div>
              <span className="text-[10px] font-mono text-may-muted uppercase">
                {logo.anchorPosition}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto p-2 bg-may-surface rounded-xl border border-may-border">
              {ANCHORS.map((anchor) => {
                const isSel = logo.anchorPosition === anchor.id;
                return (
                  <button
                    key={anchor.id}
                    onClick={() => updateLogoSettings({ anchorPosition: anchor.id })}
                    className={`h-9 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center ${
                      isSel
                        ? "bg-may-rosegold text-white shadow-sm scale-105"
                        : "bg-white text-may-muted hover:text-may-dark border border-may-border/60"
                    }`}
                  >
                    {anchor.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders: Scale, Opacity, Rotation, Margin */}
          <div className="p-4 rounded-xl bg-white border border-may-border space-y-4">
            <div>
              <div className="flex justify-between text-[10px] font-semibold uppercase text-may-muted mb-1">
                <span>Scale ({logo.scale}%)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={logo.scale}
                onChange={(e) => updateLogoSettings({ scale: parseInt(e.target.value) })}
                className="w-full accent-may-rosegold cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold uppercase text-may-muted mb-1">
                <span>Opacity ({Math.round(logo.opacity * 100)}%)</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={logo.opacity}
                onChange={(e) => updateLogoSettings({ opacity: parseFloat(e.target.value) })}
                className="w-full accent-may-rosegold cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold uppercase text-may-muted mb-1">
                <span>Margin ({logo.margin}%)</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={logo.margin}
                onChange={(e) => updateLogoSettings({ margin: parseInt(e.target.value) })}
                className="w-full accent-may-rosegold cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-may-border text-xs text-may-dark">
              <span>Smart Placement (Avoid Label)</span>
              <input
                type="checkbox"
                checked={logo.smartPlacement}
                onChange={(e) => updateLogoSettings({ smartPlacement: e.target.checked })}
                className="w-4 h-4 accent-may-rosegold rounded cursor-pointer"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
