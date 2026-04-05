import Fastify from 'fastify';
import { FomaEngine, RenderOptions } from './index.js';

const fastify = Fastify({ logger: true });

interface RenderBody {
  template: string;
  options?: RenderOptions;
}

// Route principale pour le rendu
fastify.post('/render', async (request, reply) => {
  const { template, options } = request.body as RenderBody;

  if (!template) {
    return reply.status(400).send({ error: 'Template is required' });
  }

  try {
    const html = FomaEngine.render(template, options);
    return { html };
  } catch (error: any) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Rendering failed', message: error.message });
  }
});

// Lancement du serveur
const start = async () => {
  try {
    // 0.0.0.0 est crucial pour Docker
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("🚀 Foma Render API is running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();