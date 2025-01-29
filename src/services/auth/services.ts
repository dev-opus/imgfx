import { UserRepository } from '../../repository';
import type { UserPayload } from './schemas/request';
import { Service, APIException, AuthModule } from '../../lib';

class Auth extends Service {
  private userRepo: UserRepository;

  constructor(sn: string) {
    super(sn);

    this.userRepo = new UserRepository();
  }

  /**
   *
   * @description Signup a new user
   *
   */
  async signup(params: UserPayload) {
    const userExists = await this.userRepo.getByUsername(params.username);

    if (userExists) {
      throw new APIException('username taken', 400);
    }

    const hashed = await AuthModule.hashPassword(params.password);
    const user = await this.userRepo.create({ ...params, password: hashed });

    const jwt = await AuthModule.signJwt(user.id);
    const data = { ...user, jwt, password: null };

    this.log('user signup', { user: user.id });
    return data;
  }

  /**
   *
   *
   *
   */
  async signin(params: UserPayload) {
    const user = await this.userRepo.getByUsername(params.username);

    if (!user) {
      throw new APIException('user does not exist', 400);
    }

    const passwordValid = await AuthModule.comparePassword(
      params.password,
      user.password
    );

    if (!passwordValid) {
      throw new APIException('wrong password or username', 401);
    }

    const jwt = await AuthModule.signJwt(user.id);
    const data = { ...user, jwt, password: null };

    this.log('user signin', { user: user.id });
    return data;
  }
}

export default new Auth('Authentication');
