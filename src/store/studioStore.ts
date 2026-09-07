import { create } from 'zustand';
import { 
  Stage, 
  EditTool, 
  ViewMode, 
  Asset, 
  EditRecipe, 
  BrandRecipe, 
  MasterRecipe, 
  AIJobState,
  ContentBrief,
  ContentPack,
  SocialPlatform,
  SocialPost,
  VisualTemplate
} from '../types/studio';
import { BRAND_CONFIG } from '../config/brand.config';
import { RecipeEngine } from '../services/recipeEngine';
import { AIProviderService } from '../services/aiProvider';
import { ContentEngine } from '../services/contentEngine';

interface StudioState {
  stage: Stage;
  activeEditTool: EditTool;
  assets: Asset[];
  selectedAssetId: string;
  themeMode: 'soft-luxury' | 'quiet-luxury';
  viewMode: ViewMode;
  sliderPosition: number;
  zoomLevel: number;
  isLoupeActive: boolean;
  loupePos: { x: number; y: number };
  showProtectedOverlay: boolean;
  jobState: AIJobState;
  jobProgress: number;
  jobMessage: string;
  toastMessage: string | null;
  masterRecipe: MasterRecipe;
  historyPast: Asset[][];
  historyFuture: Asset[][];

  // AI Content Creator State
  contentBrief: ContentBrief;
  selectedTemplate: VisualTemplate;
  selectedPlatform: SocialPlatform;
  socialPosts: Record<SocialPlatform, SocialPost> | null;
  contentPack: ContentPack | null;
  isContentPackModalOpen: boolean;
  contentJobState: 'idle' | 'researching' | 'generating' | 'completed';
  isDashboardOpen: boolean;

  // Actions
  toggleDashboard: () => void;
  setStage: (stage: Stage) => void;
  setActiveEditTool: (tool: EditTool) => void;
  selectAsset: (id: string) => void;
  setThemeMode: (theme: 'soft-luxury' | 'quiet-luxury') => void;
  setViewMode: (mode: ViewMode) => void;
  setSliderPosition: (pos: number) => void;
  setZoomLevel: (zoom: number) => void;
  setLoupeActive: (active: boolean) => void;
  setLoupePos: (pos: { x: number; y: number }) => void;
  toggleProtectedOverlay: () => void;
  showToast: (msg: string) => void;
  
  toggleAssetSelected: (id: string) => void;
  toggleSelectAllAssets: () => void;
  setMasterAsset: (id: string) => void;
  addUploadedAssets: (newAssets: Partial<Asset>[]) => void;
  
  updateActiveRecipe: (patch: Partial<EditRecipe>) => void;
  updateActiveBrand: (patch: Partial<BrandRecipe>) => void;
  
  runAutoAnalysis: (assetId?: string) => Promise<void>;
  makeProfessional: (assetId?: string) => Promise<void>;
  applyMasterToBatch: () => Promise<void>;

  // Content Actions
  updateContentBrief: (patch: Partial<ContentBrief>) => void;
  setSelectedTemplate: (template: VisualTemplate) => void;
  setSelectedPlatform: (platform: SocialPlatform) => void;
  generateContentAction: (research?: boolean) => Promise<void>;
  applyCopyEditAction: (action: 'shorten' | 'clearer' | 'premium' | 'direct' | 'rewrite_cta') => void;
  updatePostContent: (platform: SocialPlatform, patch: Partial<SocialPost>) => void;
  openContentPackModal: () => void;
  closeContentPackModal: () => void;
  
  undo: () => void;
  redo: () => void;
}

const DEFAULT_EDIT_RECIPE: EditRecipe = {
  cleanAuto: true,
  cleanIntensity: 'balanced',
  preservePackagingTexture: true,
  lightingPreset: 'soft_studio',
  exposure: 6,
  contrast: 8,
  highlights: -4,
  shadows: 10,
  temperature: 2,
  productSeparation: 35,
  shadowStrength: 35,
  scenePreset: 'silk',
  surfaceOpacity: 85,
  depthOfField: 25,
  reflectionStrength: 20,
  beautifyPreset: 'natural',
  skinSurfaceSmooth: 15,
  reflectionPolish: 18,
  aspectRatio: '4:5',
  framePlacement: 'center',
  autoFrame: true,
  safeAreaMargin: 10,
  enhancePreset: 'auto',
  outputResolution: '4k',
  preserveGeometry: true,
  protectLabels: true
};

const DEFAULT_BRAND_RECIPE: BrandRecipe = {
  logoEnabled: true,
  logoAsset: 'brand_mark_transparent',
  logoSize: 22,
  logoOpacity: 85,
  logoPosition: 'bottom_right',
  logoSafeMargin: 10,
  smartPlacementAvoidProduct: true,
  watermarkEnabled: true,
  watermarkMode: 'subtle',
  watermarkOpacity: 20,
  watermarkScale: 35,
  watermarkRotation: 0,
  watermarkPosition: 'bottom_right',
  protectProductArea: true,
  applyToAllBatch: true
};

const INITIAL_ASSETS: Asset[] = [
  {
    id: 'asset-01',
    name: 'Serum Astralisca 25%',
    category: 'Serum',
    beforeImg: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1608248597359-2ff96fec0872?auto=format&fit=crop&w=1200&q=85',
    width: 1200,
    height: 1500,
    isMaster: true,
    isSelected: true,
    status: 'Master',
    integrityScore: 100,
    protectedRegions: [
      'Label: 25% Mandelic Acid Glow',
      'Logo: MÂY Metallic Vector Lockup',
      'Cap: Rose Gold Metallic Pipette',
      'Bottle: Amber Frosted Glass'
    ],
    analysis: {
      productDetected: true,
      confidence: 0.99,
      boundingBox: { x: 0.25, y: 0.12, width: 0.50, height: 0.76 },
      orientation: 'portrait',
      imageQualityScore: 94,
      backgroundClutterScore: 18,
      lightingQuality: 'balanced',
      shadowsQuality: 'soft',
      labelRisk: 'safe',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '4:5',
      recommendedEnhancement: 'auto',
      recommendedComposition: 'center',
      summaryRecommendation: 'Chai serum độ tương phản cao, nhãn in sắc nét. Đã bảo vệ 100% nhãn 25% Mandelic Acid.'
    },
    recipe: { ...DEFAULT_EDIT_RECIPE },
    brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false,
    exceptions: []
  },
  {
    id: 'asset-02',
    name: 'Crème De Jour Lumière',
    category: 'Cream',
    beforeImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
    width: 1200,
    height: 1200,
    isMaster: false,
    isSelected: true,
    status: 'Ready',
    integrityScore: 100,
    protectedRegions: ['Label: Crème De Jour', 'Jar: Frosted Pink Glass', 'Lid: Champagne Gold'],
    analysis: {
      productDetected: true,
      confidence: 0.98,
      boundingBox: { x: 0.20, y: 0.22, width: 0.60, height: 0.56 },
      orientation: 'square',
      imageQualityScore: 92,
      backgroundClutterScore: 12,
      lightingQuality: 'soft_studio' as any,
      shadowsQuality: 'soft',
      labelRisk: 'safe',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '1:1',
      recommendedEnhancement: 'detail',
      recommendedComposition: 'center',
      summaryRecommendation: 'Hũ kem tròn, bề mặt phản xạ tốt. Khuyến nghị nâng sáng studio và giữ độ bóng nắp.'
    },
    recipe: { ...DEFAULT_EDIT_RECIPE, aspectRatio: '1:1' },
    brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false,
    exceptions: []
  },
  {
    id: 'asset-03',
    name: 'Velvet Matte Lipstick Rose',
    category: 'Lipstick',
    beforeImg: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1200&q=85',
    width: 1000,
    height: 1500,
    isMaster: false,
    isSelected: true,
    status: 'Ready',
    integrityScore: 100,
    protectedRegions: ['Body: Rose Gold Shell', 'Bullet: Velvet Rose Contour'],
    analysis: {
      productDetected: true,
      confidence: 0.97,
      boundingBox: { x: 0.32, y: 0.10, width: 0.36, height: 0.80 },
      orientation: 'portrait',
      imageQualityScore: 90,
      backgroundClutterScore: 22,
      lightingQuality: 'balanced',
      shadowsQuality: 'natural',
      labelRisk: 'safe',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '4:5',
      recommendedEnhancement: 'sharpen',
      recommendedComposition: 'center',
      summaryRecommendation: 'Son thỏi đứng dọc. Độ mịn lụa đã được kích hoạt, ánh kim vỏ son được làm nổi bật.'
    },
    recipe: { ...DEFAULT_EDIT_RECIPE, scenePreset: 'marble' },
    brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: true,
    exceptions: []
  },
  {
    id: 'asset-04',
    name: 'Silk Cushion Compact Powder',
    category: 'Cushion',
    beforeImg: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
    afterImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
    width: 1000,
    height: 1000,
    isMaster: false,
    isSelected: true,
    status: 'Review',
    integrityScore: 92,
    protectedRegions: ['Compact Edge', 'Mirror Reflection'],
    analysis: {
      productDetected: true,
      confidence: 0.89,
      boundingBox: { x: 0.08, y: 0.12, width: 0.84, height: 0.76 },
      orientation: 'square',
      imageQualityScore: 84,
      backgroundClutterScore: 45,
      lightingQuality: 'dim',
      shadowsQuality: 'harsh' as any,
      labelRisk: 'low',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '1:1',
      recommendedEnhancement: 'auto',
      recommendedComposition: 'center',
      summaryRecommendation: 'Sản phẩm nằm sát lề (Safe Margin thấp). Cần căn chỉnh lại khung hình để tránh tràn viền.'
    },
    recipe: { ...DEFAULT_EDIT_RECIPE, aspectRatio: '1:1' },
    brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false,
    exceptions: [
      {
        code: 'EDGE_PROXIMITY',
        severity: 'warning',
        message: 'Sản phẩm nằm sát lề ảnh (8%). Khuyến nghị bật Auto Frame để tạo không gian thở.'
      }
    ]
  },
  {
    id: 'asset-05',
    name: 'Essence Hydratante Pure',
    category: 'Toner',
    beforeImg: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
    afterImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
    width: 1200,
    height: 1600,
    isMaster: false,
    isSelected: true,
    status: 'Ready',
    integrityScore: 100,
    protectedRegions: ['Label: Pure Essence', 'Cap: Silver Rim', 'Liquid Clarity'],
    analysis: {
      productDetected: true,
      confidence: 0.99,
      boundingBox: { x: 0.28, y: 0.15, width: 0.44, height: 0.70 },
      orientation: 'portrait',
      imageQualityScore: 95,
      backgroundClutterScore: 15,
      lightingQuality: 'balanced',
      shadowsQuality: 'soft',
      labelRisk: 'safe',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '4:5',
      recommendedEnhancement: 'auto',
      recommendedComposition: 'center',
      summaryRecommendation: 'Chai tinh chất trong suốt. Phản chiếu và độ tán sáng nước đã sẵn sàng.'
    },
    recipe: { ...DEFAULT_EDIT_RECIPE },
    brand: { ...DEFAULT_BRAND_RECIPE },
    overrideActive: false,
    exceptions: []
  }
];

export const useStudioStore = create<StudioState>((set, get) => ({
  stage: 'edit',
  activeEditTool: 'clean',
  assets: INITIAL_ASSETS,
  selectedAssetId: 'asset-01',
  themeMode: 'soft-luxury',
  viewMode: 'split',
  sliderPosition: 50,
  zoomLevel: 100,
  isLoupeActive: false,
  loupePos: { x: 50, y: 50 },
  showProtectedOverlay: false,
  jobState: 'idle',
  jobProgress: 0,
  jobMessage: '',
  toastMessage: null,
  masterRecipe: BRAND_CONFIG.defaultMasterRecipes[0],
  historyPast: [],
  historyFuture: [],

  // AI Content Creator Defaults
  contentBrief: {
    title: 'Serum Astralisca 25% Mandelic Acid',
    message: 'Tái tạo bề mặt da mịn màng, làm sáng và căng bóng tự nhiên dịu êm.',
    goal: 'sales',
    tone: 'clean_luxury',
    audience: 'Khách hàng có làn da thô ráp, nhạy cảm cần cải thiện kết cấu da',
    customCta: 'Trải nghiệm ngay',
    enableResearch: true
  },
  selectedTemplate: 'hero',
  selectedPlatform: 'instagram',
  socialPosts: null,
  contentPack: null,
  isContentPackModalOpen: false,
  contentJobState: 'idle',
  isDashboardOpen: false,

  toggleDashboard: () => set((s) => ({ isDashboardOpen: !s.isDashboardOpen })),
  setStage: (stage) => set({ stage }),
  setActiveEditTool: (tool) => set({ activeEditTool: tool }),
  selectAsset: (id) => set({ selectedAssetId: id }),
  setThemeMode: (theme) => set({ themeMode: theme }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSliderPosition: (pos) => set({ sliderPosition: pos }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setLoupeActive: (active) => set({ isLoupeActive: active }),
  setLoupePos: (pos) => set({ loupePos: pos }),
  toggleProtectedOverlay: () => set((s) => ({ showProtectedOverlay: !s.showProtectedOverlay })),

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3200);
  },

  toggleAssetSelected: (id) => {
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, isSelected: !a.isSelected } : a))
    }));
  },

  toggleSelectAllAssets: () => {
    const allSelected = get().assets.every((a) => a.isSelected);
    set((state) => ({
      assets: state.assets.map((a) => ({ ...a, isSelected: !allSelected }))
    }));
  },

  setMasterAsset: (id) => {
    const target = get().assets.find((a) => a.id === id);
    if (!target) return;
    
    // Convert target asset settings to Master Recipe
    const newMasterRecipe: MasterRecipe = {
      id: `recipe-master-${id}`,
      name: `${target.name} Standard`,
      description: `Công thức ảnh mẫu dựa trên ${target.name}`,
      recipe: { ...target.recipe },
      brand: { ...target.brand },
      exportSettings: {
        format: 'png',
        quality: 'max',
        resolution: target.recipe.outputResolution
      }
    };

    set((state) => ({
      masterRecipe: newMasterRecipe,
      assets: state.assets.map((a) => ({
        ...a,
        isMaster: a.id === id,
        status: a.id === id ? 'Master' : a.status
      }))
    }));
    get().showToast(`⭐ Đã đặt "${target.name}" làm Ảnh Mẫu (Master Asset)!`);
  },

  addUploadedAssets: (newAssets) => {
    const created: Asset[] = newAssets.map((item, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: item.name || `Sản phẩm ${get().assets.length + idx + 1}`,
      category: item.category || 'Mỹ phẩm',
      beforeImg: item.beforeImg || '',
      afterImg: item.afterImg || item.beforeImg || '',
      width: item.width || 1200,
      height: item.height || 1500,
      isMaster: false,
      isSelected: true,
      status: 'Ready',
      integrityScore: 100,
      protectedRegions: ['Vùng sản phẩm chính', 'Nhãn in', 'Nắp bao bì'],
      recipe: { ...DEFAULT_EDIT_RECIPE },
      brand: { ...DEFAULT_BRAND_RECIPE },
      overrideActive: false,
      exceptions: []
    }));

    set((state) => ({
      assets: [...state.assets, ...created],
      selectedAssetId: created[0]?.id || state.selectedAssetId,
      stage: 'create'
    }));

    get().showToast(`Đã thêm ${created.length} hình ảnh sản phẩm vào Studio.`);
    // Run auto-analysis for newly added asset
    if (created[0]) {
      get().runAutoAnalysis(created[0].id);
    }
  },

  updateActiveRecipe: (patch) => {
    const { assets, selectedAssetId, historyPast } = get();
    // Save history checkpoint
    const target = assets.find((a) => a.id === selectedAssetId);
    if (!target) return;

    set({
      historyPast: [...historyPast.slice(-10), assets],
      historyFuture: [],
      assets: assets.map((a) =>
        a.id === selectedAssetId
          ? {
              ...a,
              overrideActive: !a.isMaster,
              recipe: { ...a.recipe, ...patch }
            }
          : a
      )
    });
  },

  updateActiveBrand: (patch) => {
    const { assets, selectedAssetId, historyPast } = get();
    set({
      historyPast: [...historyPast.slice(-10), assets],
      historyFuture: [],
      assets: assets.map((a) =>
        a.id === selectedAssetId
          ? {
              ...a,
              brand: { ...a.brand, ...patch }
            }
          : a
      )
    });
  },

  runAutoAnalysis: async (assetId) => {
    const id = assetId || get().selectedAssetId;
    const target = get().assets.find((a) => a.id === id);
    if (!target) return;

    set({ jobState: 'analyzing', jobProgress: 15, jobMessage: 'Đang tự động phân tích sản phẩm...' });
    const aiProvider = AIProviderService.getInstance().getProvider();

    try {
      const analysis = await aiProvider.analyzeProduct(target, (update) => {
        set({ jobState: update.state, jobProgress: update.progress, jobMessage: update.message });
      });

      set((state) => ({
        jobState: 'completed',
        jobProgress: 100,
        jobMessage: 'Phân tích hoàn tất',
        assets: state.assets.map((a) =>
          a.id === id
            ? {
                ...a,
                analysis,
                recipe: {
                  ...a.recipe,
                  aspectRatio: analysis.recommendedCrop,
                  enhancePreset: analysis.recommendedEnhancement
                }
              }
            : a
        )
      }));
      get().showToast(`✓ Đã phân tích xong ${target.name}. Khuyến nghị Make Professional sẵn sàng!`);
    } catch (err: any) {
      set({ jobState: 'failed', jobMessage: err.message || 'Lỗi khi phân tích ảnh.' });
    }
  },

  makeProfessional: async (assetId) => {
    const id = assetId || get().selectedAssetId;
    const target = get().assets.find((a) => a.id === id);
    if (!target) return;

    set({ jobState: 'processing', jobProgress: 10, jobMessage: 'Bắt đầu nâng cấp Make Professional...' });
    const aiProvider = AIProviderService.getInstance().getProvider();

    try {
      const result = await aiProvider.makeProfessional(target, target.recipe, (update) => {
        set({ jobState: update.state, jobProgress: update.progress, jobMessage: update.message });
      });

      const proRecipe = RecipeEngine.createProfessionalRecipe(target.analysis);

      set((state) => ({
        jobState: 'completed',
        jobProgress: 100,
        jobMessage: 'Make Professional hoàn tất!',
        assets: state.assets.map((a) =>
          a.id === id
            ? {
                ...a,
                afterImg: result.enhancedUrl,
                protectedRegions: result.protectedRegions,
                integrityScore: result.integrityScore,
                recipe: proRecipe,
                status: a.isMaster ? 'Master' : 'Ready'
              }
            : a
        )
      }));
      get().showToast(`✨ "${target.name}" đã được nâng cấp chuẩn thương mại Soft Luxury!`);
    } catch (err: any) {
      set({ jobState: 'failed', jobMessage: err.message || 'Lỗi xử lý ảnh.' });
      get().showToast(`Lỗi: ${err.message || 'Không thể nâng cấp ảnh.'} Ảnh gốc của bạn được giữ nguyên.`);
    }
  },

  applyMasterToBatch: async () => {
    const { assets, masterRecipe } = get();
    const selectedCount = assets.filter((a) => a.isSelected).length;
    if (selectedCount === 0) {
      get().showToast('Vui lòng chọn ít nhất một ảnh để áp dụng Master Recipe!');
      return;
    }

    set({ jobState: 'processing', jobProgress: 15, jobMessage: `Đang đồng bộ Master Recipe cho ${selectedCount} ảnh...` });

    // Simulate progressive batch adaptation with exception detection
    await new Promise((r) => setTimeout(r, 600));

    let updatedExceptionsTotal = 0;
    const updatedAssets = assets.map((asset) => {
      if (!asset.isSelected) return asset;
      if (asset.isMaster) return asset;

      const { recipe, brand, exceptions } = RecipeEngine.adaptRecipeToAsset(masterRecipe, asset);
      updatedExceptionsTotal += exceptions.length;

      return {
        ...asset,
        recipe,
        brand,
        status: exceptions.length > 0 ? ('Review' as const) : ('Ready' as const),
        overrideActive: false,
        exceptions
      };
    });

    set({
      jobState: 'completed',
      jobProgress: 100,
      jobMessage: 'Đồng bộ batch hoàn tất!',
      assets: updatedAssets
    });

    if (updatedExceptionsTotal > 0) {
      get().showToast(`⚠️ Đã đồng bộ ${selectedCount} ảnh. Phát hiện ${updatedExceptionsTotal} trường hợp cần kiểm tra lại.`);
    } else {
      get().showToast(`✨ Đã đồng bộ Master Recipe cho toàn bộ ${selectedCount} ảnh thành công!`);
    }
  },

  undo: () => {
    const { historyPast, historyFuture, assets } = get();
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    set({
      assets: previous,
      historyPast: historyPast.slice(0, -1),
      historyFuture: [assets, ...historyFuture]
    });
    get().showToast('↩️ Đã hoàn tác (Undo)');
  },

  redo: () => {
    const { historyPast, historyFuture, assets } = get();
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    set({
      assets: next,
      historyPast: [...historyPast, assets],
      historyFuture: historyFuture.slice(1)
    });
    get().showToast('↪️ Đã làm lại (Redo)');
  },

  // Content Creator Actions
  updateContentBrief: (patch) => {
    set((state) => ({ contentBrief: { ...state.contentBrief, ...patch } }));
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  setSelectedPlatform: (platform) => {
    set({ selectedPlatform: platform });
  },

  generateContentAction: async (research = false) => {
    const { assets, selectedAssetId, contentBrief } = get();
    const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
    if (!activeAsset) return;

    if (research) {
      set({ contentJobState: 'researching', jobState: 'processing', jobProgress: 20, jobMessage: 'Đang nghiên cứu xu hướng và từ khóa...' });
      await new Promise((r) => setTimeout(r, 600));
    }

    set({ contentJobState: 'generating', jobState: 'processing', jobProgress: 60, jobMessage: 'Đang khởi tạo bài viết theo Product Truth...' });
    await new Promise((r) => setTimeout(r, 400));

    const truth = ContentEngine.extractProductTruth(activeAsset);
    const posts = ContentEngine.generateSocialPosts(activeAsset, truth, contentBrief);
    const pack = ContentEngine.createContentPack(activeAsset, truth, contentBrief);

    set({
      socialPosts: posts,
      contentPack: pack,
      contentJobState: 'completed',
      jobState: 'completed',
      jobProgress: 100,
      jobMessage: 'Sáng tạo nội dung thành công!'
    });

    get().showToast(research ? '✨ Đã nghiên cứu thị trường & sáng tạo trọn bộ Content!' : '✓ Đã tạo bài viết thương mại theo Product Truth!');
  },

  applyCopyEditAction: (action) => {
    const { socialPosts, selectedPlatform } = get();
    if (!socialPosts || !socialPosts[selectedPlatform]) return;

    const currentPost = socialPosts[selectedPlatform];
    const newCaption = ContentEngine.applyCopyAction(currentPost.caption, action);

    set({
      socialPosts: {
        ...socialPosts,
        [selectedPlatform]: {
          ...currentPost,
          caption: newCaption
        }
      }
    });

    get().showToast(`✓ Đã áp dụng tinh chỉnh: ${action.replace('_', ' ')}`);
  },

  updatePostContent: (platform, patch) => {
    const { socialPosts } = get();
    if (!socialPosts || !socialPosts[platform]) return;

    set({
      socialPosts: {
        ...socialPosts,
        [platform]: {
          ...socialPosts[platform],
          ...patch
        }
      }
    });
  },

  openContentPackModal: () => set({ isContentPackModalOpen: true }),
  closeContentPackModal: () => set({ isContentPackModalOpen: false })
}));
