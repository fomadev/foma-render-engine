import juice from 'juice';

export class FomaInliner {
  /**
   * Prend du HTML et du CSS et injecte le CSS directement dans les balises
   * C'est essentiel pour que les emails gardent leur style sur Gmail/Outlook
   */
  static inline(html: string, css?: string): string {
    if (!css) return juice(html);
    
    return juice.inlineContent(html, css, {
      applyAttributesTableElements: true,
      removeStyleTags: true
    });
  }
}