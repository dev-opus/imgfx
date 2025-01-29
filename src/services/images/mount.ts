import Image from './services';
import { hono } from '../../config';
import {
  getImages,
  getTransformedImages,
  transformImage,
  uploadImage,
  uploadStatus,
} from './routes';

export const imageRouter = hono();

imageRouter.openapi(uploadImage, async (c) => {
  const payload = c.req.valid('form');
  const userId = c.get('userId');

  const data = await Image.upload({ userId, payload });
  return c.json(
    {
      ok: true,
      msg: 'upload successfully queued.',
      data,
    },
    200
  );
});

imageRouter.openapi(uploadStatus, async (c) => {
  const userId = c.get('userId');
  const { key } = c.req.valid('param');

  const msg = await Image.uploadStatus({ userId, key });
  return c.json({ ok: true, msg }, 200);
});

imageRouter.openapi(getImages, async (c) => {
  const userId = c.get('userId');
  const { skip, take } = c.req.valid('query');

  const data = await Image.getImages({ userId, skip, take });
  return c.json({ ok: true, msg: 'successful', data }, 200);
});

imageRouter.openapi(transformImage, async (c) => {
  const userId = c.get('userId');
  const payload = c.req.valid('json');

  await Image.transform({ userId, payload });
  return c.json(
    { ok: true, msg: 'transformations have been successfully queued' },
    200
  );
});

imageRouter.openapi(getTransformedImages, async (c) => {
  const userId = c.get('userId');
  const { skip, take } = c.req.valid('query');

  const data = await Image.getTransformedImages({ userId, skip, take });
  return c.json({ ok: true, msg: 'successful', data }, 200);
});
