import Fastify from 'fastify';
import { FomaEngine, RenderOptions } from './index.js';

const fastify = Fastify({ 
  logger: true 
});

/**
 * Interface pour le corps de la requête
 */
interface RenderBody {
  template: string;
  options?: RenderOptions;
}

// --- SÉCURITÉ (Préparation .env) ---
// Ce hook s'exécute avant chaque requête pour vérifier l'accès
fastify.addHook('preHandler', async (request, reply) => {
  const apiKey = request.headers['x-api-key'];
  const MASTER_KEY = process.env.RENDER_API_KEY || 'foma_debug_key'; 
  
  // Logique de protection (désactivée par défaut pour tes tests Postman)
  /*
  if (apiKey !== MASTER_KEY) {
    return reply.status(401).send({ error: 'Clé API invalide ou manquante' });
  }
  */
});

/**
 * ROUTE PRINCIPALE : POST /render
 * Transforme MJML + Handlebars en HTML final
 */
fastify.post('/render', async (request, reply) => {
  const { template, options } = request.body as RenderBody;

  // 1. Validation de l'entrée
  if (!template) {
    return reply.status(400).send({ 
      error: 'Le template est requis',
      message: 'Veuillez fournir un template MJML ou HTML dans le champ "template".'
    });
  }

  try {
    // 2. Pré-traitement : Enrobage MJML automatique si nécessaire
    let finalTemplate = template.trim();
    if (!finalTemplate.startsWith('<mjml>')) {
      finalTemplate = `<mjml><mj-body><mj-section><mj-column><mj-text>${template}</mj-text></mj-column></mj-section></mj-body></mjml>`;
    }

    // 3. Appel du moteur FomaEngine (Handlebars + MJML)
    const result = FomaEngine.render(finalTemplate, options);

    // 4. Réponse structurée
    return {
      success: result.success,
      html: result.html,
      mjmlErrors: result.errors // Liste des erreurs de syntaxe MJML
    };

  } catch (error: any) {
    fastify.log.error(`[Foma Server Error]: ${error.message}`);
    return reply.status(500).send({ 
      error: 'Erreur lors du rendu', 
      message: error.message 
    });
  }
});

/**
 * ROUTE DE SANTÉ : GET /
 */
fastify.get('/', async () => {
  return { 
    status: 'Foma Render Engine is Online', 
    version: '1.1.0',
    engine: 'Handlebars + MJML'
  };
});

/**
 * LANCEMENT DU SERVEUR
 */
const start = async () => {
  try {
    // Port 3000 et Host 0.0.0.0 (indispensable pour Docker et accès externe)
    const address = await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 Serveur Foma prêt sur ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();