import { createRoute, z } from '@hono/zod-openapi';
import * as ImageRequests from './schemas/request';
import * as ImageResponses from './schemas/response';
import {
  authenticator,
  errorResponses,
  imageValidator,
  successResponse,
  transformRateLimiter,
} from '../../lib';
import { skip } from 'node:test';

const TAG = 'Images';

export const uploadImage = createRoute({
  method: 'post',
  path: '/',

  middleware: [authenticator, imageValidator],

  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: ImageRequests.uploadImage,
        },
      },
    },
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(ImageResponses.upload),
        },
      },
      description: 'success response',
    },

    422: errorResponses[422],

    401: errorResponses[401],

    400: errorResponses[400],
  },

  tags: [TAG],
});

export const getImages = createRoute({
  method: 'get',
  path: '/',

  middleware: [authenticator],

  request: {
    query: z
      .object({
        skip: z.number().or(z.string()),
        take: z.number().or(z.string()),
      })
      .partial()
      .openapi({
        example: {
          skip: 0,
          take: 10,
        },
      }),
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(ImageResponses.images),
        },
      },
      description: 'success response',
    },

    401: errorResponses[401],
  },

  tags: [TAG],
});

export const transformImage = createRoute({
  method: 'post',
  path: '/transforms',

  middleware: [transformRateLimiter, authenticator],

  request: {
    body: {
      content: {
        'application/json': {
          schema: ImageRequests.transformImage,
        },
      },
    },
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(),
        },
      },
      description: 'success response',
    },

    400: errorResponses[400],

    401: errorResponses[401],

    403: errorResponses[403],

    404: errorResponses[404],

    422: errorResponses[422],
  },

  tags: [TAG],
});

export const getTransformedImages = createRoute({
  method: 'get',
  path: '/transforms',

  middleware: [authenticator],
  request: {
    query: z
      .object({
        skip: z.number().or(z.string()),
        take: z.number().or(z.string()),
      })
      .partial()
      .openapi({
        example: {
          skip: 0,
          take: 10,
        },
      }),
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(ImageResponses.transformedImages),
        },
      },
      description: 'success response',
    },

    400: errorResponses[400],

    401: errorResponses[401],

    403: errorResponses[403],
  },

  tags: [TAG],
});

export const uploadStatus = createRoute({
  method: 'get',
  path: '/status/{key}',

  middleware: [authenticator],

  request: {
    params: z
      .object({
        key: z.string(),
      })
      .openapi({
        param: {
          name: 'key',
          in: 'path',
        },
        example: {
          key: 'a30b608c',
        },
      }),
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(),
        },
      },
      description: 'success response',
    },

    400: errorResponses[400],
    401: errorResponses[401],
  },

  tags: [TAG],
});
