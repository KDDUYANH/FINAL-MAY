import React from 'react';
import { LayoutGrid, Wand2, Download } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const MobileNav: React.FC = () => {
  const { currentView, setView, openExport, themeMode } = useStudioStore();
  const isDark = themeMode === 'quiet-luxury';

  return (
    <div
      className={`md:hidden h-14 border-t px-6 flex items-center justify-around z-30 shrink-0 select-none ${
        isDark ? 'bg-[#1C1618] border-[#322427]' : 'bg-white border-[#EFE4DE]'
      }`}
    >
      <button
        onClick={() => setView('home')}
        className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
          currentView === 'home' ? 'text-[#B76E79] font-bold' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="text-[10px]">Trang chủ</span>
      </button>

      <button
        onClick={() => setView('studio')}
        className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
          currentView === 'studio' ? 'text-[#B76E79] font-bold' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <Wand2 className="w-4 h-4" />
        <span className="text-[10px]">Studio</span>
      </button>

      <button
        onClick={openExport}
        className="flex flex-col items-center gap-1 p-1 rounded-xl opacity-60 hover:opacity-100 transition-all text-[#B76E79]"
      >
        <Download className="w-4 h-4" />
        <span className="text-[10px]">Xuất ảnh</span>
      </button>
    </div>
  );
};
