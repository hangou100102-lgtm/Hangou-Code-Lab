import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 纯静态博客，使用 hash 路由，base 用相对路径即可（部署到任意子路径都能用）
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
