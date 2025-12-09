import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // Add this for proper JSX handling
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
      // Alias for Node.js core modules
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
        '.js': 'jsx', // Add this to enable JSX in .js files
      },
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});