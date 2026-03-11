import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({data: {status: 'ok'}, success: true});
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
