import {Queue} from 'bullmq';
import {redisConnection} from '../config/redis';

export interface RegistrationJobData {
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
}

export const registrationQueue = new Queue<RegistrationJobData>(
  'registration',
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {type: 'exponential', delay: 1000},
      removeOnComplete: true,
      removeOnFail: false,
    },
  }
);
