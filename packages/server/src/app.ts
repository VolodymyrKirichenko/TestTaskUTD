import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {swaggerSpec} from './config/swagger';
import eventsRouter from './routes/events';
import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));
app.get('/api/docs', (_req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Events API - Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: '/api/docs.json', dom_id: '#swagger-ui' });
  </script>
</body>
</html>`);
});

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
