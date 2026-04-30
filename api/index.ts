import app from '../src/frameworks/server';

// Direct health check for Vercel debugging
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Error handling middleware for unexpected crashes
app.use((err: any, req: any, res: any, next: any) => {
  console.error('SERVER CRASH:', err);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Check logs' 
  });
});

export default app;
