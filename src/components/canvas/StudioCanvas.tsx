import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  Sparkles, 
  Columns 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { InspectionLoupe } from './InspectionLoupe';
import { ProtectedMaskOverlay } from './ProtectedMaskOverlay';
import { MayBrandMark } from '../brand/MayBrandMark';

export const StudioCanvas: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    viewMode,
    setViewMode,
    sliderPosition,
    setSliderPosition,
    zoomLevel,
    setZoomLevel,
    isLoupeActive,
    setLoupeActive,
    loupePos,
    setLoupePos,
    showProtectedOverlay,
    toggleProtectedOverlay,
    themeMode
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Aspect ratio calculation for the canvas container
  const getAspectRatioClass = () => {
    switch (activeAsset?.recipe?.aspectRatio) {
      case '1:1':
        return 'aspect-square max-h-[64vh]';
      case '4:5':
        return 'aspect-[4/5] max-h-[66vh]';
      case '3:4':
        return 'aspect-[3/4] max-h-[66vh]';
      case '9:16':
        return 'aspect-[9/16] max-h-[70vh]';
      case '16:9':
        return 'aspect-[16/9] max-h-[58vh]';
      default:
        return 'aspect-[4/5] max-h-[66vh]';
    }
  };

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pct);
    }

    if (isLoupeActive) {
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setLoupePos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
    }
  }, [isDragging, isLoupeActive, setSliderPosition, setLoupePos]);

  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);
    const onTouchEnd = () => setIsDragging(false);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  if (!activeAsset) return null;

  // Render Watermark Engine onto the canvas
  const renderWatermarkLayer = () => {
    const brand = activeAsset.brand;
    if (!brand.watermarkEnabled) return null;

    const opacity = (brand.watermarkOpacity || 20) / 100;
    const scale = (brand.watermarkScale || 35) / 100;

    if (brand.watermarkMode === 'security') {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none"
          style={{
            opacity,
            transform: `rotate(${brand.watermarkRotation || 45}deg) scale(1.4)`
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(183,110,121,0.25) 0, rgba(183,110,121,0.25) 1px, transparent 0, transparent 90px)'
            }}
          />
          <div className="grid grid-cols-4 grid-rows-4 w-[160%] h-[160%] -ml-[30%] -mt-[30%] gap-10 p-6">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center" style={{ transform: `scale(${scale * 0.75})` }}>
                <MayBrandMark className="w-20 h-20" variant="rose-gold" showWordmark={true} showSlogan={false} />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (brand.watermarkMode === 'logo' || brand.watermarkMode === 'subtle') {
      // Position calculation
      const posClass = () => {
        switch (brand.watermarkPosition) {
          case 'top_left': return 'top-6 left-6';
          case 'top_right': return 'top-6 right-6';
          case 'bottom_left': return 'bottom-6 left-6';
          case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
          case 'bottom_right':
          default: return 'bottom-6 right-6';
        }
      };

      return (
        <div 
          className={`absolute ${posClass()} pointer-events-none z-20 select-none transition-all duration-300`}
          style={{ opacity, transform: `scale(${scale * 1.1})` }}
        >
          <MayBrandMark 
            className="w-24 h-24" 
            variant="rose-gold" 
            showWordmark={true} 
            showSlogan={brand.watermarkMode === 'logo'} 
            assetId={brand.logoAsset}
          />
        </div>
      );
    }

    return null;
  };

  // Render Official Brand Logo Placement
  const renderLogoLayer = () => {
    const brand = activeAsset.brand;
    if (!brand.logoEnabled) return null;

    const posClass = () => {
      switch (brand.logoPosition) {
        case 'top_left': return 'top-5 left-5';
        case 'top_right': return 'top-5 right-5';
        case 'bottom_left': return 'bottom-5 left-5';
        case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        case 'bottom_right':
        default: return 'bottom-5 right-5';
      }
    };

    const logoSize = (brand.logoSize || 22) * 4.5;
    const opacity = (brand.logoOpacity || 85) / 100;

    return (
      <div 
        className={`absolute ${posClass()} pointer-events-none z-22 transition-all duration-300 select-none`}
        style={{ width: `${logoSize}px`, opacity }}
      >
        <MayBrandMark 
          className="w-full h-auto" 
          variant="gold" 
          showWordmark={true} 
          showSlogan={true}
          assetId={brand.logoAsset}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none">
      {/* 1. TOP VIEWPORT ACTION BAR */}
      <div className={`h-12 border-b px-6 flex items-center justify-between shrink-0 z-10 ${
        isDark ? 'bg-[#181315]/90 border-[#322427]' : 'bg-white/90 border-[#EFE4DE]'
      }`}>
        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-0.5 rounded-xl border text-xs font-semibold ${
            isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF3EF] border-[#EADBD3]'
          }`}>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                viewMode === 'split' 
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split So Sánh</span>
            </button>
            <button
              onClick={() => setViewMode('after')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                viewMode === 'after' 
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kết Quả AI</span>
            </button>
            <button
              onClick={() => setViewMode('before')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                viewMode === 'before' 
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold' 
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <span>Ảnh Gốc (RAW)</span>
            </button>
          </div>
        </div>

        {/* Product Protection Indicator & Loupe */}
        <div className="flex items-center gap-3">
          {/* Protected Area Quick Toggle */}
          <button
            onClick={toggleProtectedOverlay}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
              showProtectedOverlay
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : isDark
                ? 'bg-[#251A1D] border-[#442D32] text-emerald-400 hover:bg-[#2F2125]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Product protected ✓</span>
          </button>

          {/* 200% Loupe Inspector */}
          <button
            onClick={() => setLoupeActive(!isLoupeActive)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isLoupeActive
                ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                : isDark
                ? 'bg-[#251A1D] border-[#442D32] text-neutral-300'
                : 'bg-white border-[#E5D6CF] text-neutral-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kính Lúp 200%</span>
          </button>

          {/* Zoom Level */}
          <div className={`flex items-center gap-1 text-xs border rounded-xl px-2 py-0.5 ${
            isDark ? 'bg-[#251A1D] border-[#442D32]' : 'bg-white border-[#E5D6CF]'
          }`}>
            <button 
              onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
              className="p-1 hover:text-[#B76E79]"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-11 text-center font-mono font-medium">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(Math.min(180, zoomLevel + 15))}
              className="p-1 hover:text-[#B76E79]"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE VIEWPORT STAGE */}
      <div 
        className="flex-1 flex items-center justify-center p-6 overflow-hidden relative cursor-crosshair"
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      >
        <div
          ref={containerRef}
          className={`relative w-full max-w-2xl ${getAspectRatioClass()} rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-200 ${
            isDark ? 'border-[#38282C] bg-[#1A1315]' : 'border-white bg-white'
          }`}
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Base Layer: Enhanced / After Image */}
          <div className="absolute inset-0">
            <img 
              src={activeAsset.afterImg || activeAsset.beforeImg} 
              alt={activeAsset.name} 
              className="w-full h-full object-cover select-none" 
            />
          </div>

          {/* Split / Before Layer */}
          {(viewMode === 'split' || viewMode === 'before') && (
            <div
              className="absolute inset-0 overflow-hidden select-none"
              style={{
                clipPath: viewMode === 'split' 
                  ? `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
                  : 'none'
              }}
            >
              <img 
                src={activeAsset.beforeImg} 
                alt="Original RAW" 
                className="w-full h-full object-cover select-none filter brightness-95" 
              />
              {/* Subtle Tag on Raw Side */}
              <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-mono">
                ORIGINAL RAW
              </div>
            </div>
          )}

          {/* Subtle Tag on AI Enhanced Side */}
          {viewMode === 'split' && (
            <div className="absolute top-4 right-4 bg-[#B76E79]/85 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-bold shadow-md">
              MÂY PROFESSIONAL
            </div>
          )}

          {/* Watermark Overlay Layer */}
          {renderWatermarkLayer()}

          {/* Official Brand Logo Layer */}
          {renderLogoLayer()}

          {/* Protected Region Mask Overlay */}
          {showProtectedOverlay && <ProtectedMaskOverlay asset={activeAsset} />}

          {/* Interactive Split Drag Handle */}
          {viewMode === 'split' && (
            <BeforeAfterSlider
              position={sliderPosition}
              isDark={isDark}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            />
          )}

          {/* 200% Inspection Loupe */}
          {isLoupeActive && (
            <InspectionLoupe
              x={loupePos.x}
              y={loupePos.y}
              imgUrl={viewMode === 'before' ? activeAsset.beforeImg : activeAsset.afterImg}
            />
          )}
        </div>
      </div>
    </div>
  );
};
