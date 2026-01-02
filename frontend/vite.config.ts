import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor chunk (react, react-dom, react-router-dom)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunk
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          // Map library chunk (if not lazy loaded)
          'map-vendor': ['leaflet', 'react-leaflet'],
          // Form library chunk
          'form-vendor': ['react-hook-form'],
          // i18n chunk
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild', // esbuild is faster than terser
    // Note: To remove console.logs, you can use a plugin or do it via esbuild options
    // For now, using esbuild which is faster and provides good minification
  },
})

