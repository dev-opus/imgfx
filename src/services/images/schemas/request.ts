import { z } from '@hono/zod-openapi';
const formats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

export const uploadImage = z.object({
  name: z.string().openapi({ example: 'altair' }),
  image: z.instanceof(File),
});

export const transformImage = z
  .object({
    id: z.number(),

    transforms: z
      .object({
        resize: z.object({
          width: z.number(),
          height: z.number(),
        }),

        crop: z.object({
          width: z.number(),
          height: z.number(),
          x: z.number(),
          y: z.number(),
        }),

        watermark: z.object({
          text: z.string(),
          x: z.number(),
          y: z.number(),
        }),

        rotate: z.number(),

        format: z.string().refine((val) => {
          return formats.includes(val);
        }),

        filter: z.enum(['greyscale', 'sepia']),
      })
      .partial(),
  })
  .openapi({
    example: {
      id: 1,
      transforms: {
        resize: {
          width: 250,
          height: 400,
        },

        crop: {
          width: 250,
          height: 400,
          x: 567,
          y: 400,
        },

        watermark: {
          text: 'i love imgfx',
          x: 78,
          y: 90,
        },

        rotate: 270,

        format: 'png',

        filter: 'greyscale',
      },
    },
  });

export type UploadPayload = z.infer<typeof uploadImage>;
export type TransformPayload = z.infer<typeof transformImage>;
