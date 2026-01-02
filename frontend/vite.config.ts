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
        // Ensure proper chunk ordering - react-vendor must be available first
        // Vite/Rollup will automatically handle dependencies, but we ensure React loads first
        manualChunks: (id) => {
          // CRITICAL: All React-dependent packages must be in react-vendor chunk
          // to ensure React is available when they execute
          
          // React core
          if (id.includes('node_modules/react/') && !id.includes('react-dom') && !id.includes('react-router')) {
            return 'react-vendor';
          }
          
          // React-DOM
          if (id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          
          // @headlessui/react - React UI library
          if (id.includes('node_modules/@headlessui')) {
            return 'react-vendor';
          }
          
          // react-hot-toast - React toast library
          if (id.includes('node_modules/react-hot-toast')) {
            return 'react-vendor';
          }
          
          // @tanstack/react-query - React data fetching
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'react-vendor';
          }
          
          // react-hook-form - React form library
          if (id.includes('node_modules/react-hook-form')) {
            return 'react-vendor';
          }
          
          // react-i18next - React i18n
          if (id.includes('node_modules/react-i18next')) {
            return 'react-vendor';
          }
          
          // Icons don't need React, separate chunk
          if (id.includes('node_modules/@heroicons')) {
            return 'ui-vendor';
          }
          
          // react-leaflet depends on React, must be in react-vendor
          if (id.includes('node_modules/react-leaflet')) {
            return 'react-vendor';
          }
          
          // Leaflet core (no React dependency) can be separate and lazy loaded
          if (id.includes('node_modules/leaflet')) {
            return 'map-vendor';
          }
          
          // i18next core (not React-specific)
          if (id.includes('node_modules/i18next')) {
            return 'i18n-vendor';
          }
          
          // Zustand - may use React in some contexts, move to react-vendor to be safe
          // This ensures React is available if zustand's React middleware is used
          if (id.includes('node_modules/zustand')) {
            return 'react-vendor';
          }
          
          // use-sync-external-store and scheduler depend on React
          // They must be in react-vendor to ensure React is available
          if (id.includes('node_modules/use-sync-external-store') || 
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // @remix-run/router may use React hooks in some contexts
          if (id.includes('node_modules/@remix-run/router')) {
            return 'react-vendor';
          }
          
          // @tanstack/react-query core (not the React wrapper) may still use React
          // Move all @tanstack packages to react-vendor to be safe
          if (id.includes('node_modules/@tanstack')) {
            return 'react-vendor';
          }
          
          // Any package that imports React should be in react-vendor
          // Check if the file content suggests React usage (heuristic)
          // Since we can't easily check file content, we'll be more aggressive
          // and move common patterns to react-vendor
          
          // Other vendor code (ensure no React dependencies)
          // Only keep truly non-React packages here (axios, js-cookie, etc.)
          if (id.includes('node_modules')) {
            // Double check: if it's a known non-React package, put it in vendor
            // Otherwise, be conservative and put it in react-vendor
            const nonReactPackages = [
              'axios',
              'js-cookie',
              'i18next-browser-languagedetector',
            ];
            const isNonReact = nonReactPackages.some(pkg => id.includes(`node_modules/${pkg}`));
            return isNonReact ? 'vendor' : 'react-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild', // esbuild is faster than terser
    cssCodeSplit: true, // Split CSS chunks for better caching
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    // Ensure proper module resolution
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
})

