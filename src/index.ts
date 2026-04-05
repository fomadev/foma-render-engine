import { FomaParser } from './core/parser.js';

export interface RenderOptions {
  data: Record<string, any>;
  minify?: boolean;
}

export class FomaRender {
  /**
   * La méthode principale qui sera appelée par Foma SE
   */
  static render(template: string, options: RenderOptions): string {
    let output = FomaParser.parseVariables(template, options.data);

    if (options.minify) {
      output = FomaParser.sanitize(output);
    }

    return output;
  }
}

export { FomaParser };