import express from 'express';
import cors from 'cors';
import { ENV, validateEnv } from '../config/env';
import router from './routes';

// Validate environment variables
validateEnv();

const app = express();
const PORT = ENV.PORT;

app.use(cors());
app.use(express.json());

// Main Router
app.use(router);

// Only listen if not on Vercel or in Dev
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
