import { expect } from 'chai';
import { ISVGImage } from '../../../../client/src/app/interfaces/SVGImage';
import { container } from '../../inversify.config';
import Types from '../../types';
import { ImageService } from './image.service';

const service: ImageService = container.get<ImageService>(Types.ImageService);

describe.only('DataService', () => {
  const imageTest: ISVGImage = {image: '', imageName: '', imageTags: ['']};
  const imageBlabla: ISVGImage = {image: '', imageName: 'blabla', imageTags: ['yes', '']};
  const imageBloublou: ISVGImage = {image: '', imageName: 'bloublou', imageTags: ['', 'yack']};

  it ('#filterImage should not go in the else branche of not included ', () => {
    service.arrayImages = [imageTest, imageBlabla, imageBloublou];
    const tagFilter: string[] = ['', ''];
    service.filterImage(tagFilter);
    expect(service.filterImage).to.be.length(1);
  });

  it('#addTag should check length of the tag array', () => {
    service.addTag(imageBloublou);
    expect(service.tags).to.be.length(2);
  });
  it('#generate id should return a random id of size 9', () => {
    const teststring = service.generateId();
    expect(teststring).to.be.length(9);
    console.log('generate id : ', teststring);
  });

});
