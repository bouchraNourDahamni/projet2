import { TestBed } from '@angular/core/testing';
import { ScalingMode } from 'src/app/enums/scaling-modes';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { ICoordinates } from 'src/app/interfaces/coordinates';
import { ScalingService } from './scaling.service';

describe('ScalingService', () => {
  let service: ScalingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ScalingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#cleanUp should call mouseUp with a dummy event', () => {
    const spyMouseUp = spyOn<any>(service, 'onMouseUp');
    service.cleanUp();
    expect(spyMouseUp).toHaveBeenCalled();
  });

  it('#onMouseDown should call initMouseDown, findOldCenter, chooseMode', () => {
    const event = new MouseEvent('mouseevent');
    spyOn<any>(service, 'initMouseDown').and.returnValue({});
    spyOn<any>(service, 'findOldAttributes').and.returnValue({});
    spyOn<any>(service, 'chooseMode').and.returnValue({});
    service.onMouseDown(event);
    expect(service['initMouseDown']).toHaveBeenCalled();
    expect(service['findOldAttributes']).toHaveBeenCalled();
    expect(service['chooseMode']).toHaveBeenCalled();
  });

  it('#onMouseMove should do nothing if isScaling to false', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service, 'scaleAllObjects').and.returnValue({});
    spyOn<any>(service['selectionService'], 'updateSelectionRect').and.returnValue({});
    service.onMouseMove(event);
    expect(service['scaleAllObjects']).not.toHaveBeenCalled();
    expect(service['selectionService'].updateSelectionRect).not.toHaveBeenCalled();
  });

  it('#onMouseMove should call scaleAllObjects and updateSelectionRect if isScaling to true', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service, 'scaleAllObjects').and.returnValue({});
    spyOn<any>(service['selectionService'], 'updateSelectionRect').and.returnValue({});
    service['isScaling'] = true;
    service.onMouseMove(event);
    expect(service['scaleAllObjects']).toHaveBeenCalled();
    expect(service['selectionService'].updateSelectionRect).toHaveBeenCalled();
  });

  it('#chooseMode should set scaleModeX to Inverse and scaleModeY to Inverse when TOP_LEFT_ID', () => {
    const id = 'topLeft';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Inverse);
    expect(service['scaleModeY']).toEqual(ScalingMode.Inverse);
  });

  it('#chooseMode should set scaleModeX to None and scaleModeY to Inverse when TOP_ID', () => {
    const id = 'top';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.None);
    expect(service['scaleModeY']).toEqual(ScalingMode.Inverse);
  });

  it('#chooseMode should set scaleModeX to Regular and scaleModeY to Inverse when TOP_RIGHT_ID', () => {
    const id = 'topRight';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Regular);
    expect(service['scaleModeY']).toEqual(ScalingMode.Inverse);
  });

  it('#chooseMode should set scaleModeX to Inverse and scaleModeY to None when LEFT_ID', () => {
    const id = 'left';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Inverse);
    expect(service['scaleModeY']).toEqual(ScalingMode.None);
  });

  it('#chooseMode should set scaleModeX to Regular and scaleModeY to None when RIGHT_ID', () => {
    const id = 'right';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Regular);
    expect(service['scaleModeY']).toEqual(ScalingMode.None);
  });

  it('#chooseMode should set scaleModeX to Inverse and scaleModeY to Regular when BOTTOM_LEFT_ID', () => {
    const id = 'bottomLeft';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Inverse);
    expect(service['scaleModeY']).toEqual(ScalingMode.Regular);
  });

  it('#chooseMode should set scaleModeX to None and scaleModeY to Regular when BOTTOM_ID', () => {
    const id = 'bottom';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.None);
    expect(service['scaleModeY']).toEqual(ScalingMode.Regular);
  });

  it('#chooseMode should set scaleModeX to Regular and scaleModeY to Regular when BOTTOM_RIGHT_ID', () => {
    const id = 'bottomRight';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.id = id;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    service['chooseMode'](event);
    expect(service['scaleModeX']).toEqual(ScalingMode.Regular);
    expect(service['scaleModeY']).toEqual(ScalingMode.Regular);
  });

  it('#findOldAttributes should set all old transforms', () => {
    let dummyElement: SVGElement = document.createElement('rec') as any;
    service['selection'] = [dummyElement];
    service['oldLeft'] = 0;
    service['oldTop'] = 0;
    spyOn<any>(service['selection'][0], 'getBoundingClientRect').and.returnValue({left: 10, top: 10, width: 2, height: 2});
    service['findOldAttributes']();
    expect(service['oldCenters'].pop()).toEqual({x: 11, y: 11} as ICoordinates);
    expect(service['oldTransforms'].pop()).toEqual('matrix(1 0 0 1 0 0)');

    dummyElement = document.createElement('rec') as any;
    service['selection'] = [dummyElement];
    dummyElement.setAttribute(SVGAttributes.Transform, 'dummy');
    service['findOldAttributes']();
    expect(service['oldTransforms'].pop()).toEqual('dummy');
  });

  it('#initMouseDown should init attributes', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['selectionService'].currentSelectionRect = {x: 10, y: 10, width: 10, height: 10};
    service['selectionService'].currentSelection = 'dummy' as any as SVGElement[];
    service['isScaling'] = false;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['initMouseDown'](event);
    expect(service['selectionRect']).toEqual({x: 10, y: 10, width: 10, height: 10});
    expect(service['selection']).toEqual('dummy' as any as SVGElement[]);
    expect(service['isScaling']).toBeTruthy();
    expect(service['oldWidth']).toEqual(10);
    expect(service['oldHeight']).toEqual(10);
    expect(service['oldLeft']).toEqual(10);
    expect(service['oldTop']).toEqual(10);
  });

  it('#scaleAllObjects should not call getNewRatios if keepRatio is false and scale is None', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service, 'updateDeltas').and.returnValue({});
    spyOn<any>(service, 'updateRatios').and.returnValue({});
    spyOn<any>(service, 'getNewRatios').and.returnValue({});
    spyOn<any>(service, 'scaleObject').and.returnValue({});
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'] = [] as SVGElement[];
    service['selection'].push(element);
    service['keepRatio'] = false;
    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.None;
    service['scaleAllObjects'](event);
    expect(service['updateDeltas']).toHaveBeenCalled();
    expect(service['updateRatios']).toHaveBeenCalled();
    expect(service['getNewRatios']).not.toHaveBeenCalled();
    expect(service['scaleObject']).toHaveBeenCalledTimes(1);

    service['keepRatio'] = true;
    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.None;
    service['scaleAllObjects'](event);
    expect(service['getNewRatios']).not.toHaveBeenCalled();

    service['keepRatio'] = false;
    service['scaleModeX'] = ScalingMode.Inverse;
    service['scaleModeY'] = ScalingMode.None;
    service['scaleAllObjects'](event);
    expect(service['getNewRatios']).not.toHaveBeenCalled();

    service['keepRatio'] = false;
    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.Regular;
    service['scaleAllObjects'](event);
    expect(service['getNewRatios']).not.toHaveBeenCalled();
  });

  it('#scaleAllObjects should call getNewRatios if keepRatio is true and scale is not None', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service, 'updateDeltas').and.returnValue({});
    spyOn<any>(service, 'updateRatios').and.returnValue({});
    spyOn<any>(service, 'getNewRatios').and.returnValue({});
    spyOn<any>(service, 'scaleObject').and.returnValue({});
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'] = [] as SVGElement[];
    service['selection'].push(element);
    service['keepRatio'] = true;
    service['scaleModeX'] = ScalingMode.Inverse;
    service['scaleModeY'] = ScalingMode.Regular;
    service['scaleAllObjects'](event);
    expect(service['updateDeltas']).toHaveBeenCalled();
    expect(service['updateRatios']).toHaveBeenCalled();
    expect(service['getNewRatios']).toHaveBeenCalled();
    expect(service['scaleObject']).toHaveBeenCalledTimes(1);
  });

  it('#scaleObject should not call getTransformX or getTransformY if scaleModel is None', () => {
    spyOn<any>(service['matrixManipulations'], 'extractMatrixParam').and.returnValue({});
    spyOn<any>(service, 'getTransformX').and.returnValue({});
    spyOn<any>(service, 'getTransformY').and.returnValue({});
    spyOn<any>(service, 'applyFinalTransform').and.returnValue({});
    service['oldTransforms'] = [] as string[];
    service['oldTransforms'].push('dummy');
    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.None;
    service['scaleObject'](0);
    expect(service['matrixManipulations'].extractMatrixParam).toHaveBeenCalled();
    expect(service['getTransformX']).not.toHaveBeenCalled();
    expect(service['getTransformY']).not.toHaveBeenCalled();
    expect(service['applyFinalTransform']).toHaveBeenCalled();
  });

  it('#scaleObject should call getTransformX or getTransformY if scaleModel is not None', () => {
    spyOn<any>(service['matrixManipulations'], 'extractMatrixParam').and.returnValue({});
    spyOn<any>(service, 'getTransformX').and.returnValue({});
    spyOn<any>(service, 'getTransformY').and.returnValue({});
    spyOn<any>(service, 'applyFinalTransform').and.returnValue({});
    service['oldTransforms'] = [] as string[];
    service['oldTransforms'].push('dummy');
    service['scaleModeX'] = ScalingMode.Regular;
    service['scaleModeY'] = ScalingMode.Regular;
    service['scaleObject'](0);
    expect(service['matrixManipulations'].extractMatrixParam).toHaveBeenCalled();
    expect(service['getTransformX']).toHaveBeenCalled();
    expect(service['getTransformY']).toHaveBeenCalled();
    expect(service['applyFinalTransform']).toHaveBeenCalled();
  });

  it('#updateDeltas should update deltaX and deltaY', () => {
    service['initialCoordinates'] = {x: 0, y: 0};
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['updateDeltas'](event);
    expect(service['deltaX']).toEqual(10);
    expect(service['deltaY']).toEqual(20);

    service['mirrorScalingOn'] = true;
    service['updateDeltas'](event);
    expect(service['deltaX']).toEqual(20);
    expect(service['deltaY']).toEqual(40);
  });

  it('#updateRatios should update newWidth, newHeight, ratioX and ratioY', () => {
    service['deltaX'] = 10;
    service['deltaY'] = 20;
    service['oldWidth'] = 1;
    service['oldHeight'] = 1;
    service['scaleModeX'] = ScalingMode.Regular;
    service['scaleModeY'] = ScalingMode.Regular;
    service['updateRatios']();
    expect(service['ratioX']).toEqual(11);
    expect(service['ratioY']).toEqual(21);

    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.None;
    service['updateRatios']();
    expect(service['ratioX']).toEqual(-9);
    expect(service['ratioY']).toEqual(-19);

    service['scaleModeX'] = ScalingMode.Regular;
    service['scaleModeY'] = ScalingMode.None;
    service['updateRatios']();
    expect(service['ratioX']).toEqual(11);
    expect(service['ratioY']).toEqual(-19);

    service['scaleModeX'] = ScalingMode.None;
    service['scaleModeY'] = ScalingMode.Regular;
    service['updateRatios']();
    expect(service['ratioX']).toEqual(-9);
    expect(service['ratioY']).toEqual(21);
  });

  it('#getNewRatios should update newWidth, newHeight, ratioX, ratioY, deltaX, deltaY', () => {
    service['ratioX'] = 1;
    service['ratioY'] = 2;
    service['oldWidth'] = 1;
    service['oldHeight'] = 1;
    service['scaleModeX'] = ScalingMode.Regular;
    service['scaleModeY'] = ScalingMode.Regular;
    service['getNewRatios']();
    expect(service['ratioX']).toEqual(2);
    expect(service['ratioY']).toEqual(2);
    expect(service['newWidth']).toEqual(2);
    expect(service['newHeight']).toEqual(2);
    expect(service['deltaX']).toEqual(1);
    expect(service['deltaY']).toEqual(1);

    service['scaleModeX'] = ScalingMode.Inverse;
    service['scaleModeY'] = ScalingMode.Inverse;
    service['getNewRatios']();
    expect(service['deltaX']).toEqual(-1);
    expect(service['deltaY']).toEqual(-1);
  });

  it('#findExpectedCenterY should update the expected center in X', () => {
    service['oldCenters'] = [];
    service['oldCenters'].push({x: 1, y: 2});
    service['ratioX'] = 1;
    service['deltaX'] = 2;
    service['scaleModeX'] = ScalingMode.Regular;
    expect(service['findExpectedCenterX'](0)).toEqual(1);

    service['scaleModeX'] = ScalingMode.Inverse;
    expect(service['findExpectedCenterX'](0)).toEqual(3);
  });

  it('#findExpectedCenterY should update the expected center in Y', () => {
    service['oldCenters'] = [];
    service['oldCenters'].push({x: 1, y: 1});
    service['ratioY'] = 1;
    service['deltaY'] = 2;
    service['scaleModeY'] = ScalingMode.Regular;
    expect(service['findExpectedCenterY'](0)).toEqual(1);

    service['scaleModeY'] = ScalingMode.Inverse;
    expect(service['findExpectedCenterY'](0)).toEqual(3);
  });

  it('#findCurrentCenterX should set the current matrix and return the center of the boundingBox in X', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'] = [element];
    service['oldLeft'] = 0;
    spyOn<any>(element, 'getBoundingClientRect').and.returnValue({left: 10, width: 8});
    const scalingMatrix = {a: 10, b: 0, c: 0, d: 9, e: 0, f: 0};
    expect(service['findCurrentCenterX'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}, scalingMatrix)).toEqual(14);
    expect(element.getAttribute(SVGAttributes.Transform)).toEqual('matrix(10 0 0 9 0 0)');
  });

  it('#findCurrentCenterY should set the current matrix and return the center of the boundingBox in Y', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['selection'] = [element];
    service['oldTop'] = 0;
    spyOn<any>(element, 'getBoundingClientRect').and.returnValue({top: 10, height: 8});
    const scalingMatrix = {a: 10, b: 0, c: 0, d: 9, e: 0, f: 0};
    expect(service['findCurrentCenterY'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}, scalingMatrix)).toEqual(14);
    expect(element.getAttribute(SVGAttributes.Transform)).toEqual('matrix(10 0 0 9 0 0)');
  });

  it('#getFullTransformX should get the matrix for X', () => {
    expect(service['getFullTransformX'](10, 0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 1, e: 10, f: 0});
  });

  it('#getFullTransformY should get the matrix for Y', () => {
    expect(service['getFullTransformY'](10, 0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 1, e: 0, f: 10});
  });

  it('#applyFinalTransform should set and push the final scaling matrix', () => {
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['newTransforms'] = [];
    service['selection'] = [element];
    service['applyFinalTransform'](
      {a: 1, b: 0, c: 0, d: 1, e: 10, f: 0},
      {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
      {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
      0);
    expect(element.getAttribute(SVGAttributes.Transform)).toEqual('matrix(1 0 0 1 10 0)');
    expect(service['newTransforms'].pop()).toEqual('matrix(1 0 0 1 10 0)');
  });

  it('#getAltMatrixX should return the matrix in X', () => {
    service['deltaX'] = 2;
    expect(service['getAltMatrixX']({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 1, e: -1, f: 0});
  });

  it('#getAltMatrixY should return the matrix in Y', () => {
    service['deltaY'] = 2;
    expect(service['getAltMatrixY']({a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 1, e: 0, f: -1});
  });

  it('#getTransformX should return the matrix in X', () => {
    service['ratioX'] = 2;
    service['mirrorScalingOn'] = false;
    spyOn<any>(service, 'findExpectedCenterX').and.returnValue(10);
    spyOn<any>(service, 'findCurrentCenterX').and.returnValue(10);
    spyOn<any>(service, 'getFullTransformX').and.returnValue({a: 2, b: 0, c: 0, d: 1, e: 0, f: 0});
    expect(service['getTransformX'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 2, b: 0, c: 0, d: 1, e: 0, f: 0});

    spyOn<any>(service, 'getAltMatrixX').and.returnValue({a: 10, b: 0, c: 0, d: 1, e: 0, f: 0});
    service['mirrorScalingOn'] = true;
    expect(service['getTransformX'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 10, b: 0, c: 0, d: 1, e: 0, f: 0});
  });

  it('#getTransformY should return the matrix in Y', () => {
    service['ratioY'] = 2;
    service['mirrorScalingOn'] = false;
    spyOn<any>(service, 'findExpectedCenterY').and.returnValue(10);
    spyOn<any>(service, 'findCurrentCenterY').and.returnValue(10);
    spyOn<any>(service, 'getFullTransformY').and.returnValue({a: 1, b: 0, c: 0, d: 2, e: 0, f: 0});
    expect(service['getTransformY'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 2, e: 0, f: 0});

    spyOn<any>(service, 'getAltMatrixY').and.returnValue({a: 1, b: 0, c: 0, d: 10, e: 0, f: 0});
    service['mirrorScalingOn'] = true;
    expect(service['getTransformY'](0, {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}))
      .toEqual({a: 1, b: 0, c: 0, d: 10, e: 0, f: 0});
  });

  it('#onMouseUp should set isScaling to false and call operationHandler.addOperation', () => {
    service['isScaling'] = true;
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    spyOn<any>(service['operationHandler'], 'addOperation').and.returnValue({});
    service.onMouseUp(event);
    expect(service['isScaling']).toBeFalsy();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#onShiftDown should set keepRatio to true and if isScaling is true call onMouseMove', () => {
    service['keepRatio'] = false;
    service['isScaling'] = false;
    spyOn<any>(service, 'onMouseMove').and.returnValue({});
    service.onShiftDown();
    expect(service['keepRatio']).toBeTruthy();
    expect(service.onMouseMove).not.toHaveBeenCalled();

    service['isScaling'] = true;
    service.onShiftDown();
    expect(service.onMouseMove).toHaveBeenCalled();
  });

  it('#onShiftUp should set keepRatio to false and if isScaling is true call onMouseMove', () => {
    service['keepRatio'] = true;
    service['isScaling'] = false;
    spyOn<any>(service, 'onMouseMove').and.returnValue({});
    service.onShiftUp();
    expect(service['keepRatio']).toBeFalsy();
    expect(service.onMouseMove).not.toHaveBeenCalled();

    service['isScaling'] = true;
    service.onShiftUp();
    expect(service.onMouseMove).toHaveBeenCalled();
  });

  it('#onAltDown should set mirrorScalingOn to true and if isScaling is true call onMouseMove', () => {
    service['mirrorScalingOn'] = false;
    service['isScaling'] = false;
    spyOn<any>(service, 'onMouseMove').and.returnValue({});
    service.onAltDown();
    expect(service['mirrorScalingOn']).toBeTruthy();
    expect(service.onMouseMove).not.toHaveBeenCalled();

    service['isScaling'] = true;
    service.onAltDown();
    expect(service.onMouseMove).toHaveBeenCalled();
  });

  it('#onAltUp should set mirrorScalingOn to false and if isScaling is true call onMouseMove', () => {
    service['mirrorScalingOn'] = true;
    service['isScaling'] = false;
    spyOn<any>(service, 'onMouseMove').and.returnValue({});
    service.onAltUp();
    expect(service['mirrorScalingOn']).toBeFalsy();
    expect(service.onMouseMove).not.toHaveBeenCalled();

    service['isScaling'] = true;
    service.onAltUp();
    expect(service.onMouseMove).toHaveBeenCalled();
  });
});
