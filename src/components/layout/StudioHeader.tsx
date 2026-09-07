import React from 'react';
import { 
  Sparkles, 
  Wand2, 
  Palette, 
  Layers, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  RotateCcw, 
  RotateCw,
  ShieldCheck,
  FileText,
  LayoutGrid
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { Stage } from '../../types/studio';
import { BRAND_CONFIG } from '../../config/brand.config';

export const StudioHeader: React.FC = () => {
  const {
    stage,
    setStage,
    themeMode,
    setThemeMode,
    makeProfessional,
    applyMasterToBatch,
    runAutoAnalysis,
    openContentPackModal,
    toggleDashboard,
    undo,
    redo,
    historyPast,
    historyFuture,
    jobState,
    showToast
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';

  const stages: { id: Stage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'create', label: '1. Create', icon: Upload },
    { id: 'edit', label: '2. Edit', icon: Wand2 },
    { id: 'brand', label: '3. Brand', icon: Palette },
    { id: 'content', label: '4. Content', icon: FileText },
    { id: 'batch', label: '5. Batch', icon: Layers },
    { id: 'export', label: '6. Export', icon: Download },
  ];

  // Dominant Primary Action CTA based on current stage
  const renderDominantCTA = () => {
    switch (stage) {
      case 'create':
        return (
          <button
            onClick={() => runAutoAnalysis()}
            disabled={jobState === 'analyzing'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${jobState === 'analyzing' ? 'animate-spin' : ''}`} />
            <span>{jobState === 'analyzing' ? 'Đang Phân Tích...' : 'Phân Tích Tự Động'}</span>
          </button>
        );
      case 'edit':
        return (
          <button
            onClick={() => makeProfessional()}
            disabled={jobState === 'processing'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${jobState === 'processing' ? 'animate-spin' : ''}`} />
            <span>{jobState === 'processing' ? 'Đang Hoàn Thiện...' : 'Make Professional'}</span>
          </button>
        );
      case 'brand':
        return (
          <button
            onClick={() => {
              showToast('✓ Đã áp dụng nhận diện thương hiệu cho sản phẩm!');
              setStage('content');
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Create Content</span>
          </button>
        );
      case 'content':
        return (
          <button
            onClick={openContentPackModal}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Content Pack (9)</span>
          </button>
        );
      case 'batch':
        return (
          <button
            onClick={() => applyMasterToBatch()}
            disabled={jobState === 'processing'}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Apply Master to All</span>
          </button>
        );
      case 'export':
        return (
          <button
            onClick={() => {
              showToast('🎉 Đang xuất gói sản phẩm thương mại 4K!');
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Assets (4K)</span>
          </button>
        );
    }
  };

  return (
    <header className={`h-16 border-b px-6 flex items-center justify-between z-30 shrink-0 backdrop-blur-md transition-colors duration-200 ${
      isDark ? 'bg-[#1C1618]/90 border-[#322427]' : 'bg-white/90 border-[#EFE4DE]'
    }`}>
      {/* Brand Identity & Demo Mode Tag */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shadow-md shrink-0">
          <img 
            src="/assets/brand/may_logo_circle.png" 
            alt="MÂY" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#B76E79] to-[#8C4752]">
              {BRAND_CONFIG.name}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-[#2A1F22] text-[#E0A7AF] border-[#4A3438]' : 'bg-[#F8E5E5] text-[#9E5862] border-[#E9CAD0]'
            }`}>
              Image Studio
            </span>
            {/* Quiet Demo Mode Indicator */}
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
              isDark ? 'bg-neutral-800 text-neutral-400 border-neutral-700' : 'bg-neutral-100 text-neutral-500 border-neutral-200'
            }`}>
              Demo mode
            </span>
          </div>
          <p className="text-[9px] opacity-70 font-mono tracking-wider">COMMERCIAL PRODUCT CREATION ENGINE</p>
        </div>
      </div>

      {/* 5-Stage Core Navigation Workflow */}
      <div className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border ${
        isDark ? 'bg-[#241C1E] border-[#382B2E]' : 'bg-[#FAF3EF] border-[#EDE0D8]'
      }`}>
        {stages.map((st) => {
          const Icon = st.icon;
          const isCurrent = stage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setStage(st.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white shadow-xs'
                  : isDark 
                  ? 'text-[#C9B2B6] hover:bg-[#2E2326]' 
                  : 'text-[#6D5357] hover:bg-white/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions: Undo/Redo, Theme Toggle & Dominant CTA */}
      <div className="flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyPast.length === 0}
            title="Hoàn tác (Undo)"
            className={`p-2 rounded-xl border transition-all ${
              historyPast.length > 0 
                ? isDark ? 'hover:bg-neutral-800 border-neutral-700' : 'hover:bg-neutral-100 border-neutral-200'
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
                ? isDark ? 'hover:bg-neutral-800 border-neutral-700' : 'hover:bg-neutral-100 border-neutral-200'
                : 'opacity-30 cursor-not-allowed border-transparent'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Launcher Button */}
        <button
          onClick={toggleDashboard}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isDark ? 'bg-[#281F22] border-[#423135] text-[#E0A7AF] hover:bg-[#342428]' : 'bg-white border-[#E5D7D0] text-[#7C6367] hover:bg-[#FAF3EF]'
          }`}
          title="Mở Bảng Tổng Quan Dự Án (Studio Executive Dashboard)"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#B76E79]" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setThemeMode(isDark ? 'soft-luxury' : 'quiet-luxury')}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isDark ? 'bg-[#281F22] border-[#423135] text-amber-300' : 'bg-white border-[#E5D7D0] text-[#7C6367]'
          }`}
          title="Chuyển đổi giao diện Sáng / Tối"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Dominant Primary Action Button */}
        {renderDominantCTA()}
      </div>
    </header>
  );
};
