import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/dogs': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: false,
      },
      '/locations': {
        target: 'https://frontend-take-home-service.fetch.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});