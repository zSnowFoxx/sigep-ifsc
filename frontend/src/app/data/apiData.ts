// Backend mockup (server/) — ainda atende apenas a consulta ao SIGAA.
// Antes: autenticação, dashboard e os demais cadastros (agora no backend real).
export const API_URL = "http://localhost:3002/api";

// Backend real (backend/). `npm run dev` usa o backend local; o build (deploy) usa o da Vercel.
// VITE_BACKEND_URL, se definida, substitui os dois.
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? "http://localhost:3001/api" : "https://sigep-ifsc.vercel.app/api");
