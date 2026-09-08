import React, { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { CanvasCompositor } from '../../services/canvasCompositor';
import { AspectRatio } from '../../types/studio';

export const ExportModal: React.FC = () => {
  const {
    isExportOpen,
    closeExport,
    assets,
    selectedAssetId,
    themeMode,
    showToast,
  } = useStudioStore();

  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [resolution, setResolution] = useState<'original' | '2k' | '4k'>('4k');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [isExporting, setIsExporting] = useState(false);

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  if (!isExportOpen || !activeAsset) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Export always uses committed final state
      await CanvasCompositor.exportAsset(
        {
          ...activeAsset,
          recipe: { ...activeAsset.recipe, aspectRatio },
        },
        format,
        resolution
      );
      showToast(`🎉 Đã xuất "${activeAsset.name}" định dạng ${format.toUpperCase()} ${resolution.toUpperCase()}!`);
      closeExport();
    } catch (err: any) {
      showToast(`Lỗi xuất ảnh: ${err.message || 'Không thể tạo tệp xuất.'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const ratios: { id: AspectRatio; label: string; desc: string }[] = [
    { id: 'original', label: 'Gốc', desc: 'Giữ tỷ lệ nguyên bản' },
    { id: '1:1', label: '1:1', desc: 'Vuông (Shopee, Lazada)' },
    { id: '4:5', label: '4:5', desc: 'Chân dung (Instagram Post)' },
    { id: '3:4', label: '3:4', desc: 'Tiêu chuẩn ảnh dọc' },
    { id: '9:16', label: '9:16', desc: 'Story & Reels' },
    { id: '16:9', label: '16:9', desc: 'Ngang (Banner web)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#1C1518] border-[#38262A] text-[#F5ECE8]'
            : 'bg-white border-[#EADAD2] text-[#2D1D1F]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#B76E79]/15 text-[#B76E79] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif">Xuất ảnh thương mại</h3>
              <p className="text-[11px] opacity-70">Chất lượng hoàn thiện cao cho sản phẩm</p>
            </div>
          </div>
          <button
            onClick={closeExport}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Asset Preview Mini Card */}
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl border ${
              isDark ? 'bg-[#241B1E] border-[#38282C]' : 'bg-[#FAF5F2] border-[#EFE4DE]'
            }`}
          >
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-inherit">
              <img
                src={activeAsset.afterImg || activeAsset.beforeImg}
                alt={activeAsset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs truncate">{activeAsset.name}</div>
              <div className="text-[11px] opacity-70 flex items-center gap-2 mt-0.5">
                <span>{activeAsset.category}</span>
                <span>•</span>
                <span className="font-mono">{activeAsset.width}x{activeAsset.height}px</span>
              </div>
              <span className="inline-block mt-1 text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                ✓ Đã qua kiểm duyệt bảo vệ nhãn
              </span>
            </div>
          </div>

          {/* Aspect Ratio Presets */}
          <div>
            <label className="text-xs font-bold block mb-2">Tỷ lệ khung hình (Aspect Ratio)</label>
            <div className="grid grid-cols-3 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aspectRatio === r.id
                      ? 'border-[#B76E79] bg-[#B76E79]/10 ring-1 ring-[#B76E79]'
                      : isDark
                      ? 'border-[#332428] hover:border-neutral-600 bg-[#22181B]'
                      : 'border-[#EADAD2] hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{r.label}</span>
                    {aspectRatio === r.id && <Check className="w-3 h-3 text-[#B76E79]" />}
                  </div>
                  <div className="text-[10px] opacity-70 truncate mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-xs font-bold block mb-2">Định dạng file</label>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer text-center ${
                    format === fmt
                      ? 'bg-[#B76E79] text-white border-[#8C4752] shadow-sm'
                      : isDark
                      ? 'bg-[#22181B] border-[#332428] text-neutral-300 hover:border-neutral-600'
                      : 'bg-white border-[#EADAD2] text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selection */}
          <div>
            <label className="text-xs font-bold block mb-2">Độ phân giải xuất</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'original', label: 'Gốc (Original)', desc: '100% tỷ lệ thật' },
                { id: '2k', label: '2K High-Res', desc: '2048px (Web & App)' },
                { id: '4k', label: '4K Ultra-HD', desc: '3840px (Print & POSM)' },
              ].map((res) => (
                <button
                  key={res.id}
                  onClick={() => setResolution(res.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    resolution === res.id
                      ? 'border-[#B76E79] bg-[#B76E79]/10 ring-1 ring-[#B76E79]'
                      : isDark
                      ? 'border-[#332428] hover:border-neutral-600 bg-[#22181B]'
                      : 'border-[#EADAD2] hover:border-neutral-400 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs">{res.label}</div>
                  <div className="text-[10px] opacity-70 truncate mt-0.5">{res.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-inherit flex items-center justify-end gap-3 bg-black/[0.02] dark:bg-white/[0.02]">
          <button
            onClick={closeExport}
            className="px-4 py-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100 transition-opacity"
          >
            Đóng
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4752] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Đang xuất tệp...' : `Tải ảnh ${format.toUpperCase()} (${resolution.toUpperCase()})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
