import sharp from 'sharp';
import { ZodType } from 'zod';
import { z } from '@hono/zod-openapi';
import { Readable } from 'stream';

export function successResponse<TData extends ZodType>(
  data?: TData,
  msg: string = 'successful'
) {
  if (data) {
    return z.object({
      ok: z.boolean().openapi({ example: true }),
      msg: z.string().openapi({ example: msg }),
      data,
    });
  }

  return z.object({
    ok: z.boolean().openapi({ example: true }),
    msg: z.string().openapi({ example: msg }),
  });
}

const errorSchemas = {
  MalformedEntitySchema: z.object({
    ok: z.boolean().openapi({ example: false }),
    msg: z.string().openapi({ example: 'Malformed Entity' }),
    cause: z
      .array(z.object({ path: z.string(), message: z.string() }))
      .openapi({ example: [{ path: 'name', message: 'name is required' }] }),

    type: z.string().openapi({ example: 'ValidationError' }),
  }),

  BadAuthenticationSchema: z.object({
    ok: z.boolean().openapi({ example: false }),

    msg: z.string().openapi({
      example: 'Email or password wrong',
    }),

    type: z.string().openapi({ example: 'AuthenticationError' }).optional(),
  }),

  Generic4xxSchema: z.object({
    ok: z.boolean().openapi({ example: false }),
    msg: z.string().openapi({ example: 'Inadequate permissions' }),
  }),
};

function errorResponse<TData extends ZodType>(schema: TData) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description: 'error response',
  };
}

export const errorResponses = {
  422: errorResponse(errorSchemas.MalformedEntitySchema),

  400: errorResponse(errorSchemas.Generic4xxSchema),

  401: errorResponse(errorSchemas.BadAuthenticationSchema),

  403: errorResponse(errorSchemas.Generic4xxSchema),

  404: errorResponse(errorSchemas.Generic4xxSchema),

  413: errorResponse(errorSchemas.Generic4xxSchema),
};

export async function getMetadata(image: File | Buffer) {
  let imageBuffer;

  if (image instanceof File) {
    imageBuffer = Buffer.from(await image.arrayBuffer());
  } else {
    imageBuffer = image;
  }

  const metadata = await sharp(imageBuffer).metadata();
  return metadata;
}

export async function fileToBuffer(image: File) {
  const buffer = Buffer.from(await image.arrayBuffer());
  return buffer;
}

export async function streamToBuffer(stream: Readable) {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  const buffer = Buffer.concat(chunks);
  return buffer;
}
