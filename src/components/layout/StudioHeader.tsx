import React from 'react';
import { 
  Download, 
  RotateCcw, 
  RotateCw, 
  Sun, 
  Moon, 
  LayoutGrid, 
  Wand2
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { BrandLogo } from '../brand/BrandLogo';

export const StudioHeader: React.FC = () => {
  const {
    currentView,
    setView,
    themeMode,
    setThemeMode,
    undo,
    redo,
    historyPast,
    historyFuture,
    openExport,
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';

  return (
    <header
      className={`h-16 border-b px-6 flex items-center justify-between shrink-0 z-30 backdrop-blur-md transition-colors duration-200 ${
        isDark ? 'bg-[#1C1618]/90 border-[#322427]' : 'bg-white/90 border-[#EFE4DE]'
      }`}
    >
      {/* 1. Real Brand Logo & Title */}
      <div 
        onClick={() => setView('home')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <BrandLogo 
          variant="circle" 
          className="h-9 w-9 rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] to-[#8C4752]">
              MÂY
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#2A1F22] text-[#E0A7AF] border-[#4A3438]'
                  : 'bg-[#F8E5E5] text-[#9E5862] border-[#E9CAD0]'
              }`}
            >
              Image Studio
            </span>
            <span
              className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border opacity-75 ${
                isDark
                  ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  : 'bg-neutral-100 text-neutral-500 border-neutral-200'
              }`}
            >
              Demo mode
            </span>
          </div>
          <p className="text-[9px] opacity-60 font-mono tracking-wider">
            PREMIUM COSMETIC CREATION
          </p>
        </div>
      </div>

      {/* 2. Minimal Navigation: Home | Studio */}
      <div
        className={`flex items-center gap-1 p-1 rounded-2xl border ${
          isDark ? 'bg-[#241C1E] border-[#382B2E]' : 'bg-[#FAF3EF] border-[#EDE0D8]'
        }`}
      >
        <button
          onClick={() => setView('home')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'home'
              ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
              : isDark
              ? 'text-[#C9B2B6] hover:bg-[#2E2326]'
              : 'text-[#6D5357] hover:bg-white/80'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => setView('studio')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'studio'
              ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
              : isDark
              ? 'text-[#C9B2B6] hover:bg-[#2E2326]'
              : 'text-[#6D5357] hover:bg-white/80'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>
      </div>

      {/* 3. Actions: Undo / Redo, Theme Toggle & Export CTA */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyPast.length === 0}
            title="Hoàn tác (Undo)"
            className={`p-2 rounded-xl border transition-all ${
              historyPast.length > 0
                ? isDark
                  ? 'hover:bg-neutral-800 border-neutral-700 cursor-pointer'
                  : 'hover:bg-neutral-100 border-neutral-200 cursor-pointer'
                : 'opacity-30 cursor-not-allowed border-transparent'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={historyFuture.length === 0}
            title="Làm lại (Redo)"
            className={`p-2 rounded-xl border transition-all ${
              historyFuture.length > 0
                ? isDark
                  ? 'hover:bg-neutral-800 border-neutral-700 cursor-pointer'
                  : 'hover:bg-neutral-100 border-neutral-200 cursor-pointer'
                : 'opacity-30 cursor-not-allowed border-transparent'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setThemeMode(isDark ? 'soft-luxury' : 'quiet-luxury')}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark ? 'bg-[#281F22] border-[#423135] text-amber-300' : 'bg-white border-[#E5D7D0] text-[#7C6367]'
          }`}
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Dominant Export CTA */}
        <button
          onClick={openExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất ảnh</span>
        </button>
      </div>
    </header>
  );
};
