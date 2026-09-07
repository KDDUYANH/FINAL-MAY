import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Search, 
  BookOpen
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { ContentGoal, ContentTone } from '../../types/studio';
import { ContentEngine } from '../../services/contentEngine';

export const ContentBriefPanel: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    contentBrief,
    updateContentBrief,
    generateContentAction,
    contentJobState,
    themeMode
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const truth = activeAsset ? ContentEngine.extractProductTruth(activeAsset) : null;

  const goals: { id: ContentGoal; label: string }[] = [
    { id: 'sales', label: 'Bán Hàng (Sales)' },
    { id: 'awareness', label: 'Nhận Diện (Awareness)' },
    { id: 'engagement', label: 'Tương Tác (Engagement)' },
    { id: 'educational', label: 'Kiến Thức Da Liễu' },
    { id: 'launch', label: 'Ra Mắt (Launch)' },
  ];

  const tones: { id: ContentTone; label: string }[] = [
    { id: 'clean_luxury', label: 'Clean Luxury' },
    { id: 'dermatological', label: 'Chuẩn Y Khoa' },
    { id: 'warm_elegant', label: 'Ấm Áp & Dịu Dàng' },
    { id: 'minimal_modern', label: 'Tối Giản Hiện Đại' },
  ];

  return (
    <div className={`p-5 border-r flex flex-col justify-between w-80 shrink-0 overflow-y-auto select-none transition-colors duration-200 ${
      isDark ? 'bg-[#181315] border-[#2E2023]' : 'bg-white border-[#EFE4DE]'
    }`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-sm text-[#B76E79]">
              Content Brief & Product Truth
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Factual Truth
            </span>
          </div>
          <p className="text-[10px] opacity-70">
            Nội dung được sáng tạo dựa trên thành phần thực tế, không thêu dệt công dụng.
          </p>
        </div>

        {/* 1. PRODUCT TRUTH CARDS */}
        {truth && (
          <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
            isDark ? 'bg-[#22181B] border-[#3B292D]' : 'bg-[#FFF9F6] border-[#ECDAD1]'
          }`}>
            <div className="font-bold text-[11px] text-[#B76E79] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Thông Số Sản Phẩm (Verified Facts)
            </div>
            <div className="space-y-1 text-[10.5px]">
              <div>
                <span className="opacity-70">Thành phần: </span>
                <strong className="text-neutral-800 dark:text-neutral-200">{truth.ingredients[0]}</strong>
              </div>
              <div>
                <span className="opacity-70">Công dụng: </span>
                <span className="text-neutral-800 dark:text-neutral-200">{truth.benefits[0]}</span>
              </div>
            </div>

            {/* Claims Verification status */}
            {truth.needsConfirmationClaims.length > 0 && (
              <div className="pt-1.5 border-t border-dashed border-[#ECDAD1] flex items-start gap-1 text-[10px] text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Cần xác thực lâm sàng trước khi đăng tải chỉ số điều trị.</span>
              </div>
            )}
          </div>
        )}

        {/* 2. SIMPLE BRIEF INPUTS */}
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-bold block mb-1">Tiêu Đề / Tên Trọng Tâm (Title)</label>
            <input
              type="text"
              value={contentBrief.title}
              onChange={(e) => updateContentBrief({ title: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border transition-colors ${
                isDark ? 'bg-[#22181B] border-[#3E292D] text-white' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-800'
              }`}
              placeholder="VD: 25% Mandelic Acid Glow"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-bold block mb-1">Thông Điệp Cốt Lõi (Core Message)</label>
            <textarea
              rows={2}
              value={contentBrief.message}
              onChange={(e) => updateContentBrief({ message: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border transition-colors resize-none ${
                isDark ? 'bg-[#22181B] border-[#3E292D] text-white' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-800'
              }`}
              placeholder="Mịn da, dịu lành không châm chích..."
            />
          </div>

          {/* Goal */}
          <div>
            <label className="text-xs font-bold block mb-1.5">Mục Tiêu Bài Viết (Goal)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => updateContentBrief({ goal: g.id })}
                  className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition-all cursor-pointer ${
                    contentBrief.goal === g.id
                      ? 'bg-[#B76E79] text-white border-[#8C4752] font-bold shadow-xs'
                      : isDark ? 'bg-[#22181B] border-[#38262A] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs font-bold block mb-1.5">Tone Giọng (Brand Tone)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateContentBrief({ tone: t.id })}
                  className={`p-2 rounded-xl text-left text-[11px] font-semibold border transition-all cursor-pointer ${
                    contentBrief.tone === t.id
                      ? 'bg-[#B76E79] text-white border-[#8C4752] font-bold shadow-xs'
                      : isDark ? 'bg-[#22181B] border-[#38262A] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Optional AI Research & Trends Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl border bg-neutral-50/60 dark:bg-neutral-900/40 text-xs">
              <span className="font-semibold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#B76E79]" /> Nghiên cứu từ khóa & xu hướng
              </span>
              <input
                type="checkbox"
                checked={contentBrief.enableResearch}
                onChange={(e) => updateContentBrief({ enableResearch: e.target.checked })}
                className="accent-[#B76E79]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#EFE4DE] space-y-2">
        <button
          onClick={() => generateContentAction(contentBrief.enableResearch)}
          disabled={contentJobState === 'generating' || contentJobState === 'researching'}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${contentJobState !== 'idle' && contentJobState !== 'completed' ? 'animate-spin' : ''}`} />
          <span>
            {contentJobState === 'researching' 
              ? 'Đang nghiên cứu thị trường...' 
              : contentJobState === 'generating' 
              ? 'Đang sáng tạo bài viết...' 
              : 'Sáng Tạo Nội Dung Ngay'}
          </span>
        </button>
      </div>
    </div>
  );
};
