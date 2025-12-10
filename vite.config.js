import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { visualizer } from 'rollup-plugin-visualizer';

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
    // Optional: Bundle analyzer (remove for production)
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
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
    include: ['react', 'react-dom', 'react-router-dom'], // Pre-bundle dependencies
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser', // or 'esbuild' for faster builds
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled', 'lucide-react'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'utils-vendor': ['axios', 'date-fns', 'lodash'],
        },
        // Cleaner chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000, // Increase from default 500KB
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
    host: true, // Listen on all addresses
  },
  preview: {
    port: 3001,
    host: true,
  },
});