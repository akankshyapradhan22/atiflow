import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: ['universally-unrectangular-jaime.ngrok-free.dev'],
    
    hmr: {
      host: 'universally-unrectangular-jaime.ngrok-free.dev',
      protocol: 'wss',
      clientPort: 443,
    }
  },
})