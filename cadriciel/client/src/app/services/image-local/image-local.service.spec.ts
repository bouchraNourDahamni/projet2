import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ImageService } from '../Image/image.service';
import { SvgManagerService } from '../svg-manager/svg-manager.service';
import { ImageLocalService } from './image-local.service';

const dialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('ImageLocalService', () => {

  let service: ImageLocalService;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [SvgManagerService, ImageService, { provide: MatDialog, useValue:  dialogMock },
        ],
    });

    service = TestBed.get(ImageLocalService);

  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#saveImage when ImageService is able to save the image locally', () => {
    service['imageService'].abilityToSaveImage = true;
    service['imageService'].image = '<svg></svg>';
    spyOn<any>(window.URL, 'createObjectURL').and.callThrough();
    service['saveImage']('test');
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(new Blob(['<svg></svg>'], { type: 'text' }));
  });
  it('#saveImage when ImageService is not able to save the image locally', () => {
    service['imageService'].abilityToSaveImage = false;
    spyOn<any>(window.URL, 'createObjectURL').and.callThrough();
    service['saveImage']('test');
    expect(window.URL.createObjectURL).not.toHaveBeenCalledWith();
  });
  it('#openImage should properly read from a file and alert the change', () => {
    service['fileContent'] = 'hello';
    spyOn<any>(service['imageService'], 'alertChange');
    service['openImage']();
    expect(service['imageService'].alertChange).toHaveBeenCalled();
  });
  it('#fileUploads when the uploaded file is not null', () => {
    spyOn<any>(service['fileReader'], 'readAsText');
    const file = new Blob(['<svg></svg>'], { type: 'text' }) as File;
    service['fileUploads'](file);
    expect(service['fileReader'].readAsText).toHaveBeenCalled();

  });
  it('#fileUploads when the uploaded file is null', () => {
    spyOn<any>(service['fileReader'], 'readAsText');
    const file = null as any;

    service['fileUploads'](file);
    expect(service['fileReader'].readAsText).not.toHaveBeenCalled();
  });
  it('#validImageContent should open the image if the image content is valid', () => {
    service['fileContent'] = '<svg></svg>';
    spyOn<any>(service['dialog'], 'open');
    spyOn<any>(service, 'openImage');
    service['validImageContent']();
    expect(service['validSvg']).toBeTruthy();
    expect(service['dialog'].open).not.toHaveBeenCalled();
    expect(service['openImage']).toHaveBeenCalled();
  });
  it('#validImageContent should not open the image if the image content is invalid', () => {
    service['fileContent'] = 'hello';
    spyOn<any>(service['dialog'], 'open');
    spyOn<any>(service, 'openImage');
    service['validImageContent']();
    expect(service['validSvg']).toBeFalsy();
    expect(service['dialog'].open).toHaveBeenCalled();
    expect(service['openImage']).not.toHaveBeenCalled();

  });
});
