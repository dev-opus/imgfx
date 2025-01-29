import { fileToBuffer } from './utils';
import { env, s3Client } from '../config';
import { UploadPayload } from '../services/images/schemas/request';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class Cloudfare {
  /**
   *
   * @description Upload an image to our bucket
   *
   */
  static async upload(params: {
    format: string;
    name: string;
    image: Buffer | File;
  }) {
    const { name, image, format } = params;

    let imageBuffer;
    if (image instanceof File) {
      imageBuffer = await fileToBuffer(image);
    } else {
      imageBuffer = image as Buffer;
    }

    const putCommand = new PutObjectCommand({
      Bucket: env.cloudfare_r2.bucket_name,
      Key: name,
      Body: imageBuffer,
      ContentType: `image/${format}`,
    });

    await s3Client.send(putCommand);
    const bucketUrl = env.cloudfare_r2.bucket_url + name;

    return bucketUrl;
  }

  /**
   *
   * @description Download an image from our bucket
   *
   */
  static async download(key: string) {
    const getCommand = new GetObjectCommand({
      Bucket: env.cloudfare_r2.bucket_name,
      Key: key,
    });

    const res = await s3Client.send(getCommand);
    return res.Body;
  }
}
