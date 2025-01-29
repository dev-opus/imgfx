import { env } from './env';
import { createClient } from 'redis';
import { logger, Consumer } from '../lib';
import { S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const consumer = new Consumer('consumer');
export const prisma = new PrismaClient();
export const redis = createClient({ url: env.redis_uri });

export const s3Client = new S3Client({
  region: 'auto',
  endpoint: env.cloudfare_r2.endpoint,
  credentials: {
    accessKeyId: env.cloudfare_r2.access_id,
    secretAccessKey: env.cloudfare_r2.secret_key,
  },
});

export async function loadConnections() {
  redis
    .connect()
    .then(() => logger.log(env.log_level, 'redis connected'))
    .catch((error) => logger.warn('error connecting redis', error));

  prisma
    .$connect()
    .then(() => logger.log(env.log_level, 'prisma connected'))
    .catch((error) => logger.warn('error connecting prisma:', error));

  setTimeout(async () => {
    try {
      await consumer.transform();
      await consumer.upload();

      logger.log(env.log_level, 'rabbitmq consumers are listening');
    } catch (error) {
      logger.warn('error setting up rabbitmq consumers', error);
    }
  }, 2000);
}
