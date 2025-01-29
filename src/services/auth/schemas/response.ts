import { z } from '@hono/zod-openapi';

export const signup = z
  .object({
    id: z.number(),
    username: z.string(),
    password: z.null(),
    createdAt: z.string(),
    updatedAt: z.string(),
    jwt: z.string(),
  })
  .openapi({
    example: {
      id: 1,
      username: 'dxnwrt',
      password: null,
      createdAt: '2025-01-22T17:27:16.484Z',
      updatedAt: '2025-01-22T17:27:16.484Z',
      jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTczNzY1NDE0Mn0.zzCBd22vi1RT4V27P_hhLZakIsPSuvykktGuSJrC6qc',
    },
  });

export const signin = signup;
