import { FomaEngine } from './index.js';

const myTemplate = `
<mjml>
  <mj-head>
    <mj-style>
      .primary-text { color: #2c3e50; font-weight: bold; }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text class="primary-text">
          Cher(e) {{ name }},
        </mj-text>
        <mj-text>
          Votre investissement de {{ amount }} FC pour le projet {{ project }} a été validé.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

const result = FomaEngine.render(myTemplate, {
  data: {
    name: "Fordi Malanda",
    amount: "500.000",
    project: "Dzoket Logistics"
  },
  css: ".primary-text { font-size: 20px; }" // Injection CSS supplémentaire
});

console.log("--- RESULTAT DU RENDU ---");
console.log(result);