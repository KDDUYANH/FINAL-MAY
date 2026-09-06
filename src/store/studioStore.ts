import { create } from "zustand";
import {
  AssetItem,
  WorkflowStep,
  ActiveTool,
  InteractionMode,
  EnhancementPreset,
  EnhancementMode,
  BackgroundPreset,
  LightingPreset,
  WatermarkSettings,
  LogoSettings,
  ImageTransform,
  EditAdjustments,
  ZoomLevel,
  QAStatus,
  ViewMode,
  EditOperation,
} from "@/types/studio";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { getAIProvider } from "@/lib/ai/provider";

const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: false,
  preset: "MÂY Logo",
  opacity: 0.7,
  scale: 0.6,
  rotation: 0,
  spacing: 80,
  smartPlacement: true,
  isManualPosition: false,
  normalizedX: 0.85,
  normalizedY: 0.85,
};

const DEFAULT_LOGO: LogoSettings = {
  enabled: true,
  url: MAY_BRAND_CONFIG.logoSignUrl,
  anchorPosition: "top-right",
  scale: 45,
  opacity: 0.9,
  rotation: 0,
  margin: 5,
  smartPlacement: true,
  isManualPosition: false,
  normalizedX: 0.85,
  normalizedY: 0.15,
};

const DEFAULT_EDIT_ADJUSTMENTS: EditAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  saturation: 0,
  sharpness: 0,
  noiseReduction: 0,
  clarity: 0,
  colorIntensity: 0,
  rotation: 0,
  cropRatio: "Original",
};

interface StudioState {
  viewMode: ViewMode;
  assets: AssetItem[];
  activeAssetId: string | null;
  workflowStep: WorkflowStep;
  activeTool: ActiveTool;
  interactionMode: InteractionMode;
  
  // Canvas Viewport Interaction
  splitPosition: number;
  isLoupeActive: boolean;
  loupeMagnification: number;
  zoom: ZoomLevel;
  panOffset: { x: number; y: number };

  // Batch
  selectedAssetIds: string[];
  isProcessing: boolean;
  batchPreviewModalOpen: boolean;
  representativeAssetIds: string[];
  
  demoMode: boolean;

  // View & Mode Actions
  setViewMode: (mode: ViewMode) => void;
  setWorkflowStep: (step: WorkflowStep) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setInteractionMode: (mode: InteractionMode) => void;

  // Asset Actions
  addAssetsFromFiles: (files: FileList | File[]) => Promise<void>;
  addSampleAsset: (sample: { id: string; title: string; url: string }) => void;
  setActiveAssetId: (id: string | null) => void;
  removeAsset: (id: string) => void;
  
  // Analysis
  runProductAnalysis: (assetId: string) => Promise<void>;
  applyRecommendation: (assetId: string) => void;

  // Enhance Preview Workflow
  setEnhancementMode: (mode: EnhancementMode) => void;
  setEnhancementPreset: (preset: EnhancementPreset) => void;
  setBackgroundPreset: (preset: BackgroundPreset) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  updateEditAdjustmentsPreview: (adjustments: Partial<EditAdjustments>) => void;
  applyEnhancementCommit: () => void;
  cancelEnhancementPreview: () => void;

  // Image Transform (Move / Resize)
  updateImageTransform: (transform: Partial<ImageTransform>) => void;
  
  // Logo & Watermark Updates
  updateLogoSettings: (settings: Partial<LogoSettings>) => void;
  updateLogoPosition: (normX: number, normY: number) => void;
  resetLogoToSmartPosition: () => void;

  updateWatermarkSettings: (settings: Partial<WatermarkSettings>) => void;
  updateWatermarkPosition: (normX: number, normY: number) => void;
  resetWatermarkToSmartPosition: () => void;

  // Undo & Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Canvas Viewport Controls
  setSplitPosition: (pos: number) => void;
  setLoupeActive: (active: boolean) => void;
  setLoupeMagnification: (mag: number) => void;
  setZoom: (zoom: ZoomLevel) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  resetCanvasView: () => void;

  // Batch
  toggleSelectAsset: (id: string) => void;
  selectAllAssets: () => void;
  clearSelectedAssets: () => void;
  openBatchPreviewModal: () => void;
  closeBatchPreviewModal: () => void;
  confirmApplyMasterToAll: () => void;
  
  resetActiveAssetTool: () => void;
  resetActiveAssetAll: () => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  viewMode: "home",
  assets: [],
  activeAssetId: null,
  workflowStep: "UPLOAD",
  activeTool: "UPLOAD",
  interactionMode: "pan",
  
  splitPosition: 50,
  isLoupeActive: false,
  loupeMagnification: 2.0,
  zoom: "FIT",
  panOffset: { x: 0, y: 0 },
  
  selectedAssetIds: [],
  isProcessing: false,
  batchPreviewModalOpen: false,
  representativeAssetIds: [],
  demoMode: true,

  setViewMode: (mode) => set({ viewMode: mode }),
  setWorkflowStep: (step) => {
    let tool: ActiveTool = "UPLOAD";
    if (step === "ENHANCE") tool = "ENHANCE";
    else if (step === "PROTECT") tool = "PROTECT";
    else if (step === "EXPORT") tool = "EXPORT";
    set({ workflowStep: step, activeTool: tool });
  },
  setActiveTool: (tool) => {
    let step: WorkflowStep = get().workflowStep;
    if (tool === "UPLOAD") step = "UPLOAD";
    else if (tool === "ENHANCE" || tool === "EDIT" || tool === "BACKGROUND") step = "ENHANCE";
    else if (tool === "LOGO" || tool === "PROTECT") step = "PROTECT";
    else if (tool === "WATERMARK" || tool === "EXPORT") step = "EXPORT";

    const interaction: InteractionMode = tool === "EDIT" ? "transform" : "pan";
    set({ activeTool: tool, workflowStep: step, interactionMode: interaction });
  },
  setInteractionMode: (mode) => set({ interactionMode: mode }),

  addAssetsFromFiles: async (files) => {
    const fileArray = Array.from(files);
    const newAssets: AssetItem[] = [];

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) continue;
      const objectUrl = URL.createObjectURL(file);
      
      const img = new Image();
      img.src = objectUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const w = img.naturalWidth || 1024;
      const h = img.naturalHeight || 1024;

      const newId = `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const asset: AssetItem = {
        id: newId,
        name: file.name,
        originalUrl: objectUrl,
        committedUrl: objectUrl,
        previewUrl: objectUrl,
        hasUncommittedPreview: false,
        isGeneratingPreview: false,
        previewRequestId: 0,
        width: w,
        height: h,
        status: "RAW",
        hasProtectedProduct: true,
        enhancementMode: "BALANCED",
        enhancementPreset: "Clean Luxury",
        backgroundPreset: "Original",
        lightingPreset: "Natural",
        imageTransform: {
          normalizedX: 0.5,
          normalizedY: 0.5,
          widthPx: w,
          heightPx: h,
          lockAspectRatio: true,
          rotation: 0,
        },
        editAdjustments: { ...DEFAULT_EDIT_ADJUSTMENTS },
        logo: { ...DEFAULT_LOGO },
        watermark: { ...DEFAULT_WATERMARK },
        history: [],
        historyIndex: -1,
        createdAt: Date.now(),
      };
      newAssets.push(asset);
    }

    if (newAssets.length === 0) return;

    set((state) => {
      const updated = [...state.assets, ...newAssets];
      const nextActiveId = state.activeAssetId || newAssets[0].id;
      return {
        assets: updated,
        activeAssetId: nextActiveId,
        selectedAssetIds: Array.from(new Set([...state.selectedAssetIds, ...newAssets.map((a) => a.id)])),
        viewMode: "studio",
        workflowStep: state.workflowStep === "UPLOAD" ? "ENHANCE" : state.workflowStep,
        activeTool: "ENHANCE",
      };
    });

    if (newAssets.length > 0) {
      get().runProductAnalysis(newAssets[0].id);
    }
  },

  addSampleAsset: async (sample) => {
    const newId = `sample-${Date.now()}`;
    const asset: AssetItem = {
      id: newId,
      name: sample.title,
      originalUrl: sample.url,
      committedUrl: sample.url,
      previewUrl: sample.url,
      hasUncommittedPreview: false,
      isGeneratingPreview: false,
      previewRequestId: 0,
      width: 1024,
      height: 1024,
      status: "PROTECTED",
      hasProtectedProduct: true,
      enhancementMode: "BALANCED",
      enhancementPreset: "Clean Luxury",
      backgroundPreset: "Original",
      lightingPreset: "Natural",
      imageTransform: {
        normalizedX: 0.5,
        normalizedY: 0.5,
        widthPx: 1024,
        heightPx: 1024,
        lockAspectRatio: true,
        rotation: 0,
      },
      editAdjustments: { ...DEFAULT_EDIT_ADJUSTMENTS },
      logo: { ...DEFAULT_LOGO },
      watermark: { ...DEFAULT_WATERMARK },
      history: [],
      historyIndex: -1,
      createdAt: Date.now(),
    };

    set((state) => ({
      assets: [...state.assets, asset],
      activeAssetId: state.activeAssetId || asset.id,
      selectedAssetIds: Array.from(new Set([...state.selectedAssetIds, asset.id])),
      viewMode: "studio",
      workflowStep: state.workflowStep === "UPLOAD" ? "ENHANCE" : state.workflowStep,
      activeTool: "ENHANCE",
    }));

    get().runProductAnalysis(asset.id);
  },

  setActiveAssetId: (id) => set({ activeAssetId: id }),

  removeAsset: (id) => set((state) => {
    const filtered = state.assets.filter((a) => a.id !== id);
    const activeId = state.activeAssetId === id ? (filtered[0]?.id || null) : state.activeAssetId;
    return {
      assets: filtered,
      activeAssetId: activeId,
      selectedAssetIds: state.selectedAssetIds.filter((sid) => sid !== id),
    };
  }),

  runProductAnalysis: async (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset) return;

    const provider = getAIProvider();
    const result = await provider.analyzeProduct(asset.originalUrl);

    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? {
              ...a,
              status: "PROTECTED",
              hasProtectedProduct: result.hasProduct,
              recommendation: result.recommendation,
            }
          : a
      ),
    }));
  },

  applyRecommendation: (assetId) => {
    const asset = get().assets.find((a) => a.id === assetId);
    if (!asset || !asset.recommendation) return;

    get().setActiveTool(asset.recommendation.action);
  },

  // Enhance Preview Workflow
  setEnhancementMode: (mode) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, enhancementMode: mode, hasUncommittedPreview: true }
          : a
      ),
    };
  }),

  setEnhancementPreset: (preset) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, enhancementPreset: preset, hasUncommittedPreview: true }
          : a
      ),
    };
  }),

  setBackgroundPreset: (preset) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, backgroundPreset: preset, hasUncommittedPreview: true }
          : a
      ),
    };
  }),

  setLightingPreset: (preset) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, lightingPreset: preset, hasUncommittedPreview: true }
          : a
      ),
    };
  }),

  updateEditAdjustmentsPreview: (adjustments) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) => {
        if (a.id !== state.activeAssetId) return a;
        const newReqId = a.previewRequestId + 1;
        return {
          ...a,
          editAdjustments: { ...a.editAdjustments, ...adjustments },
          hasUncommittedPreview: true,
          previewRequestId: newReqId,
        };
      }),
    };
  }),

  applyEnhancementCommit: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) => {
        if (a.id !== state.activeAssetId) return a;
        const newOp: EditOperation = {
          id: `op-${Date.now()}`,
          type: "enhance",
          description: `Applied ${a.enhancementPreset} enhancement`,
          params: {
            preset: a.enhancementPreset,
            background: a.backgroundPreset,
            lighting: a.lightingPreset,
            editAdjustments: a.editAdjustments,
          },
          timestamp: Date.now(),
        };
        const newHistory = [...a.history.slice(0, a.historyIndex + 1), newOp];
        return {
          ...a,
          committedUrl: a.previewUrl,
          hasUncommittedPreview: false,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      }),
    };
  }),

  cancelEnhancementPreview: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              previewUrl: a.committedUrl,
              hasUncommittedPreview: false,
            }
          : a
      ),
    };
  }),

  // Image Transform (Move & Resize)
  updateImageTransform: (transform) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) => {
        if (a.id !== state.activeAssetId) return a;
        const prev = a.imageTransform;
        let newW = transform.widthPx ?? prev.widthPx;
        let newH = transform.heightPx ?? prev.heightPx;

        // Maintain aspect ratio if locked
        const isLocked = transform.lockAspectRatio ?? prev.lockAspectRatio;
        if (isLocked) {
          const aspect = a.width / (a.height || 1);
          if (transform.widthPx !== undefined && transform.heightPx === undefined) {
            newH = Math.round(newW / aspect);
          } else if (transform.heightPx !== undefined && transform.widthPx === undefined) {
            newW = Math.round(newH * aspect);
          }
        }

        return {
          ...a,
          imageTransform: {
            ...prev,
            ...transform,
            widthPx: newW,
            heightPx: newH,
            lockAspectRatio: isLocked,
          },
          hasUncommittedPreview: true,
        };
      }),
    };
  }),

  // Logo Updates
  updateLogoSettings: (settings) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, logo: { ...a.logo, ...settings } }
          : a
      ),
    };
  }),

  updateLogoPosition: (normX, normY) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              logo: {
                ...a.logo,
                isManualPosition: true,
                normalizedX: normX,
                normalizedY: normY,
              },
            }
          : a
      ),
    };
  }),

  resetLogoToSmartPosition: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              logo: { ...a.logo, isManualPosition: false },
            }
          : a
      ),
    };
  }),

  // Watermark Updates
  updateWatermarkSettings: (settings) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, watermark: { ...a.watermark, ...settings } }
          : a
      ),
    };
  }),

  updateWatermarkPosition: (normX, normY) => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              watermark: {
                ...a.watermark,
                isManualPosition: true,
                normalizedX: normX,
                normalizedY: normY,
              },
            }
          : a
      ),
    };
  }),

  resetWatermarkToSmartPosition: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              watermark: { ...a.watermark, isManualPosition: false },
            }
          : a
      ),
    };
  }),

  // Undo & Redo
  canUndo: () => {
    const asset = get().assets.find((a) => a.id === get().activeAssetId);
    return !!asset && asset.historyIndex >= 0;
  },

  canRedo: () => {
    const asset = get().assets.find((a) => a.id === get().activeAssetId);
    return !!asset && asset.historyIndex < asset.history.length - 1;
  },

  undo: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) => {
        if (a.id !== state.activeAssetId || a.historyIndex < 0) return a;
        return { ...a, historyIndex: a.historyIndex - 1 };
      }),
    };
  }),

  redo: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) => {
        if (a.id !== state.activeAssetId || a.historyIndex >= a.history.length - 1) return a;
        return { ...a, historyIndex: a.historyIndex + 1 };
      }),
    };
  }),

  setSplitPosition: (pos) => set({ splitPosition: Math.max(0, Math.min(100, pos)) }),
  setLoupeActive: (active) => set({ isLoupeActive: active }),
  setLoupeMagnification: (mag) => set({ loupeMagnification: mag }),
  setZoom: (zoom) => set({ zoom }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  resetCanvasView: () => set({ zoom: "FIT", panOffset: { x: 0, y: 0 }, splitPosition: 50 }),

  toggleSelectAsset: (id) => set((state) => {
    const isSel = state.selectedAssetIds.includes(id);
    return {
      selectedAssetIds: isSel
        ? state.selectedAssetIds.filter((item) => item !== id)
        : [...state.selectedAssetIds, id],
    };
  }),

  selectAllAssets: () => set((state) => ({
    selectedAssetIds: state.assets.map((a) => a.id),
  })),

  clearSelectedAssets: () => set({ selectedAssetIds: [] }),

  openBatchPreviewModal: () => {
    const { assets, selectedAssetIds } = get();
    if (selectedAssetIds.length === 0) return;
    
    const count = selectedAssetIds.length;
    const repIds = [
      selectedAssetIds[0],
      selectedAssetIds[Math.floor(count / 2)],
      selectedAssetIds[count - 1],
    ].filter((v, i, a) => a.indexOf(v) === i);

    set({ batchPreviewModalOpen: true, representativeAssetIds: repIds });
  },

  closeBatchPreviewModal: () => set({ batchPreviewModalOpen: false }),

  confirmApplyMasterToAll: () => set((state) => {
    const activeAsset = state.assets.find((a) => a.id === state.activeAssetId);
    if (!activeAsset) return { batchPreviewModalOpen: false };

    return {
      batchPreviewModalOpen: false,
      assets: state.assets.map((a) => {
        if (state.selectedAssetIds.includes(a.id) && a.id !== activeAsset.id) {
          return {
            ...a,
            enhancementMode: activeAsset.enhancementMode,
            enhancementPreset: activeAsset.enhancementPreset,
            backgroundPreset: activeAsset.backgroundPreset,
            lightingPreset: activeAsset.lightingPreset,
            imageTransform: { ...activeAsset.imageTransform },
            editAdjustments: { ...activeAsset.editAdjustments },
            logo: { ...activeAsset.logo },
            watermark: { ...activeAsset.watermark },
            status: "READY" as QAStatus,
          };
        }
        return a;
      }),
    };
  }),

  resetActiveAssetTool: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? { ...a, editAdjustments: { ...DEFAULT_EDIT_ADJUSTMENTS } }
          : a
      ),
    };
  }),

  resetActiveAssetAll: () => set((state) => {
    if (!state.activeAssetId) return state;
    return {
      assets: state.assets.map((a) =>
        a.id === state.activeAssetId
          ? {
              ...a,
              committedUrl: a.originalUrl,
              previewUrl: a.originalUrl,
              hasUncommittedPreview: false,
              enhancementPreset: "Clean Luxury",
              backgroundPreset: "Original",
              lightingPreset: "Natural",
              imageTransform: {
                normalizedX: 0.5,
                normalizedY: 0.5,
                widthPx: a.width,
                heightPx: a.height,
                lockAspectRatio: true,
                rotation: 0,
              },
              editAdjustments: { ...DEFAULT_EDIT_ADJUSTMENTS },
              logo: { ...DEFAULT_LOGO },
              watermark: { ...DEFAULT_WATERMARK },
              status: "PROTECTED" as QAStatus,
            }
          : a
      ),
    };
  }),
}));
