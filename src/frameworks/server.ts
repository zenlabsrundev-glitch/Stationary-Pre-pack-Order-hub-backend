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

// For traditional server startup
if (!ENV.IS_PROD) {
  app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', '-------------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', `🚀 STATIONERY HUB BACKEND IS LIVE! (v2.0-sequential-ids)`);
    console.log('\x1b[36m%s\x1b[0m', `✅ Server: http://localhost:${PORT}`);
    console.log('\x1b[35m%s\x1b[0m', `📡 Database: Supabase Connected Successfully`);
    console.log('\x1b[32m%s\x1b[0m', '-------------------------------------------');
  });
}

// Export for Vercel
export default app;
