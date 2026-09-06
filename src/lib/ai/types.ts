import { AnalysisRecommendation, ActiveTool } from "@/types/studio";

export interface AnalysisResult {
  hasProduct: boolean;
  confidence: number;
  imageQuality: "Good" | "Excellent" | "Fair";
  backgroundStatus: "Needs refinement" | "Clean" | "Studio";
  productBoundingBox?: { x: number; y: number; width: number; height: number };
  detectedLabels: string[];
  protectedRegionsCount: number;
  recommendation: AnalysisRecommendation;
}

export interface EnhancementParams {
  mode: "AUTO" | "BALANCED" | "PREMIUM";
  preset: string;
  backgroundPreset: string;
  lightingPreset: string;
  exposure?: number;
  contrast?: number;
  whiteBalance?: number;
  sharpness?: number;
}

export interface CompositingResult {
  enhancedImageUrl: string;
  maskImageUrl?: string;
  integrityConfidence: number;
  qaPassed: boolean;
  qaMessage: string;
}

export interface ImageAIProvider {
  name: string;
  isConfigured: boolean;
  analyzeProduct(imageUrl: string): Promise<AnalysisResult>;
  enhanceProduct(imageUrl: string, params: EnhancementParams): Promise<CompositingResult>;
}
