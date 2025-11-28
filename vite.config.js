import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'LOGOIPC.png'],
      
      // Hapus cache lama secara otomatis jika ada update baru
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true, // PENTING: Agar SW baru langsung aktif tanpa nunggu tutup browser

        runtimeCaching: [
          // 1. ATURAN UNTUK DATA (API SUPABASE & AUTH) -> WAJIB NETWORK FIRST
          // Artinya: Selalu cek internet dulu. Kalau ada sinyal, ambil data baru.
          // Kalau gak ada sinyal (offline), baru ambil cache lama.
          {
            urlPattern: ({ url }) => 
              url.href.includes('/rest/v1/') || 
              url.href.includes('/auth/v1/'),
            handler: 'NetworkFirst', 
            options: {
              cacheName: 'api-data-live',
              networkTimeoutSeconds: 3, // Tunggu 3 detik, kalau lemot baru pakai cache
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // Cuma simpan 1 jam biar gak basi datanya
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          // 2. ATURAN UNTUK GAMBAR -> CACHE FIRST
          // Artinya: Kalau gambar sudah pernah didownload, pakai yg di HP aja biar irit kuota.
          {
            urlPattern: ({ url }) => 
              url.href.includes('/storage/v1/object') || 
              url.href.includes('unsplash.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Simpan 30 Hari
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          }
        ],
      },

      manifest: {
        name: 'Informasi Pariwisata Cilacap',
        short_name: 'Wisata Cilacap',
        description: 'Panduan lengkap wisata dan kuliner di Kabupaten Cilacap',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        type: 'module',
      },
    }),
  ],
})