import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { IImageMetaData } from 'src/app/interfaces/image-metadata';
import { ISVGImage } from 'src/app/interfaces/SVGImage';
import { ImageService } from '../Image/image.service';
import { SvgManagerService } from '../svg-manager/svg-manager.service';
import { ImageServerService } from './image-server.service';

const dialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('ImageServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SvgManagerService,
                ImageService,
                HttpClientTestingModule,
      { provide: MatDialog, useValue:  dialogMock },
      {provide : HttpClient },
    ],
  }));

  it('imageServerService should be created', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    expect(service).toBeTruthy();
  });

  it('#resetImagesWithMetaData call pop on images array', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    const dummySvgImage: ISVGImage =  {image: 'haha', imageName: 'hoho' , imageTags: ['blou']};
    const images: ISVGImage[] = [dummySvgImage];
    spyOn<any>(images, 'pop').and.callThrough();
    service['resetImagesWithMetaData'](images);
    expect(images.pop).toHaveBeenCalled();
  });

  it('#resetImages call pop on images array', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    const dummySvgString =  'i am a string';
    const images: string[] = [dummySvgString];
    spyOn<any>(images, 'pop').and.callThrough();
    service['resetImages'](images);
    expect(images.pop).toHaveBeenCalled();
  });

  it('#sendImageToServer should call sendHTML if abilityToSaveImage is true', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    service['imageService'].abilityToSaveImage = false;
    spyOn<any>(service, 'sendHttpRequest');
    expect(service['sendHttpRequest']).not.toHaveBeenCalled();
  });

  it('#getImagesId', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    spyOn<any>(service, 'getImagesFromCloud');
    const imageMetaDummy: IImageMetaData = {imageName: 'fahgs', imageTags: ['sjdf'], id: 'dfdf'};
    const imageMetaDataServer: IImageMetaData[] = [imageMetaDummy, imageMetaDummy];
    Object.defineProperty(service, 'imageMetaDataServer', {value: imageMetaDataServer});
    service.getImagesId(imageMetaDataServer);
    expect(service['getImagesFromCloud']).toHaveBeenCalled();
  });
  it('#getArrayRendererIndex should return an index when bigger than length', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    service['indexIterration'] = 0;
    service.imagesReceived.length = 10;
    service['getArrayRendererIndex']();
    spyOn<any>(service, 'getArrayRendererIndex').and.returnValue(service['indexIterration']);
    expect(service['indexIterration']).toBe(8);
  });

  it('#getArrayRendererIndex should return an index when smaller than length', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    service['indexIterration'] = 0;
    service.imagesReceived.length = 5;
    service['getArrayRendererIndex']();
    spyOn<any>(service, 'getArrayRendererIndex').and.returnValue(service['indexIterration']);
    expect(service['indexIterration']).toBe(5);
  });

  it('#getArrayServerIndex should return an index when bigger than length', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    service['indexServer'] = 0;
    service.imagesReceived.length = 10;
    service['getArrayServerIndex']();
    spyOn<any>(service, 'getArrayServerIndex').and.returnValue(service['indexServer']);
    expect(service['indexServer']).toBe(2);
  });

  it('#getArrayServerIndex should return an index when smaller than length', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    service['indexServer'] = 0;
    service.imagesReceived.length = 5;
    service['getArrayServerIndex']();
    spyOn<any>(service, 'getArrayServerIndex').and.returnValue(service['indexServer']);
    expect(service['indexServer']).toBe(0);
  });

  it('#setImageToRenderer should call resetDrawings', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    spyOn<any>(service, 'resetDrawings');
    service['setImageToRenderer']();
    expect(service.resetDrawings).toHaveBeenCalled();
  });

  it('#rendererImagesServer should call resetDrawings and setImageToRenderer', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    spyOn<any>(service, 'resetDrawings');
    spyOn<any>(service, 'setImageToRenderer');
    service['rendererImagesServer']();
    expect(service.resetDrawings).toHaveBeenCalled();
    expect(service['setImageToRenderer']).toHaveBeenCalled();
  });

  it('#eightDrawingToRenderer shouldnot call pop function', () => {
    const service: ImageServerService = TestBed.get(ImageServerService);
    spyOn<any>(service['eightDrawingToRenderer'], 'pop').and.callThrough();
    service['eightDrawingToRenderer'].length = 11;
    service.resetDrawings();
    expect(service['eightDrawingToRenderer'].pop).toHaveBeenCalledTimes(6);
  });
});
