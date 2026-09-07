import { 
  Asset, 
  ContentBrief, 
  ContentPack, 
  ProductTruth, 
  SocialPlatform, 
  SocialPost 
} from '../types/studio';
import { BRAND_CONFIG } from '../config/brand.config';

export class ContentEngine {
  /**
   * Extracts Product Truth as the authoritative source of factual claims.
   */
  public static extractProductTruth(asset: Asset): ProductTruth {
    const isSerum = asset.name.toLowerCase().includes('serum') || asset.name.toLowerCase().includes('mandelic');
    const isCream = asset.name.toLowerCase().includes('crème') || asset.name.toLowerCase().includes('cream');
    const isLipstick = asset.name.toLowerCase().includes('lipstick') || asset.name.toLowerCase().includes('son');

    if (isSerum) {
      return {
        productName: asset.name,
        brandName: BRAND_CONFIG.name,
        ingredients: ['25% Mandelic Acid (AHA dịu nhẹ)', 'Hyaluronic Acid đa tầng', 'Chiết xuất hoa cúc tự nhiên'],
        productType: 'Serum tái tạo da & làm sáng chuyên sâu',
        benefits: ['Tẩy tế bào chết vi mô dịu nhẹ', 'Cải thiện bề mặt da thô ráp', 'Làm sáng đều màu da không gây kích ứng'],
        usage: 'Sử dụng 2-3 giọt vào buổi tối sau bước toner, thoa đều và khóa ẩm.',
        size: '30ml / 1.0 fl oz',
        verifiedClaims: ['25% Mandelic Acid đạt chuẩn da liễu', 'Không chứa cồn khô và hương liệu nhân tạo', 'Phù hợp cả làn da nhạy cảm'],
        needsConfirmationClaims: ['Giảm mụn ẩn sau 7 ngày (Cần kiểm nghiệm lâm sàng)'],
        brandVoice: 'Khoa học, dịu dàng, Soft Luxury, tôn trọng làn da nguyên bản'
      };
    }

    if (isCream) {
      return {
        productName: asset.name,
        brandName: BRAND_CONFIG.name,
        ingredients: ['Peptide sinh học phục hồi', 'Ceramide NP', 'Hyaluronic 8D'],
        productType: 'Kem dưỡng ẩm phục hồi tế bào ban ngày',
        benefits: ['Căng bóng ngậm nước suốt 24 giờ', 'Củng cố hàng rào bảo vệ da', 'Làm mờ nếp nhăn mảnh'],
        usage: 'Thoa một lượng bằng hạt đậu vào mỗi buổi sáng sau serum.',
        size: '50ml / 1.7 oz',
        verifiedClaims: ['Kết cấu mỏng nhẹ thẩm thấu nhanh', 'Lớp finish bóng khỏe tự nhiên'],
        needsConfirmationClaims: ['Xóa mờ 90% nếp nhăn sau 2 tuần (Cần xác thực)'],
        brandVoice: 'Sang trọng, quý phái, nâng niu làn da'
      };
    }

    if (isLipstick) {
      return {
        productName: asset.name,
        brandName: BRAND_CONFIG.name,
        ingredients: ['Bơ hạt mỡ hữu cơ', 'Dầu Jojoba nguyên chất', 'Khoáng màu tự nhiên'],
        productType: 'Son thỏi lì nhung mạ vàng hồng',
        benefits: ['Mịn lì như cánh hoa hồng', 'Giữ ẩm không khô môi', 'Bền màu 8 giờ'],
        usage: 'Thoa trực tiếp lên môi từ lòng môi tán đều ra viền.',
        size: '3.8g',
        verifiedClaims: ['Vỏ son mạ vàng hồng kim loại cao cấp', 'Không chì độc hại'],
        needsConfirmationClaims: [],
        brandVoice: 'Quyến rũ, thời thượng, đẳng cấp'
      };
    }

    // Generic Cosmetic Asset
    return {
      productName: asset.name,
      brandName: BRAND_CONFIG.name,
      ingredients: ['Thành phần chiết xuất tự nhiên', 'Khoáng chất nuôi dưỡng da'],
      productType: 'Mỹ phẩm chăm sóc cao cấp',
      benefits: ['Dưỡng ẩm chuyên sâu', 'Nuôi dưỡng làn da sáng khỏe'],
      usage: 'Dùng hàng ngày theo chu trình dưỡng da.',
      size: 'Dung tích tiêu chuẩn',
      verifiedClaims: ['Sản xuất theo tiêu chuẩn chất lượng cao'],
      needsConfirmationClaims: [],
      brandVoice: 'Thanh lịch, hiện đại, tin cậy'
    };
  }

  /**
   * Generates tailored social posts for all platforms based on Product Truth and Content Brief.
   */
  public static generateSocialPosts(
    asset: Asset,
    truth: ProductTruth,
    brief: ContentBrief
  ): Record<SocialPlatform, SocialPost> {
    const title = brief.title || truth.productName;
    const keyBenefit = truth.benefits[0] || 'Làn da mịn màng rạng rỡ';
    const ingredientHighlight = truth.ingredients[0] || 'Thành phần chọn lọc';

    // 1. INSTAGRAM (Aesthetic, hook-driven, spaced, luxury)
    const instagram: SocialPost = {
      platform: 'instagram',
      hook: `Làn da mịn màng hơn mỗi ngày bắt đầu từ ${ingredientHighlight}.`,
      caption: `Từng giọt tinh túy của ${title} mang đến cảm giác thư thái và phục hồi diệu kỳ cho làn da bạn.\n\n✨ ${keyBenefit}\n🌿 Tối ưu với ${ingredientHighlight}\n💎 Giữ trọn vẻ đẹp tự nhiên, thanh khiết\n\nKhông cần thỏa hiệp giữa hiệu quả da liễu và sự dịu êm. Cùng MÂY nâng niu vẻ đẹp nguyên bản của bạn hôm nay.`,
      cta: 'Nhấn vào link bio để trải nghiệm chu trình chăm sóc chuẩn Soft Luxury.',
      hashtags: ['#MayBeauty', '#SkinCareRoutine', '#CleanLuxury', '#DuongDaChuyenSau', '#BeautyTruth'],
      shortVersion: `Khám phá ${title} — ${keyBenefit} từ ${BRAND_CONFIG.name}. Trải nghiệm ngay.`
    };

    // 2. FACEBOOK (Structured storytelling, educational, social proof)
    const facebook: SocialPost = {
      platform: 'facebook',
      hook: `Bí quyết sở hữu làn da mịn màng, căng bóng không còn là điều bí mật.`,
      caption: `Chào bạn, bạn đã tìm được giải pháp nuôi dưỡng làn da thực sự dịu lành chưa?\n\nTại MÂY, chúng tôi tin rằng làn da đẹp nhất là làn da được lắng nghe và nuôi dưỡng đúng cách. Với ${title}, công thức chứa ${ingredientHighlight} giúp:\n\n1️⃣ ${truth.benefits[0] || 'Tái tạo bề mặt da mịn màng'}\n2️⃣ ${truth.benefits[1] || 'Cung cấp độ ẩm sâu không bết dính'}\n3️⃣ ${truth.benefits[2] || 'An toàn và lành tính cho mọi loại da'}\n\nĐược tạo ra với tiêu chuẩn: ${truth.verifiedClaims[0] || 'Chất lượng cao cấp'}.\n\nInbox cho MÂY để nhận tư vấn phác đồ phù hợp nhất với làn da của bạn ngay hôm nay!`,
      cta: 'Nhắn tin cho Fanpage MÂY Beauty để nhận ưu đãi ra mắt độc quyền.',
      hashtags: ['#MayCosmetics', '#ChămSócDa', '#DưỡngSángMịn', '#PhụcHồiDa'],
      shortVersion: `Trải nghiệm ${title} từ ${BRAND_CONFIG.name} — Giải pháp dịu lành cho làn da.`
    };

    // 3. TIKTOK (Fast hook, conversational script, high energy)
    const tiktok: SocialPost = {
      platform: 'tiktok',
      hook: `Dừng lại 3 giây nếu da bạn đang sần sùi và kém mịn!`,
      caption: `Ai bảo AHA là phải châm chích? Với ${title} từ nhà MÂY, công thức ${ingredientHighlight} dịu êm đến bất ngờ.\n\nThoa buổi tối, sáng dậy cảm nhận da mềm mịn như lụa. Bí quyết nằm ở cách chọn đúng hoạt chất cho da nhạy cảm nè cả nhà! 👇`,
      cta: 'Bấm ngay vào giỏ hàng góc trái màn hình nhận quà tặng kèm nhé!',
      hashtags: ['#tiktokbeauty', '#skincaretips', '#goclamdep', '#reviewmypham', '#maybeauty'],
      shortVersion: `Da mịn căng bóng với ${title}. Săn ngay tại giỏ hàng TikTok!`
    };

    // 4. THREADS (Intimate, thoughtful micro-blogging)
    const threads: SocialPost = {
      platform: 'threads',
      hook: `Có một sự thật về việc dưỡng da mà ít ai nói cho bạn biết...`,
      caption: `Da không cần quá nhiều bước cầu kỳ, da cần đúng hoạt chất và sự kiên nhẫn dịu lành.\n\nTừ ngày thêm ${title} vào routine, điều mình thích nhất là da cứ sáng mịn dần lên một cách rất tự nhiên. Không bong tróc, không ửng đỏ. Chỉ có cảm giác nhẹ tênh mỗi sớm mai thức dậy.`,
      cta: 'Bạn đã thử qua thành phần này chưa? Để lại comment cùng trò chuyện nhé.',
      hashtags: ['#skincarethoughts', '#maybeauty', '#dailyroutine'],
      shortVersion: `Dưỡng da tối giản nhưng hiệu quả cùng ${title}.`
    };

    // 5. ZALO (Professional customer care, direct consulting)
    const zalo: SocialPost = {
      platform: 'zalo',
      hook: `MÂY xin gửi thông tin chi tiết về sản phẩm ${title}`,
      caption: `Kính gửi Quý khách hàng,\n\nMÂY Beauty trân trọng giới thiệu dòng sản phẩm mới: ${title}.\n- Loại sản phẩm: ${truth.productType}\n- Thành phần chính: ${truth.ingredients.join(', ')}\n- Quy cách: ${truth.size}\n- Hướng dẫn dùng: ${truth.usage}\n\nSản phẩm cam kết chính hãng, đảm bảo 100% tiêu chuẩn an toàn cho làn da của Quý khách.`,
      cta: 'Quý khách vui lòng phản hồi tin nhắn này hoặc gọi hotline 0931 73 75 79 để được hỗ trợ đặt hàng ngay.',
      hashtags: [],
      shortVersion: `${title} - ${truth.productType}. Liên hệ 0931 73 75 79 để đặt hàng.`
    };

    // 6. MARKETPLACE (Feature-benefit list, specs, buyer reassurance)
    const marketplace: SocialPost = {
      platform: 'marketplace',
      hook: `[CHÍNH HÃNG] ${title} - ${truth.productType}`,
      caption: `THÔNG TIN SẢN PHẨM:\n- Tên sản phẩm: ${title}\n- Thương hiệu: ${BRAND_CONFIG.name} Beauty\n- Xuất xứ: Việt Nam (Công nghệ chuyển giao chuẩn quốc tế)\n- Dung tích: ${truth.size}\n\nCÔNG DỤNG NỔI BẬT:\n${truth.benefits.map((b) => `• ${b}`).join('\n')}\n\nCAM KẾT TỪ SHOP:\n✓ 100% Hàng chính hãng, date mới\n✓ Đổi trả miễn phí nếu có lỗi nhà sản xuất\n✓ Hỗ trợ tư vấn da liễu trọn đời`,
      cta: 'Bấm Mua Ngay để nhận mã giảm giá và miễn phí vận chuyển toàn quốc.',
      hashtags: ['#chinhhang', '#freeship', '#myphamcaocap'],
      shortVersion: `${title} chính hãng - Mua ngay giao hàng hỏa tốc.`
    };

    return {
      instagram,
      facebook,
      tiktok,
      threads,
      zalo,
      marketplace
    };
  }

  /**
   * Applies single-click AI editing actions to text.
   */
  public static applyCopyAction(
    currentText: string,
    action: 'shorten' | 'clearer' | 'premium' | 'direct' | 'rewrite_cta'
  ): string {
    switch (action) {
      case 'shorten':
        return currentText
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .slice(0, 3)
          .join('\n');
      case 'clearer':
        return currentText
          .replace(/\s+/g, ' ')
          .replace(/([.?!])\s*/g, '$1\n\n')
          .trim();
      case 'premium':
        return `Nâng niu vẻ đẹp nguyên bản cùng biểu tượng sang trọng của MÂY.\n\n${currentText}\n\nTrải nghiệm đỉnh cao của sự dịu lành.`;
      case 'direct':
        return `Khám phá ngay: Hiệu quả rõ rệt trên làn da.\n${currentText.substring(0, 120)}...\nĐặt mua ngay hôm nay!`;
      case 'rewrite_cta':
        return 'Sở hữu ngay hôm nay để nhận trọn bộ quà tặng độc quyền từ MÂY.';
      default:
        return currentText;
    }
  }

  /**
   * Compiles complete 9-piece Content Pack.
   */
  public static createContentPack(
    asset: Asset,
    truth: ProductTruth,
    brief: ContentBrief
  ): ContentPack {
    const posts = this.generateSocialPosts(asset, truth, brief);

    return {
      id: `pack-${asset.id}-${Date.now()}`,
      productId: asset.id,
      productName: asset.name,
      heroVisualUrl: asset.afterImg || asset.beforeImg,
      highlightVisualUrl: asset.afterImg || asset.beforeImg,
      posterVisualUrl: asset.afterImg || asset.beforeImg,
      posts,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };
  }
}
