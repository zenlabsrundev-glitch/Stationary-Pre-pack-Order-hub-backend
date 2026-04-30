import express from 'express';
import cors from 'cors';
import { ENV, validateEnv } from '../config/env';
import router from './routes';

// Validate environment variables
validateEnv();

const app = express();
const PORT = ENV.PORT;

app.use(cors({
  origin: [ENV.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Main Router
app.use(router);

// Only listen if not on Vercel or in Dev
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`🔗 Allowed Origin: ${ENV.FRONTEND_URL}`);
  });
}

// Export for Vercel
export default app;
