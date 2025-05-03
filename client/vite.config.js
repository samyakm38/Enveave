import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 👈 Add this line
  plugins: [react()],
});
