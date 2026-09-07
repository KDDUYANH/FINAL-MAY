import { 
  Asset, 
  EditRecipe, 
  BrandRecipe, 
  MasterRecipe, 
  BatchException, 
  SmartAnalysis,
  WatermarkPosition,
  AspectRatio 
} from '../types/studio';

export class RecipeEngine {
  /**
   * Generates conservative, premium "Make Professional" recipe based on product analysis.
   */
  public static createProfessionalRecipe(analysis?: SmartAnalysis): EditRecipe {
    const recommendedCrop: AspectRatio = analysis?.recommendedCrop || '4:5';
    
    return {
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
      aspectRatio: recommendedCrop,
      framePlacement: 'center',
      autoFrame: true,
      safeAreaMargin: 10,
      enhancePreset: 'auto',
      outputResolution: '4k',
      preserveGeometry: true,
      protectLabels: true
    };
  }

  /**
   * Adapts a Master Recipe to a target asset non-destructively using normalized coordinates.
   */
  public static adaptRecipeToAsset(
    masterRecipe: MasterRecipe,
    targetAsset: Asset
  ): { recipe: EditRecipe; brand: BrandRecipe; exceptions: BatchException[] } {
    const master = masterRecipe.recipe;
    const masterBrand = masterRecipe.brand;
    const analysis = targetAsset.analysis;
    const exceptions: BatchException[] = [];

    // Clone base recipe
    const adaptedRecipe: EditRecipe = {
      ...master,
      // Adapt aspect ratio if target has specific optimal crop
      aspectRatio: master.aspectRatio,
      autoFrame: true
    };

    // Adapt brand & watermark settings using normalized geometry
    const adaptedBrand: BrandRecipe = {
      ...masterBrand,
      // Dynamically calculate safe placement based on target bounding box
      logoPosition: this.computeSafeLogoPosition(analysis?.boundingBox, masterBrand.logoPosition),
      watermarkPosition: this.computeSafeWatermarkPosition(analysis?.boundingBox, masterBrand.watermarkPosition)
    };

    // --- SMART EXCEPTION DETECTION ---
    
    // 1. Resolution Check
    const minDim = Math.min(targetAsset.width, targetAsset.height);
    if (minDim > 0 && minDim < 800) {
      exceptions.push({
        code: 'LOW_RESOLUTION',
        severity: 'warning',
        message: `Độ phân giải nguồn (${targetAsset.width}x${targetAsset.height}) thấp, có thể giảm độ sắc nét khi xuất 4K.`
      });
    }

    // 2. Edge Proximity Check
    if (analysis?.boundingBox) {
      const { x, y, width, height } = analysis.boundingBox;
      const marginX = Math.min(x, 1 - (x + width));
      const marginY = Math.min(y, 1 - (y + height));
      if (marginX < 0.05 || marginY < 0.05) {
        exceptions.push({
          code: 'EDGE_PROXIMITY',
          severity: 'warning',
          message: 'Sản phẩm nằm quá sát mép ảnh. Cần mở rộng lề an toàn (Safe Margin).'
        });
      }
    }

    // 3. Logo Overlap Risk
    if (adaptedBrand.logoEnabled && analysis?.boundingBox) {
      const isOverlap = this.checkPlacementOverlap(analysis.boundingBox, adaptedBrand.logoPosition);
      if (isOverlap) {
        exceptions.push({
          code: 'LOGO_OVERLAP',
          severity: 'warning',
          message: 'Vị trí logo có nguy cơ chạm vào viền sản phẩm. Đã tự động dịch chuyển ra vùng an toàn.'
        });
      }
    }

    // 4. Detection Confidence Check
    if (analysis && analysis.confidence < 0.85) {
      exceptions.push({
        code: 'LOW_CONFIDENCE',
        severity: 'warning',
        message: 'Độ tin cậy nhận diện sản phẩm dưới 85%. Vui lòng kiểm tra lại viền bao bì.'
      });
    }

    // 5. Composition Variance Check
    if (analysis && master.aspectRatio === '1:1' && analysis.orientation === 'portrait') {
      exceptions.push({
        code: 'COMPOSITION_MISMATCH',
        severity: 'warning',
        message: 'Ảnh mẫu là ảnh dọc nhưng Master Recipe đặt khung 1:1. Tự động căn chỉnh giữa.'
      });
    }

    return {
      recipe: adaptedRecipe,
      brand: adaptedBrand,
      exceptions
    };
  }

  private static computeSafeLogoPosition(
    boundingBox?: { x: number; y: number; width: number; height: number },
    desired: WatermarkPosition = 'bottom_right'
  ): WatermarkPosition {
    if (!boundingBox) return desired;
    // If product takes up bottom right, move to top left or top right
    if (boundingBox.x + boundingBox.width > 0.75 && boundingBox.y + boundingBox.height > 0.75) {
      return 'top_left';
    }
    return desired;
  }

  private static computeSafeWatermarkPosition(
    boundingBox?: { x: number; y: number; width: number; height: number },
    desired: WatermarkPosition = 'bottom_right'
  ): WatermarkPosition {
    if (!boundingBox) return desired;
    if (boundingBox.x + boundingBox.width > 0.8 && boundingBox.y + boundingBox.height > 0.8) {
      return 'bottom_left';
    }
    return desired;
  }

  private static checkPlacementOverlap(
    boundingBox: { x: number; y: number; width: number; height: number },
    position: WatermarkPosition
  ): boolean {
    switch (position) {
      case 'bottom_right':
        return boundingBox.x + boundingBox.width > 0.85 && boundingBox.y + boundingBox.height > 0.85;
      case 'bottom_left':
        return boundingBox.x < 0.15 && boundingBox.y + boundingBox.height > 0.85;
      case 'top_right':
        return boundingBox.x + boundingBox.width > 0.85 && boundingBox.y < 0.15;
      case 'top_left':
        return boundingBox.x < 0.15 && boundingBox.y < 0.15;
      case 'center':
        return true; // Overlaps center product
      default:
        return false;
    }
  }
}
