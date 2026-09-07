import { MasterRecipe } from '../types/studio';

export const BRAND_CONFIG = {
  name: 'MÂY',
  fullName: 'MÂY IMAGE STUDIO',
  slogan: 'YOUR BEAUTY, OUR PROMISE',
  phone: '0931 73 75 79',
  version: 'v4.0 Production Master',
  
  colors: {
    roseGold: '#B76E79',
    deepRose: '#8C4752',
    blushSilk: '#FDE3E5',
    champagneGold: '#D4AF37',
    softGold: '#FFF2D6',
    bronzeGold: '#996E14',
    darkCocoa: '#2D1D1F',
    deepCharcoal: '#141012',
    surfaceLight: '#FAF5F2',
    surfaceBorder: '#EFE4DE',
    surfaceCard: '#FFFFFF',
    surfaceDarkCard: '#1C1618',
    surfaceDarkBorder: '#322427',
  },

  logos: [
    {
      id: 'vector_metallic',
      label: 'MÂY Metallic Vector Mark',
      type: 'vector',
      path: '',
      recommendedUsage: 'Watermarks, Overlays, Minimal branding'
    },
    {
      id: 'brand_mark_transparent',
      label: 'MÂY Gold Emblem (Transparent)',
      type: 'image',
      path: '/assets/brand/may_logo_mark.png',
      recommendedUsage: 'Header, Watermark, High-res export'
    },
    {
      id: 'brand_circle_seal',
      label: 'MÂY Luxury Circle Seal',
      type: 'image',
      path: '/assets/brand/may_logo_circle.png',
      recommendedUsage: 'Commercial seal, Premium packaging stamp'
    },
    {
      id: 'brand_full_lockup',
      label: 'MÂY Full Lockup (With Slogan & Phone)',
      type: 'image',
      path: '/assets/brand/may_logo_full_lockup.png',
      recommendedUsage: 'Poster hero, Marketing collateral, Social banner'
    },
    {
      id: 'brand_badge_textured',
      label: 'MÂY Textured Badge',
      type: 'image',
      path: '/assets/brand/may_logo_badge.jpg',
      recommendedUsage: 'Embossed watermark, Security stamp'
    }
  ],

  defaultMasterRecipes: [
    {
      id: 'recipe-luxury-standard',
      name: 'Luxury Product Standard',
      description: 'Chuyên nghiệp, dịu mắt, làm sáng bao bì và bảo toàn 100% nhãn hoạt chất.',
      recipe: {
        cleanAuto: true,
        cleanIntensity: 'balanced',
        preservePackagingTexture: true,
        lightingPreset: 'soft_studio',
        exposure: 5,
        contrast: 8,
        highlights: -5,
        shadows: 12,
        temperature: 2,
        productSeparation: 35,
        shadowStrength: 40,
        scenePreset: 'silk',
        surfaceOpacity: 85,
        depthOfField: 30,
        reflectionStrength: 25,
        beautifyPreset: 'natural',
        skinSurfaceSmooth: 15,
        reflectionPolish: 20,
        aspectRatio: '4:5',
        framePlacement: 'center',
        autoFrame: true,
        safeAreaMargin: 10,
        enhancePreset: 'auto',
        outputResolution: '4k',
        preserveGeometry: true,
        protectLabels: true
      },
      brand: {
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
      },
      exportSettings: {
        format: 'png',
        quality: 'max',
        resolution: '4k'
      }
    },
    {
      id: 'recipe-clean-commercial',
      name: 'Clean Commercial White',
      description: 'Chuẩn sàn thương mại điện tử, nền trắng tinh khiết có bóng đổ tự nhiên.',
      recipe: {
        cleanAuto: true,
        cleanIntensity: 'strong',
        preservePackagingTexture: true,
        lightingPreset: 'clean_commercial',
        exposure: 10,
        contrast: 12,
        highlights: 0,
        shadows: 8,
        temperature: 0,
        productSeparation: 45,
        shadowStrength: 30,
        scenePreset: 'pure_white',
        surfaceOpacity: 100,
        depthOfField: 10,
        reflectionStrength: 15,
        beautifyPreset: 'clean',
        skinSurfaceSmooth: 20,
        reflectionPolish: 25,
        aspectRatio: '1:1',
        framePlacement: 'center',
        autoFrame: true,
        safeAreaMargin: 12,
        enhancePreset: 'sharpen',
        outputResolution: '4k',
        preserveGeometry: true,
        protectLabels: true
      },
      brand: {
        logoEnabled: false,
        logoAsset: 'brand_mark_transparent',
        logoSize: 20,
        logoOpacity: 80,
        logoPosition: 'top_left',
        logoSafeMargin: 8,
        smartPlacementAvoidProduct: true,
        watermarkEnabled: false,
        watermarkMode: 'subtle',
        watermarkOpacity: 15,
        watermarkScale: 30,
        watermarkRotation: 0,
        watermarkPosition: 'bottom_right',
        protectProductArea: true,
        applyToAllBatch: true
      },
      exportSettings: {
        format: 'jpg',
        quality: 'max',
        resolution: '4k'
      }
    }
  ] as MasterRecipe[]
};
