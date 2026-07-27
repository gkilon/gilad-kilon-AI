
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use any cast to satisfy TypeScript when accessing Node process methods in Vite config
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    base: '/',
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    build: {
      target: 'esnext',
      outDir: 'dist'
    }
  };
});
