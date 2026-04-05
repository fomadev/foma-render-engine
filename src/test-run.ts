import { FomaEngine } from './index.js';

const template = `
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Bonjour {{ name }} ! Bienvenue sur {{ platform }}.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

const html = FomaEngine.render(template, {
  data: { name: "Fordi", platform: "FomaBank" }
});

console.log(html);