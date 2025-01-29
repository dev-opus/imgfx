import { successResponse, errorResponses } from '../../lib';
import { createRoute } from '@hono/zod-openapi';
import * as UserRequests from './schemas/request';
import * as UserResponses from './schemas/response';

const TAG = 'Authentication/Authorization';

export const signup = createRoute({
  method: 'post',
  path: '/signup',

  request: {
    body: {
      content: {
        'application/json': {
          schema: UserRequests.signup,
        },
      },
      description: 'request body',
    },
  },

  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponse(UserResponses.signup),
        },
      },
      description: 'success response',
    },

    422: errorResponses[422],

    400: errorResponses[400],
  },

  tags: [TAG],
});

export const signin = createRoute({
  method: 'post',
  path: '/signin',

  request: {
    body: {
      content: {
        'application/json': {
          schema: UserRequests.signin,
        },
      },
      description: 'request body',
    },
  },

  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponse(UserResponses.signin),
        },
      },
      description: 'success response',
    },

    422: errorResponses[422],

    400: errorResponses[400],

    401: errorResponses[401],
  },

  tags: [TAG],
});
