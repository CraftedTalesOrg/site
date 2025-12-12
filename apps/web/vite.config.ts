import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [
    devtools(),
    // Only use cloudflare plugin for production builds
    mode === 'production'
    && cloudflare({
      viteEnvironment: { name: 'ssr' },
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    viteReact({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
  ].filter(Boolean),
}));
