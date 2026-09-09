import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Wand2, 
  Star, 
  Maximize2,
  Trash2,
  Layers
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BrandLogo } from '../brand/BrandLogo';
import { createManagedObjectURL, getOptimizedThumbnail } from '../../utils/imageOptimizer';

export const HomeView: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    selectAsset,
    deleteAsset,
    setView,
    addUploadedAssets,
    previewRecommendation,
    openExport,
    themeMode,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = themeMode === 'quiet-luxury';
  const [filterCategory, setFilterCategory] = useState<'all' | 'master' | 'ready'>('all');

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const masterAsset = assets.find((a) => a.isMaster) || activeAsset;
  const activeRec = masterAsset?.recommendation;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file) => {
      const url = createManagedObjectURL(file);
      return {
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Mỹ phẩm',
        beforeImg: url,
        afterImg: url,
        width: 1200,
        height: 1500,
      };
    });

    addUploadedAssets(newAssets);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file) => {
      const url = createManagedObjectURL(file);
      return {
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Mỹ phẩm',
        beforeImg: url,
        afterImg: url,
        width: 1200,
        height: 1500,
      };
    });

    addUploadedAssets(newAssets);
  };

  const filteredAssets = assets.filter((item) => {
    if (filterCategory === 'master') return item.isMaster;
    if (filterCategory === 'ready') return item.status === 'Ready' || item.status === 'Master';
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 max-w-6xl mx-auto w-full space-y-12 animate-fadeIn select-none">
      {/* 1. BRAND HERO & CREATE / UPLOAD (Streamlined Deluxe) */}
      <section className="space-y-6 text-center max-w-2xl mx-auto pt-2">
        <div className="flex flex-col items-center gap-3">
          <BrandLogo variant="horizontal" className="h-10 w-auto" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans tracking-wide">
            AI Product Image Studio • Quiet Luxury Standards
          </p>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 md:p-10 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${
            isDark
              ? 'border-[#3D292D] bg-[#1A1315]/80 hover:bg-[#23181B] hover:border-[#B76E79]'
              : 'border-[#E7D6CE] bg-white/70 hover:bg-[#FFF8F6] hover:border-[#B76E79]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B76E79] group-hover:text-white transition-all duration-300 shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold font-serif text-neutral-900 dark:text-neutral-100">
              Kéo thả ảnh sản phẩm vào đây hoặc nhấp để tải lên
            </div>
            <div className="text-[11px] opacity-60 mt-1">
              Hỗ trợ PNG, JPG, WebP độ phân giải cao lên đến 4K
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              Tải ảnh ngay
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                selectAsset('asset-01');
                setView('studio');
              }}
              className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Thử Serum mẫu</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. BEST NEXT ACTION: SMART RECOMMENDATION SPOTLIGHT */}
      {masterAsset && activeRec && (
        <section
          className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
            isDark
              ? 'bg-[#1D1618] border-[#3E2B30] text-[#FAF5F2]'
              : 'bg-white border-[#ECD8D2] text-[#2D1D1F]'
          }`}
        >
          {/* Visual Thumbnail */}
          <div 
            className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-[#B76E79]/40 relative group cursor-pointer"
            onClick={() => {
              selectAsset(masterAsset.id);
              setView('studio');
            }}
          >
            <img
              src={getOptimizedThumbnail(masterAsset.afterImg || masterAsset.beforeImg, 400)}
              alt={masterAsset.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-white drop-shadow" />
            </div>
            {masterAsset.isMaster && (
              <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>MASTER</span>
              </span>
            )}
          </div>

          {/* Action Information & Intelligence */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BEST NEXT ACTION</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold font-serif text-neutral-900 dark:text-[#FAF5F2]">
              "{activeRec.action}" cho {masterAsset.name}
            </h3>

            <p className="text-xs opacity-75 leading-relaxed max-w-xl">
              {activeRec.reason}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  previewRecommendation(masterAsset.id);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <span>Xem trước (Preview)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  selectAsset(masterAsset.id);
                  openExport();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer border-neutral-300 dark:border-neutral-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất ảnh ngay</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. RECENT WORK GALLERY WITH CATEGORY FILTERS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-[#FAF5F2]">
              Tác Phẩm Gần Đây (Recent Work)
            </h2>
            <p className="text-xs opacity-70">
              Tiếp tục chỉnh sửa hoặc tải về ảnh đã hoàn thiện
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-inherit bg-black/[0.02] dark:bg-white/[0.02] self-start sm:self-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Tất cả ({assets.length})
            </button>
            <button
              onClick={() => setFilterCategory('master')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'master'
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Ảnh Master
            </button>
            <button
              onClick={() => setFilterCategory('ready')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === 'ready'
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Sẵn sàng xuất
            </button>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAssets.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col group ${
                isDark ? 'bg-[#1A1315] border-[#38262A]' : 'bg-white border-[#EADBD3]'
              }`}
            >
              {/* Card Image Thumbnail */}
              <div
                onClick={() => {
                  selectAsset(item.id);
                  setView('studio');
                }}
                className="aspect-[4/5] relative overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  src={getOptimizedThumbnail(item.afterImg || item.beforeImg, 400)}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                />

                {/* Category Pill */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-mono">
                  {item.category}
                </div>

                {/* Master Badge */}
                {item.isMaster && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>MASTER</span>
                  </div>
                )}

                {/* Hover Overlay Hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/90 text-neutral-900 text-xs font-bold shadow backdrop-blur-md flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#B76E79]" />
                    <span>Mở trong Studio</span>
                  </span>
                </div>
              </div>

              {/* Card Details & Actions */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <h4 className="font-bold text-sm font-serif truncate text-neutral-900 dark:text-[#FAF5F2]">
                    {item.name}
                  </h4>
                  <div className="text-[11px] opacity-65 flex items-center gap-2 mt-1">
                    <span>Tỷ lệ {item.recipe.aspectRatio}</span>
                    <span>•</span>
                    <span className="font-mono">{item.width}x{item.height}px</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-inherit flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      selectAsset(item.id);
                      setView('studio');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#B76E79]/10 text-[#B76E79] text-xs font-bold hover:bg-[#B76E79] hover:text-white transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Mở Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      selectAsset(item.id);
                      openExport();
                    }}
                    className="p-2.5 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-all text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    title="Xuất ảnh này"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAsset(item.id);
                    }}
                    className="p-2.5 rounded-xl border border-inherit hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all text-neutral-400 cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
