import bcryptjs from 'bcryptjs';
import { env } from '../config';
import { sign, verify } from 'hono/jwt';

export class AuthModule {
  /**
   *
   * @description hash a plain password
   *
   */
  static async hashPassword(plain: string) {
    const hashed = await bcryptjs.hash(plain, 10);
    return hashed;
  }

  /**
   *
   * @description compares a plain password and a hashed password
   *
   */
  static async comparePassword(plain: string, hashed: string) {
    const valid = await bcryptjs.compare(plain, hashed);
    return valid;
  }

  /**
   *
   * @description sign a jwt using a user's ID
   *
   */
  static async signJwt(sub: number) {
    const payload = { sub, exp: Math.floor(Date.now() / 1000) + 84600 };
    const jwt = await sign(payload, env.jwt_secret);

    return jwt;
  }

  /**
   *
   * @description verify a jwt
   *
   */
  static async verifyJwt(jwt: string) {
    const payload = await verify(jwt, env.jwt_secret);
    return payload;
  }
}
