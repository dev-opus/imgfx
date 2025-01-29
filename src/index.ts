import { hono } from './config';
import { cors } from 'hono/cors';
import { services } from './services';
import { serve } from '@hono/node-server';
import { loadConnections, env } from './config';
import { logger as honoLogger } from 'hono/logger';
import { apiReference } from '@scalar/hono-api-reference';
import { logger, APIException, HTTPException } from './lib';
import type { UnofficialStatusCode } from 'hono/utils/http-status';
import { HTTPException as HonoHTTPException } from 'hono/http-exception';

const app = hono();

app.use(cors());
app.use(honoLogger());

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'imgfx',
    description: `<b>imgfx is RESTful API service for performing basic image transformations.
      imgfx is built with Node.js and the Hono 🔥 web framework</b>`,
  },
  servers: [
    { url: `http://localhost:${env.port}`, description: 'development server' },
  ],
});

app.get(
  '/ui',
  apiReference({
    theme: 'saturn',
    spec: { url: '/doc' },
  })
);

app.route('/api', services);

loadConnections().then(() => {
  try {
    serve({
      fetch: app.fetch,
      port: env.port,
    });

    logger.log(env.log_level, `serevr started on port: ${env.port}`);
  } catch (error) {
    logger.error('fatal error on startup:', error);
    process.exit(1);
  }
});

app.onError((err, c) => {
  logger.error(err);

  if (err instanceof HTTPException || err instanceof APIException) {
    const res = err.getResponse();
    return c.json({ ...res }, err.status as UnofficialStatusCode);
  }

  if (err instanceof HonoHTTPException) {
    return c.json(
      { ok: false, message: err.message, cause: err.cause },
      err.status
    );
  }

  return c.json({ msg: err.message, cause: err.cause }, 500);
});
