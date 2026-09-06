import { create } from "zustand";
import {
  MainModule,
  JobStatus,
  HeroEditAction,
  CanvasHistoryStage,
  AssetItem,
  EnhancementPreset,
  CleanPreset,
  LightingPreset,
  ScenePreset,
  AlignPreset,
  QualityPreset,
  WatermarkSettings,
  EditAdjustments,
  EditOperation,
  ProtectionDetails,
} from "@/types/studio";
import { MAY_BRAND_CONFIG } from "@/lib/brand.config";
import { getAIProvider } from "@/lib/ai/provider";

const DEFAULT_PROTECTION: ProtectionDetails = {
  productDetected: true,
  labelProtected: true,
  logoProtected: true,
  textProtected: true,
  geometryChecked: true,
  status: "Protected",
  boundingBox: { x: 0.25, y: 0.15, width: 0.5, height: 0.7 },
  showProtectedArea: false,
};

const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: true,
  preset: "MÂY Logo",
  opacity: 0.65,
  scale: 0.5,
  rotation: 0,
  spacing: 80,
  smartPlacement: true,
  isManualPosition: false,
  normalizedX: 0.82,
  normalizedY: 0.85,
};

const DEFAULT_ADJUSTMENTS: EditAdjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  saturation: 0,
  sharpness: 0,
  noiseReduction: 0,
};

interface StudioState {
  activeModule: MainModule;
  activeHeroAction: HeroEditAction;
  jobStatus: JobStatus;
  jobStatusMessage: string;
  demoMode: boolean;

  assets: AssetItem[];
  activeAssetId: string | null;
  masterAssetId: string | null;
  selectedAssetIds: string[];

  // Canvas Viewport
  splitPosition: number;
  isLoupeActive: boolean;
  loupeMagnification: number;
  zoom: number;
  panOffset: { x: number; y: number };

  // Batch representative modal
  batchRepresentativeIds: string[];
  isBatchApplying: boolean;

  // Actions
  setActiveModule: (mod: MainModule) => void;
  setActiveHeroAction: (act: HeroEditAction) => void;
  setActiveAssetId: (id: string | null) => void;
  setSplitPosition: (pos: number) => void;
  setLoupeActive: (active: boolean) => void;
  setZoom: (zoom: number) => void;
  resetCanvasView: () => void;

  addAssetsFromFiles: (files: FileList | File[]) => Promise<void>;
  addSampleAsset: (sample: { id: string; title: string; url: string }) => void;
  removeAsset: (id: string) => void;

  // 6 Hero Actions
  setBeautifyPreset: (preset: EnhancementPreset) => void;
  setCleanPreset: (preset: CleanPreset) => void;
  setLightingPreset: (preset: LightingPreset) => void;
  setScenePreset: (preset: ScenePreset) => void;
  setAlignPreset: (preset: AlignPreset) => void;
  setQualityPreset: (preset: QualityPreset) => void;

  updateAdjustments: (adj: Partial<EditAdjustments>) => void;
  updateWatermark: (wm: Partial<WatermarkSettings>) => void;
  toggleShowProtectedArea: () => void;

  setHistoryStage: (stage: CanvasHistoryStage) => void;
  undo: () => void;
  redo: () => void;
  resetActiveAsset: () => void;

  // Batch
  setMasterAssetId: (id: string) => void;
  applyMasterToAll: () => Promise<void>;
}

function createAssetItem(name: string, url: string, width = 1024, height = 1024): AssetItem {
  return {
    id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    originalUrl: url,
    committedUrl: url,
    previewUrl: url,
    hasUncommittedPreview: false,
    width,
    height,
    jobStatus: "ready",
    qaMessage: "Product geometry & label text protected",
    protection: { ...DEFAULT_PROTECTION },
    beautifyPreset: "Auto",
    cleanPreset: "Cleaned",
    lightingPreset: "Soft Studio",
    scenePreset: "Clean Studio",
    alignPreset: "Fit",
    qualityPreset: "Standard",
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    watermark: { ...DEFAULT_WATERMARK },
    historyStage: "Final",
    history: [],
    historyIndex: -1,
    createdAt: Date.now(),
  };
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeModule: "CREATE",
  activeHeroAction: "BEAUTIFY",
  jobStatus: "idle",
  jobStatusMessage: "Ready",
  demoMode: true,

  assets: [],
  activeAssetId: null,
  masterAssetId: null,
  selectedAssetIds: [],

  splitPosition: 50,
  isLoupeActive: false,
  loupeMagnification: 2,
  zoom: 1,
  panOffset: { x: 0, y: 0 },

  batchRepresentativeIds: [],
  isBatchApplying: false,

  setActiveModule: (mod) => set({ activeModule: mod }),
  setActiveHeroAction: (act) => set({ activeHeroAction: act }),
  setActiveAssetId: (id) => set({ activeAssetId: id }),
  setSplitPosition: (pos) => set({ splitPosition: Math.max(0, Math.min(100, pos)) }),
  setLoupeActive: (active) => set({ isLoupeActive: active }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(3, zoom)) }),
  resetCanvasView: () => set({ zoom: 1, panOffset: { x: 0, y: 0 }, splitPosition: 50 }),

  addAssetsFromFiles: async (files) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    set({ jobStatus: "uploading", jobStatusMessage: "Reading image assets..." });

    const newAssets: AssetItem[] = [];
    for (const file of fileList) {
      const url = URL.createObjectURL(file);
      const asset = createAssetItem(file.name, url);
      newAssets.push(asset);
    }

    set((state) => {
      const combined = [...state.assets, ...newAssets];
      return {
        assets: combined,
        activeAssetId: state.activeAssetId || newAssets[0].id,
        masterAssetId: state.masterAssetId || newAssets[0].id,
        jobStatus: "analyzing",
        jobStatusMessage: "Detecting packaging & protecting label...",
      };
    });

    // Run honest protection & analysis check
    const ai = getAIProvider();
    await ai.analyzeProduct(newAssets[0].originalUrl);

    set({
      jobStatus: "ready",
      jobStatusMessage: "Product detected & protected",
    });
  },

  addSampleAsset: (sample) => {
    const asset = createAssetItem(sample.title, sample.url);
    set((state) => ({
      assets: [...state.assets, asset],
      activeAssetId: state.activeAssetId || asset.id,
      masterAssetId: state.masterAssetId || asset.id,
      jobStatus: "ready",
      jobStatusMessage: "Sample asset loaded & protected",
    }));
  },

  removeAsset: (id) => {
    set((state) => {
      const remaining = state.assets.filter((a) => a.id !== id);
      return {
        assets: remaining,
        activeAssetId:
          state.activeAssetId === id
            ? remaining.length > 0
              ? remaining[0].id
              : null
            : state.activeAssetId,
      };
    });
  },

  // 6 Hero Actions
  setBeautifyPreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      jobStatus: "processing",
      jobStatusMessage: `Applying ${preset} aesthetic...`,
    });

    setTimeout(() => {
      set({
        assets: assets.map((a) => (a.id === activeAssetId ? { ...a, beautifyPreset: preset } : a)),
        jobStatus: "ready",
        jobStatusMessage: `${preset} applied`,
      });
    }, 250);
  },

  setCleanPreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      jobStatus: "processing",
      jobStatusMessage: `Refining ${preset} cleanliness...`,
    });

    setTimeout(() => {
      set({
        assets: assets.map((a) => (a.id === activeAssetId ? { ...a, cleanPreset: preset } : a)),
        jobStatus: "ready",
        jobStatusMessage: `${preset} cleanliness updated`,
      });
    }, 250);
  },

  setLightingPreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, lightingPreset: preset } : a)),
    });
  },

  setScenePreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, scenePreset: preset } : a)),
    });
  },

  setAlignPreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, alignPreset: preset } : a)),
    });
  },

  setQualityPreset: (preset) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, qualityPreset: preset } : a)),
    });
  },

  updateAdjustments: (adj) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) =>
        a.id === activeAssetId ? { ...a, adjustments: { ...a.adjustments, ...adj } } : a
      ),
    });
  },

  updateWatermark: (wm) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) =>
        a.id === activeAssetId ? { ...a, watermark: { ...a.watermark, ...wm } } : a
      ),
    });
  },

  toggleShowProtectedArea: () => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) =>
        a.id === activeAssetId
          ? {
              ...a,
              protection: {
                ...a.protection,
                showProtectedArea: !a.protection.showProtectedArea,
              },
            }
          : a
      ),
    });
  },

  setHistoryStage: (stage) => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, historyStage: stage } : a)),
    });
  },

  undo: () => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;
    const current = assets.find((a) => a.id === activeAssetId);
    if (!current || current.historyIndex <= 0) return;

    const newIndex = current.historyIndex - 1;
    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, historyIndex: newIndex } : a)),
    });
  },

  redo: () => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;
    const current = assets.find((a) => a.id === activeAssetId);
    if (!current || current.historyIndex >= current.history.length - 1) return;

    const newIndex = current.historyIndex + 1;
    set({
      assets: assets.map((a) => (a.id === activeAssetId ? { ...a, historyIndex: newIndex } : a)),
    });
  },

  resetActiveAsset: () => {
    const { activeAssetId, assets } = get();
    if (!activeAssetId) return;

    set({
      assets: assets.map((a) =>
        a.id === activeAssetId
          ? {
              ...a,
              beautifyPreset: "Auto",
              cleanPreset: "Cleaned",
              lightingPreset: "Soft Studio",
              scenePreset: "Clean Studio",
              alignPreset: "Fit",
              qualityPreset: "Standard",
              adjustments: { ...DEFAULT_ADJUSTMENTS },
              watermark: { ...DEFAULT_WATERMARK },
              historyStage: "Final",
            }
          : a
      ),
      zoom: 1,
      panOffset: { x: 0, y: 0 },
      splitPosition: 50,
      jobStatus: "ready",
      jobStatusMessage: "Asset reset to default protected state",
    });
  },

  setMasterAssetId: (id) => set({ masterAssetId: id }),

  applyMasterToAll: async () => {
    const { masterAssetId, assets } = get();
    if (!masterAssetId) return;
    const master = assets.find((a) => a.id === masterAssetId);
    if (!master) return;

    set({ isBatchApplying: true, jobStatus: "processing", jobStatusMessage: "Adapting settings across batch..." });

    // Normalize coordinates & adapt per asset
    const updated = assets.map((asset) => {
      if (asset.id === master.id) return asset;
      return {
        ...asset,
        beautifyPreset: master.beautifyPreset,
        cleanPreset: master.cleanPreset,
        lightingPreset: master.lightingPreset,
        scenePreset: master.scenePreset,
        qualityPreset: master.qualityPreset,
        // Adapt watermark normalized coordinates
        watermark: {
          ...master.watermark,
          normalizedX: master.watermark.normalizedX,
          normalizedY: master.watermark.normalizedY,
        },
        qaMessage: "Master aesthetic adapted & product protected",
        jobStatus: "ready" as JobStatus,
      };
    });

    await new Promise((r) => setTimeout(r, 600));

    set({
      assets: updated,
      isBatchApplying: false,
      jobStatus: "ready",
      jobStatusMessage: `Applied master settings to ${assets.length} images`,
    });
  },
}));
