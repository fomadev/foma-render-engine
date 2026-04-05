import { FomaParser } from './core/parser.js';
import { FomaMjmlAdapter } from './transformers/mjml-adapter.js';
import juice from 'juice';

export interface RenderOptions {
  data?: Record<string, any>;
  css?: string;
  isMjml?: boolean;
}

export class FomaEngine {
  /**
   * La méthode ultime pour générer tes emails
   */
  static render(template: string, options: RenderOptions = {}): string {
    // 1. On remplace les variables {{ name }}
    let output = FomaParser.parse(template, options.data || {});

    // 2. Si c'est du MJML (recommandé pour Dzoket/FomaBank), on compile en HTML
    if (options.isMjml !== false) {
      output = FomaMjmlAdapter.compile(output);
    }

    // 3. On injecte le CSS en "inline" pour une compatibilité Gmail/Outlook parfaite
    if (options.css) {
      output = juice.inlineContent(output, options.css);
    }

    return output;
  }
}