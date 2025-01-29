import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException, HTTPExceptionType } from '../lib/errors.js';

/**
 *
 * @description Hono instance to be used across the app
 *
 */
export const hono = () => {
  const app = new OpenAPIHono({
    defaultHook(result) {
      if (!result.success) {
        throw new HTTPException(
          'Improperly formatted request',
          422,
          HTTPExceptionType.v,
          result.error.errors
        );
      }
    },
  });

  app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'apiKey',
    name: 'Authorization',
    in: 'header',
  });

  return app;
};
