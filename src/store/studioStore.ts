import { create } from 'zustand';
import {
  AppView, EditTool, ViewMode, Asset, EditRecipe, BrandRecipe,
  MasterRecipe, AIJobState, SmartRecommendation, SmartAnalysis,
} from '../types/studio';
import { BRAND_CONFIG } from '../config/brand.config';
import { RecipeEngine } from '../services/recipeEngine';
import { AIProviderService } from '../services/aiProvider';
import { revokeAssetObjectURLs } from '../utils/imageOptimizer';

// ─── Defaults ───────────────────────────────────────────────────

const DEFAULT_EDIT_RECIPE: EditRecipe = {
  enhancePreset: 'auto',
  cleanIntensity: 'balanced',
  preservePackagingTexture: true,
  lightingPreset: 'soft_studio',
  exposure: 6, contrast: 8, highlights: -4, shadows: 10,
  temperature: 2, productSeparation: 35, shadowStrength: 35,
  scenePreset: 'silk',
  depthOfField: 25, reflectionStrength: 20,
  aspectRatio: '4:5', framePlacement: 'center',
  autoFrame: true, safeAreaMargin: 10,
  outputResolution: '4k', preserveGeometry: true, protectLabels: true,
};

const DEFAULT_BRAND_RECIPE: BrandRecipe = {
  watermarkEnabled: false,
  watermarkMode: 'subtle',
  watermarkOpacity: 20, watermarkScale: 35, watermarkRotation: 0,
  watermarkPosition: 'bottom_right',
  protectProductArea: true,
  logoAsset: 'brand_mark_transparent',
};

// ─── Demo Assets ────────────────────────────────────────────────

const DEMO_ASSETS: Asset[] = [
  {
    id: 'asset-01', name: 'Serum Astralisca 25%', category: 'Serum',
    beforeImg: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1608248597359-2ff96fec0872?auto=format&fit=crop&w=1200&q=85',
    width: 1200, height: 1500, isMaster: true, isSelected: true,
    status: 'Master', integrityScore: 100,
    protectedRegions: ['Label: 25% Mandelic Acid Glow', 'Logo: MÂY Metallic Vector Lockup', 'Cap: Rose Gold Metallic Pipette', 'Bottle: Amber Frosted Glass'],
    analysis: {
      productDetected: true, confidence: 0.99,
      boundingBox: { x: 0.25, y: 0.12, width: 0.50, height: 0.76 },
      orientation: 'portrait', imageQualityScore: 94, backgroundClutterScore: 18,
      lightingQuality: 'balanced', shadowsQuality: 'soft', labelRisk: 'safe',
      productEdgesIntact: true, transparencyIssues: false,
      recommendedCrop: '4:5', recommendedEnhancement: 'auto', recommendedComposition: 'center',
      summaryRecommendation: 'Chai serum độ tương phản cao, nhãn in sắc nét.',
    },
    recommendation: {
      action: 'Nâng sáng studio + Nền lụa satin',
      reason: 'Sản phẩm sắc nét, nhưng nền hơi rối và ánh sáng hơi phẳng.',
      presetSuggestion: 'clean_luxury', backgroundSuggestion: 'silk',
      lightingSuggestion: 'soft_studio', isAlreadyGood: false,
    },
    recipe: { ...DEFAULT_EDIT_RECIPE }, brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false, exceptions: [],
  },
  {
    id: 'asset-02', name: 'Crème De Jour Lumière', category: 'Cream',
    beforeImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
    width: 1200, height: 1200, isMaster: false, isSelected: true,
    status: 'Ready', integrityScore: 100,
    protectedRegions: ['Label: Crème De Jour', 'Jar: Frosted Pink Glass', 'Lid: Champagne Gold'],
    recommendation: {
      action: 'Nâng chi tiết bề mặt',
      reason: 'Ảnh đã tốt. Có thể tăng chi tiết bề mặt thủy tinh và bóng nắp.',
      presetSuggestion: 'soft_beauty', isAlreadyGood: false,
    },
    recipe: { ...DEFAULT_EDIT_RECIPE, aspectRatio: '1:1' }, brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false, exceptions: [],
  },
  {
    id: 'asset-03', name: 'Velvet Matte Lipstick Rose', category: 'Lipstick',
    beforeImg: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1200&q=85',
    width: 1000, height: 1500, isMaster: false, isSelected: true,
    status: 'Ready', integrityScore: 100,
    protectedRegions: ['Body: Rose Gold Shell', 'Bullet: Velvet Rose Contour'],
    recipe: { ...DEFAULT_EDIT_RECIPE, scenePreset: 'marble' }, brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false, exceptions: [],
  },
];

// ─── Store Interface ────────────────────────────────────────────

interface StudioState {
  // Navigation
  currentView: AppView;
  activeEditTool: EditTool;

  // Assets
  assets: Asset[];
  selectedAssetId: string;

  // Theme
  themeMode: 'soft-luxury' | 'quiet-luxury';

  // Canvas / Preview
  viewMode: ViewMode;
  sliderPosition: number;
  zoomLevel: number;
  isLoupeActive: boolean;
  loupePos: { x: number; y: number };
  isPreviewDirty: boolean;

  // AI Job
  jobState: AIJobState;
  jobProgress: number;
  jobMessage: string;

  // Toast
  toastMessage: string | null;

  // Batch
  masterRecipe: MasterRecipe;

  // History
  historyPast: Asset[][];
  historyFuture: Asset[][];

  // Export
  isExportOpen: boolean;

  // ─── Actions ────────────────────────────────────────────────
  setView: (view: AppView) => void;
  setActiveEditTool: (tool: EditTool) => void;
  selectAsset: (id: string) => void;
  deleteAsset: (id: string) => void;
  addUploadedAssets: (newAssets: Partial<Asset>[]) => void;
  toggleAssetSelected: (id: string) => void;
  toggleSelectAllAssets: () => void;
  setMasterAsset: (id: string) => void;
  setThemeMode: (theme: 'soft-luxury' | 'quiet-luxury') => void;
  setViewMode: (mode: ViewMode) => void;
  setSliderPosition: (pos: number) => void;
  setZoomLevel: (zoom: number) => void;
  setLoupeActive: (active: boolean) => void;
  setLoupePos: (pos: { x: number; y: number }) => void;
  showToast: (msg: string) => void;
  updateActiveRecipe: (patch: Partial<EditRecipe>) => void;
  updateActiveBrand: (patch: Partial<BrandRecipe>) => void;
  applyPreview: () => void;
  cancelPreview: () => void;
  resetToOriginal: () => void;
  runAutoAnalysis: (assetId?: string) => Promise<void>;
  previewRecommendation: (assetId?: string) => Promise<void>;
  applyRecommendation: (assetId?: string) => Promise<void>;
  applyMasterToBatch: () => Promise<void>;
  openExport: () => void;
  closeExport: () => void;
  undo: () => void;
  redo: () => void;
}

// ─── Store ──────────────────────────────────────────────────────

export const useStudioStore = create<StudioState>((set, get) => ({
  currentView: 'home',
  activeEditTool: 'enhance',
  assets: DEMO_ASSETS,
  selectedAssetId: 'asset-01',
  themeMode: 'soft-luxury',
  viewMode: 'split',
  sliderPosition: 50,
  zoomLevel: 100,
  isLoupeActive: false,
  loupePos: { x: 50, y: 50 },
  isPreviewDirty: false,
  jobState: 'idle',
  jobProgress: 0,
  jobMessage: '',
  toastMessage: null,
  masterRecipe: BRAND_CONFIG.defaultMasterRecipes[0],
  historyPast: [],
  historyFuture: [],
  isExportOpen: false,

  // ─── Navigation ─────────────────────────────────────────────
  setView: (view) => set({ currentView: view }),
  setActiveEditTool: (tool) => set({ activeEditTool: tool }),

  // ─── Assets ─────────────────────────────────────────────────
  selectAsset: (id) => set({ selectedAssetId: id }),

  deleteAsset: (id) => {
    const target = get().assets.find((a) => a.id === id);
    if (target) {
      revokeAssetObjectURLs(target);
    }
    const remaining = get().assets.filter((a) => a.id !== id);
    set((s) => ({
      assets: remaining,
      selectedAssetId: s.selectedAssetId === id ? (remaining[0]?.id || '') : s.selectedAssetId,
    }));
    get().showToast('Đã xóa ảnh khỏi danh sách');
  },

  addUploadedAssets: (newAssets) => {
    const created: Asset[] = newAssets.map((item, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: item.name || `Sản phẩm ${get().assets.length + idx + 1}`,
      category: item.category || 'Mỹ phẩm',
      beforeImg: item.beforeImg || '',
      afterImg: item.afterImg || item.beforeImg || '',
      width: item.width || 1200, height: item.height || 1500,
      isMaster: false, isSelected: true, status: 'Raw' as const,
      integrityScore: 100, protectedRegions: [],
      recipe: { ...DEFAULT_EDIT_RECIPE }, brand: { ...DEFAULT_BRAND_RECIPE },
      overrideActive: false, exceptions: [],
    }));
    set((s) => ({
      assets: [...s.assets, ...created],
      selectedAssetId: created[0]?.id || s.selectedAssetId,
      currentView: 'studio',
    }));
    get().showToast(`Đã thêm ${created.length} ảnh sản phẩm`);
    if (created[0]) get().runAutoAnalysis(created[0].id);
  },

  toggleAssetSelected: (id) => set((s) => ({
    assets: s.assets.map((a) => (a.id === id ? { ...a, isSelected: !a.isSelected } : a)),
  })),

  toggleSelectAllAssets: () => {
    const all = get().assets.every((a) => a.isSelected);
    set((s) => ({ assets: s.assets.map((a) => ({ ...a, isSelected: !all })) }));
  },

  setMasterAsset: (id) => {
    const t = get().assets.find((a) => a.id === id);
    if (!t) return;
    set((s) => ({
      masterRecipe: { id: `recipe-${id}`, name: `${t.name} Standard`, description: `Công thức ảnh mẫu dựa trên ${t.name}`, recipe: { ...t.recipe }, brand: { ...t.brand }, exportSettings: { format: 'png', quality: 'max', resolution: t.recipe.outputResolution } },
      assets: s.assets.map((a) => ({ ...a, isMaster: a.id === id, status: a.id === id ? 'Master' as const : a.status === 'Master' ? 'Ready' as const : a.status })),
    }));
    get().showToast(`⭐ "${t.name}" đặt làm Master`);
  },

  // ─── Theme ──────────────────────────────────────────────────
  setThemeMode: (theme) => set({ themeMode: theme }),

  // ─── Canvas ─────────────────────────────────────────────────
  setViewMode: (mode) => set({ viewMode: mode }),
  setSliderPosition: (pos) => set({ sliderPosition: pos }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setLoupeActive: (active) => set({ isLoupeActive: active }),
  setLoupePos: (pos) => set({ loupePos: pos }),

  // ─── Toast ──────────────────────────────────────────────────
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => { if (get().toastMessage === msg) set({ toastMessage: null }); }, 3200);
  },

  // ─── Recipe (creates preview intent, NOT commit) ──────────
  updateActiveRecipe: (patch) => set((s) => ({
    isPreviewDirty: true,
    assets: s.assets.map((a) => {
      if (a.id !== s.selectedAssetId) return a;
      return {
        ...a,
        overrideActive: !a.isMaster,
        recipe: { ...a.recipe, ...patch }
      };
    }),
  })),

  updateActiveBrand: (patch) => set((s) => ({
    isPreviewDirty: true,
    assets: s.assets.map((a) =>
      a.id === s.selectedAssetId ? { ...a, brand: { ...a.brand, ...patch } } : a
    ),
  })),

  // ─── Preview Pipeline (previewImage ≠ committedImage) ───────
  applyPreview: () => {
    const { assets, selectedAssetId, historyPast } = get();
    const target = assets.find((a) => a.id === selectedAssetId);
    if (!target) return;

    set({
      historyPast: [...historyPast.slice(-10), assets],
      historyFuture: [],
      isPreviewDirty: false,
      assets: assets.map((a) =>
        a.id === selectedAssetId
          ? {
              ...a,
              afterImg: a.previewImg || a.afterImg,
              previewImg: undefined,
              status: a.isMaster ? ('Master' as const) : ('Ready' as const),
            }
          : a
      ),
    });
    get().showToast('✓ Đã áp dụng thay đổi vào ảnh chính');
  },

  cancelPreview: () => {
    const { historyPast, selectedAssetId, assets } = get();
    // If there's a previous committed state in history, restore the recipe and state from it
    if (historyPast.length > 0) {
      const lastCommitted = historyPast[historyPast.length - 1].find((a) => a.id === selectedAssetId);
      if (lastCommitted) {
        set({
          assets: assets.map((a) =>
            a.id === selectedAssetId
              ? {
                  ...a,
                  previewImg: undefined,
                  recipe: { ...lastCommitted.recipe },
                  brand: { ...lastCommitted.brand },
                }
              : a
          ),
          isPreviewDirty: false,
        });
        get().showToast('✕ Đã hủy bản xem trước, giữ nguyên ảnh');
        return;
      }
    }
    set({
      assets: assets.map((a) =>
        a.id === selectedAssetId ? { ...a, previewImg: undefined } : a
      ),
      isPreviewDirty: false,
    });
    get().showToast('✕ Đã hủy bản xem trước, giữ nguyên ảnh');
  },

  resetToOriginal: () => {
    const { assets, selectedAssetId, historyPast } = get();
    const target = assets.find((a) => a.id === selectedAssetId);
    if (!target) return;
    set({
      historyPast: [...historyPast.slice(-10), assets],
      historyFuture: [],
      isPreviewDirty: false,
      assets: assets.map((a) =>
        a.id === selectedAssetId
          ? {
              ...a,
              previewImg: undefined,
              afterImg: a.beforeImg,
              recipe: { ...DEFAULT_EDIT_RECIPE },
              brand: { ...DEFAULT_BRAND_RECIPE },
              status: 'Raw',
            }
          : a
      ),
    });
    get().showToast('↺ Đã khôi phục ảnh gốc');
  },

  // ─── AI Actions ─────────────────────────────────────────────
  runAutoAnalysis: async (assetId) => {
    const id = assetId || get().selectedAssetId;
    const target = get().assets.find((a) => a.id === id);
    if (!target) return;

    set({ jobState: 'analyzing', jobProgress: 15, jobMessage: 'Đang phân tích sản phẩm...' });
    const provider = AIProviderService.getInstance().getProvider();

    try {
      const analysis = await provider.analyzeProduct(target, (u) => {
        set({ jobState: u.state, jobProgress: u.progress, jobMessage: u.message });
      });
      const recommendation = generateRecommendation(analysis);

      set((s) => ({
        jobState: 'completed',
        jobProgress: 100,
        jobMessage: 'Phân tích hoàn tất',
        assets: s.assets.map((a) =>
          a.id === id ? { ...a, analysis, recommendation, recipe: { ...a.recipe, aspectRatio: analysis.recommendedCrop } } : a
        ),
      }));
      get().showToast(`✓ Đã phân tích ${target.name}`);
    } catch (err: any) {
      set({ jobState: 'failed', jobMessage: err.message || 'Lỗi phân tích.' });
    }
  },

  previewRecommendation: async (assetId) => {
    const id = assetId || get().selectedAssetId;
    const target = get().assets.find((a) => a.id === id);
    if (!target) return;

    set({
      selectedAssetId: id,
      currentView: 'studio',
      jobState: 'processing',
      jobProgress: 15,
      jobMessage: 'Đang chuẩn bị bản xem trước AI...',
    });
    const provider = AIProviderService.getInstance().getProvider();

    try {
      const previousSnapshot = get().assets;
      const result = await provider.makeProfessional(target, target.recipe, (u) => {
        set({ jobState: u.state, jobProgress: u.progress, jobMessage: u.message });
      });
      const proRecipe = RecipeEngine.createProfessionalRecipe(target.analysis);

      set((s) => ({
        historyPast: s.historyPast.length > 0 ? s.historyPast : [previousSnapshot],
        jobState: 'completed',
        jobProgress: 100,
        jobMessage: 'Bản xem trước hoàn tất!',
        isPreviewDirty: true,
        viewMode: 'split',
        assets: s.assets.map((a) =>
          a.id === id
            ? {
                ...a,
                previewImg: result.enhancedUrl, // Non-destructive preview layer
                protectedRegions: result.protectedRegions,
                integrityScore: result.integrityScore,
                recipe: proRecipe,
              }
            : a
        ),
      }));
      get().showToast(`✨ Đang xem trước đề xuất cho "${target.name}". Nhấn "Áp dụng" nếu ưng ý!`);
    } catch (err: any) {
      set({ jobState: 'failed', jobMessage: err.message || 'Lỗi xử lý.' });
      get().showToast(`Lỗi: ${err.message || 'Không thể tạo xem trước.'}`);
    }
  },

  applyRecommendation: async (assetId) => {
    // Calling recommendation routes through the safe non-destructive preview pipeline
    await get().previewRecommendation(assetId);
  },

  applyMasterToBatch: async () => {
    const { assets, masterRecipe } = get();
    const count = assets.filter((a) => a.isSelected && !a.isMaster).length;
    if (count === 0) { get().showToast('Chọn ít nhất một ảnh!'); return; }

    set({ jobState: 'processing', jobProgress: 15, jobMessage: `Đang đồng bộ ${count} ảnh...` });
    await new Promise((r) => setTimeout(r, 600));

    let excTotal = 0;
    const updated = assets.map((a) => {
      if (!a.isSelected || a.isMaster) return a;
      const { recipe, brand, exceptions } = RecipeEngine.adaptRecipeToAsset(masterRecipe, a);
      excTotal += exceptions.length;
      return { ...a, recipe, brand, status: exceptions.length > 0 ? 'Review' as const : 'Ready' as const, overrideActive: false, exceptions };
    });

    set({ jobState: 'completed', jobProgress: 100, jobMessage: 'Đồng bộ hoàn tất!', assets: updated });
    get().showToast(excTotal > 0 ? `⚠️ ${count} ảnh đồng bộ. ${excTotal} cần kiểm tra.` : `✨ Đồng bộ Master cho ${count} ảnh!`);
  },

  // ─── Export ─────────────────────────────────────────────────
  openExport: () => set({ isExportOpen: true }),
  closeExport: () => set({ isExportOpen: false }),

  // ─── Undo / Redo ───────────────────────────────────────────
  undo: () => {
    const { historyPast, historyFuture, assets } = get();
    if (historyPast.length === 0) return;
    set({ assets: historyPast[historyPast.length - 1], historyPast: historyPast.slice(0, -1), historyFuture: [assets, ...historyFuture] });
    get().showToast('↩️ Hoàn tác');
  },

  redo: () => {
    const { historyPast, historyFuture, assets } = get();
    if (historyFuture.length === 0) return;
    set({ assets: historyFuture[0], historyPast: [...historyPast, assets], historyFuture: historyFuture.slice(1) });
    get().showToast('↪️ Làm lại');
  },
}));

// ─── Recommendation Generator ───────────────────────────────────

function generateRecommendation(analysis: SmartAnalysis): SmartRecommendation {
  const issues: string[] = [];
  if (analysis.lightingQuality === 'dim' || analysis.lightingQuality === 'uneven') issues.push('Nâng sáng studio');
  if (analysis.backgroundClutterScore > 20) issues.push('Thay nền sạch');
  if (analysis.imageQualityScore < 85) issues.push('Tăng độ nét');

  if (analysis.imageQualityScore >= 90 && analysis.backgroundClutterScore < 15 && issues.length === 0) {
    return { action: 'Ảnh đã rất tốt', reason: 'Sản phẩm rõ nét, nền sạch, ánh sáng cân bằng.', isAlreadyGood: true };
  }

  return {
    action: issues.length > 0 ? issues.join(' + ') : 'Nâng cấp tự động',
    reason: `Điểm chất lượng: ${analysis.imageQualityScore}/100. ${issues.length > 0 ? 'Khuyến nghị cải thiện.' : 'Có thể tối ưu thêm.'}`,
    presetSuggestion: analysis.recommendedEnhancement || 'auto',
    backgroundSuggestion: analysis.backgroundClutterScore > 20 ? 'silk' : undefined,
    lightingSuggestion: analysis.lightingQuality === 'dim' ? 'soft_studio' : undefined,
    isAlreadyGood: false,
  };
}
