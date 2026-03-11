import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './config/swagger';
import eventsRouter from './routes/events';
import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/api/health', (_req, res) => {
  res.json({data: {status: 'ok'}, success: true});
});

export default app;
