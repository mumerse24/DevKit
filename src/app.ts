import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'DevKit backend is online'
  });
});

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

export default app;
