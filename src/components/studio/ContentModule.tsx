"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/studioStore";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { ContentPackVisual, ContentPackCopy } from "@/types/studio";
import { Copy, Check, Download, Sparkles, Layers, Image as ImageIcon } from "lucide-react";

const PACK_VISUALS: ContentPackVisual[] = [
  {
    id: "hero",
    label: "Hero Banner",
    ratio: "16:9",
    dimensions: "1920 × 1080 px",
    desc: "Website hero, banner trang chủ & display ad",
    previewFilter: "brightness(1.03) contrast(1.02)",
  },
  {
    id: "clean",
    label: "Product Clean",
    ratio: "1:1",
    dimensions: "1200 × 1200 px",
    desc: "Ảnh vuông thương mại điện tử & sàn Shopee/Lazada",
    previewFilter: "contrast(1.04)",
  },
  {
    id: "lifestyle",
    label: "Lifestyle Scene",
    ratio: "4:5",
    dimensions: "1080 × 1350 px",
    desc: "Khung dọc Instagram / Facebook Feed chuẩn tỷ lệ vàng",
    previewFilter: "sepia(0.04) brightness(1.02)",
  },
  {
    id: "story",
    label: "Story & Reel",
    ratio: "9:16",
    dimensions: "1080 × 1920 px",
    desc: "TikTok, Instagram Story & Reels toàn màn hình",
    previewFilter: "contrast(1.06) saturate(1.03)",
  },
];

const PACK_COPY: ContentPackCopy = {
  hook: "Đánh thức vẻ rạng ngời thuần khiết của làn da bạn cùng tinh hoa dưỡng chất MÂY.",
  caption:
    "Công thức dịu nhẹ từ tự nhiên hòa quyện cùng công nghệ bảo toàn hoạt chất mandelic acid 25%, MÂY Cosmetics kiến tạo trải nghiệm chăm sóc da thanh lịch và hiệu quả bền vững mỗi ngày.",
  cta: "Nhắn tin hoặc đặt hàng trực tuyến ngay hôm nay để nhận bộ quà tặng Soft Luxury từ MÂY.",
  hashtags: ["#MayCosmetics", "#SoftLuxury", "#CleanBeauty", "#SkincareRoutine", "#VietnameseBeauty"],
};

export const ContentModule: React.FC = () => {
  const { assets, activeAssetId } = useStudioStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportAll = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Bộ Content Pack đã được đóng gói và sẵn sàng tải về!");
    }, 1200);
  };

  if (!activeAsset) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-may-muted">
        Vui lòng tải ảnh sản phẩm ở mục CREATE trước khi tạo Content Pack.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-may-surface overflow-y-auto p-8 select-none">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-may-border pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-may-rosegold font-bold block mb-1">
              Complete Production Set
            </span>
            <h2 className="font-serif text-2xl font-semibold text-may-dark">
              MÂY Content Pack
            </h2>
            <p className="text-xs text-may-muted mt-1">
              Bộ ấn phẩm hoàn chỉnh đa tỷ lệ (Visuals) cùng nội dung truyền thông (Copy) đã được bảo toàn bản sắc thương hiệu.
            </p>
          </div>

          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-may-dark text-white hover:bg-may-dark/90 text-xs font-semibold shadow-card transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-may-blush" />
            <span>{isExporting ? "Đang đóng gói..." : "Xuất toàn bộ Content Pack"}</span>
          </button>
        </div>

        {/* Visuals Grid */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-may-muted mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-may-rosegold" />
            <span>Định dạng hình ảnh (Visual Formats)</span>
          </h3>

          <div className="grid grid-cols-4 gap-5">
            {PACK_VISUALS.map((vis) => (
              <div
                key={vis.id}
                className="p-4 rounded-2xl bg-white border border-may-border shadow-soft flex flex-col justify-between group hover:border-may-rosegold transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-may-surface mb-3 border border-may-border/50">
                    <img
                      src={activeAsset.previewUrl}
                      alt={vis.label}
                      style={{ filter: vis.previewFilter }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-mono">
                      {vis.ratio}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-may-dark">{vis.label}</h4>
                  <div className="text-[10px] font-mono text-may-rosegold mt-0.5">
                    {vis.dimensions}
                  </div>
                  <p className="text-[11px] text-may-muted mt-1 leading-snug">
                    {vis.desc}
                  </p>
                </div>

                <a
                  href={activeAsset.previewUrl}
                  download={`may-content-${vis.id}.jpg`}
                  className="mt-4 w-full py-2 rounded-lg bg-may-surface hover:bg-may-blushLight border border-may-border text-center text-xs font-medium text-may-dark transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-may-muted" />
                  <span>Tải ảnh {vis.ratio}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Copywriting Section */}
        <div className="p-6 rounded-2xl bg-white border border-may-border shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-may-muted flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-may-rosegold" />
              <span>Nội dung bài viết mẫu (Editorial Copy)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Tone: Soft Luxury
            </span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {/* Hook */}
            <div className="p-4 rounded-xl bg-may-surface border border-may-border/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-may-muted block mb-1">
                  1. Hook mở đầu
                </span>
                <p className="text-xs text-may-dark font-medium leading-relaxed">
                  &ldquo;{PACK_COPY.hook}&rdquo;
                </p>
              </div>
              <button
                onClick={() => handleCopy(PACK_COPY.hook, "hook")}
                className="mt-3 text-[11px] font-semibold text-may-rosegold hover:underline flex items-center gap-1 self-start"
              >
                {copiedKey === "hook" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép Hook</span>
                  </>
                )}
              </button>
            </div>

            {/* Caption */}
            <div className="p-4 rounded-xl bg-may-surface border border-may-border/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-may-muted block mb-1">
                  2. Thân bài (Caption)
                </span>
                <p className="text-xs text-may-dark leading-relaxed">
                  {PACK_COPY.caption}
                </p>
              </div>
              <button
                onClick={() => handleCopy(PACK_COPY.caption, "caption")}
                className="mt-3 text-[11px] font-semibold text-may-rosegold hover:underline flex items-center gap-1 self-start"
              >
                {copiedKey === "caption" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép Caption</span>
                  </>
                )}
              </button>
            </div>

            {/* CTA & Hashtags */}
            <div className="p-4 rounded-xl bg-may-surface border border-may-border/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-may-muted block mb-1">
                  3. Kêu gọi hành động (CTA)
                </span>
                <p className="text-xs text-may-dark font-medium leading-relaxed mb-2">
                  {PACK_COPY.cta}
                </p>
                <div className="text-[10px] text-may-rosegold font-mono leading-normal">
                  {PACK_COPY.hashtags.join(" ")}
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopy(`${PACK_COPY.cta}\n\n${PACK_COPY.hashtags.join(" ")}`, "cta")
                }
                className="mt-3 text-[11px] font-semibold text-may-rosegold hover:underline flex items-center gap-1 self-start"
              >
                {copiedKey === "cta" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép CTA & Tag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
