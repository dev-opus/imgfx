import { rabitMq } from '../../config';
import { RabbitMq } from '../baseclasses';
import {
  TransformPayload,
  UploadPayload,
} from '../../services/images/schemas/request';
import { getMetadata } from '../utils';

export class Publisher extends RabbitMq {
  constructor(cn: string) {
    super(cn);
  }

  /**
   *
   * @description Publish a message to the channel
   *
   */
  async transform(params: {
    id: number;
    userId: number;
    imageName: string;
    transforms: TransformPayload['transforms'];
  }) {
    if (!this.channel) await this.init(); // only set up channel and exchange once

    const message = JSON.stringify(params);

    this.channel!.publish(
      rabitMq.exchangeName,
      rabitMq.routingKey.transform,
      Buffer.from(message)
    );

    this.log('published a transform job to the channel');
  }

  /**
   *
   * @description Publish an upload job
   *
   */
  async upload(params: { payload: UploadPayload; userId: number }) {
    if (!this.channel) await this.init(); // only set up channel and exchange once
    const { payload, userId } = params;
    const { format } = await getMetadata(payload.image);

    const imageBuffer = await payload.image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    const message = JSON.stringify({
      payload: { image: base64Image, name: payload.name },
      userId,
      format: format as string,
    });

    this.channel!.publish(
      rabitMq.exchangeName,
      rabitMq.routingKey.upload,
      Buffer.from(message)
    );

    this.log('published an upload job to the channel');
  }
}
