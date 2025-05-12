import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/server.ts',
    'src/migrate.ts',
    'src/db/migrations/*.ts'
  ],
  format: ['cjs'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true
});
