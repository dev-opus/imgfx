import { z } from '@hono/zod-openapi';

export const image = z
  .object({
    id: z.number(),
    userId: z.number(),
    bucketUrl: z.string(),
    bucketKey: z.string(),
    transformed: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi({
    example: {
      id: 1,
      userId: 1,
      bucketUrl: '',
      bucketKey: 'altair',
      transformed: false,
      createdAt: '2025-01-22T17:27:16.484Z',
      updatedAt: '2025-01-22T17:27:16.484Z',
    },
  });

export const upload = z
  .object({ key: z.string() })
  .openapi({ example: { key: 'a30b608c' } });

export const images = z.array(image);
export const transformedImages = z.array(
  image.omit({ userId: true, transformed: true })
);
