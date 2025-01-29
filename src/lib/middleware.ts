import { AuthModule } from './auth';
import { Context, Next } from 'hono';
import { HTTPException, HTTPExceptionType } from './errors';
import { rateLimiter } from 'hono-rate-limiter';
import { randomUUID } from 'node:crypto';

// Auth
export async function authenticator(c: Context, next: Next) {
  const token = c.req.header('Authorization');

  if (!token) {
    throw new HTTPException(
      'No token set in Authorization header',
      401,
      HTTPExceptionType.a
    );
  }

  try {
    const validJwt = await AuthModule.verifyJwt(token);
    c.set('userId', validJwt.sub);

    await next();
  } catch (error: any) {
    throw new HTTPException('invlaid token', 401, HTTPExceptionType.a);
  }
}

// image validator
export async function imageValidator(c: Context, next: Next) {
  const body = await c.req.parseBody();

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg',
  ];

  const image = body['image'] as File;

  if (!image) {
    throw new HTTPException('image is required', 400, HTTPExceptionType.v);
  }

  if (image.size >= 5_242_880) {
    throw new HTTPException(
      'image size exceeds allowed limit: 5MB',
      413,
      HTTPExceptionType.v
    );
  }

  const validFormat = allowedTypes.includes(image.type);
  if (!validFormat) {
    throw new HTTPException(
      'image format not allowed',
      400,
      HTTPExceptionType.v
    );
  }

  await next();
}

// rate-limiter

export const transformRateLimiter = rateLimiter({
  windowMs: 12 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-6',
  keyGenerator: () => randomUUID(),
});
