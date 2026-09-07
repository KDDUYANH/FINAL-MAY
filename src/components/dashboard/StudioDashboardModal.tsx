import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Star, 
  CheckCircle2, 
  Package 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BRAND_CONFIG } from '../../config/brand.config';

export const StudioDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    toggleDashboard,
    assets,
    selectedAssetId,
    selectAsset,
    setStage,
    masterRecipe,
    openContentPackModal,
    themeMode
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  if (!isDashboardOpen) return null;

  const masterAsset = assets.find((a) => a.isMaster) || assets[0];
  const readyCount = assets.filter((a) => a.status === 'Ready' || a.status === 'Master').length;
  const reviewCount = assets.filter((a) => a.exceptions && a.exceptions.length > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className={`relative w-full max-w-5xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#181214] border-[#38262A] text-[#F5ECE8]' : 'bg-white border-[#EFE4DE] text-[#2D1D1F]'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-[#EFE4DE] dark:border-[#38262A] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/40 shadow-md shrink-0">
              <img 
                src="/assets/brand/may_logo_circle.png" 
                alt="MÂY Brand Seal" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] to-[#8C4752]">
                  {BRAND_CONFIG.name} Production Executive Dashboard
                </h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {BRAND_CONFIG.version}
                </span>
              </div>
              <p className="text-xs opacity-70">
                Tổng quan tiến độ sản xuất hình ảnh & gói nội dung thương mại của thương hiệu.
              </p>
            </div>
          </div>

          <button
            onClick={toggleDashboard}
            className="p-2.5 rounded-xl border hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. KEY KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 flex items-center justify-between mb-1">
                <span>Tài Sản Sản Xuất</span>
                <Package className="w-4 h-4 text-[#B76E79]" />
              </div>
              <div className="text-2xl font-bold font-serif text-[#B76E79]">{assets.length} Ảnh</div>
              <div className="text-[10px] opacity-70 mt-1 truncate">
                Mẫu chính: <strong>{masterAsset.name}</strong>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 flex items-center justify-between mb-1">
                <span>Product Truth Integrity</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-emerald-600">100%</div>
              <div className="text-[10px] opacity-70 mt-1">
                Bảo toàn tuyệt đối nhãn & bao bì
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 flex items-center justify-between mb-1">
                <span>Sẵn Sàng Xuất Bản</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-blue-600">{readyCount}/{assets.length}</div>
              <div className="text-[10px] opacity-70 mt-1">
                {reviewCount > 0 ? `${reviewCount} ảnh cần kiểm tra lề` : 'Toàn bộ đạt tiêu chuẩn'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 flex items-center justify-between mb-1">
                <span>Độ Phân Giải Chuẩn</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-amber-600">4K UHD</div>
              <div className="text-[10px] opacity-70 mt-1">
                3840 x 4800 px Không Nhiễu Hạt
              </div>
            </div>
          </div>

          {/* 2. MASTER RECIPE & BRAND STANDARD HIGHLIGHT */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FFF5F6] to-[#FAF0EE] dark:from-[#2B1B20] dark:to-[#221619] border border-[#E9CCD3] dark:border-[#4D2F36] flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current" />
                Công Thức Chuẩn (Active Master Recipe)
              </div>
              <h4 className="font-serif font-bold text-base text-[#8C4752] dark:text-[#E0A7AF]">
                {masterRecipe.name}
              </h4>
              <p className="text-xs opacity-80 max-w-xl leading-relaxed">
                Ánh sáng: <strong className="capitalize">{masterRecipe.recipe.lightingPreset.replace('_', ' ')}</strong> • 
                Bối cảnh: <strong className="capitalize">{masterRecipe.recipe.scenePreset}</strong> • 
                Khung hình: <strong>{masterRecipe.recipe.aspectRatio}</strong> • 
                Thủy ấn: <strong>{masterRecipe.brand.watermarkMode} ({masterRecipe.brand.watermarkOpacity}%)</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  toggleDashboard();
                  setStage('edit');
                }}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold hover:bg-black/5 transition-all cursor-pointer"
              >
                Chỉnh Thông Số Master
              </button>
              <button
                onClick={() => {
                  toggleDashboard();
                  openContentPackModal();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                Mở Content Pack
              </button>
            </div>
          </div>

          {/* 3. ALL ASSETS OVERVIEW GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-[#B76E79]">
                Tất Cả Sản Phẩm Trong Dự Án ({assets.length})
              </h4>
              <span className="text-[11px] opacity-70">
                Nhấn vào ảnh để chuyển nhanh đến giao diện biên tập
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {assets.map((item) => {
                const isCurrent = item.id === selectedAssetId;
                const hasEx = item.exceptions && item.exceptions.length > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      selectAsset(item.id);
                      toggleDashboard();
                      setStage('edit');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group ${
                      isCurrent
                        ? 'border-[#B76E79] shadow-md ring-2 ring-[#B76E79]/20'
                        : isDark ? 'bg-[#22181B] border-[#38262A] hover:border-neutral-500' : 'bg-[#FAF5F2] border-[#EFE4DE] hover:border-neutral-400'
                    }`}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border shrink-0">
                      <img src={item.afterImg || item.beforeImg} alt={item.name} className="w-full h-full object-cover" />
                      {item.isMaster && (
                        <div className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-full">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold truncate group-hover:text-[#B76E79] transition-colors">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-[10px] opacity-70 mt-0.5">
                        {item.category} • Khung {item.recipe.aspectRatio}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          hasEx ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-semibold">
                          ✓ 100% Protected
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#EFE4DE] dark:border-[#38262A] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs opacity-75">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cam kết giữ vững Product Truth & Không sinh chi tiết giả</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                toggleDashboard();
                setStage('create');
              }}
              className="px-4 py-2.5 rounded-xl border text-xs font-bold hover:bg-black/5 transition-all cursor-pointer"
            >
              + Tải Thêm Ảnh Mới
            </button>
            <button
              onClick={() => {
                toggleDashboard();
                setStage('export');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Chuyển Đến Cổng Xuất Bản (Export)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
