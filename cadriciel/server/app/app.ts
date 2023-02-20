import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import {inject, injectable} from 'inversify';
import * as logger from 'morgan';
import {ImageController} from './controllers/image.controller';
import Types from './types';

const LOGGER_CONFIG = 'dev';
const IMAGE_ROUTE = '/api/Image';
const NOTE_FOUND_ERROR = 'Not Found';
const APP_ENV = 'development';

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    constructor(@inject(Types.ImageController) private imageController: ImageController) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        this.app.use(logger(LOGGER_CONFIG));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        this.app.use(IMAGE_ROUTE, this.imageController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error(NOTE_FOUND_ERROR);
            next(err);
        });
        if (this.app.get('env') === APP_ENV) {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
