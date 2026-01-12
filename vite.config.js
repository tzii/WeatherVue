import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
    base: '/WeatherVue/',
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'WeatherVue',
                short_name: 'WeatherVue',
                description: 'Award-winning weather application with immersive atmospheric design',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'weather-api-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 5 // 5 minutes
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'geocoding-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                            }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
            '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three'],
                    'd3': ['d3'],
                    'gsap': ['gsap'],
                    'vendor': ['vue', 'vue-router', 'pinia']
                }
            }
        }
    }
});
