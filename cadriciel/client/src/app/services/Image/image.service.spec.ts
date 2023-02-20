import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { SvgManagerService } from '../svg-manager/svg-manager.service';
import { ImageService } from './image.service';

const dialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('ImageService', () => {
  const dummySVGElement: SVGElement = document.createElement('svg') as any;
  let service: ImageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [SvgManagerService, { provide: MatDialog, useValue:  dialogMock }],
    });

    service = TestBed.get(ImageService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('#alertChange should open drawing even when workspace has not been saved', () => {
    service['alreadySave'] = false;
    service['svgManager'].hasBeenModified = true;
    service['dialog'].open = jasmine.createSpy('open').and.returnValue({afterClosed: () => of(true)});

    spyOn<any>(service, 'openDrawing');
    service['alertChange']();
    expect(service['alreadySave']).toBeFalsy();
    expect(service['openDrawing']).toHaveBeenCalled();
  });
  it ('#alertChange should open the drawing if image has not been modified or has already been saved', () => {
    const newService: ImageService = TestBed.get(ImageService);
    newService['alreadySave'] = true;
    newService['svgManager'].hasBeenModified = false;
    spyOn<any>(newService, 'openDrawing');
    newService['alertChange']();
    expect(newService['openDrawing']).toHaveBeenCalled();
    expect(newService['alreadySave']).toBeFalsy();
  });
  it ('#alertChange should open the drawing if image has not been modified or has already been saved', () => {
    const newService: ImageService = TestBed.get(ImageService);
    newService['alreadySave'] = false;
    newService['svgManager'].hasBeenModified = true;
    newService['dialog'].open = jasmine.createSpy('open').and.returnValue({afterClosed: () => of(false)});
    spyOn<any>(newService, 'openDrawing');
    newService['alertChange']();
    expect(newService['openDrawing']).not.toHaveBeenCalled();
    expect(newService['alreadySave']).toBeFalsy();
  });

  it('#setLocalImageDimensions should set local Image dimensions', () => {
    service['svg'] = jasmine.createSpyObj('SVGElement', ['firstElementChild']);
    Object.defineProperty(service['svg'], 'firstElementChild', {value: dummySVGElement});
    Object.defineProperty(service['svg'].firstElementChild, 'getAttribute', {value: 'width'});
    service['setLocalImageDimension']();
    expect(service['validDimension']).toBeTruthy();
  });

  it('#setLocalImageDimensions should set local Image dimensions', () => {
    service['svg'] = jasmine.createSpyObj('SVGElement', ['firstElementChild']);
    Object.defineProperty(service['svg'], 'firstElementChild', {value: dummySVGElement});
    Object.defineProperty(service['svg'].firstElementChild, 'getAttribute', {value: 'width'});
    service['setLocalImageDimension']();
    expect(service['validDimension']).toBeTruthy();
  });
  it('#validateDimensions validate the new dimensions of drawing', () => {
    service['validDimension'] = true;
    service['svgElements'] = ['1', '2'] as any;
    spyOn<any>(service['svgManager'], 'createDrawing');
    spyOn<any>(service['svgManager'], 'addElement');
    service['svg'] = jasmine.createSpyObj('SVGElement', ['firstElementChild']);
    Object.defineProperty(service['svg'], 'firstElementChild', {value: dummySVGElement});
    Object.defineProperty(service['svg'].firstElementChild, 'getAttribute', {value: 'width'});
    service['validateDimension']();
    expect(service['svgManager'].createDrawing).toHaveBeenCalled();
    expect(service['svgManager'].addElement).toHaveBeenCalled();
  });
  it('#validateDimensions validate the new dimensions of drawing', () => {
    service['validDimension'] = true;
    service['svgElements'] = ['1', '2'] as any;
    spyOn<any>(service['svgManager'], 'createDrawing');
    spyOn<any>(service['svgManager'], 'addElement');
    service['svg'] = jasmine.createSpyObj('SVGElement', ['firstElementChild']);
    Object.defineProperty(service['svg'], 'firstElementChild', {value: dummySVGElement});
    Object.defineProperty(service['svg'].firstElementChild, 'getAttribute', {value: 'width'});
    service['validateDimension']();
    expect(service['svgManager'].createDrawing).toHaveBeenCalled();
    expect(service['svgManager'].addElement).toHaveBeenCalled();
  });
  it('#validateDimensions should sent an alert if drawing has not valid dimension', () => {
    service['validDimension'] = false;
    service['svgElements'] = [] as any;
    service['dialog'].open = jasmine.createSpy('open');
    spyOn<any>(service['svgManager'], 'createDrawing');
    spyOn<any>(service['svgManager'], 'addElement');
    service['validateDimension']();
    expect(service['svgManager'].createDrawing).not.toHaveBeenCalled();
    expect(service['svgManager'].addElement).not.toHaveBeenCalled();
  });
});
