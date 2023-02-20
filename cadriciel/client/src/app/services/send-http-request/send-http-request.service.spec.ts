import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { SendHttpRequest } from './send-http-request.service';

const matDialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('SendHttpRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendHttpRequest, {provide: MatDialog, useValue: matDialogMock}],
      imports: [HttpClientTestingModule],
    });
  });

  afterEach(inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('#fetchDrawing should check if get is being called',
   inject([HttpTestingController, SendHttpRequest],
     (httpMock: HttpTestingController, service: SendHttpRequest) => {
        service.fetchDrawing().subscribe((data) => {
         expect(data).toBeTruthy();
     });
        const req = httpMock.expectOne('http://localhost:3000/api/image');
        expect(req.request.method).toEqual('GET');
        req.flush({data: true});
   }));

  it('#getImageFromCloud should return get', () => {
    inject([HttpTestingController, SendHttpRequest],
      (httpMock: HttpTestingController, service: SendHttpRequest) => {
         service.getImageFromCloud('key').subscribe((data) => {
          expect(data).toBeTruthy();
      });
         const req = httpMock.expectOne('http://localhost:3000/api/image');
         expect(req.request.method).toEqual('GET');
         req.flush({data: true});
    });
  });

  it('#alertUser should send an alert', () => {
    const service: SendHttpRequest = TestBed.get(SendHttpRequest);
    spyOn<any>(service['dialog'], 'open');
    service['alertUser']();
    expect(service['dialog'].open).toHaveBeenCalled();
  });

  it('#sendHTML should send an alert', () => {
    const service: SendHttpRequest = TestBed.get(SendHttpRequest);
    const tagtest: string[] = ['test1', 'test2'];
    service['sendHTML']('testimage', 'nametest', tagtest);
    expect(service['imageSvg'].image).toBe('testimage');
    expect(service['imageSvg'].imageName).toBe('nametest');
    expect(service['imageSvg'].imageTags).toEqual(tagtest);
  });

  it('#getTagList should return a list of image tags', () => {
    inject([HttpTestingController, SendHttpRequest],
      (httpMock: HttpTestingController, service: SendHttpRequest) => {
         service['getTagList']().subscribe((data) => {
          expect(data).toBeTruthy();
      });
         const req = httpMock.expectOne('http://localhost:3000/api/image');
         expect(req.request.method).toEqual('GET');
         req.flush({data: true});
    });
  });

  it('#deleteDrawing should set image name of the image to delete', () => {
    const service: SendHttpRequest = TestBed.get(SendHttpRequest);
    const imageName = 'slim';
    service['deleteDrawing'](imageName);
    expect(service.imageToDelete.imageName).toEqual(imageName);
  });

});
