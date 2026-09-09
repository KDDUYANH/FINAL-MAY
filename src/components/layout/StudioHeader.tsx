import React from 'react';
import { 
  Download, 
  RotateCcw, 
  RotateCw, 
  Sun, 
  Moon, 
  LayoutGrid, 
  Wand2,
  Bell
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
      className={`h-16 border-b px-6 flex items-center justify-between shrink-0 z-30 backdrop-blur-md transition-colors duration-200 select-none ${
        isDark ? 'bg-[#1A1315]/95 border-[#302225]' : 'bg-[#FDF9F7]/95 border-[#EFE2DC]'
      }`}
    >
      {/* 1. Real Brand Logo & Title (matching reference) */}
      <div 
        onClick={() => setView('home')}
        className="flex items-center gap-3.5 cursor-pointer group"
      >
        <BrandLogo 
          variant="circle" 
          className="h-9 w-9 rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] via-[#C87D88] to-[#8C4752]">
              MÂY CREATIVE STUDIO
            </span>
            <span
              className={`text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-[#2A1E22] text-[#E5A8B0] border-[#483338]'
                  : 'bg-[#FCEEEA] text-[#9E5862] border-[#E8C8C0]'
              }`}
            >
              Pro
            </span>
          </div>
          <p className="text-[9px] opacity-60 font-mono tracking-widest uppercase">
            AI PRODUCT & COMMERCIAL STUDIO
          </p>
        </div>
      </div>

      {/* 2. Deluxe Navigation Pills: Home | Studio */}
      <div
        className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
          isDark ? 'bg-[#231A1D] border-[#38282C]' : 'bg-[#F7EEEA] border-[#E8D9D2]'
        }`}
      >
        <button
          onClick={() => setView('home')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'home'
              ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
              : isDark
              ? 'text-[#C9B2B6] hover:bg-[#2E2125]'
              : 'text-[#6D5357] hover:bg-white/90'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Tổng quan</span>
        </button>
        <button
          onClick={() => setView('studio')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentView === 'studio'
              ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs font-bold'
              : isDark
              ? 'text-[#C9B2B6] hover:bg-[#2E2125]'
              : 'text-[#6D5357] hover:bg-white/90'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>
      </div>

      {/* 3. Actions: Undo/Redo, Theme Toggle, Profile & Export CTA */}
      <div className="flex items-center gap-2.5">
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
                : 'opacity-25 cursor-not-allowed border-transparent'
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
                : 'opacity-25 cursor-not-allowed border-transparent'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notification Bell */}
        <button
          className={`p-2 rounded-xl border transition-colors cursor-pointer relative ${
            isDark ? 'border-[#38282C] hover:bg-[#281D21] text-neutral-400' : 'border-[#E8D9D2] hover:bg-white text-neutral-600'
          }`}
          title="Thông báo hệ thống"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79] absolute top-1.5 right-1.5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setThemeMode(isDark ? 'soft-luxury' : 'quiet-luxury')}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark ? 'bg-[#251B1F] border-[#3E292E] text-amber-300' : 'bg-white border-[#E8D9D2] text-[#7C6367]'
          }`}
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
        </button>

        {/* User Avatar Pill (Matching reference image) */}
        <div className={`hidden md:flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl border ${
          isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF2EF] border-[#E8D7D0]'
        }`}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#E5C1B8] flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
            M
          </div>
          <span className="text-[11px] font-semibold text-neutral-800 dark:text-[#F3E6E2]">
            Mây • Studio
          </span>
        </div>

        {/* Dominant Export CTA */}
        <button
          onClick={openExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#A85E69] to-[#8C4752] text-white text-xs font-bold shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất ảnh</span>
        </button>
      </div>
    </header>
  );
};
