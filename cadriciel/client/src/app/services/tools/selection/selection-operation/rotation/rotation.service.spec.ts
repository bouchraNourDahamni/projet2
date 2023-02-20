import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { RotationService } from './rotation.service';

const SMALL_ANGLE_RADIANS = 0.0174533;
const LARGE_ANGLE_RADIANS = 0.261799;

describe('RotationService', () => {

  let service: RotationService;

  const mockedRenderer: any = {
    removeChild: jasmine.createSpy('removeChild'),
    appendChild: jasmine.createSpy('appendChild'),
    createElement: jasmine.createSpy('createElement'),
    setAttribute: jasmine.createSpy('setAttribute'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SvgManagerService, {provide: Renderer2,  useValue: mockedRenderer }],
    });
    service = TestBed.get(RotationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onMouseWheel should set angle to small_angle and call updateRotations when scrollingUp and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = true;
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    spyOn<any>(service, 'updateRotations').and.callThrough();
    service.onMouseWheel(event);
    expect(service['updateRotations']).toHaveBeenCalled();
    expect(service['angle']).toEqual(SMALL_ANGLE_RADIANS);
  });

  it('#onMouseWheel should set angle to large_angle and call updateRotations when scrollingUp and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = false;
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    spyOn<any>(service, 'updateRotations').and.callThrough();
    service.onMouseWheel(event);
    expect(service['updateRotations']).toHaveBeenCalled();
    expect(service['angle']).toEqual(LARGE_ANGLE_RADIANS);
  });

  it('#onMouseWheel should set angle to -small_angle and call updateRotations when scrollingDown and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = true;
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    spyOn<any>(service, 'updateRotations').and.callThrough();
    service.onMouseWheel(event);
    expect(service['updateRotations']).toHaveBeenCalled();
    expect(service['angle']).toEqual(-SMALL_ANGLE_RADIANS);
  });

  it('#onMouseWheel should set angle to -large_angle and call updateRotations when scrollingDown and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = false;
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    spyOn<any>(service, 'updateRotations').and.callThrough();
    service.onMouseWheel(event);
    expect(service['updateRotations']).toHaveBeenCalled();
    expect(service['angle']).toEqual(-LARGE_ANGLE_RADIANS);
  });

  it('#onAltKeyUp should do nothing if repeat is true', () => {
    service['altKeyPressed'] = true;
    service.onAltKeyUp(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['altKeyPressed']).toBeTruthy();
  });

  it('#onAltKeyUp should set the altKeyPressed to false when repeat is false', () => {
    service['altKeyPressed'] = true;
    service.onAltKeyUp(new KeyboardEvent('shiftDown', {repeat: false}));
    expect(service['altKeyPressed']).toBeFalsy();
  });

  it('#onAltKeyDown should do nothing when repeat is true', () => {
    service['altKeyPressed'] = false;
    service.onAltKeyDown(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['altKeyPressed']).toBeFalsy();
  });

  it('#onAltKeyDown should set the altKeyPressed to true when repeat is false', () => {
    service['altKeyPressed'] = false;
    service.onAltKeyDown(new KeyboardEvent('shiftDown', {repeat: false}));
    expect(service['altKeyPressed']).toBeTruthy();
  });

  it('#onShiftDown should do nothing if repeat is true', () => {
    service['isShiftPressed'] = false;
    service.onShiftDown(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['isShiftPressed']).toBeFalsy();
  });

  it('#onShiftDown should set isShiftPressed to true if repeat is false', () => {
    service['isShiftPressed'] = false;
    service.onShiftDown(new KeyboardEvent('shiftDown', {repeat: false}));
    expect(service['isShiftPressed']).toBeTruthy();
  });

  it('#onShiftUp should do nothing if repeat is true', () => {
    service['isShiftPressed'] = true;
    service.onShiftUp(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['isShiftPressed']).toBeTruthy();
  });

  it('#onShiftUp should set isShiftPressed to false if repeat is false', () => {
    service['isShiftPressed'] = true;
    service.onShiftUp(new KeyboardEvent('shiftDown', {repeat: false}));
    expect(service['isShiftPressed']).toBeFalsy();
  });

  it('#setRotation should set the current matrix transformation', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const matrix = service['matrixManipulations'].matrixToString({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0});
    service['renderer'].setAttribute(element, SVGAttributes.Transform, matrix);
    service['setRotation'](element, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0});
    expect(element.getAttribute(SVGAttributes.Transform)).toEqual(matrix);
  });

  it('#getCenterOfSVGElement should return the center of an SVGElement', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    spyOn<any>(element, 'getBoundingClientRect').and.returnValue({bottom: 10, height: 10,
                                                                  left: 10, right: 10, top: 10, width: 10} as ClientRect);
    expect(service['getCenterOfSVGElement'](element)).toEqual({x: 10, y: 10});
  });

  it('#rotateEachElement should call getCenterOfSVGElement when center is undefined', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'].currentSelection.push(element);
    spyOn<any>(service, 'setRotation').and.callThrough();
    spyOn<any>(service, 'getCenterOfSVGElement').and.returnValue({x: 10, y: 10});
    service['rotateEachElement']();
    expect(service['getCenterOfSVGElement']).toHaveBeenCalled();
    expect(service['setRotation']).toHaveBeenCalled();
  });

  it('#rotateEachElement should set the current rotation matrix if there is no previous transforms', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const center = {x: 10, y: 10};
    const matrixRotate = service['getMatrixRotate'](center);
    spyOn<any>(service, 'setRotation').and.callThrough();
    service['selection'].currentSelection.push(element);
    service['rotateEachElement'](center);
    expect(service['newTransforms'].pop()).toEqual(service['matrixManipulations'].matrixToString(matrixRotate));
    expect(service['setRotation']).toHaveBeenCalled();
  });

  it('#rotateEachElement should set the current rotation matrix multiplied by the old if there is a previous transform', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const matrix = service['matrixManipulations'].matrixToString({a: 1, b: 15, c: 0, d: 1, e: 0, f: 0});
    service['renderer'].setAttribute(element, SVGAttributes.Transform, matrix);
    const center = {x: 10, y: 10};
    const matrixRotate = service['getMatrixRotate'](center);
    spyOn<any>(service, 'setRotation').and.callThrough();
    service['selection'].currentSelection.push(element);
    service['rotateEachElement'](center);
    const newMatrix = service['matrixManipulations'].matrixMultiply(matrixRotate, {a: 1, b: -1, c: 0, d: 1, e: 0, f: 0});
    const newMatrixString = service['matrixManipulations'].matrixToString(newMatrix);
    expect(service['newTransforms'].pop()).toEqual(newMatrixString);
    expect(service['setRotation']).toHaveBeenCalled();
  });

  it('#checkOldTransforms should push an identity matrix if there is no oldTransform', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'].currentSelection.push(element);
    service['checkOldTransforms']();
    expect(service['oldTransforms'].pop()).toEqual('matrix(1 0 0 1 0 0)');
  });

  it('#checkOldTransforms should push the current matrix if there is an oldTransform', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const matrix = service['matrixManipulations'].matrixToString({a: 1, b: 10, c: 0, d: 10, e: 0, f: 10});
    service['renderer'].setAttribute(element, SVGAttributes.Transform, matrix);
    service['selection'].currentSelection.push(element);
    service['checkOldTransforms']();
    expect(service['oldTransforms'].pop()).toEqual('matrix(1 10 0 10 0 10)');
  });

  it('#updateRotations should call rotateEachElement() and updateSelectionRect when isShiftPressed is true', () => {
    service['isShiftPressed'] = true;
    spyOn<any>(service, 'rotateEachElement').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['updateRotations']();
    expect(service['rotateEachElement']).toHaveBeenCalledWith();
    expect(service['selection'].updateSelectionRect).toHaveBeenCalled();
  });

  it('#updateRotations should call rotateEachElement(center) and updateSelectionRect when isShiftPressed is false', () => {
    service['isShiftPressed'] = false;
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 0, height: 0};
    const center = {x: 10, y: 10};
    spyOn<any>(service, 'rotateEachElement').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['updateRotations']();
    expect(service['rotateEachElement']).toHaveBeenCalledWith(center);
    expect(service['selection'].updateSelectionRect).toHaveBeenCalled();
  });

  it('#getMatrixRotate should get the correct matrix', () => {
    service['angle'] = 0.5;
    expect(service['getMatrixRotate']({x: 10, y: 10})).toEqual({a: 0.878, b: 0.479, c: -0.479, d: 0.878, e: 6.018, f: -3.57});
  });
});
