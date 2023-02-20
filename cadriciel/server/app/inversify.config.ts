import {Container} from 'inversify';
import {Application} from './app';
import {ImageController} from './controllers/image.controller';
import {Server} from './server';
import {ImageCloudService} from './services/image-cloud/image-cloud.service';
import {ImageService} from './services/image/image.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.ImageController).to(ImageController);
container.bind(Types.ImageService).to(ImageService);
container.bind(Types.ImageCloudService).to(ImageCloudService);

export {container};
