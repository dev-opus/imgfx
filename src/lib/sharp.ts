import sharp, { type Sharp } from 'sharp';

// Types //

type ResizeTransformProps = {
  width: number;
  height: number;
};

type CropTransformProps = ResizeTransformProps & {
  x: number;
  y: number;
};

type WatermarkTransformProps = Omit<CropTransformProps, 'width' | 'height'> & {
  text: string;
};

type RotateTransformProps = number | undefined;

type FormatTransformProps = string | undefined;

type FilterTransformProps = 'sepia' | 'greyscale' | undefined;

export type TransformKey =
  | 'crop'
  | 'resize'
  | 'rotate'
  | 'watermark'
  | 'filter'
  | 'format';

export type TransformerPayload =
  | ResizeTransformProps
  | CropTransformProps
  | WatermarkTransformProps
  | RotateTransformProps
  | FormatTransformProps
  | FilterTransformProps;

export class ImageTransformer {
  private image: Buffer;

  constructor(image: Buffer) {
    this.image = image;
  }

  /**
   *
   * @description Apply transformation
   *
   */
  async transform(params: { key: TransformKey; payload: TransformerPayload }) {
    const { key, payload } = params;

    switch (key) {
      case 'crop':
        await this.crop(payload as CropTransformProps);
        break;
      case 'resize':
        await this.resize(payload as ResizeTransformProps);
        break;
      case 'rotate':
        await this.rotate(payload as number);
        break;
      case 'watermark':
        await this.watermark(payload as WatermarkTransformProps);

        break;
      case 'format':
        await this.format(payload as string);
        break;
      case 'filter':
        if (payload === 'greyscale') {
          await this.greyscale();
        } else {
          await this.sepia();
        }
    }
  }

  /**
   *
   * @description return imageBuffer
   *
   */
  getImageBuffer() {
    return this.image;
  }

  /**
   *
   * @description get an image' metadata
   *
   */
  async getMetadata() {
    const metadata = await sharp(this.image).metadata();
    return metadata;
  }

  /**
   *
   *
   *
   */
  async imageToFile(path: string) {
    await sharp(this.image).toFile(path);
  }

  /**
   *
   * @description resize an image
   *
   */
  private async resize(params: ResizeTransformProps) {
    const { width, height } = await this.getMetadata();
    this.image = await sharp(this.image)
      .resize({
        width: params.width >= width! ? Math.floor(width! * 0.9) : params.width,
        height:
          params.height >= height! ? Math.floor(height! * 0.9) : params.height,
      })
      .toBuffer();
  }

  /**
   *
   * @description crop an image
   *
   */
  private async crop(params: CropTransformProps) {
    const { width, height } = await this.getMetadata();
    this.image = await sharp(this.image)
      .extract({
        left: params.x >= width! ? Math.floor(params.x! * 0.1) : params.x,
        top: params.y >= height! ? Math.floor(params.y! * 0.1) : params.y,
        width: params.width >= width! ? Math.floor(width! * 0.7) : params.width,
        height:
          params.height >= height! ? Math.floor(height! * 0.7) : params.height,
      })
      .toBuffer();
  }

  /**
   *
   * @description rotate an image
   *
   */
  private async rotate(degree: number) {
    this.image = await sharp(this.image).rotate(degree).toBuffer();
  }

  /**
   *
   * @description format an image
   *
   */
  private async format(format: string) {
    this.image = await sharp(this.image)
      .toFormat(format as keyof Sharp['toFormat'])
      .toBuffer();
  }

  /**
   *
   * @description greyscale an image
   *
   */
  private async greyscale() {
    this.image = await sharp(this.image).greyscale().toBuffer();
  }

  /**
   *
   * @description sepia an image
   *
   */
  private async sepia() {
    this.image = await sharp(this.image)
      .modulate({ brightness: 1, saturation: 0.5, hue: 45 })
      .toBuffer();
  }

  /**
   *
   * @description watermark an image
   *
   */
  private async watermark(params: WatermarkTransformProps) {
    const { x, y, text } = params;
    const { width, height } = await this.getMetadata();

    const svgText = `
   <svg width="${width}" height="${height}">
    <style>
      .title { fill: red; font-size: 2em}
    </style>
    <text x="45%" y="40%" text-anchor="middle" class="title">${text}</text>
  </svg>`;

    const svgBuffer = Buffer.from(svgText);

    this.image = await sharp(this.image)
      .composite([{ input: svgBuffer, top: y, left: x }])
      .toBuffer();
  }
}
