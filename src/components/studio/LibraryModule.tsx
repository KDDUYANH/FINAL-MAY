"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { Search, Download, Trash2, Sliders, ExternalLink, Image as ImageIcon } from "lucide-react";

type LibraryTab = "ALL" | "PRODUCTS" | "PROJECTS" | "BRAND" | "EXPORTS";

export const LibraryModule: React.FC = () => {
  const { assets, setActiveAssetId, setActiveModule, removeAsset } = useStudioStore();
  const [activeTab, setActiveTab] = useState<LibraryTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-may-surface overflow-y-auto p-8 select-none">
      <div className="max-w-6xl w-full mx-auto space-y-6">
        {/* Header & Search */}
        <div className="flex items-center justify-between border-b border-may-border pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-may-rosegold font-bold block mb-1">
              Asset Archive
            </span>
            <h2 className="font-serif text-2xl font-semibold text-may-dark">
              MÂY Library
            </h2>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-may-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm tài sản ảnh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-may-border bg-white text-xs text-may-dark placeholder:text-may-muted focus:outline-none focus:border-may-rosegold transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {(
            [
              { key: "ALL", label: "Tất cả (All)" },
              { key: "PRODUCTS", label: "Sản phẩm (Products)" },
              { key: "PROJECTS", label: "Dự án (Projects)" },
              { key: "BRAND", label: "Nhận diện (Brand)" },
              { key: "EXPORTS", label: "Đã xuất (Exports)" },
            ] as { key: LibraryTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-may-dark text-white shadow-soft"
                  : "bg-white text-may-muted hover:text-may-dark border border-may-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Asset Cards Grid */}
        {filteredAssets.length === 0 && assets.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-may-border text-center">
            <ImageIcon className="w-10 h-10 text-may-muted mx-auto mb-3" />
            <h4 className="font-serif text-lg font-semibold text-may-dark">
              Thư viện trống
            </h4>
            <p className="text-xs text-may-muted mt-1 mb-5">
              Chưa có ảnh nào được tải vào phiên làm việc. Tải ảnh tại mục CREATE để quản lý tại đây.
            </p>
            <button
              onClick={() => setActiveModule("CREATE")}
              className="px-5 py-2 rounded-xl bg-may-dark text-white text-xs font-semibold shadow-soft"
            >
              Đi tới CREATE
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-3.5 rounded-2xl bg-white border border-may-border shadow-soft flex flex-col justify-between group hover:border-may-rosegold transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-may-surface mb-3 border border-may-border/50">
                    <img
                      src={asset.previewUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                      {asset.width}×{asset.height}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-may-dark truncate">
                    {asset.name}
                  </h4>
                  <div className="text-[10px] text-may-muted font-mono mt-0.5">
                    {new Date(asset.createdAt).toLocaleDateString()} • {asset.beautifyPreset}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-may-border flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveAssetId(asset.id);
                      setActiveModule("EDIT");
                    }}
                    className="flex items-center gap-1 text-[11px] font-semibold text-may-rosegold hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Mở chỉnh sửa</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={asset.previewUrl}
                      download={asset.name}
                      className="p-1.5 rounded-lg hover:bg-may-surface text-may-muted hover:text-may-dark transition-all"
                      title="Tải xuống"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-may-muted hover:text-red-600 transition-all"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
