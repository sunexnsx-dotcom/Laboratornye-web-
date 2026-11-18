import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Форма регистрации отправляется в register.php.
// Во время разработки запросы к нему переадресуются на PHP-сервер (php -S localhost:8000).
export default defineConfig({
  // singlefile: сборка в один HTML-файл, который открывается без сервера
  plugins: [react(), viteSingleFile()],
  base: './',
  server: {
    open: true,
    proxy: { '/register.php': 'http://localhost:8000' }
  },
  preview: {
    proxy: { '/register.php': 'http://localhost:8000' }
  }
});
