import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // Désactive le minify pour le moment pour mieux voir les erreurs si besoin
  // IMPORTANT : On dit à tsup de NE PAS toucher aux modules natifs de Node
  external: [
    'fastify', 
    'mjml', 
    'juice',
    'events',
    'util',
    'path',
    'url',
    'fs',
    'stream'
  ],
});