import { ContentPack, SocialPlatform } from '../types/studio';

export class ContentPackExporter {
  private static sanitize(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Generates formatted text file containing all social post variations.
   */
  public static exportSocialCopyText(pack: ContentPack): void {
    const safeName = this.sanitize(pack.productName);
    const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'threads', 'zalo', 'marketplace'];

    let content = `====================================================\n`;
    content += `MÂY BEAUTY STUDIO — SOCIAL CONTENT PACK\n`;
    content += `Sản phẩm: ${pack.productName}\n`;
    content += `Ngày tạo: ${pack.createdAt}\n`;
    content += `====================================================\n\n`;

    for (const p of platforms) {
      const post = pack.posts[p];
      if (!post) continue;
      content += `----------------------------------------------------\n`;
      content += `[ ${p.toUpperCase()} POST ]\n`;
      content += `----------------------------------------------------\n`;
      content += `HOOK: ${post.hook}\n\n`;
      content += `CAPTION:\n${post.caption}\n\n`;
      content += `CTA: ${post.cta}\n\n`;
      if (post.hashtags && post.hashtags.length > 0) {
        content += `HASHTAGS: ${post.hashtags.join(' ')}\n\n`;
      }
      content += `SHORT VERSION:\n${post.shortVersion}\n\n\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `may_${safeName}_social_pack.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Triggers download of an image asset with clean semantic name.
   */
  public static exportVisualAsset(
    imgUrl: string,
    productName: string,
    type: 'hero' | 'highlight' | 'poster' | 'benefit' | 'promo' | 'quote',
    ratio: string = '4x5'
  ): void {
    const safeName = this.sanitize(productName);
    const cleanRatio = ratio.replace(':', 'x');
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `may_${safeName}_${type}_${cleanRatio}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
