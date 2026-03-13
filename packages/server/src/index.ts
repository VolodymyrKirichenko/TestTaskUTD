import app from './app';
import {startRegistrationWorker} from './workers/registration.worker';

const PORT = process.env.PORT || 4000;

let worker: ReturnType<typeof startRegistrationWorker> | null = null;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  if (process.env.REDIS_ENABLED === 'true') {
    try {
      worker = startRegistrationWorker();
    } catch {
      console.warn('Redis unavailable — Bull worker disabled');
    }
  }
});

const shutdown = async () => {
  if (worker) {
    await worker.close();
  }

  server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
