import Fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import juice from 'juice';
import Handlebars from 'handlebars';

const fastify = Fastify({ 
  logger: true 
});

/**
 * Interface pour la requête de rendu
 * @example { "template": "otp", "data": { "code": "1234" } }
 */
interface RenderBody {
  template: string;
  data: Record<string, any>;
}

/**
 * ROUTE PRINCIPALE : POST /render
 * Gère le système de Layout + View (.fre)
 */
fastify.post('/render', async (request, reply) => {
  const { template, data } = request.body as RenderBody;

  // 1. Validation de sécurité élémentaire
  if (!template) {
    return reply.status(400).send({ 
      success: false, 
      error: "Le nom du template est requis (ex: 'otp')." 
    });
  }

  try {
    // 2. Définition des chemins
    const templatesDir = path.join(process.cwd(), 'templates');
    const layoutPath = path.join(templatesDir, 'layout.fre');
    const viewPath = path.join(templatesDir, `${template}.fre`);

    // 3. Vérification de l'existence des fichiers
    if (!fs.existsSync(layoutPath)) {
      throw new Error("Fichier 'layout.fre' manquant dans le dossier /templates.");
    }
    if (!fs.existsSync(viewPath)) {
      throw new Error(`Le template '${template}.fre' est introuvable.`);
    }

    // 4. Lecture des sources
    const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
    const viewSource = fs.readFileSync(viewPath, 'utf-8');

    // 5. Rendu de la "Vue" (le contenu spécifique)
    // On compile et on injecte les données dans la vue (ex: otp.fre)
    const viewHtml = Handlebars.compile(viewSource)(data || {});

    // 6. Insertion dans le Layout Global
    // On passe le résultat de la vue dans la variable 'body' du layout
    const fullHtml = Handlebars.compile(layoutSource)({
      ...data,
      body: viewHtml // Note : Dans layout.fre, utilise {{{body}}} (triple moustaches)
    });

    // 7. Transformation du CSS (Juice)
    // Transforme les <style> en attributs style="" pour la compatibilité Email
    const finalEmail = juice(fullHtml);

    return { 
      success: true, 
      html: finalEmail 
    };

  } catch (error: any) {
    fastify.log.error(`[Render Error]: ${error.message}`);
    return reply.status(500).send({ 
      success: false, 
      error: "Erreur de rendu .fre",
      message: error.message 
    });
  }
});

/**
 * ROUTE DE SANTÉ (HEALTH CHECK)
 */
fastify.get('/', async () => {
  return { 
    status: 'Foma Render Engine Online', 
    version: '1.3.0',
    mode: 'Layout/View System'
  };
});

/**
 * LANCEMENT DU SERVEUR
 */
const start = async () => {
  try {
    // Écoute sur 0.0.0.0 pour Docker
    await fastify.listen({ 
      port: 3000, 
      host: '0.0.0.0' 
    });
    console.log("🚀 Foma Engine (Layout Mode) prêt sur http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();