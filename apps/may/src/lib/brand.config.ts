export interface BrandConfig {
  name: string;
  tagline: string;
  contactPhone: string;
  logoUrl: string;
  logoSignUrl: string;
  colors: {
    rosegold: string;
    blush: string;
    surface: string;
    champagne: string;
    dark: string;
    muted: string;
  };
  availableLogos: {
    id: string;
    title: string;
    url: string;
  }[];
  sampleProducts: {
    id: string;
    title: string;
    url: string;
  }[];
}

export const MAY_BRAND_CONFIG: BrandConfig = {
  name: "MÂY",
  tagline: "YOUR BEAUTY, OUR PROMISE",
  contactPhone: "0931 73 75 79",
  logoUrl: "/assets/branding/may-logo.png",
  logoSignUrl: "/assets/branding/may-logo-sign.png",
  colors: {
    rosegold: "#B76E79",
    blush: "#FADCD9",
    surface: "#FDF7F7",
    champagne: "#FFF5EB",
    dark: "#2D1D1F",
    muted: "#7D6B6E",
  },
  availableLogos: [
    {
      id: "logo-full",
      title: "MÂY Full Signature Logo",
      url: "/assets/branding/may-logo.png",
    },
    {
      id: "logo-sign",
      title: "MÂY Symbol Mark",
      url: "/assets/branding/may-logo-sign.png",
    },
  ],
  sampleProducts: [
    {
      id: "sample-1",
      title: "MÂY Luxury Product Collection",
      url: "/assets/samples/magnific_bo-suu-tap-cac-san-pham-c_Cqq7rS2EEy.png",
    },
    {
      id: "sample-2",
      title: "MÂY High-end Beauty Serum",
      url: "/assets/samples/magnific_highend-beauty-cosmetics-_ovvrXzB829.png",
    },
    {
      id: "sample-3",
      title: "MÂY Minimalist Essence",
      url: "/assets/samples/magnific_minimalist-luxury-cosmeti_fHHUvDNCDY.png",
    },
    {
      id: "sample-4",
      title: "MÂY Premium Cosmetic Line",
      url: "/assets/samples/magnific_premium-cosmetic-products_LwwAxCuswO.png",
    },
  ],
};
