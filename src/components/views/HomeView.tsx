import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Wand2, 
  ShieldCheck,
  Star,
  CheckCircle2,
  Maximize2,
  Trash2
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
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 max-w-7xl mx-auto w-full space-y-12 animate-fadeIn select-none">
      {/* 1. TOP HERO: MODERN MINIMAL LUXURY BANNER */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 border transition-all duration-300 shadow-xl bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.02] border-neutral-200/80 dark:border-neutral-800">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold backdrop-blur-md bg-white/60 dark:bg-[#1E1618]/60 border-[#B76E79]/30 text-[#B76E79]">
            <BrandLogo variant="mark" className="h-4 w-auto inline-block" />
            <span>MÂY Studio v4.0 • Quiet Luxury Commercial AI</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-neutral-900 dark:text-[#FAF5F2] leading-tight">
            Nâng Tầm Hình Ảnh Mỹ Phẩm Cao Cấp
          </h1>

          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
            Không cần kỹ năng photoshop phức tạp. AI tự động định vị sản phẩm, tái tạo ánh sáng studio dịu mắt, và bảo toàn 100% nhãn in thành phần bao bì.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#A25A64] to-[#8C4752] text-white text-xs md:text-sm font-bold shadow-lg hover:shadow-xl hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Tải Ảnh Sản Phẩm</span>
            </button>

            <button
              onClick={() => {
                selectAsset('asset-01');
                setView('studio');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs md:text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
            >
              <Wand2 className="w-4 h-4 text-[#B76E79]" />
              <span>Thử nghiệm với Serum mẫu</span>
            </button>
          </div>
        </div>

        {/* Ambient Luxury Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#B76E79]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none" />
      </section>

      {/* 2. DRAG & DROP UPLOAD ZONE */}
      <section>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 md:p-10 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${
            isDark
              ? 'border-[#443034] bg-[#181214]/60 hover:bg-[#22181B] hover:border-[#B76E79]'
              : 'border-[#E5D7D0] bg-white/60 hover:bg-[#FFF8F6] hover:border-[#B76E79]'
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
          <div className="w-16 h-16 rounded-2xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B76E79] group-hover:text-white transition-all duration-300 shadow-sm">
            <Upload className="w-7 h-7" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold font-serif text-neutral-900 dark:text-neutral-100">
              Kéo thả hình ảnh vào đây hoặc bấm để tải lên
            </div>
            <div className="text-xs opacity-60 mt-1">
              Hỗ trợ PNG, JPG, WebP độ phân giải cao lên đến 4K
            </div>
          </div>
        </div>
      </section>

      {/* 3. SMART NEXT ACTION: AI RECOMMENDATION HERO */}
      {masterAsset && activeRec && (
        <section
          className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
            isDark
              ? 'bg-[#1D1618] border-[#3E2B30] text-[#FAF5F2]'
              : 'bg-white border-[#ECD8D2] text-[#2D1D1F]'
          }`}
        >
          {/* Visual Thumbnail with Master Badge */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-[#B76E79]/40 relative group cursor-pointer"
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B76E79]">
              <Sparkles className="w-4 h-4" />
              <span>Gợi ý bước tiếp theo của AI (Smart Recommendation)</span>
            </div>

            <h3 className="text-lg md:text-xl font-bold font-serif text-neutral-900 dark:text-[#FAF5F2]">
              "{activeRec.action}" cho {masterAsset.name}
            </h3>

            <p className="text-xs opacity-75 leading-relaxed max-w-xl">
              {activeRec.reason}
            </p>

            {/* Quality & Integrity Badge */}
            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Nhãn in: 100% Nguyên bản</span>
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Độ tin cậy AI: 99%</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  selectAsset(masterAsset.id);
                  setView('studio');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <span>Xem trước & Hoàn thiện</span>
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

      {/* 4. RECENT WORK GALLERY WITH CATEGORY FILTERS */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-neutral-900 dark:text-[#FAF5F2]">
              Tác Phẩm Gần Đây (Recent Work)
            </h2>
            <p className="text-xs opacity-70">
              Quản lý và tiếp tục tinh chỉnh các bộ sản phẩm đang thực hiện
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
              className={`rounded-3xl border overflow-hidden transition-all duration-300 group flex flex-col ${
                isDark ? 'bg-[#1D1618] border-[#36262A]' : 'bg-white border-[#EADBD3]'
              } hover:shadow-2xl hover:border-[#B76E79]`}
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
                    <span>Chỉnh sửa trong Studio</span>
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
                    <Wand2 className="w-3.5 h-3.5" />
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

      {/* 5. BRAND VALUE PILLARS (Deluxe Soft Luxury Assurance) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-inherit">
        <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.015] border border-inherit space-y-1.5">
          <div className="flex items-center gap-2 text-[#B76E79] font-bold text-xs font-serif">
            <ShieldCheck className="w-4 h-4" />
            <span>Bảo Toàn Nhãn Hoạt Chất 100%</span>
          </div>
          <p className="text-[11px] opacity-70 leading-relaxed">
            Công nghệ segmentation tự động nhận diện và khóa bất biến phần chữ in thành phần & logo in trên bao bì chai.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.015] border border-inherit space-y-1.5">
          <div className="flex items-center gap-2 text-[#B76E79] font-bold text-xs font-serif">
            <Sparkles className="w-4 h-4" />
            <span>Ánh Sáng Studio Mềm Mại</span>
          </div>
          <p className="text-[11px] opacity-70 leading-relaxed">
            Tái tạo độ tương phản quang học, phản xạ bóng đổ tự nhiên trên nền lụa satin và đá marble thanh lịch.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-black/[0.015] dark:bg-white/[0.015] border border-inherit space-y-1.5">
          <div className="flex items-center gap-2 text-[#B76E79] font-bold text-xs font-serif">
            <Download className="w-4 h-4" />
            <span>Xuất Ảnh 4K Sẵn Sàng Bán Hàng</span>
          </div>
          <p className="text-[11px] opacity-70 leading-relaxed">
            Hỗ trợ đầy đủ tỷ lệ chuẩn cho Shopee, Instagram Post, Story/Reels và in ấn ấn phẩm POSM thương mại.
          </p>
        </div>
      </section>
    </div>
  );
};
