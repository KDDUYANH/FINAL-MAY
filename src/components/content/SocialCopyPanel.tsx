import React from 'react';
import { 
  Smartphone, 
  MessageCircle, 
  ShoppingBag, 
  Copy, 
  Send,
  Layers
} from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { SocialPlatform } from '../../types/studio';
import { ContentEngine } from '../../services/contentEngine';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const SocialCopyPanel: React.FC = () => {
  const {
    assets,
    selectedAssetId,
    contentBrief,
    selectedPlatform,
    setSelectedPlatform,
    socialPosts,
    applyCopyEditAction,
    updatePostContent,
    openContentPackModal,
    themeMode,
    showToast
  } = useStudioStore();

  const isDark = themeMode === 'quiet-luxury';
  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  // Fallback generation if socialPosts not yet initialized
  const posts = socialPosts || ContentEngine.generateSocialPosts(
    activeAsset,
    ContentEngine.extractProductTruth(activeAsset),
    contentBrief
  );

  const currentPost = posts[selectedPlatform] || posts.instagram;

  const platforms: { id: SocialPlatform; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { id: 'tiktok', label: 'TikTok', icon: Smartphone },
    { id: 'threads', label: 'Threads', icon: MessageCircle },
    { id: 'zalo', label: 'Zalo', icon: Send },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  ];

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 Đã sao chép ${label} vào Clipboard!`);
  };

  return (
    <aside className={`w-96 border-l flex flex-col justify-between shrink-0 overflow-y-auto select-none transition-colors duration-200 ${
      isDark ? 'bg-[#181315] border-[#2E2023]' : 'bg-white border-[#EFE4DE]'
    }`}>
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#B76E79]">
              Social Copy Studio
            </h3>
            <p className="text-[10px] opacity-70">
              Tối ưu hóa nội dung riêng biệt theo đặc thù từng nền tảng.
            </p>
          </div>
          <button
            onClick={openContentPackModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-[11px] font-bold shadow-xs hover:opacity-95 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Content Pack</span>
          </button>
        </div>

        {/* 1. PLATFORM TABS */}
        <div className="grid grid-cols-3 gap-1.5">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isCurrent = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#B76E79] text-white border-[#8C4752] font-bold shadow-xs'
                    : isDark ? 'bg-[#22181B] border-[#38262A] text-neutral-300' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] truncate">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. MINIMAL COPY EDITOR ACTIONS */}
        <div className="pt-2">
          <label className="text-[11px] font-bold block mb-1.5 opacity-80">Tinh chỉnh nhanh bằng AI (1-Click Edit)</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'shorten', label: 'Rút gọn' },
              { id: 'clearer', label: 'Rõ ràng hơn' },
              { id: 'premium', label: 'Văn phong sang trọng' },
              { id: 'direct', label: 'Trực diện hơn' },
              { id: 'rewrite_cta', label: 'Đổi CTA' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => applyCopyEditAction(act.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer ${
                  isDark ? 'bg-[#22181B] border-[#3E292D] text-neutral-300 hover:bg-[#2A1E22]' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-700 hover:bg-white'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. POST DETAILS */}
        <div className="space-y-3 pt-2 border-t border-[#EFE4DE]">
          {/* Hook */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Tiêu đề giật tít (Hook)</span>
              <button
                onClick={() => handleCopyToClipboard(currentPost.hook, 'Tiêu đề')}
                className="text-[#B76E79] text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Chép
              </button>
            </div>
            <input
              type="text"
              value={currentPost.hook}
              onChange={(e) => updatePostContent(selectedPlatform, { hook: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border font-medium ${
                isDark ? 'bg-[#22181B] border-[#3E292D] text-white' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-800'
              }`}
            />
          </div>

          {/* Caption */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Nội dung bài viết (Caption)</span>
              <button
                onClick={() => handleCopyToClipboard(currentPost.caption, 'Nội dung')}
                className="text-[#B76E79] text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Chép bài
              </button>
            </div>
            <textarea
              rows={6}
              value={currentPost.caption}
              onChange={(e) => updatePostContent(selectedPlatform, { caption: e.target.value })}
              className={`w-full p-3 rounded-xl text-xs border resize-none leading-relaxed ${
                isDark ? 'bg-[#22181B] border-[#3E292D] text-white' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-800'
              }`}
            />
          </div>

          {/* CTA */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span>Lời kêu gọi hành động (CTA)</span>
              <button
                onClick={() => handleCopyToClipboard(currentPost.cta, 'CTA')}
                className="text-[#B76E79] text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Copy className="w-3 h-3" /> Chép
              </button>
            </div>
            <input
              type="text"
              value={currentPost.cta}
              onChange={(e) => updatePostContent(selectedPlatform, { cta: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl text-xs border font-medium ${
                isDark ? 'bg-[#22181B] border-[#3E292D] text-white' : 'bg-[#FAF5F2] border-[#ECDAD2] text-neutral-800'
              }`}
            />
          </div>

          {/* Hashtags */}
          {currentPost.hashtags && currentPost.hashtags.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Hashtags chọn lọc</span>
                <button
                  onClick={() => handleCopyToClipboard(currentPost.hashtags.join(' '), 'Hashtags')}
                  className="text-[#B76E79] text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> Chép tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentPost.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#B76E79]/10 text-[#B76E79] font-mono font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dominant Bottom Action */}
      <div className="p-4 border-t border-[#EFE4DE]">
        <button
          onClick={openContentPackModal}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9E5862] text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Mở Trọn Gói Content Pack</span>
        </button>
      </div>
    </aside>
  );
};
