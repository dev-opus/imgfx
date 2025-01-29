import { prisma } from '../config';

export class ImageRepository {
  /**
   *
   * @description Create an Image record
   *
   */
  async create(params: {
    userId: number;
    bucketUrl: string;
    bucketKey: string;
  }) {
    const image = await prisma.images.create({ data: params });
    return image;
  }

  /**
   *
   * @description get image records based on userId
   *
   */
  async getImagesByUserId(
    userId: number,
    skip?: number | string,
    take?: number | string
  ) {
    const images = await prisma.images.findMany({
      where: { userId },
      skip: skip ? +skip : 0,
      take: take ? +take : 25,
    });

    return images;
  }

  /**
   *
   * @description get image record by its bucketUrl
   *
   */
  async getImageByUrl(bucketUrl: string) {
    const image = await prisma.images.findUnique({ where: { bucketUrl } });
    return image;
  }

  /**
   *
   * @description Get an image record by its ID
   *
   */
  async getImageById(id: number) {
    const image = await prisma.images.findUnique({ where: { id } });
    return image;
  }

  /**
   *
   * @description Get an image record by its key
   *
   */
  async getImageByKey(key: string) {
    const image = await prisma.images.findFirst({ where: { bucketKey: key } });
    return image;
  }

  /**
   *
   * @description Mark an image record as transformed
   *
   */
  async markAsTransformed(id: number) {
    const image = await prisma.images.update({
      where: { id },
      data: { transformed: true },
    });

    return image;
  }

  /**
   *
   * @description create record for transformed images
   *
   */
  async createTransformed(params: {
    imageId: number;
    name: string;
    bucketKey: string;
    bucketUrl: string;
  }) {
    const transformedImage = await prisma.transformeds.create({
      data: params,
    });
    return transformedImage;
  }

  /**
   *
   * @description get transformed images based on parent imageId
   *
   */
  async getTransformedImages(
    userId: number,
    skip?: number | string,
    take?: number | string
  ) {
    const transformedImages = await prisma.transformeds.findMany({
      where: { userId },
      skip: skip ? +skip : 0,
      take: take ? +take : 25,
      select: {
        id: true,
        name: false,
        bucketUrl: true,
        bucketKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return transformedImages;
  }
}
