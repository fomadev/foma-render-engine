import Fastify from 'fastify';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import juice from 'juice';
import { FomaEngine, RenderOptions } from './index.js';

const fastify = Fastify({ 
  logger: true 
});

/**
 * Interface pour la nouvelle route de fichiers .fre
 */
interface RenderFreBody {
  templateName: string; // ex: "otp" pour lire "templates/otp.fre"
  context: Record<string, any>; // ex: { code: "123456" }
}

/**
 * ROUTE 1 : POST /render-fre
 * Lit un fichier .fre sur le disque, injecte les données et inline le CSS
 */
fastify.post('/render-fre', async (request, reply) => {
  const { templateName, context } = request.body as RenderFreBody;

  if (!templateName) {
    return reply.status(400).send({ error: "Le nom du template est requis." });
  }

  try {
    // 1. Définition du chemin du fichier (dossier /templates à la racine du projet)
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.fre`);

    // Vérification de l'existence du fichier
    if (!existsSync(filePath)) {
      return reply.status(404).send({ 
        success: false, 
        message: `Template '${templateName}.fre' non trouvé dans le dossier /templates` 
      });
    }

    // 2. Lecture du contenu brut
    const rawContent = readFileSync(filePath, 'utf-8');

    // 3. Compilation Handlebars (remplace les {{ variables }})
    const template = Handlebars.compile(rawContent);
    const htmlWithData = template(context || {});

    // 4. Transformation Juice (Injecte <style> directement dans les balises HTML)
    const finalHtml = juice(htmlWithData);

    return { 
      success: true, 
      template: templateName,
      html: finalHtml 
    };

  } catch (error: any) {
    fastify.log.error(`[FRE Error]: ${error.message}`);
    return reply.status(500).send({ 
      success: false, 
      error: "Erreur lors du traitement du fichier .fre",
      message: error.message 
    });
  }
});

/**
 * ROUTE 2 : POST /render (Ton ancienne route MJML reste disponible)
 */
fastify.post('/render', async (request, reply) => {
  const { template, options } = request.body as any;
  if (!template) return reply.status(400).send({ error: 'Template requis' });

  try {
    const result = FomaEngine.render(template, options);
    return { success: true, html: result.html, mjmlErrors: result.errors };
  } catch (error: any) {
    return reply.status(500).send({ error: error.message });
  }
});

/**
 * ROUTE DE SANTÉ
 */
fastify.get('/', async () => {
  return { 
    status: 'Foma Render Engine Online', 
    version: '1.2.0',
    features: ['MJML Support', 'Handlebars Templates', 'Juice CSS Inlining']
  };
});

/**
 * LANCEMENT DU SERVEUR
 */
const start = async () => {
  try {
    await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0' 
    });
    console.log("🚀 Foma Engine avec Juice & Handlebars prêt sur port 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();