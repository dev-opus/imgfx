import Auth from './services';
import { hono } from '../../config';
import { signin, signup } from './routes';

export const authRouter = hono();

authRouter.openapi(signup, async (c) => {
  const payload = c.req.valid('json');

  const data = await Auth.signup(payload);
  return c.json({ ok: true, msg: 'signup successful', data }, 201);
});

authRouter.openapi(signin, async (c) => {
  const payload = c.req.valid('json');

  const data = await Auth.signin(payload);
  return c.json({ ok: true, msg: 'signin successful', data }, 200);
});
