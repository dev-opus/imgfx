import { prisma } from '../config';
import type { UserPayload } from '../services/auth/schemas/request';

export class UserRepository {
  /**
   *
   * @description create a user record
   *
   */
  async create(payload: UserPayload) {
    const user = await prisma.users.create({ data: payload });
    return user;
  }

  /**
   *
   * @description retrieve a user record by their username
   *
   */
  async getByUsername(username: string) {
    const user = await prisma.users.findUnique({ where: { username } });
    return user;
  }
}
