/**
 * Foma Render Engine - Core Parser
 * Gère l'extraction et le remplacement des variables {{ }}
 */

export class FomaParser {
  /**
   * Remplace les variables {{key}} par les valeurs du JSON fourni
   * @param template Le contenu du fichier .fre (HTML)
   * @param data Les données dynamiques (ex: { code: '1234' })
   */
  static parseVariables(template: string, data: Record<string, any>): string {
    // Regex pour détecter {{ variable }} ou {{variable}}
    const variableRegex = /\{\{\s*([\w.]+)\s*\}\}/g;

    return template.replace(variableRegex, (match, key) => {
      // On récupère la valeur dans l'objet data (supporte le nesting simple)
      const value = data[key];

      // Si la variable n'existe pas, on laisse le tag ou on met vide
      // Pour la sécurité (Fortress), on retourne une chaîne vide si undefined
      if (value === undefined) {
        console.warn(`[FomaRender] Warning: Variable "{{${key}}}" non trouvée.`);
        return ''; 
      }

      return String(value);
    });
  }

  /**
   * Nettoie le template des espaces inutiles pour optimiser le poids
   */
  static sanitize(template: string): string {
    return template.trim().replace(/\s+/g, ' ');
  }
}