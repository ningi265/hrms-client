import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'crypto', 'buffer', 'process', 'assert'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      http: 'stream-http',
      https: 'https-browserify',
      zlib: 'browserify-zlib',
      stream: 'stream-browserify',
      util: 'util',
      url: 'url',
      assert: 'assert',
      crypto: 'crypto-browserify',
      process: 'process/browser',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'globalThis',
      },
    },
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive vendor splitting
          if (id.includes('node_modules')) {
            // React & Core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-core';
            }
            
            // Firebase
            if (id.includes('firebase')) {
              if (id.includes('/auth/')) return 'firebase-auth';
              if (id.includes('/firestore/')) return 'firebase-firestore';
              if (id.includes('/app/')) return 'firebase-app';
              return 'firebase-other';
            }
            
            // MUI
            if (id.includes('@mui/material')) {
              return 'mui-material';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('@emotion')) {
              return 'emotion';
            }
            
            // Icons
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }
            
            // Utilities
            if (id.includes('axios')) {
              return 'axios';
            }
            if (id.includes('date-fns')) {
              return 'date-fns';
            }
            if (id.includes('lodash')) {
              return 'lodash';
            }
            
            // Visualization/Canvas
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            if (id.includes('purify.es')) {
              return 'purify';
            }
            
            // Split remaining node_modules by first directory
            const match = id.match(/node_modules\/([^\/]+)/);
            if (match) {
              const packageName = match[1];
              // Group small packages together
              if (['uuid', 'nanoid', 'qs', 'classnames'].includes(packageName)) {
                return 'utils-small';
              }
              return `vendor-${packageName}`;
            }
          }
          
          // Application code splitting
          if (id.includes('/src/pages/')) {
            // Extract page name
            const match = id.match(/src\/pages\/([^\/]+)/);
            if (match) {
              const pageName = match[1];
              // Group related pages
              if (pageName.includes('dashboard')) {
                if (id.includes('/requisitions/manage/')) {
                  return 'page-requisitions-manage';
                }
                if (id.includes('/requisitions/')) {
                  return 'page-requisitions';
                }
                return 'page-dashboard';
              }
              return `page-${pageName}`;
            }
          }
          
          // Components
          if (id.includes('/src/components/')) {
            return 'components';
          }
          
          // Context/State
          if (id.includes('/src/authcontext/') || id.includes('/src/context/')) {
            return 'context';
          }
          
          // Utils/helpers
          if (id.includes('/src/utils/') || id.includes('/src/helpers/')) {
            return 'utils-app';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000, // Lower warning limit to catch more issues
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3001,
    host: true,
  },
});