import Fastify from 'fastify';
import { FomaEngine, RenderOptions } from './index.js';

// Initialisation de Fastify avec le logger activé pour le debug
const fastify = Fastify({ 
  logger: true 
});

// Interface pour typer le corps de la requête
interface RenderBody {
  template: string;
  options?: RenderOptions;
}

/**
 * Route POST /render
 * Reçoit un template .fre et des options, retourne le HTML rendu
 */
fastify.post('/render', async (request, reply) => {
  const { template, options } = request.body as RenderBody;

  // Validation basique
  if (!template) {
    return reply.status(400).send({ 
      error: 'Template is required',
      message: 'Veuillez fournir un template dans le corps de la requête.' 
    });
  }

  try {
    // Appel au moteur de rendu Foma
    const html = FomaEngine.render(template, options);
    return { html };
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ 
      error: 'Rendering failed', 
      message: error.message 
    });
  }
});

// Route de santé (utile pour Docker/Kubernetes)
fastify.get('/health', async () => {
  return { status: 'OK', engine: 'Foma Render' };
});

/**
 * Lancement du serveur
 */
const start = async () => {
  try {
    /**
     * TRÈS IMPORTANT : host: '0.0.0.0'
     * Sans cela, le serveur ne sera pas accessible depuis l'extérieur du conteneur Docker.
     */
    const port = 3000;
    const address = await fastify.listen({ 
      port: port, 
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 Foma Render API is running on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();