import React from 'react';
import { 
  X, 
  Download, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { ContentPackExporter } from '../../services/contentPackExporter';
import { ContentEngine } from '../../services/contentEngine';

export const ContentPackModal: React.FC = () => {
  const {
    isContentPackModalOpen,
    closeContentPackModal,
    assets,
    selectedAssetId,
    contentBrief,
    contentPack,
    themeMode,
    showToast
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  if (!isContentPackModalOpen || !activeAsset) return null;

  // Resolve pack
  const pack = contentPack || ContentEngine.createContentPack(
    activeAsset,
    ContentEngine.extractProductTruth(activeAsset),
    contentBrief
  );

  const handleExportFullPack = () => {
    // 1. Export social copy text file
    ContentPackExporter.exportSocialCopyText(pack);

    // 2. Export 3 key visual images
    ContentPackExporter.exportVisualAsset(pack.heroVisualUrl, pack.productName, 'hero', '4x5');
    ContentPackExporter.exportVisualAsset(pack.highlightVisualUrl, pack.productName, 'highlight', '1x1');
    ContentPackExporter.exportVisualAsset(pack.posterVisualUrl, pack.productName, 'poster', '9x16');

    showToast('🎉 Đã tải về trọn bộ 9 tài sản Content Pack!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
        isDark ? 'bg-[#1A1315] border-[#38262A] text-[#F5ECE8]' : 'bg-white border-[#EFE4DE] text-[#2D1D1F]'
      }`}>
        {/* Modal Header */}
        <div className="p-6 border-b border-[#EFE4DE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E6B2BA] to-[#B76E79] flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#B76E79]">
                Trọn Bộ MÂY Content Pack (9 Tài Sản)
              </h3>
              <p className="text-xs opacity-70">
                Bộ ấn phẩm thương mại & bài viết đa nền tảng đồng nhất cho {activeAsset.name}.
              </p>
            </div>
          </div>

          <button
            onClick={closeContentPackModal}
            className="p-2 rounded-xl border hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. THREE VISUAL ASSETS PREVIEW */}
          <div>
            <h4 className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> 03 Visual Thương Mại Đa Tỷ Lệ
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 text-center">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border shadow-sm relative group">
                  <img src={pack.heroVisualUrl} alt="Hero" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                    4:5 Hero
                  </span>
                </div>
                <p className="text-[11px] font-bold">01. Hero Image (Feed)</p>
              </div>

              <div className="space-y-1.5 text-center">
                <div className="aspect-square rounded-2xl overflow-hidden border shadow-sm relative group">
                  <img src={pack.highlightVisualUrl} alt="Highlight" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                    1:1 Square
                  </span>
                </div>
                <p className="text-[11px] font-bold">02. Product Highlight</p>
              </div>

              <div className="space-y-1.5 text-center">
                <div className="aspect-[9/16] rounded-2xl overflow-hidden border shadow-sm relative group">
                  <img src={pack.posterVisualUrl} alt="Poster" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded font-mono">
                    9:16 Story
                  </span>
                </div>
                <p className="text-[11px] font-bold">03. Story / Reel Poster</p>
              </div>
            </div>
          </div>

          {/* 2. SIX SOCIAL POST COPY SUMMARY */}
          <div>
            <h4 className="text-xs font-bold text-[#B76E79] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> 06 Bản Copy Đa Nền Tảng (Ready to Post)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Instagram Content', text: pack.posts.instagram.caption },
                { name: 'Facebook Storytelling', text: pack.posts.facebook.caption },
                { name: 'TikTok Script & Hook', text: pack.posts.tiktok.caption },
                { name: 'Threads Micro-Tip', text: pack.posts.threads.caption },
                { name: 'Zalo Customer Care', text: pack.posts.zalo.caption },
                { name: 'Marketplace Listing', text: pack.posts.marketplace.caption },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border space-y-1 ${
                    isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#B76E79]">0{idx + 4}. {item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-[10.5px] opacity-75 line-clamp-3 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#EFE4DE] flex items-center justify-between">
          <div className="text-xs font-medium opacity-80">
            Tên tệp định danh tự động theo chuẩn: <code className="font-mono text-[#B76E79]">may_mandelic25_*</code>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeContentPackModal}
              className="px-5 py-2.5 rounded-xl border text-xs font-bold hover:bg-black/5 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleExportFullPack}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Toàn Bộ Gói Content Pack</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
