import { Readable } from 'stream';
import { logger } from '../logger';

import { Cloudfare } from '../cloudfare';
import { streamToBuffer } from '../utils';
import { RabbitMq } from '../baseclasses';
import { rabitMq, env } from '../../config';
import { ImageTransformer } from '../sharp';

import { ImageRepository } from '../../repository';
import { TransformPayload } from '../../services/images/schemas/request';

export class Consumer extends RabbitMq {
  private imageRepo: ImageRepository;
  constructor(cn: string) {
    super(cn);

    this.imageRepo = new ImageRepository();
  }

  /**
   *
   * @description create consumer for image upload jobs
   *
   */
  async upload() {
    if (!this.channel) await this.init();

    const q = await this.channel!.assertQueue(rabitMq.queue.upload);
    await this.channel!.bindQueue(
      q.queue,
      rabitMq.exchangeName,
      rabitMq.routingKey.upload
    );

    await this.channel!.consume(q.queue, async (msg) => {
      try {
        const { payload, userId, format } = JSON.parse(
          msg!.content.toString()
        ) as {
          payload: { name: string; image: string };
          userId: number;
          format: string;
        };

        const bucketUrl = await Cloudfare.upload({
          name: payload.name,
          format: format as string,
          image: Buffer.from(payload.image, 'base64'),
        });

        await this.imageRepo.create({
          userId,
          bucketUrl,
          bucketKey: payload.name,
        });

        this.log('image upload job completed', { image: payload.name });
        this.channel!.ack(msg!);
      } catch (error) {
        this.channel!.ack(msg!);
        this.log('error occured with the upload', error);
      }
    });
  }

  /**
   *
   * @description create consumer for image transformation jobs
   *
   */
  async transform() {
    if (!this.channel) await this.init();

    const q = await this.channel!.assertQueue(rabitMq.queue.transform);
    await this.channel!.bindQueue(
      q.queue,
      rabitMq.exchangeName,
      rabitMq.routingKey.transform
    );

    await this.channel!.consume(q.queue, async (msg) => {
      try {
        const { imageName, id, userId, transforms } = JSON.parse(
          msg!.content.toString()
        ) as TransformPayload & { imageName: string; userId: number };

        const orderedKeys = [
          'resize',
          'crop',
          'watermark',
          'filter',
          'format',
          'rotate',
        ] as const;

        // we want to apply transformations in a certain order, no matter how the user enters them
        let orderedTransforms = {} as typeof transforms;
        for (const key of orderedKeys) {
          const transform = transforms[key];
          if (transform) {
            orderedTransforms = {
              ...orderedTransforms,
              [key]: transform,
            };
          }
        }

        const r2Image = await Cloudfare.download(imageName);
        if (!r2Image) {
          logger.warn(
            'did not find image with key: ' + imageName + ' in the R2 storage'
          );

          return;
        }

        const r2ImageBuffer = await streamToBuffer(r2Image as Readable);
        const imageTransformer = new ImageTransformer(r2ImageBuffer);

        for (const [key, value] of Object.entries(orderedTransforms)) {
          await imageTransformer.transform({
            key: key as keyof typeof orderedTransforms,
            payload: value,
          });
        }

        const transformedImageBuffer = imageTransformer.getImageBuffer();
        const { format } = await imageTransformer.getMetadata();

        const transformedImageName =
          imageName + '_transformed_' + new Date().getTime();

        await Cloudfare.upload({
          format: format!,
          image: transformedImageBuffer,
          name: transformedImageName,
        });

        const imageRepoPromises = [
          this.imageRepo.markAsTransformed(id),
          this.imageRepo.createTransformed({
            imageId: id,
            name: transformedImageName,
            bucketKey: transformedImageName,
            bucketUrl: env.cloudfare_r2.bucket_url + transformedImageName,
          }),
        ];

        await Promise.all(imageRepoPromises);

        logger.log(
          env.log_level,
          `transformation operations for ${imageName} complete`
        );

        this.channel!.ack(msg!);
      } catch (error) {
        this.channel!.ack(msg!); // we don't want the consumer retrying the job after every server restart

        // log the error as this is out of the request/response lifecycle.
        // in a production-grade app, we'd have websockets or another form of bi-directional
        // connection in place with the client with which we'd inform them of the error
        this.log('error occured with transformation job', error);
      }
    });
  }
}
