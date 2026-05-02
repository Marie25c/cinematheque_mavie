import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.js',
    deps: {
      inline: [/react-router-dom/], // Force Vitest à utiliser une seule instance
    },
    testTimeout: 30000, // On passe à 30 secondes
    hookTimeout: 30000,
    poolOptions: {
      forks: {
        singleFork: true, // Évite de lancer trop de processus en même temps sur WSL
      },
    },
  },
})
