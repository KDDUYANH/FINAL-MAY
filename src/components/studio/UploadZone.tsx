"use client";

import React, { useRef, useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { Upload, Image as ImageIcon, Sparkles, Plus } from "lucide-react";

export const UploadZone: React.FC = () => {
  const { addAssetsFromFiles, addSampleAsset } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addAssetsFromFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addAssetsFromFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* Drop Zone Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full max-w-xl p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
          isDragging
            ? "border-may-rosegold bg-may-blush/30 scale-[1.01]"
            : "border-may-border bg-white/70 hover:bg-white hover:border-may-rosegold/60 shadow-soft"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-may-blush flex items-center justify-center text-may-rosegold mb-4 shadow-sm">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="font-serif text-xl font-semibold text-may-dark mb-1">
          Upload Product Imagery
        </h3>
        <p className="text-xs text-may-muted max-w-xs leading-relaxed mb-6">
          Drag &amp; drop high-resolution cosmetic photos (PNG, JPG, WebP) or click to browse.
        </p>

        <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-may-rosegold text-white text-xs font-semibold shadow-card hover:bg-may-rosegold/90 transition-all">
          <Plus className="w-4 h-4" />
          <span>Select Images</span>
        </div>
      </div>

      {/* Sample Product Images */}
      <div className="mt-8 max-w-xl w-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-may-muted uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-may-rosegold" />
          <span>Or load sample MÂY cosmetic imagery</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {MAY_BRAND_CONFIG.sampleProducts.map((sample) => (
            <button
              key={sample.id}
              onClick={() => addSampleAsset(sample)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-may-border hover:border-may-rosegold shadow-sm transition-all focus:outline-none"
            >
              <img
                src={sample.url}
                alt={sample.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-left">
                <span className="text-[10px] font-medium text-white line-clamp-1">
                  {sample.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
