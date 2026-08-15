import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'AWS Cloud Practitioner 学習アプリ',
        short_name: 'CLF-C02',
        description: 'AWS Certified Cloud Practitioner (CLF-C02) 試験対策学習アプリ',
        theme_color: '#1F3A68',
        background_color: '#1F3A68',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*firebaseio\.com\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'firebase-rtdb' },
          },
        ],
      },
    }),
  ],
})
