import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { ColorBucketSvgService } from './color-bucket-svg.service';

describe('ColorBucketSvgService', () => {
  let rendererSpy: Renderer2;
  let service: ColorBucketSvgService;
  const dummyCoordA: ICoordinates = {x: 12, y: 5};
  const dummyCoordB: ICoordinates = {x: 3, y: 4};
  const dummyCoordArrayA = [dummyCoordA, dummyCoordB];
  const dummyCoordArrayB = [dummyCoordB, dummyCoordA];
  const dummyDoubleCoordArray = [dummyCoordArrayA, dummyCoordArrayB];
  const dummySVGElementA: SVGElement = document.createElement('dummyA') as any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorBucketSvgService);

    rendererSpy = jasmine.createSpyObj('Renderer2', {
      setAttribute: jasmine.createSpy('setAttribute'),
      createElement: dummySVGElementA,
      removeChild: null,
      appendChild: null,
    });

    service['renderer'] = rendererSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#generateOutlineString should make a string out of all evaluated outlines', () => {
    spyOn<any>(service, 'outlineToString').and.returnValue('blublu');
    expect(service['generateOutlineString'](dummyDoubleCoordArray)).toEqual('blublublublu');
  });

  it('#outlineToString should change a list of coordinates to a valid path instruction', () => {
    expect(service['outlineToString'](dummyCoordArrayA)).toEqual('M 12,5 L 12,5 L 3,4 Z ');
  });

  it('#createSurface should create a path object with the correct attributes', () => {
    spyOn<any>(service, 'generateOutlineString').and.returnValue('moo');
    const spySetFill = spyOn<any>(service, 'setFill');
    const spySetOutline = spyOn<any>(service, 'setOutline');
    const spySVGManager = spyOn<any>(service['svgManager'], 'addElement');
    const spyAddOperation = spyOn<any>(service['operationHandler'], 'addOperation');

    service['createSurface'](dummyDoubleCoordArray);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'd', 'moo');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill-rule', 'evenodd');
    expect(spySetFill).toHaveBeenCalledWith(dummySVGElementA);
    expect(spySetOutline).toHaveBeenCalledWith(dummySVGElementA);
    expect(spySVGManager).toHaveBeenCalledWith(dummySVGElementA);
    expect(spyAddOperation).toHaveBeenCalled();
  });

  it('#setFill should set the fill transparence to 0 if the mode is outline only', () => {
    service['fillColor'] = 'black';
    service['fillOpacity'] = 0.2;
    service['currentMode'] = 'outline';
    service['setFill'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill-opacity', '0');
  });

  it('#setFill should set the fill color and opacity to current values if mode is not outline only', () => {
    service['fillColor'] = 'black';
    service['fillOpacity'] = 0.2;
    service['currentMode'] = 'full';
    service['setFill'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill-opacity', '0.2');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill', 'black');

    service['fillColor'] = 'blue';
    service['fillOpacity'] = 0.5;
    service['currentMode'] = 'both';
    service['setFill'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill-opacity', '0.5');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill', 'blue');
  });

  it('#setOutline should set the fill transparence to 0 if the mode is fill only', () => {
    service['outlineColor'] = 'black';
    service['outlineOpacity'] = 0.2;
    service['currentMode'] = 'full';
    service['setOutline'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-opacity', '0');
  });

  it('#setFill should set the fill color and opacity to current values if mode is not outline only', () => {
    service['outlineColor'] = 'black';
    service['outlineOpacity'] = 0.2;
    service['outlineWidth'] = 71;
    service['currentMode'] = 'outline';
    service['setOutline'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-opacity', '0.2');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke', 'black');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-width', '71');

    service['outlineColor'] = 'blue';
    service['outlineOpacity'] = 0.5;
    service['outlineWidth'] = 42;
    service['currentMode'] = 'both';
    service['setOutline'](dummySVGElementA);
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-opacity', '0.5');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke', 'blue');
    expect(rendererSpy.setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-width', '42');
  });
});
