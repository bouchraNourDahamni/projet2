import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { TranslationControlPoints } from 'src/app/enums/translation-control-points';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

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
    service = TestBed.get(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#cleanUp should call mouseUp with a dummy event', () => {
    const spyMouseUp = spyOn<any>(service, 'onMouseUp');
    service.cleanUp();
    expect(spyMouseUp).toHaveBeenCalled();
  });

  it('#toggleMag should invert the isMagnetizeBehavior', () => {
    const bool = service['isMagnetizeBehavior'].getValue();
    service.toggleMag();
    expect(service['isMagnetizeBehavior'].getValue()).toEqual(!bool);
  });

  it('#setControlPoints should set the current point', () => {
    const point = TranslationControlPoints.BotCenterLeft;
    service['setControlPoints'](point);
    service.currentControlPoints.subscribe((newPoint: TranslationControlPoints) => {
      expect(newPoint).toEqual(point);
    });
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

  it('#setTranslate should set the current matrix transformation', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const matrix = service['matrixManipulations'].matrixToString({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0});
    service['renderer'].setAttribute(element, SVGAttributes.Transform, matrix);
    service['setTranslate'](element, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0});
    expect(element.getAttribute(SVGAttributes.Transform)).toEqual(matrix);
  });

  it('#translateEachElement should set the current translation matrix if there is no previous transforms', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const translate = {x: 10, y: 10};
    spyOn<any>(service, 'setTranslate').and.callThrough();
    service['selection'].currentSelection.push(element);
    service['translateEachElement'](translate);
    expect(service['newTransforms'].pop()).toEqual('matrix(1 0 0 1 10 10)');
    expect(service['setTranslate']).toHaveBeenCalled();
  });

  it('#translateEachElement should set the current translation matrix multiplied by the old if there is a previous transform', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const matrix = service['matrixManipulations'].matrixToString({a: 1, b: 15, c: 0, d: 1, e: 0, f: 0});
    service['renderer'].setAttribute(element, SVGAttributes.Transform, matrix);
    const translate = {x: 10, y: 10};
    spyOn<any>(service, 'setTranslate').and.callThrough();
    service['selection'].currentSelection.push(element);
    service['translateEachElement'](translate);
    const newMatrix = service['matrixManipulations'].matrixMultiply({a: 1, b: 0, c: 0, d: 1, e: 10, f: 10},
                                                                    {a: 1, b: 15, c: 0, d: 1, e: 0, f: 0});
    const newMatrixString = service['matrixManipulations'].matrixToString(newMatrix);
    expect(service['newTransforms'].pop()).toEqual(newMatrixString);
    expect(service['setTranslate']).toHaveBeenCalled();
  });

  it('#calculateTanslationNeeded should return the translation for TopLeft when controlPoint is TopLeft', () => {
    service['setControlPoints'](TranslationControlPoints.TopLeft);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 10, y: 20 - 10};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for TopCenterRight when controlPoint is TopCenterRight', () => {
    service['setControlPoints'](TranslationControlPoints.TopCenterRight);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 15, y: 20 - 10};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for TopRight when controlPoint is TopRight', () => {
    service['setControlPoints'](TranslationControlPoints.TopRight);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 20, y: 20 - 10};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for RightCenterBot when controlPoint is RightCenterBot', () => {
    service['setControlPoints'](TranslationControlPoints.RightCenterBot);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 20, y: 20 - 15};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for BotRight when controlPoint is BotRight', () => {
    service['setControlPoints'](TranslationControlPoints.BotRight);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 20, y: 20 - 20};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for BotCenterLeft when controlPoint is BotCenterLeft', () => {
    service['setControlPoints'](TranslationControlPoints.BotCenterLeft);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 15, y: 20 - 20};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for BotLeft when controlPoint is BotLeft', () => {
    service['setControlPoints'](TranslationControlPoints.BotLeft);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 10, y: 20 - 20};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for LeftCenterTop when controlPoint is LeftCenterTop', () => {
    service['setControlPoints'](TranslationControlPoints.LeftCenterTop);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 10, y: 20 - 15};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for Center when controlPoint is Center', () => {
    service['setControlPoints'](TranslationControlPoints.Center);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 15, y: 20 - 15};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#calculateTanslationNeeded should return the translation for TopLeft when controlPoint is random', () => {
    service['setControlPoints']('dummy' as TranslationControlPoints);
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    const translate = {x: 20, y: 20};
    const returnValue = {x: 20 - 10, y: 20 - 10};
    expect(service['calculateTanslationNeeded'](translate)).toEqual(returnValue);
  });

  it('#updateTranslations should do nothing when oldEvent === newEvent', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const oldEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service, 'translateEachElement').and.callThrough();
    service['oldMouseEvent'] = oldEvent;
    service['updateTranslations'](newEvent);
    expect(service['translateEachElement']).not.toHaveBeenCalled();
  });

  it('#updateTranslations should change oldMouseEvent and call translateEachElement when magnetize is false', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const oldEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 50, clientY: 20});
    spyOn<any>(service, 'translateEachElement').and.callThrough();
    service['oldMouseEvent'] = oldEvent;
    service['updateTranslations'](newEvent);
    expect(service['oldMouseEvent']).toEqual(newEvent);
    expect(service['translateEachElement']).toHaveBeenCalledWith({x: -40, y: 0});
  });

  it('#updateTranslations should change oldMouseEvent and call calculateTanslationNeeded when magnetize is true ', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const oldEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 50});
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['selection'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    spyOn<any>(service, 'translateEachElement').and.callThrough();
    spyOn<any>(service, 'calculateTanslationNeeded').and.callThrough();
    service.toggleMag();
    service['setControlPoints'](TranslationControlPoints.Center);
    service['oldMouseEvent'] = oldEvent;
    service['updateTranslations'](newEvent);
    expect(service['oldMouseEvent']).toEqual(newEvent);
    expect(service['calculateTanslationNeeded']).toHaveBeenCalled();
  });

  it('#onMouseDown should do nothing if the currentSelection is empty', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const oldEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 50});
    service['selection'].currentSelection = [] as SVGElement[];
    service['oldMouseEvent'] = oldEvent;
    service.onMouseDown(newEvent);
    expect(service['oldMouseEvent']).toEqual(oldEvent);
  });

  it('#onMouseDown should set isTranslating and oldMouseEvent if the currentSelection is not empty', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const oldEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 50});
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'].currentSelection = [element] as SVGElement[];
    service['oldMouseEvent'] = oldEvent;
    service.onMouseDown(newEvent);
    expect(service['oldMouseEvent']).toEqual(newEvent);
    expect(service['isTranslating']).toBeTruthy();
  });

  it('#onMouseMove should do nothing if isTranslating is false', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['isTranslating'] = false;
    spyOn<any>(service, 'updateTranslations').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['onMouseMove'](newEvent);
    expect(service['updateTranslations']).not.toHaveBeenCalled();
    expect(service['selection'].updateSelectionRect).not.toHaveBeenCalled();
  });

  it('#onMouseMove should call updateTranslations and updateSelectionRect if isTranslating is true', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['isTranslating'] = true;
    spyOn<any>(service, 'updateTranslations').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['onMouseMove'](newEvent);
    expect(service['updateTranslations']).toHaveBeenCalled();
    expect(service['selection'].updateSelectionRect).toHaveBeenCalled();
  });

  it('#onMouseUp should do nothing if isTranslating is false', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['isTranslating'] = false;
    spyOn<any>(service, 'updateTranslations').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['onMouseUp'](newEvent);
    expect(service['isTranslating']).toBeFalsy();
  });

  it('#onMouseUp should set isTranlation to false if isTranslating is true', () => {
    const newEvent: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['isTranslating'] = true;
    spyOn<any>(service, 'updateTranslations').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectionRect').and.callThrough();
    service['onMouseUp'](newEvent);
    expect(service['isTranslating']).toBeFalsy();
  });
});
