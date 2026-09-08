import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Columns, 
  Sparkles, 
  Check, 
  X, 
  SplitSquareVertical 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { InspectionLoupe } from './InspectionLoupe';
import { BrandLogo } from '../brand/BrandLogo';

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
    isPreviewDirty,
    applyPreview,
    cancelPreview,
    resetToOriginal,
    themeMode,
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Pan state for 100% / 200% zoom
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const getAspectRatioClass = () => {
    switch (activeAsset?.recipe?.aspectRatio) {
      case '1:1':
        return 'aspect-square max-h-[64vh]';
      case '4:5':
        return 'aspect-[4/5] max-h-[68vh]';
      case '3:4':
        return 'aspect-[3/4] max-h-[68vh]';
      case '9:16':
        return 'aspect-[9/16] max-h-[72vh]';
      case '16:9':
        return 'aspect-[16/9] max-h-[56vh]';
      case 'original':
      default:
        return 'aspect-[4/5] max-h-[68vh]';
    }
  };

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
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
          y: Math.max(0, Math.min(100, y)),
        });
      }

      if (isPanning) {
        const dx = clientX - panStartRef.current.x;
        const dy = clientY - panStartRef.current.y;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        panStartRef.current = { x: clientX, y: clientY };
      }
    },
    [isDragging, isLoupeActive, isPanning, setSliderPosition, setLoupePos]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && zoomLevel > 100 && !isDragging)) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    const onMouseUp = () => {
      setIsDragging(false);
      setIsPanning(false);
    };
    const onTouchEnd = () => {
      setIsDragging(false);
      setIsPanning(false);
    };
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  if (!activeAsset) return null;

  // Real Brand Logo Watermark Layer
  const renderWatermarkLayer = () => {
    const brand = activeAsset.brand;
    if (!brand?.watermarkEnabled) return null;

    const opacity = (brand.watermarkOpacity || 25) / 100;
    const scale = (brand.watermarkScale || 35) / 100;

    const posClass = () => {
      switch (brand.watermarkPosition) {
        case 'top_left':
          return 'top-6 left-6';
        case 'top_right':
          return 'top-6 right-6';
        case 'bottom_left':
          return 'bottom-6 left-6';
        case 'center':
          return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
        case 'auto':
        case 'bottom_right':
        default:
          return 'bottom-6 right-6';
      }
    };

    return (
      <div
        className={`absolute ${posClass()} pointer-events-none z-20 select-none transition-all duration-300`}
        style={{
          opacity,
          transform: `scale(${scale * 1.2}) rotate(${brand.watermarkRotation || 0}deg)`,
        }}
      >
        <BrandLogo variant="mark" className="w-20 h-auto" />
      </div>
    );
  };

  const getFilterStyle = () => {
    const recipe = activeAsset?.recipe;
    if (!recipe) return {};
    const brightness = 1 + (recipe.exposure || 0) / 100;
    const contrast = 1 + (recipe.contrast || 0) / 100;
    const highlights = 1 + (recipe.highlights || 0) / 200;
    return {
      filter: `brightness(${brightness}) contrast(${contrast}) saturate(${highlights})`,
      transform: `rotate(${recipe.cropRotation || 0}deg)`,
      transition: 'filter 0.15s ease-out, transform 0.2s ease-out',
    };
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none h-full">
      {/* 1. TOP VIEWPORT CONTROLS BAR */}
      <div
        className={`h-12 border-b px-6 flex items-center justify-between shrink-0 z-10 ${
          isDark ? 'bg-[#181315]/90 border-[#322427]' : 'bg-white/90 border-[#EFE4DE]'
        }`}
      >
        {/* View Mode: Split / Side-by-side / After / Before */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-0.5 rounded-xl border text-xs font-semibold ${
              isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF3EF] border-[#EADBD3]'
            }`}
          >
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split So sánh</span>
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Song song (Side-by-side)</span>
            </button>
            <button
              onClick={() => setViewMode('after')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'after'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kết quả AI</span>
            </button>
            <button
              onClick={() => setViewMode('before')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'before'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>Ảnh gốc</span>
            </button>
          </div>
        </div>

        {/* Zoom & Inspection Controls */}
        <div className="flex items-center gap-3">
          {/* 200% Loupe toggle */}
          <button
            onClick={() => setLoupeActive(!isLoupeActive)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLoupeActive
                ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-xs'
                : isDark
                ? 'bg-[#251A1D] border-[#442D32] text-neutral-300'
                : 'bg-white border-[#E5D6CF] text-neutral-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kính lúp 200%</span>
          </button>

          {/* Quick Zoom Presets: Fit / 100% / 200% */}
          <div
            className={`flex items-center gap-1 text-xs border rounded-xl px-2 py-0.5 ${
              isDark ? 'bg-[#251A1D] border-[#442D32]' : 'bg-white border-[#E5D6CF]'
            }`}
          >
            <button
              onClick={() => {
                setZoomLevel(100);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1 hover:text-[#B76E79] text-[10px] font-bold"
              title="Vừa màn hình (Fit)"
            >
              Fit
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))}
              className="p-1 hover:text-[#B76E79]"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-medium">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 20))}
              className="p-1 hover:text-[#B76E79]"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Image */}
          <button
            onClick={resetToOriginal}
            className={`p-2 rounded-xl border text-neutral-400 hover:text-red-500 transition-colors cursor-pointer ${
              isDark ? 'border-[#442D32] hover:bg-[#251A1D]' : 'border-[#E5D6CF] hover:bg-[#FAF3EF]'
            }`}
            title="Khôi phục trạng thái gốc ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. FLOATING PREVIEW COMMIT BAR (Section 11 & 12) */}
      {isPreviewDirty && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-xl border backdrop-blur-md animate-slideDown bg-[#241B1E]/95 border-[#B76E79]/60 text-white">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FDE3E5]">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-pulse" />
            <span>Đang xem trước thay đổi</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <button
            onClick={cancelPreview}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Hủy (Cancel)</span>
          </button>
          <button
            onClick={applyPreview}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Áp dụng (Apply)</span>
          </button>
        </div>
      )}

      {/* 3. MAIN CANVAS VIEWPORT */}
      <div
        className="flex-1 flex items-center justify-center p-6 overflow-hidden relative cursor-crosshair"
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onMouseDown={onMouseDown}
      >
        {/* Side-by-side mode */}
        {viewMode === 'side-by-side' ? (
          <div className="flex items-center justify-center gap-6 w-full max-w-4xl h-full">
            {/* Left: Original RAW */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-bold font-mono uppercase opacity-70 mb-2">Ảnh Gốc (RAW)</span>
              <div
                className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden shadow-lg border-2 border-inherit relative`}
              >
                <img
                  src={activeAsset.beforeImg}
                  alt="Original"
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>
            {/* Right: AI Result */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-bold font-mono uppercase text-[#B76E79] mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Kết quả MÂY Studio</span>
              </span>
              <div
                className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden shadow-lg border-2 border-[#B76E79]/40 relative`}
              >
                <img
                  src={activeAsset.afterImg || activeAsset.beforeImg}
                  alt="AI Enhanced"
                  className="w-full h-full object-cover select-none"
                  style={getFilterStyle()}
                />
                {renderWatermarkLayer()}
              </div>
            </div>
          </div>
        ) : (
          /* Single / Split Mode Viewport */
          <div
            ref={containerRef}
            className={`relative w-full max-w-2xl ${getAspectRatioClass()} rounded-3xl overflow-hidden shadow-2xl border-4 transition-transform duration-100 ${
              isDark ? 'border-[#38282C] bg-[#1A1315]' : 'border-white bg-white'
            }`}
            style={{
              transform: `scale(${zoomLevel / 100}) translate(${pan.x}px, ${pan.y}px)`,
            }}
          >
            {/* Base Layer: AI Enhanced / Committed / Preview Image */}
            <div className="absolute inset-0">
              <img
                src={activeAsset.afterImg || activeAsset.beforeImg}
                alt={activeAsset.name}
                className="w-full h-full object-cover select-none"
                style={getFilterStyle()}
              />
            </div>

            {/* Split / Before Layer */}
            {(viewMode === 'split' || viewMode === 'before') && (
              <div
                className="absolute inset-0 overflow-hidden select-none"
                style={{
                  clipPath:
                    viewMode === 'split'
                      ? `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
                      : 'none',
                }}
              >
                <img
                  src={activeAsset.beforeImg}
                  alt="Original RAW"
                  className="w-full h-full object-cover select-none filter brightness-95"
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-mono">
                  ẢNH GỐC
                </div>
              </div>
            )}

            {/* AI Side Tag in Split Mode */}
            {viewMode === 'split' && (
              <div className="absolute top-4 right-4 bg-[#B76E79]/85 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-bold shadow-md">
                MÂY ENHANCED
              </div>
            )}

            {/* Watermark Overlay Layer */}
            {renderWatermarkLayer()}

            {/* Split Drag Handle */}
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
        )}
      </div>
    </div>
  );
};
