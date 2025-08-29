// src/app.js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoints de salud (útiles para CI y debugging)
app.get('/', (_req, res) => res.status(200).json({ ok: true }));
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Adjunta tus rutas si existen (no falla si no están)
try {
  const m = await import('./routes/index.js');
  const router = m.default || m;
  if (router) app.use('/api', router);
} catch (e) {
  console.warn('[app] routes/index.js no encontrado; seguimos con / y /health');
}

// Evita efectos en CI (DB, colas, etc.)
if (!process.env.CI_SMOKE) {
  // Aquí iría tu inicialización real:
  // await connectDB();
  // initQueues();
}

export default app;
