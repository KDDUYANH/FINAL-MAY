import React from 'react';
import { 
  LayoutTemplate, 
  Download, 
  Sparkles, 
  Tag, 
  Quote, 
  Award, 
  Check
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { AspectRatio, VisualTemplate } from '../../types/studio';
import { VisualLayoutEngine } from '../../services/visualLayoutEngine';
import { MayBrandMark } from '../brand/MayBrandMark';
import { ContentPackExporter } from '../../services/contentPackExporter';

export const VisualComposer: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    contentBrief,
    selectedTemplate,
    setSelectedTemplate,
    updateActiveRecipe,
    themeMode,
    showToast
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const currentRatio: AspectRatio = activeAsset?.recipe?.aspectRatio || '4:5';

  const templates: { id: VisualTemplate; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'hero', label: 'Hero Editorial', icon: LayoutTemplate },
    { id: 'poster', label: 'Commercial Poster', icon: Award },
    { id: 'highlight', label: 'Highlight Chi Tiết', icon: Tag },
    { id: 'benefit', label: 'Lợi Ích Cốt Lõi', icon: Check },
    { id: 'promo', label: 'Ưu Đãi Đặc Biệt', icon: Sparkles },
    { id: 'quote', label: 'Quote / Cảm Nhận', icon: Quote },
  ];

  const ratios: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9'];

  // Compute normalized layout coordinates
  const layout = VisualLayoutEngine.computeLayout(
    selectedTemplate,
    currentRatio,
    activeAsset?.analysis?.boundingBox
  );

  const getContainerRatioClass = () => {
    switch (currentRatio) {
      case '1:1': return 'aspect-square max-h-[58vh]';
      case '4:5': return 'aspect-[4/5] max-h-[62vh]';
      case '9:16': return 'aspect-[9/16] max-h-[66vh]';
      case '16:9': return 'aspect-[16/9] max-h-[50vh]';
      default: return 'aspect-[4/5] max-h-[62vh]';
    }
  };

  const handleDownloadCurrentVisual = () => {
    ContentPackExporter.exportVisualAsset(
      activeAsset.afterImg || activeAsset.beforeImg,
      activeAsset.name,
      selectedTemplate,
      currentRatio
    );
    showToast(`📥 Đã tải ảnh ${selectedTemplate.toUpperCase()} (${currentRatio})!`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 select-none animate-fadeIn">
      {/* 1. TOP COMPOSER BAR (Templates & Ratios) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Template Pills */}
        <div className={`p-1 rounded-2xl border flex items-center gap-1 text-xs font-semibold ${
          isDark ? 'bg-[#1C1518] border-[#38262A]' : 'bg-white border-[#EFE4DE]'
        }`}>
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            const isCurrent = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tpl.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ratio Selector & Visual Export */}
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-bold ${
            isDark ? 'bg-[#1C1518] border-[#38262A]' : 'bg-white border-[#EFE4DE]'
          }`}>
            {ratios.map((r) => (
              <button
                key={r}
                onClick={() => updateActiveRecipe({ aspectRatio: r })}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentRatio === r
                    ? 'bg-[#B76E79] text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadCurrentVisual}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Visual</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE RENDERED VISUAL CANVAS */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div 
          className={`relative w-full max-w-xl ${getContainerRatioClass()} rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-300 ${
            isDark ? 'border-[#38282C] bg-[#1A1315]' : 'border-white bg-[#FAF5F2]'
          }`}
        >
          {/* Base Product Visual */}
          <div 
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${layout.productScale})` }}
          >
            <img 
              src={activeAsset.afterImg || activeAsset.beforeImg} 
              alt={activeAsset.name} 
              className="w-full h-full object-cover select-none" 
            />
          </div>

          {/* Luxury Gradient Vignette to enhance text readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/35" />

          {/* Brand Logo in Negative Space */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none z-10 select-none">
            <MayBrandMark className="w-16 h-16" variant="gold" showWordmark={true} showSlogan={false} />
          </div>

          {/* Badge / Slogan */}
          {layout.badge && (
            <div
              className="absolute pointer-events-none z-10 flex justify-center w-full"
              style={{ top: `${layout.badge.y * 100}%` }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-[#B76E79]/90 text-white text-[10px] font-bold backdrop-blur-md shadow-md">
                {selectedTemplate === 'promo' ? 'SPECIAL EDITION' : 'MÂY PURE BOTANICAL'}
              </div>
            </div>
          )}

          {/* Headline (Respecting Product Area) */}
          <div
            className="absolute pointer-events-none z-10 px-8 w-full text-center select-none"
            style={{ top: `${layout.headline.y * 100}%` }}
          >
            <h2 className="font-serif font-bold text-white text-2xl md:text-3xl tracking-wide drop-shadow-lg leading-tight uppercase">
              {contentBrief.title || activeAsset.name}
            </h2>
          </div>

          {/* Subheadline / Core Message */}
          <div
            className="absolute pointer-events-none z-10 px-10 w-full text-center select-none"
            style={{ top: `${layout.subheadline.y * 100}%` }}
          >
            <p className="text-xs md:text-sm text-white/90 drop-shadow font-medium max-w-md mx-auto leading-relaxed">
              {contentBrief.message || 'Tái tạo bề mặt da mịn màng, thanh lọc tự nhiên dịu êm.'}
            </p>
          </div>

          {/* CTA Button */}
          {layout.ctaButton && (
            <div
              className="absolute pointer-events-none z-10 flex justify-center w-full"
              style={{ top: `${layout.ctaButton.y * 100}%` }}
            >
              <div className="px-6 py-2 rounded-full bg-white text-[#8C4752] text-xs font-bold shadow-xl border border-[#E9CAD0]">
                {contentBrief.customCta || 'EXPLORE NOW'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
