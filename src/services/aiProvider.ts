import { Asset, EditRecipe, SmartAnalysis, AIJobState } from '../types/studio';

export type ProviderType = 'demo' | 'gemini' | 'fal' | 'replicate';

export interface AIProviderConfig {
  type: ProviderType;
  apiKey?: string;
  isDemoMode: boolean;
}

export interface AIJobStatusUpdate {
  state: AIJobState;
  progress: number; // 0 - 100
  message: string;
}

export interface ImageAIProvider {
  type: ProviderType;
  isDemoMode: boolean;
  
  analyzeProduct(
    asset: Asset,
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<SmartAnalysis>;

  makeProfessional(
    asset: Asset,
    recipe: EditRecipe,
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<{ enhancedUrl: string; protectedRegions: string[]; integrityScore: number }>;

  enhanceQuality(
    asset: Asset,
    resolution: '2k' | '4k',
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<{ enhancedUrl: string }>;
}

// Default Demo Provider implementation
export class DemoAIProvider implements ImageAIProvider {
  type: ProviderType = 'demo';
  isDemoMode = true;

  async analyzeProduct(
    asset: Asset,
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<SmartAnalysis> {
    const steps: AIJobStatusUpdate[] = [
      { state: 'queued', progress: 10, message: 'Đang chuẩn bị phân tích hình ảnh...' },
      { state: 'analyzing', progress: 35, message: 'Nhận diện sản phẩm & tính toán toạ độ bao bì...' },
      { state: 'protecting', progress: 70, message: 'Khoá vùng bảo vệ: Logo, Nhãn thành phần, Nắp chai...' },
      { state: 'qa', progress: 90, message: 'Đánh giá chất lượng ánh sáng và góc chụp...' },
      { state: 'completed', progress: 100, message: 'Phân tích hoàn tất! Khuyến nghị Make Professional sẵn sàng.' }
    ];

    for (const step of steps) {
      if (signal?.aborted) {
        throw new Error('Thao tác phân tích đã bị huỷ bởi người dùng.');
      }
      onProgress?.(step);
      await new Promise((r) => setTimeout(r, 220));
    }

    // Heuristics based on asset name or dimensions
    const isSquare = Math.abs(asset.width - asset.height) < 50;
    const isPortrait = asset.height > asset.width;

    return {
      productDetected: true,
      confidence: 0.985,
      boundingBox: {
        x: 0.22,
        y: 0.15,
        width: 0.56,
        height: 0.70
      },
      orientation: isSquare ? 'square' : isPortrait ? 'portrait' : 'landscape',
      imageQualityScore: 92,
      backgroundClutterScore: 24,
      lightingQuality: 'balanced',
      shadowsQuality: 'soft',
      labelRisk: 'safe',
      productEdgesIntact: true,
      transparencyIssues: false,
      recommendedCrop: '4:5',
      recommendedEnhancement: 'auto',
      recommendedComposition: 'center',
      summaryRecommendation: 'Sản phẩm có độ nét tốt. Khuyến nghị chuẩn hoá nền lụa satin Soft Studio và khoá bảo vệ nhãn in.'
    };
  }

  async makeProfessional(
    asset: Asset,
    _recipe: EditRecipe,
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<{ enhancedUrl: string; protectedRegions: string[]; integrityScore: number }> {
    const steps: AIJobStatusUpdate[] = [
      { state: 'queued', progress: 10, message: 'Chuẩn bị tiến trình xử lý...' },
      { state: 'analyzing', progress: 25, message: 'Định vị vùng sản phẩm & nhãn mác...' },
      { state: 'protecting', progress: 50, message: 'Khoá bất biến: Bao bì & typography...' },
      { state: 'processing', progress: 75, message: 'Tái tạo ánh sáng studio & nền sản phẩm...' },
      { state: 'qa', progress: 92, message: 'Kiểm duyệt tính toàn vẹn (Integrity QA)...' },
      { state: 'completed', progress: 100, message: 'Sản phẩm đã được nâng cấp thương mại hoàn hảo!' }
    ];

    for (const step of steps) {
      if (signal?.aborted) {
        throw new Error('Tiến trình Make Professional đã bị huỷ.');
      }
      onProgress?.(step);
      await new Promise((r) => setTimeout(r, 260));
    }

    return {
      enhancedUrl: asset.afterImg || asset.beforeImg,
      protectedRegions: [
        'Logo & Chữ in: Vector & typography locked',
        'Chi tiết bao bì: Thân chai & nắp kim loại',
        'Tỷ lệ quang học: Phản xạ và độ trong suốt thủy tinh'
      ],
      integrityScore: 100
    };
  }

  async enhanceQuality(
    asset: Asset,
    _resolution: '2k' | '4k',
    onProgress?: (update: AIJobStatusUpdate) => void,
    signal?: AbortSignal
  ): Promise<{ enhancedUrl: string }> {
    const steps: AIJobStatusUpdate[] = [
      { state: 'processing', progress: 40, message: 'Nâng cấp chi tiết bề mặt và độ nét cạnh...' },
      { state: 'qa', progress: 85, message: 'Khử răng cưa & bảo vệ chữ nhỏ trên nhãn...' },
      { state: 'completed', progress: 100, message: 'Nâng cấp độ phân giải thành công!' }
    ];

    for (const step of steps) {
      if (signal?.aborted) throw new Error('Hủy nâng cấp độ phân giải.');
      onProgress?.(step);
      await new Promise((r) => setTimeout(r, 200));
    }

    return { enhancedUrl: asset.afterImg || asset.beforeImg };
  }
}

// Provider Factory
export class AIProviderService {
  private static instance: AIProviderService;
  private currentProvider: ImageAIProvider;

  private constructor() {
    // Default to DemoAIProvider
    this.currentProvider = new DemoAIProvider();
  }

  public static getInstance(): AIProviderService {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  public getProvider(): ImageAIProvider {
    return this.currentProvider;
  }

  public setProvider(type: ProviderType, _apiKey?: string) {
    // When expanding to real Gemini/Fal/Replicate backends, inject here.
    if (type === 'demo') {
      this.currentProvider = new DemoAIProvider();
    } else {
      // In web demo environment without backend server keys, fallback safely to DemoAIProvider
      this.currentProvider = new DemoAIProvider();
    }
  }
}
