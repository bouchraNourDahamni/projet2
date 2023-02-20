import { injectable } from 'inversify';

const BUCKET_NAME = 'imagesbucketpolydessin';
const LOCATION_CONSTRAINT = 'ca-central-1';
const AWS_CLOUD = 'aws-sdk';
const ENV = 'dotenv';
const EXTENSION = '.txt';
const ACL_PERMISSION = 'public-read';

@injectable()
export class ImageCloudService {

  public s3: any;
  public keyId: string;
  public secretKeyId: string;

  constructor() {
    this.cloud();
  }

  public cloud(): void {
    // tslint:disable-next-line: no-require-imports
    const aws = require(AWS_CLOUD);
    // tslint:disable-next-line: no-require-imports
    require(ENV).config();
    this.keyId = process.env.AWS_ACCESS_KEY_ID as string;
    this.secretKeyId = process.env.AWS_SECRET_ACCESS_KEY as string;
    this.s3 = new aws.S3({
      accessKeyId: this.keyId,
      secretAccessKey: this.secretKeyId,
    });
    const params = {
      Bucket: BUCKET_NAME,
      CreateBucketConfiguration: {
        LocationConstraint: LOCATION_CONSTRAINT,
      },
    };
    this.s3.createBucket(params, (err: Error, data: any) => {
      if (err) {
        console.error(err, err.stack);
      }
    });
  }

  public uploadImageToCloud(image: string, key: string): void {
    const keyWithExtension = key + EXTENSION;
    const params = {
      Bucket: BUCKET_NAME,
      Key: keyWithExtension,
      Body: image,
      ACL: ACL_PERMISSION,
    };

    this.s3.upload(params, (err: Error) => {
      if (err) {
        throw err;
      }
    });
  }

  public getFileFromCloud(key: string): void {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    this.s3.getObject(params, (err: Error) => {
      if (err) {
        throw err;
      }
    });
  }

}
