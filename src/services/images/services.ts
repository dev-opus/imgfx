import { randomBytes } from 'crypto';
import { env, redis } from '../../config';
import { ImageRepository } from '../../repository';
import { Service, Publisher, APIException } from '../../lib';
import { TransformPayload, UploadPayload } from './schemas/request';

class Image extends Service {
  private redis: typeof redis;
  private publisher: Publisher;
  private imageRepo: ImageRepository;

  constructor(sn: string) {
    super(sn);
    this.redis = redis;
    this.imageRepo = new ImageRepository();
    this.publisher = new Publisher('publisher');
  }

  /**
   *
   * @description Create image record
   *
   */
  async upload(params: { userId: number; payload: UploadPayload }) {
    const { userId, payload } = params;

    const duplicate = await this.imageRepo.getImageByUrl(
      env.cloudfare_r2.bucket_url + payload.name
    );

    if (duplicate) {
      throw new APIException('duplicate uploads not allowed', 400);
    }

    await this.publisher.upload({
      payload,
      userId,
    });

    const key = randomBytes(4).toString('hex');
    await this.redis.setEx(key + ':' + userId, 180, payload.name);
    await this.redis.setEx(userId + ':regkey', 84600, key);

    this.log('queue image upload', { userId });
    return { key };
  }

  /**
   *
   * @description Get images
   *
   */
  async getImages(params: {
    userId: number;
    skip?: number | string;
    take?: number | string;
  }) {
    const { userId } = params;

    const images = await this.imageRepo.getImagesByUserId(userId);
    this.log('get images', { userId, images: images.length });

    return images;
  }

  /**
   *
   * @description Track the progress of uploads
   *
   */
  async uploadStatus(params: { userId: number; key: string }) {
    const { key, userId } = params;

    const uploadKey = key + ':' + userId;
    const regKey = await this.redis.get(userId + ':regkey');

    if (!regKey) {
      throw new APIException(
        'key not associated with any uploads in the last 24hrs',
        400
      );
    }

    const bucketKey = await this.redis.get(uploadKey);

    if (!bucketKey) {
      return 'key not found: upload must have completed';
    }

    const image = await this.imageRepo.getImageByKey(bucketKey);

    if (!image) {
      return 'uploading...';
    }

    await this.redis.del(uploadKey);
    return 'upload complete';
  }

  /**
   *
   * @description transform an image
   *
   */
  async transform(params: { userId: number; payload: TransformPayload }) {
    const { userId, payload } = params;
    const { transforms } = payload;

    if (Object.keys(transforms).length === 0) {
      throw new APIException(
        'need at least one transform operation to proceed',
        400
      );
    }

    const image = await this.imageRepo.getImageById(payload.id);

    if (!image) {
      throw new APIException('image not found', 404);
    }

    if (image.userId !== userId) {
      throw new APIException('cannot transform: inadequate permissions', 403);
    }

    await this.publisher.transform({
      imageName: image.bucketKey,
      userId,
      ...payload,
    });

    this.log('transformations have been queued', { userId, imageId: image.id });
  }

  /**
   *
   * @description get transformed images
   *
   */
  async getTransformedImages(params: {
    userId: number;
    skip?: number | string;
    take?: number | string;
  }) {
    const { userId } = params;

    const transformedImages = await this.imageRepo.getTransformedImages(userId);

    return transformedImages;
  }
}

export default new Image('image');
