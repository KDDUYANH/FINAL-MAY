import { ImageAIProvider, AnalysisResult, CompositingResult, EnhancementParams } from "./types";

export class DemoAIProvider implements ImageAIProvider {
  name = "Demo Provider (Local Mock)";
  isConfigured = true;

  async analyzeProduct(imageUrl: string): Promise<AnalysisResult> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      hasProduct: true,
      confidence: 0.98,
      imageQuality: "Good",
      backgroundStatus: "Needs refinement",
      productBoundingBox: { x: 0.25, y: 0.15, width: 0.5, height: 0.7 },
      detectedLabels: ["MÂY Cosmetics", "25% Mandelic Acid", "Active Serum"],
      protectedRegionsCount: 3,
      recommendation: {
        action: "ENHANCE",
        title: "Enhance Image",
        reason:
          "Improve studio lighting and background separation while preserving original product geometry & label text.",
        confidence: 0.96,
      },
    };
  }

  async enhanceProduct(imageUrl: string, params: EnhancementParams): Promise<CompositingResult> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      enhancedImageUrl: imageUrl,
      integrityConfidence: 0.99,
      qaPassed: true,
      qaMessage: "Product geometry & label text 100% protected (Protected Composite Pipeline)",
    };
  }
}

export function getAIProvider(): ImageAIProvider {
  return new DemoAIProvider();
}
