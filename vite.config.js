import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteDevErrorForward from './vite-plugins/vite-dev-error-forward'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteDevErrorForward()],
});
