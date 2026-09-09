import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStudioStore } from './store/studioStore';
import { StudioHeader } from './components/layout/StudioHeader';
import { MobileNav } from './components/layout/MobileNav';
import { HomeView } from './components/views/HomeView';
import { StudioView } from './components/views/StudioView';
import { ExportModal } from './components/export/ExportModal';
import './App.css';

export default function App() {
  const { 
    currentView, 
    themeMode, 
    toastMessage, 
    jobState, 
    jobMessage,
    jobProgress 
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';

  return (
    <div
      className={`flex flex-col h-screen w-full transition-colors duration-300 select-none overflow-hidden font-sans ${
        isDark ? 'bg-[#141012] text-[#F5ECE8]' : 'bg-[#FAF5F2] text-[#2D1D1F]'
      }`}
    >
      {/* 1. TOP GLOBAL WORKFLOW BAR */}
      <StudioHeader />

      {/* 2. MAIN ACTIVE WORKSPACE: HOME vs STUDIO */}
      <main className="flex-1 flex overflow-hidden relative">
        {currentView === 'home' ? <HomeView /> : <StudioView />}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <MobileNav />

      {/* 4. FLOATING AI PROGRESS NOTIFICATION */}
      {(jobState === 'processing' || jobState === 'analyzing') && (
        <div className="fixed top-20 right-6 z-50 bg-[#1F171A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#B76E79]/50 flex items-center gap-3 backdrop-blur-md animate-slideDown">
          <Sparkles className="w-4 h-4 text-[#FDE3E5] animate-spin" />
          <div className="text-xs">
            <div className="font-bold">{jobMessage}</div>
            <div className="w-32 bg-white/20 h-1 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#B76E79] h-full transition-all duration-300 rounded-full"
                style={{ width: `${jobProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. FLOATING TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 bg-[#2D1D1F]/95 text-[#FAF5F2] px-5 py-2.5 rounded-2xl shadow-2xl border border-[#B76E79]/40 flex items-center gap-2.5 backdrop-blur-md animate-toast">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE3E5]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 6. EXPORT MODAL */}
      <ExportModal />
    </div>
  );
}
