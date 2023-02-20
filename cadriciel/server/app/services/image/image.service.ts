import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { ISVGImage } from '../../../../client/src/app/interfaces/SVGImage';

const DATABASE_URL = 'mongodb+srv://dbUser:test@cluster0-qwog6.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'polydessin';
const DATABASE_COLLECTION = 'images';
const FAILED_LOAD = 'Failed to delete course';
const TIME_SET_OUT = 3000;

@injectable()
export class ImageService {

  public collection: Collection<ISVGImage>;
  public arrayImages: ISVGImage[];
  public tags: Set<string>;
  private options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: TIME_SET_OUT,
    keepAlive: true,
  };

  constructor() {
    this.arrayImages = [];
    this.tags = new Set();
    MongoClient.connect(DATABASE_URL, this.options)
      .then((client: MongoClient) => {
        this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
      })
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  }

  public async addImageMetaData(image: ISVGImage): Promise<void> {
    this.collection.insertOne(image).catch((error: Error) => {
      throw error;
    });
  }

  public filterImage(tagFilter: string[]): ISVGImage[] {
    const imageFiltered: ISVGImage[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.arrayImages.length; j++) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < tagFilter.length; i++) {
        // tslint:disable-next-line: prefer-for-of
        for (let k = 0; k < this.arrayImages[j].imageTags.length; k++) {
          if (this.arrayImages[j].imageTags[k] === tagFilter[i]) {
            if (!imageFiltered.includes(this.arrayImages[j])) {
              imageFiltered.push(this.arrayImages[j]);
            }
          }
        }
      }
    }
    return imageFiltered;
  }

  public async getImagesMetaData(): Promise<ISVGImage[]> {
    return this.collection.find({}).toArray()
      .then((images: []) => {
        return images;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public addTag(svgImage: ISVGImage): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < svgImage.imageTags.length; i++) {
      this.tags.add(svgImage.imageTags[i]);
    }
  }

  public async deleteImage(imageNameToDelete: string): Promise<void> {
    return this.collection
      .findOneAndDelete({ imageName: imageNameToDelete })
      .then(() => {/**/ })
      .catch((error: Error) => {
        throw new Error(FAILED_LOAD);
      });
  }

  public generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

}
