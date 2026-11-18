import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // singlefile: сборка в один HTML-файл, который открывается без сервера
  plugins: [react(), viteSingleFile()],
  base: './',
  server: { open: true }
});
