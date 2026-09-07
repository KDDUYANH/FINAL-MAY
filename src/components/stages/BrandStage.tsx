import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BRAND_CONFIG } from '../../config/brand.config';
import { WatermarkPosition, WatermarkMode } from '../../types/studio';
import { StudioCanvas } from '../canvas/StudioCanvas';

export const BrandStage: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    updateActiveBrand,
    themeMode,
    setStage,
    showToast
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const brand = activeAsset?.brand;

  // Active sub-tab in Brand panel: 'logo' vs 'watermark'
  const [brandTab, setBrandTab] = useState<'logo' | 'watermark'>('logo');

  if (!activeAsset || !brand) return null;

  const positions: { id: WatermarkPosition; label: string }[] = [
    { id: 'auto', label: 'Tự động né sản phẩm' },
    { id: 'bottom_right', label: 'Góc Dưới Phải' },
    { id: 'bottom_left', label: 'Góc Dưới Trái' },
    { id: 'top_right', label: 'Góc Trên Phải' },
    { id: 'top_left', label: 'Góc Trên Trái' },
    { id: 'center', label: 'Chính Giữa' },
  ];

  const watermarkModes: { id: WatermarkMode; label: string; desc: string }[] = [
    { id: 'subtle', label: 'MÂY Subtle Emblem', desc: 'Biểu tượng chìm góc ảnh sang trọng' },
    { id: 'logo', label: 'Logo & Tagline Hoàn Chỉnh', desc: 'Bao gồm slogan & số điện thoại' },
    { id: 'security', label: 'Diagonal Security Grid', desc: 'Ma trận bảo vệ bản quyền chống sao chép' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden relative select-none">
      {/* Visual Canvas Stage */}
      <StudioCanvas />

      {/* Right Brand Inspector */}
      <aside className={`w-88 border-l flex flex-col justify-between shrink-0 overflow-y-auto transition-colors duration-200 ${
        isDark ? 'bg-[#181315] border-[#2E2023]' : 'bg-white border-[#EFE4DE]'
      }`}>
        <div className="p-5 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-[#B76E79]">
              Hệ Thống Nhận Diện Thương Hiệu
            </h3>
            <p className="text-xs opacity-70">
              Định vị Logo và Thủy ấn (Watermark) chuẩn xác, tự động né vùng sản phẩm.
            </p>
          </div>

          {/* Sub-tab navigation: Logo vs Watermark */}
          <div className={`p-1 rounded-2xl border flex text-xs font-bold ${
            isDark ? 'bg-[#22181B] border-[#3B282C]' : 'bg-[#FAF3EF] border-[#EADAD1]'
          }`}>
            <button
              onClick={() => setBrandTab('logo')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                brandTab === 'logo'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Logo Thương Hiệu
            </button>
            <button
              onClick={() => setBrandTab('watermark')}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                brandTab === 'watermark'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Thủy Ấn (Watermark)
            </button>
          </div>

          {/* TAB 1: LOGO CONTROLS */}
          {brandTab === 'logo' && (
            <div className="space-y-4">
              {/* Enable / Disable Logo */}
              <div className="flex items-center justify-between p-3 rounded-2xl border bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
                <span className="font-bold">Kích hoạt chèn Logo</span>
                <input
                  type="checkbox"
                  checked={brand.logoEnabled}
                  onChange={(e) => updateActiveBrand({ logoEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#B76E79]"
                />
              </div>

              {brand.logoEnabled && (
                <>
                  {/* Select Brand Logo Asset */}
                  <div>
                    <label className="text-xs font-bold block mb-2">Chọn Mẫu Logo MÂY</label>
                    <div className="space-y-2">
                      {BRAND_CONFIG.logos.map((logo) => (
                        <button
                          key={logo.id}
                          onClick={() => updateActiveBrand({ logoAsset: logo.id })}
                          className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                            brand.logoAsset === logo.id
                              ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                              : isDark ? 'bg-[#22181B] border-[#3D292D]' : 'bg-[#FAF5F2] border-[#ECDAD2]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{logo.label}</div>
                            <div className={`text-[10px] mt-0.5 ${brand.logoAsset === logo.id ? 'text-white/80' : 'opacity-70'}`}>
                              {logo.recommendedUsage}
                            </div>
                          </div>
                          {brand.logoAsset === logo.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Position */}
                  <div>
                    <label className="text-xs font-bold block mb-2">Vị Trí Đặt Logo</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {positions.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => updateActiveBrand({ logoPosition: pos.id })}
                          className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                            brand.logoPosition === pos.id
                              ? 'bg-[#B76E79] text-white border-[#8C4752] font-bold shadow-xs'
                              : isDark ? 'bg-[#22181B] border-[#3D292D] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Size & Opacity */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Kích thước logo:</span>
                        <span className="font-mono">{brand.logoSize}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={brand.logoSize}
                        onChange={(e) => updateActiveBrand({ logoSize: Number(e.target.value) })}
                        className="w-full accent-[#B76E79]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Độ đậm (Opacity):</span>
                        <span className="font-mono">{brand.logoOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={brand.logoOpacity}
                        onChange={(e) => updateActiveBrand({ logoOpacity: Number(e.target.value) })}
                        className="w-full accent-[#B76E79]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: WATERMARK CONTROLS */}
          {brandTab === 'watermark' && (
            <div className="space-y-4">
              {/* Enable / Disable Watermark */}
              <div className="flex items-center justify-between p-3 rounded-2xl border bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
                <span className="font-bold">Bật Thủy ấn (Watermark)</span>
                <input
                  type="checkbox"
                  checked={brand.watermarkEnabled}
                  onChange={(e) => updateActiveBrand({ watermarkEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#B76E79]"
                />
              </div>

              {brand.watermarkEnabled && (
                <>
                  {/* Watermark Modes */}
                  <div>
                    <label className="text-xs font-bold block mb-2">Chế Độ Thủy Ấn</label>
                    <div className="space-y-2">
                      {watermarkModes.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => updateActiveBrand({ watermarkMode: mode.id })}
                          className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                            brand.watermarkMode === mode.id
                              ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                              : isDark ? 'bg-[#22181B] border-[#3D292D]' : 'bg-[#FAF5F2] border-[#ECDAD2]'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold">{mode.label}</div>
                            <div className={`text-[10px] mt-0.5 ${brand.watermarkMode === mode.id ? 'text-white/80' : 'opacity-70'}`}>
                              {mode.desc}
                            </div>
                          </div>
                          {brand.watermarkMode === mode.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Watermark Position */}
                  {brand.watermarkMode !== 'security' && (
                    <div>
                      <label className="text-xs font-bold block mb-2">Vị Trí Thủy Ấn</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {positions.map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => updateActiveBrand({ watermarkPosition: pos.id })}
                            className={`p-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                              brand.watermarkPosition === pos.id
                                ? 'bg-[#B76E79] text-white border-[#8C4752] font-bold shadow-xs'
                                : isDark ? 'bg-[#22181B] border-[#3D292D] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opacity & Protect Product Area Switch */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Độ mờ Thủy ấn:</span>
                        <span className="font-mono">{brand.watermarkOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={brand.watermarkOpacity}
                        onChange={(e) => updateActiveBrand({ watermarkOpacity: Number(e.target.value) })}
                        className="w-full accent-[#B76E79]"
                      />
                    </div>

                    <div className="p-3 rounded-xl border flex items-center justify-between text-xs bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300/40">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Protect product area</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={brand.protectProductArea}
                        onChange={(e) => updateActiveBrand({ protectProductArea: e.target.checked })}
                        className="w-4 h-4 accent-emerald-600"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dominant Stage Action */}
        <div className="p-4 border-t border-[#EFE4DE] space-y-2">
          <button
            onClick={() => {
              showToast('✨ Đã áp dụng nhận diện thương hiệu cho toàn bộ ảnh!');
              setStage('batch');
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply Brand & Đến Batch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
};
