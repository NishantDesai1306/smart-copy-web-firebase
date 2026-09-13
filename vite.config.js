import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const firebaseBackend =
  /^https:\/\/(?:(?:firestore|firebase|firebaseinstallations|identitytoolkit|securetoken|www|firebasestorage)\.googleapis\.com|(?:[^/]+\.)?(?:firebasestorage\.app|firebaseio\.com))\//;

const firebaseNetworkOnly = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
].map((method) => ({
  urlPattern: firebaseBackend,
  handler: 'NetworkOnly',
  method,
}));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'favicon.svg',
        'offline.html',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
      ],
      manifest: {
        name: 'Smart Copy',
        short_name: 'Smart Copy',
        description: 'Save, find, and copy the text you reuse.',
        theme_color: '#2457ff',
        background_color: '#f6f8fc',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/__/],
        additionalManifestEntries: [{ url: '/offline.html', revision: null }],
        runtimeCaching: firebaseNetworkOnly,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
    },
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
});
