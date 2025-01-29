import { logger } from './logger';
import { env, rabitMq } from '../config';
import { connect, Channel } from 'amqplib';

export class Service {
  private logger: typeof logger;

  constructor(sn: string) {
    this.logger = logger.child({ service: sn });
  }

  /**
   *
   * @description protected log method
   *
   */
  protected log(msg: string, load: any = {}) {
    this.logger.child({ load }).log({ level: env.log_level, message: msg });
  }
}

export class RabbitMq {
  private logger: typeof logger;
  protected channel: Channel | null;

  constructor(cn: string) {
    this.channel = null;
    this.logger = logger.child({ 'rmq-class': cn });
  }

  /**
   *
   * @description set up channel and exchange
   *
   */
  protected async init() {
    const connection = await connect(rabitMq.host);
    this.channel = await connection.createChannel();

    await this.channel.assertExchange(
      rabitMq.exchangeName,
      rabitMq.exchangeType
    );
  }

  /**
   *
   * @description Internal logger
   *
   */
  protected log(msg: string, load?: any) {
    this.logger
      .child({ load: load ? load : {} })
      .log({ level: env.log_level, message: msg });
  }
}
