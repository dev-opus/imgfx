import { hono } from '../config';
import { authRouter } from './auth';
import { imageRouter } from './images';

export const services = hono();

services.route('/auth', authRouter);
services.route('/images', imageRouter);
