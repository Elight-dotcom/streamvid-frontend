import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: ['streamvid.com', 'aorta-wrongness-wifi.ngrok-free.dev'],
    port: 5173,
  },
  plugins: [react()],
})
