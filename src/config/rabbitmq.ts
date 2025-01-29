import { env } from './env';

export const rabitMq = {
  host: env.rabbitmq_host,
  queue: {
    upload: 'upload',
    transform: 'transform',
  },
  routingKey: {
    transform: 'images-tx',
    upload: 'image-upload',
  },

  exchangeType: 'direct',
  exchangeName: 'image-processor',
};
