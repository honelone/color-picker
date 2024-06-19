import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default () => {
  const isPublish = process.argv.includes('publish');

  const build: any = {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  };
  if (isPublish) {
    build.lib = {
      entry: 'src/ColorPicker/index.ts',
      name: 'ColorPicker',
      fileName: 'color-picker',
      formats: ['es', 'umd'],
    };
  }

  return defineConfig({
    base: '/color-picker/',
    plugins: [vue(), isPublish ? cssInjectedByJsPlugin() : undefined],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build,
  });
};
