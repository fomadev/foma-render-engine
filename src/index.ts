import mjml2html from 'mjml';
import Handlebars from 'handlebars';

/**
 * Options de rendu pour le moteur Foma
 */
export interface RenderOptions {
  /** Les données dynamiques à injecter (ex: { name: "Fordi" }) */
  context?: Record<string, any>; 
  /** Si vrai, le HTML de sortie sera minifié pour réduire le poids de l'email */
  minify?: boolean;
  /** Niveau de validation MJML ('soft', 'strict', ou 'skip') */
  validationLevel?: 'soft' | 'strict' | 'skip';
}

/**
 * FomaEngine - Le cœur du moteur de rendu
 * Gère la fusion des données (Handlebars) et la compilation d'email (MJML)
 */
export class FomaEngine {
  /**
   * Transforme un template .fre (MJML + Handlebars) en HTML pur compatible Outlook/Gmail
   * @param template La chaîne de caractères contenant le code MJML avec moustaches
   * @param options Configuration du rendu
   */
  static render(template: string, options: RenderOptions = {}) {
    try {
      // 1. Injection des données dynamiques avec Handlebars
      // On compile le template MJML brut pour y injecter le context
      const hbTemplate = Handlebars.compile(template);
      const mjmlWithData = hbTemplate(options.context || {});

      // 2. Transformation du MJML final en HTML pur
      // On utilise 'soft' par défaut pour éviter de bloquer le rendu en cas de petite erreur de syntaxe
      const result = mjml2html(mjmlWithData, {
        minify: options.minify ?? true,
        validationLevel: options.validationLevel ?? 'soft'
      });

      // 3. Retourne l'objet de résultat complet
      // On inclut les erreurs MJML pour faciliter le debugging
      return {
        html: result.html,
        errors: result.errors,
        success: result.errors.length === 0
      };

    } catch (error: any) {
      // Capture les erreurs de compilation Handlebars (ex: syntaxe {{ }} invalide)
      throw new Error(`[FomaEngine] Compilation failed: ${error.message}`);
    }
  }
}