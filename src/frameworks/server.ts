import express from 'express';
import cors from 'cors';
import { ENV, validateEnv } from '../config/env';
import router from './routes';

// Validate environment variables
validateEnv();

const app = express();
const PORT = ENV.PORT;

app.use(cors({
  origin: [ENV.FRONTEND_URL, 'https://campush-kit-hub.web.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Root route - Beautiful Status Page with Tom and Jerry
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stationery Hub API | Status</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --secondary: #a855f7;
                --bg: #0f172a;
                --card: rgba(30, 41, 59, 0.7);
            }
            body {
                margin: 0;
                font-family: 'Outfit', sans-serif;
                background: var(--bg);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                overflow: hidden;
            }
            .background {
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 40%);
                z-index: -1;
            }
            .card {
                background: var(--card);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 3rem;
                border-radius: 2rem;
                text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .logo {
                font-size: 4rem;
                margin-bottom: 1rem;
                display: block;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            h1 {
                margin: 0;
                font-size: 2rem;
                font-weight: 800;
                background: linear-gradient(to right, #818cf8, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                color: #94a3b8;
                margin: 1rem 0 2rem;
                font-size: 1.1rem;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                background: rgba(34, 197, 94, 0.1);
                color: #4ade80;
                padding: 0.5rem 1.5rem;
                border-radius: 100px;
                font-weight: 600;
                font-size: 0.9rem;
                border: 1px solid rgba(34, 197, 94, 0.2);
            }
            .dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                margin-right: 10px;
                box-shadow: 0 0 10px #22c55e;
            }
            .footer {
                margin-top: 3rem;
                font-size: 0.8rem;
                color: #475569;
            }
            .character-container {
                position: absolute;
                bottom: -20px;
                width: 100%;
                height: 100px;
                overflow: hidden;
                pointer-events: none;
            }
            .running-gif {
                height: 80px;
                position: absolute;
                animation: run 10s linear infinite;
            }
            @keyframes run {
                from { left: -150px; }
                to { left: 100%; }
            }
        </style>
    </head>
    <body>
        <div class="background"></div>
        <div class="card">
            <span class="logo">🚀</span>
            <h1>Stationery Hub</h1>
            <p>The backend API is healthy and serving requests from the cloud.</p>
            
            <div class="status-badge">
                <div class="dot"></div>
                SYSTEM ONLINE
            </div>

            <div class="character-container">
                <img src="https://media1.giphy.com/media/jyTk0vpfS0pyqkgpZu/giphy.gif" class="running-gif" alt="Tom and Jerry Running">
            </div>

            <div class="footer">
                Version 1.0.2 • Powered by Vercel & Supabase
            </div>
        </div>
    </body>
    </html>
  `);
});

// Main Router (prefixed with /api to match frontend)
app.use('/api', router);

// Only listen if not on Vercel or in Dev
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`🔗 Allowed Origin: ${ENV.FRONTEND_URL}`);
  });
}

// Export for Vercel
export default app;
