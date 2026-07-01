import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'متابعة عروض المقاولات',
        short_name: 'عروض المقاولات',
        description: 'نظام متابعة عروض المقاولات والبناء',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        dir: 'rtl',
        lang: 'ar',
        display: 'standalone',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
})
