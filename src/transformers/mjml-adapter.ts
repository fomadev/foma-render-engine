import mjml2html from 'mjml';

export class FomaMjmlAdapter {
  static compile(mjmlContent: string): string {
    const { html, errors } = mjml2html(mjmlContent, {
      minify: true,
      validationLevel: 'soft'
    });

    if (errors.length > 0) {
      console.warn('[FomaRender] MJML Warnings:', errors.map(e => e.message));
    }

    return html;
  }
}