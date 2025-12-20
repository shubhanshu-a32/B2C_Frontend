import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: [
      "fateful-locomotively-maximo.ngrok-free.dev",
    ],
    origin: 'http://localhost:5173'
  },
});
