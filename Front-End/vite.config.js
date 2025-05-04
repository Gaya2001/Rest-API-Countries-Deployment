import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',  // Make the server accessible on all network interfaces
    port: 5173,
    allowedHosts: [
      'rest-api-countries-deployment-1.onrender.com',  // Allow this host
      'localhost', // Add localhost if needed for local development
      '127.0.0.1',  // Add localhost IP
      '44.226.145.213',
      '54.187.200.255'

    ]
  }
})
