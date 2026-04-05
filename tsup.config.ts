import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // CommonJS pour NestJS, ESM pour le web
  dts: true,             // Génère les fichiers de types .d.ts
  splitting: false,
  sourcemap: true,
  clean: true,           // Nettoie le dossier dist avant chaque build
});