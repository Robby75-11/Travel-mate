import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Tutte le richieste che iniziano con /auth, /hotel, /utenti, /viaggi, /prenotazioni
      // verranno reindirizzate a http://localhost:8080 (il tuo backend Spring Boot)
      "/auth": "http://localhost:8080",
      "/hotel": "http://localhost:8080",
      "/utenti": "http://localhost:8080",
      "/viaggi": "http://localhost:8080",
      "/prenotazioni": "http://localhost:8080",
      // Puoi aggiungere anche altri endpoint se ne hai, es:
      // '/api': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
    },
  },
});
