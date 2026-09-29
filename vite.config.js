import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: { host: '0.0.0.0', port: 8080, strictPort: true },
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home/index.html'),
        aiCrop: resolve(__dirname, 'ai-crop/index.html'),
        askExpert: resolve(__dirname, 'ask-expert/index.html'),
        schemes: resolve(__dirname, 'schemes/index.html'),
        community: resolve(__dirname, 'community/index.html'),
        profile: resolve(__dirname, 'profile/index.html'),
        auth: resolve(__dirname, 'auth/auth.html'),
        authIndex: resolve(__dirname, 'auth/index.html'),
      }
    }
  }
});

