import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { IImageDelete } from '../../../client/src//app/interfaces/image-delete';
import { ISVGImage } from '../../../client/src//app/interfaces/SVGImage';
import { ImageCloudService } from '../services/image-cloud/image-cloud.service';
import { ImageService } from '../services/image/image.service';
import Types from '../types';

const QUERY = 'q';

@injectable()
export class ImageController {

    public router: Router;
    public arrayImages: ISVGImage[] = [];
    public arrayImagesFilterReturn: ISVGImage[] = [];
    constructor(
        @inject(Types.ImageService) private imageService: ImageService,
        @inject(Types.ImageCloudService) private imageCloudService: ImageCloudService) {
            this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            const imageReceived: ISVGImage = req.body as ISVGImage;
            const id: string = this.imageService.generateId();
            this.imageService.addTag(req.body as ISVGImage);
            this.imageService.addImageMetaData(imageReceived);
            this.imageCloudService.uploadImageToCloud(imageReceived.image, id);
        });

        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            this.imageService.getImagesMetaData()
                .then((images: ISVGImage[]) => {
                    res.send(images);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/filter', (req: Request, res: Response, next: NextFunction) => {
            const joinedTags = req.query[QUERY] as string;
            const filtersToApply: string[] = joinedTags.split(';');
            const filteredImages = this.imageService.filterImage(filtersToApply);
            res.send(filteredImages);
        });

        this.router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
            res.send(Array.from(this.imageService.tags));
        });

        this.router.post('/delete', (req: Request, res: Response, next: NextFunction) => {
            const imageToDelete: IImageDelete = req.body as IImageDelete;
            this.imageService.deleteImage(imageToDelete.imageName);
        });

    }

}
