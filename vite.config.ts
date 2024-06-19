import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/color-picker/',
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'ColorPicker',
      fileName: 'color-picker',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // manualChunks(id) {
        //   console.log(id);
        //   if (id.includes('ColorPicker')) {
        //     return 'color-picker';
        //   }
        // },
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
