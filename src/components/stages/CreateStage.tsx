import React, { useRef } from 'react';
import { 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sun, 
  Crop 
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';

export const CreateStage: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    addUploadedAssets,
    runAutoAnalysis,
    makeProfessional,
    setStage,
    jobState,
    themeMode
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const analysis = activeAsset?.analysis;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        name: file.name.replace(/\.[^/.]+$/, ""),
        category: 'Mỹ phẩm',
        beforeImg: url,
        afterImg: url,
        width: 1200,
        height: 1500
      };
    });

    addUploadedAssets(newAssets);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto space-y-6 select-none animate-fadeIn">
      {/* 1. UPLOAD DROPZONE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.005] group ${
          isDark 
            ? 'bg-[#1D1618]/60 hover:bg-[#251A1D] border-[#422F33] hover:border-[#B76E79]' 
            : 'bg-[#FFF9F6] hover:bg-[#FFF4F0] border-[#EAD0D7] hover:border-[#B76E79]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E6B2BA] to-[#B76E79] flex items-center justify-center text-white shadow-lg mb-3.5 group-hover:scale-105 transition-transform">
          <Upload className="w-6 h-6" />
        </div>

        <h3 className="font-serif text-lg font-bold text-[#B76E79]">
          Kéo thả ảnh sản phẩm hoặc Nhấn để tải lên
        </h3>
        <p className="text-xs opacity-75 mt-1 max-w-md">
          Hỗ trợ JPG, PNG, WEBP độ phân giải cao. MÂY sẽ tự động phát hiện sản phẩm, tách viền và bảo vệ nhãn in.
        </p>

        <div className="flex items-center gap-3 mt-4 text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Product Integrity Engine: Nhãn & Logo được bảo toàn 100%</span>
        </div>
      </div>

      {/* 2. AUTOMATIC SMART ANALYSIS PANEL */}
      {activeAsset && (
        <div className={`p-6 rounded-3xl border space-y-5 shadow-sm transition-colors ${
          isDark ? 'bg-[#1C1518] border-[#342427]' : 'bg-white border-[#EFE4DE]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border">
                <img src={activeAsset.beforeImg} alt={activeAsset.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#B76E79]">{activeAsset.name}</h4>
                <p className="text-xs opacity-70">Kết quả phân tích trí tuệ nhân tạo (Smart AI Analysis)</p>
              </div>
            </div>

            <button
              onClick={() => runAutoAnalysis(activeAsset.id)}
              disabled={jobState === 'analyzing'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-black/5 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${jobState === 'analyzing' ? 'animate-spin text-[#B76E79]' : ''}`} />
              <span>{jobState === 'analyzing' ? 'Đang phân tích...' : 'Phân tích lại'}</span>
            </button>
          </div>

          {/* Analysis Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Nhận diện sản phẩm
              </div>
              <div className="text-xs font-bold text-emerald-600">Đã phát hiện (99%)</div>
              <div className="text-[10px] opacity-70 mt-0.5">Khung bao bì đã khoá</div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 mb-1 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Chất lượng chiếu sáng
              </div>
              <div className="text-xs font-bold">Studio Balanced</div>
              <div className="text-[10px] opacity-70 mt-0.5">Bóng đổ tự nhiên mềm</div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Nguy cơ nhãn in
              </div>
              <div className="text-xs font-bold text-blue-600">An toàn tuyệt đối</div>
              <div className="text-[10px] opacity-70 mt-0.5">Bảo toàn typography</div>
            </div>

            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-[#22181B] border-[#38262A]' : 'bg-[#FAF5F2] border-[#EFE4DE]'}`}>
              <div className="text-[11px] opacity-75 mb-1 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-purple-500" /> Tỷ lệ khuyến nghị
              </div>
              <div className="text-xs font-bold text-purple-600">
                {analysis?.recommendedCrop || '4:5'} Mobile Portrait
              </div>
              <div className="text-[10px] opacity-70 mt-0.5">Tối ưu lướt feed</div>
            </div>
          </div>

          {/* 3. STEP 3: CONCISE RECOMMENDATION & DOMINANT ACTION */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F6] to-[#FAF0EE] dark:from-[#2B1B20] dark:to-[#221619] border border-[#E9CCD3] dark:border-[#4D2F36] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B76E79] text-white text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                Khuyến nghị của MÂY
              </div>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                {analysis?.summaryRecommendation || 'Sản phẩm có độ tương phản tốt. Khuyến nghị chuẩn hóa nền lụa satin Soft Studio và bảo vệ nhãn in.'}
              </p>
            </div>

            <button
              onClick={async () => {
                await makeProfessional(activeAsset.id);
                setStage('edit');
              }}
              disabled={jobState === 'processing'}
              className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Make Professional</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
