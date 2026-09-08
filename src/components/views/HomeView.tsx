import React, { useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Plus, 
  Wand2
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BrandLogo } from '../brand/BrandLogo';

export const HomeView: React.FC = () => {
  const {
    assets,
    selectAsset,
    setView,
    addUploadedAssets,
    openExport,
    themeMode,
  } = useStudioStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = themeMode === 'quiet-luxury';

  const masterAsset = assets.find((a) => a.isMaster) || assets[0];
  const activeRec = masterAsset?.recommendation;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
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
      const url = URL.createObjectURL(file);
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

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full space-y-10 animate-fadeIn select-none">
      {/* 1. HERO SECTION: UPLOAD PRODUCT */}
      <section className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BrandLogo variant="circle" className="h-12 w-auto shadow-md rounded-2xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
          AI Product Image Studio
        </h1>
        <p className="text-xs md:text-sm opacity-75 max-w-lg mx-auto leading-relaxed">
          Tải ảnh mỹ phẩm thô. AI sẽ tự động phân tích và tạo hình ảnh thương mại chuẩn cao cấp, bảo toàn 100% nhãn in bao bì.
        </p>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-6 p-8 md:p-10 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group ${
            isDark
              ? 'border-[#4A3438] bg-[#1F171A]/70 hover:bg-[#281D21] hover:border-[#B76E79]'
              : 'border-[#E6D1C9] bg-white/70 hover:bg-[#FFF9F7] hover:border-[#B76E79]'
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
          <div className="w-14 h-14 rounded-2xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold">Kéo thả ảnh sản phẩm vào đây</div>
            <div className="text-xs opacity-60 mt-0.5">Hoặc bấm để tải từ thiết bị (JPG, PNG, WebP)</div>
          </div>
          <button className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md pointer-events-none">
            Chọn ảnh từ máy
          </button>
        </div>
      </section>

      {/* 2. SMART NEXT ACTION: AI RECOMMENDATION CARD */}
      {masterAsset && activeRec && (
        <section
          className={`p-6 rounded-3xl border transition-all shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 ${
            isDark
              ? 'bg-gradient-to-r from-[#281D21] to-[#1E1518] border-[#442F34]'
              : 'bg-gradient-to-r from-[#FFF5F2] to-[#FAF0EB] border-[#EBDAD2]'
          }`}
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-[#B76E79]/40 relative">
            <img
              src={masterAsset.afterImg || masterAsset.beforeImg}
              alt={masterAsset.name}
              className="w-full h-full object-cover"
            />
            {masterAsset.isMaster && (
              <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                MASTER
              </span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#B76E79]">
                Gợi ý bước tiếp theo (Smart Next Move)
              </span>
            </div>
            <h3 className="text-base font-bold font-serif">
              "{activeRec.action}" cho {masterAsset.name}
            </h3>
            <p className="text-xs opacity-75 mt-1 leading-relaxed">
              {activeRec.reason}
            </p>

            <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  selectAsset(masterAsset.id);
                  setView('studio');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
              >
                <span>Xem trước trong Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  selectAsset(masterAsset.id);
                  openExport();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất ngay</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. RECENT WORK: LARGE VISUAL THUMBNAILS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold">Tác phẩm gần đây (Recent Work)</h2>
            <p className="text-xs opacity-70">Các sản phẩm đang thực hiện trong workspace</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-bold text-[#B76E79] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {assets.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl border overflow-hidden transition-all duration-200 group flex flex-col ${
                isDark ? 'bg-[#1F1719] border-[#38262A]' : 'bg-white border-[#EADBD3]'
              } hover:shadow-xl hover:border-[#B76E79]`}
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
                  src={item.afterImg || item.beforeImg}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-mono">
                  {item.category}
                </div>
                {item.isMaster && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    MASTER
                  </div>
                )}
              </div>

              {/* Card Details & Actions */}
              <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h4 className="font-bold text-sm truncate">{item.name}</h4>
                  <div className="text-[11px] opacity-65 flex items-center gap-2 mt-0.5">
                    <span>{item.recipe.aspectRatio}</span>
                    <span>•</span>
                    <span>{item.width}x{item.height}px</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-inherit flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      selectAsset(item.id);
                      setView('studio');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#B76E79]/10 text-[#B76E79] text-xs font-bold hover:bg-[#B76E79] hover:text-white transition-all cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Mở Studio</span>
                  </button>
                  <button
                    onClick={() => {
                      selectAsset(item.id);
                      openExport();
                    }}
                    className="p-2 rounded-xl border border-inherit hover:bg-black/5 dark:hover:bg-white/5 transition-all text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    title="Xuất ảnh này"
                  >
                    <Download className="w-3.5 h-3.5" />
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
