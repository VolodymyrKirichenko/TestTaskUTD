import {Worker, Job} from 'bullmq';
import {redisConnection} from '../config/redis';
import type {RegistrationJobData} from '../queues/registration.queue';

const simulateEmail = (data: RegistrationJobData): void => {
  console.log('────────────────────────────────────────');
  console.log('📧 Sending registration confirmation...');
  console.log(`   To:    ${data.fullName} <${data.email}>`);
  console.log(`   Phone: ${data.phone}`);
  console.log(`   Event: ${data.eventId}`);
  console.log('   Status: ✅ Email sent (simulated)');
  console.log('────────────────────────────────────────');
};

export const startRegistrationWorker = (): Worker<RegistrationJobData> => {
  const worker = new Worker<RegistrationJobData>(
    'registration',
    async (job: Job<RegistrationJobData>) => {
      console.log(
        `[Worker] Processing registration job ${job.id} (attempt ${job.attemptsMade + 1})`
      );
      simulateEmail(job.data);
    },
    {connection: redisConnection}
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(
      `[Worker] Job ${job?.id} failed (attempt ${job?.attemptsMade}): ${err.message}`
    );
  });

  console.log('[Worker] Registration worker started');
  return worker;
};
