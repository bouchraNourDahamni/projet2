import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ICoordinates } from 'src/app/interfaces/coordinates';
import { ISVGRectangle } from 'src/app/interfaces/SVGRectangle';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { SelectionSvgService } from './selection-svg.service';

describe('SelectionSvgService', () => {
  let rendererSpy: Renderer2;
  let service: SelectionSvgService;
  let svgManagerSpy: SvgManagerService;
  const dummySVGElementA: SVGElement = document.createElement('dummyA') as any;
  const dummyCoordinatesA: ICoordinates = {x: 40, y: 60};
  const dummyCoordinatesB: ICoordinates = {x: 300, y: 600};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SelectionSvgService);

    rendererSpy = jasmine.createSpyObj('Renderer2', {
      setAttribute: jasmine.createSpy('setAttribute'),
      createElement: dummySVGElementA,
      removeChild: null,
      appendChild: null,
    });

    svgManagerSpy = jasmine.createSpyObj('SvgManager', {
      deleteElement: null,
      addElement: null,
      getOffset: {x: 10, y: 5},
      deleteSelectionRect: null,
      addSelectionRect: null,
    });

    service['renderer'] = rendererSpy;
    service['svgManager'] = svgManagerSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createPerimeter should create a new perimeter and set its color, transparency and dashed-line attributes', () => {
    service['createPerimeter'](dummyCoordinatesA);
    expect(service['perimeter']).toEqual(dummySVGElementA);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'fill-opacity', '0');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke', 'gray');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'stroke-dasharray', '4');
  });

  it('#createPerimeter should set the coordinates of the first perimeter point as initial coordinates', () => {
    service['createPerimeter'](dummyCoordinatesA);
    expect(service['initialCoordinates']).toEqual(dummyCoordinatesA);
  });

  it('#updatePerimeter should create a new perimeter based on initial and new coordinates', () => {
    service['initialCoordinates'] = dummyCoordinatesA;
    service['perimeter'] = dummySVGElementA;
    service['updatePerimeter'](dummyCoordinatesB);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'x', '40');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'y', '60');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'width', '260');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'height', '540');
  });

  it('#removePerimeter should remove the perimeter from the canvas', () => {
    service['perimeter'] = dummySVGElementA;
    service['removePerimeter']();
    expect(service['svgManager'].deleteElement).toHaveBeenCalledWith(dummySVGElementA);
  });

  it('#createSelectionRectangle should create an svg rectangle based on the default settings and given attributes', () => {
    const dummyRectangle: ISVGRectangle = {x: 10, y: 20, height: 40, width: 60};
    const spyControlPoints = spyOn(service, 'createControlPoints');
    service.createSelectionRectangle(dummyRectangle);
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(2);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'x', '10');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'y', '20');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'height', '40');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySVGElementA, 'width', '60');
    expect(service['renderer'].appendChild).toHaveBeenCalledTimes(1);
    expect(spyControlPoints).toHaveBeenCalled();
  });

  it('#createControlPoints should add circles to the corners of the selection rectangles and in the middle of each segment', () => {
    const dummyRectangle: ISVGRectangle = {x: 10, y: 20, height: 40, width: 60};
    service.createControlPoints(dummyRectangle);
    expect(service['renderer'].appendChild).toHaveBeenCalledTimes(9);
  });

  it('#createSelectionRectangle should call deleteSelectionRect when selectionContainer is not null', () => {
    service['selectionContainer'] = dummySVGElementA;
    const dummyRectangle: ISVGRectangle = {x: 10, y: 20, height: 40, width: 60};
    service.createSelectionRectangle(dummyRectangle);
    service['svgManager'] = jasmine.createSpyObj('svgManager', {
      deleteSelectionRect: jasmine.createSpy('deleteSelectionRect'),
      addSelectionRect: jasmine.createSpy('addSelectionRect'),
    });
    service['createSelectionRectangle'](dummyRectangle);
    expect(service['svgManager'].deleteSelectionRect).toHaveBeenCalled();
  });

});
