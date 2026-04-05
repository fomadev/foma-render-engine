import Fastify from 'fastify';
import { FomaEngine, RenderOptions } from './index.js';

const fastify = Fastify({ 
  logger: true // Garde le log pour voir les erreurs de rendu en console
});

/**
 * Interface pour le corps de la requête
 */
interface RenderBody {
  template: string;
  options?: RenderOptions;
}

/**
 * Route de rendu POST /render
 */
fastify.post('/render', async (request, reply) => {
  const { template, options } = request.body as RenderBody;

  // 1. Vérification de la présence du template
  if (!template) {
    return reply.status(400).send({ 
      error: 'Template is required',
      message: 'Le champ "template" est obligatoire dans le corps JSON.' 
    });
  }

  try {
    /**
     * ASTUCE : Si tu envoies juste du HTML simple comme <h1>...</h1>, 
     * MJML va planter. On peut vérifier si c'est du MJML valide.
     */
    let finalTemplate = template;
    if (!template.trim().startsWith('<mjml>')) {
      // Si ce n'est pas du MJML, on l'enrobe pour éviter l'erreur "Malformed MJML"
      // Ou tu peux décider de traiter le HTML différemment selon ta logique
      finalTemplate = `<mjml><mj-body><mj-section><mj-column><mj-text>${template}</mj-text></mj-column></mj-section></mj-body></mjml>`;
    }

    // 2. Exécution du moteur Foma
    const html = FomaEngine.render(finalTemplate, options);

    return { 
      success: true,
      html 
    };

  } catch (error: any) {
    fastify.log.error(`[Render Error]: ${error.message}`);
    
    return reply.status(500).send({ 
      error: 'Rendering failed', 
      message: error.message,
      hint: 'Assurez-vous que votre template est une structure MJML valide ou du texte brut.'
    });
  }
});

/**
 * Route de test (Health Check)
 */
fastify.get('/', async () => {
  return { status: 'Foma Render Engine is Online', version: '1.0.0' };
});

/**
 * Démarrage du serveur
 */
const start = async () => {
  try {
    // Port 3000 et Host 0.0.0.0 pour Docker
    await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0' 
    });
    
    console.log("🚀 Serveur Foma prêt sur http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();