import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT!),
  node_env: process.env.NODE_ENV!,
  redis_uri: process.env.REDIS_URI!,
  log_level: process.env.LOG_LEVEL!,
  jwt_secret: process.env.JWT_SECRET!,
  rabbitmq_host: process.env.RABBITMQ_HOST!,

  cloudfare_r2: {
    endpoint: process.env.R2_ENDPOINT!,
    access_id: process.env.R2_ACCESS_ID!,
    secret_key: process.env.R2_SECRET_KEY!,
    bucket_url: process.env.R2_BUCKET_URL!,
    bucket_name: process.env.R2_BUCKET_NAME!,
  },
};
