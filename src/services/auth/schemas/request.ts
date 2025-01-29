import { z } from '@hono/zod-openapi';

/* Schemas */

export const signup = z
  .object({
    username: z.string().trim().toLowerCase(),
    password: z
      .string()
      .min(8)
      .refine((val) => {
        return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(val);
      }),
  })
  .openapi({
    example: {
      username: 'dxnwrt',
      password: 'zinin@Gt6',
    },
  });

export const signin = signup;

/* Payload */

export type UserPayload = z.infer<typeof signup>;
