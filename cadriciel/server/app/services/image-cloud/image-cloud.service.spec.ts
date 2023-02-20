import { Request, Service } from 'aws-sdk';
import * as sinon from 'sinon';
import { container } from '../../inversify.config';
import Types from '../../types';
import { ImageCloudService } from './image-cloud.service';

const service: ImageCloudService = container.get<ImageCloudService>(Types.ImageCloudService);

describe.only('ImageCloudService', () => {
  it('#getFileFromCloud should be able to get the right object with no error', ()  => {
    const stub = sinon.stub(service.s3, 'getObject')
    .returns(new Request(new Service(), 'get'));

    service.getFileFromCloud('newKey');
    sinon.assert.calledOnce(stub);
  });

  it('#upload should correctly upload a new image', () => {
    const stub = sinon.stub(service.s3, 'upload')
    .returns(new Request(new Service(), 'upload'));

    service.uploadImageToCloud('newimage', 'newkey');

    sinon.assert.calledOnce(stub);
  });
});
