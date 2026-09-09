import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  RotateCcw, 
  Columns, 
  Sparkles, 
  Check, 
  X, 
  SplitSquareVertical,
  Undo2,
  Redo2
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
    undo,
    redo,
    historyPast,
    historyFuture,
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

  const rafIdRef = useRef<number | null>(null);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
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
      });
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
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
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

  // Preview Architecture: previewImage ≠ committedImage
  const displayedAfterImg = activeAsset.previewImg || activeAsset.afterImg || activeAsset.beforeImg;
  const displayedBeforeImg = activeAsset.previewImg
    ? (activeAsset.afterImg || activeAsset.beforeImg)
    : activeAsset.beforeImg;

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
              <span>Song song</span>
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
              <span>Kết quả</span>
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

        {/* Top Status & Integrity Hint */}
        <div className="flex items-center gap-2 text-xs opacity-75">
          <span className="font-serif font-bold text-neutral-800 dark:text-neutral-200">
            {activeAsset.name}
          </span>
          <span>•</span>
          <span className="font-mono text-[11px] text-[#B76E79] font-bold">
            {activeAsset.status}
          </span>
        </div>
      </div>

      {/* 2. MAIN CANVAS VIEWPORT */}
      <div
        className="flex-1 flex items-center justify-center p-6 pb-24 overflow-hidden relative cursor-crosshair [contain:layout_paint]"
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onMouseDown={onMouseDown}
      >
        {/* Visual Split Indicator at center top */}
        {viewMode === 'split' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2.5 bg-black/75 text-white text-[10px] font-mono tracking-wider px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-xl">
            <span className="opacity-75">BEFORE</span>
            <span className="text-[#B76E79] font-bold">◀───────●───────▶</span>
            <span className="opacity-75">AFTER</span>
          </div>
        )}

        {/* Side-by-side mode */}
        {viewMode === 'side-by-side' ? (
          <div className="flex items-center justify-center gap-6 w-full max-w-4xl h-full">
            {/* Left: Original / Previous */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-bold font-mono uppercase opacity-70 mb-2">
                {activeAsset.previewImg ? 'ẢNH HIỆN TẠI' : 'ẢNH GỐC (RAW)'}
              </span>
              <div
                className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden shadow-lg border-2 border-inherit relative`}
              >
                <img
                  src={displayedBeforeImg}
                  alt="Original"
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>
            {/* Right: AI Result / Preview */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-bold font-mono uppercase text-[#B76E79] mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{activeAsset.previewImg ? 'BẢN XEM TRƯỚC AI' : 'KẾT QUẢ MÂY STUDIO'}</span>
              </span>
              <div
                className={`w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden shadow-lg border-2 border-[#B76E79]/40 relative`}
              >
                <img
                  src={displayedAfterImg}
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
            className={`relative w-full max-w-2xl ${getAspectRatioClass()} rounded-3xl overflow-hidden shadow-2xl border-4 transition-transform duration-75 ${
              isDark ? 'border-[#38282C] bg-[#1A1315]' : 'border-white bg-white'
            }`}
            style={{
              transform: `scale(${zoomLevel / 100}) translate3d(${pan.x}px, ${pan.y}px, 0)`,
              willChange: isPanning || isDragging ? 'transform' : 'auto',
            }}
          >
            {/* Base Layer: AI Enhanced / Preview Image */}
            <div className="absolute inset-0">
              <img
                src={displayedAfterImg}
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
                  src={displayedBeforeImg}
                  alt="Before"
                  className="w-full h-full object-cover select-none filter brightness-95"
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-mono">
                  {activeAsset.previewImg ? 'HIỆN TẠI' : 'ẢNH GỐC'}
                </div>
              </div>
            )}

            {/* Tag in Split Mode */}
            {viewMode === 'split' && (
              <div className="absolute top-4 right-4 bg-[#B76E79]/85 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md font-bold shadow-md">
                {activeAsset.previewImg ? 'XEM TRƯỚC AI' : 'MÂY ENHANCED'}
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
                imgUrl={viewMode === 'before' ? displayedBeforeImg : displayedAfterImg}
              />
            )}
          </div>
        )}
      </div>

      {/* 3. TACTILE BOTTOM CONTROL DOCK (P0 Hierarchy: Zoom, History, Apply/Cancel) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 w-full max-w-lg px-4 pointer-events-none">
        {/* Floating Commit Bar (if preview dirty) */}
        {isPreviewDirty && (
          <div className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slideDown bg-[#201518]/95 border-[#B76E79] text-white ring-4 ring-[#B76E79]/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE3E5]">
              <Sparkles className="w-3.5 h-3.5 text-[#B76E79] animate-pulse" />
              <span>Bản xem trước chưa lưu</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <button
              onClick={cancelPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hủy (Cancel)</span>
            </button>
            <button
              onClick={applyPreview}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Áp dụng (Apply)</span>
            </button>
          </div>
        )}

        {/* Central Controls Dock: Zoom & History */}
        <div className={`pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl shadow-xl border backdrop-blur-md transition-colors ${
          isDark ? 'bg-[#181214]/90 border-[#38262A]' : 'bg-white/95 border-[#E6D7D0]'
        }`}>
          {/* Zoom: FIT / 100% / 200% */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setZoomLevel(100);
                setPan({ x: 0, y: 0 });
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                zoomLevel === 100 && pan.x === 0 && pan.y === 0
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Vừa khung nhìn (Fit)"
            >
              FIT
            </button>
            <button
              onClick={() => {
                setZoomLevel(100);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                zoomLevel === 100 && (pan.x !== 0 || pan.y !== 0)
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Kích thước thực 100%"
            >
              100%
            </button>
            <button
              onClick={() => {
                setZoomLevel(200);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                zoomLevel === 200
                  ? 'bg-[#B76E79] text-white shadow-xs'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title="Phóng đại 200%"
            >
              200%
            </button>
            <button
              onClick={() => setLoupeActive(!isLoupeActive)}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isLoupeActive
                  ? 'bg-[#B76E79] text-white border-[#8C4752]'
                  : 'opacity-75 hover:opacity-100 border-inherit'
              }`}
              title="Bật/Tắt kính lúp 200%"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Kính lúp</span>
            </button>
          </div>

          <div className="h-4 w-px bg-inherit opacity-40" />

          {/* History: Undo / Reset / Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyPast.length === 0}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-25 transition-all cursor-pointer"
              title="Hoàn tác (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={resetToOriginal}
              className="px-2 py-1 rounded-xl text-xs font-medium opacity-70 hover:opacity-100 hover:text-red-500 transition-all cursor-pointer"
              title="Khôi phục ảnh gốc ban đầu (Reset)"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              <span>Reset</span>
            </button>
            <button
              onClick={redo}
              disabled={historyFuture.length === 0}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-25 transition-all cursor-pointer"
              title="Làm lại (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
