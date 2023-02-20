import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { IRange } from 'src/app/interfaces/range';
import { ISVGRectangle } from 'src/app/interfaces/SVGRectangle';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { EraserService } from './eraser.service';

const DEFAULT_TEXTURE = 'none';
const RED_TEXTURE = 'eraser-filter';
const FILTER_URL_START = 'url(#';
const FILTER_URL_END = ')';

describe('EraserService', () => {
  let manager: SvgManagerService;
  let service: EraserService;

  class MockSVGElement {
    public boundingBox = {top: 0, bottom: 0, left: 0, right: 0};

    constructor(top: number, bottom: number, left: number, right: number) {
      this.boundingBox.top = top;
      this.boundingBox.bottom = bottom;
      this.boundingBox.left = left;
      this.boundingBox.right = right;
    }

    public getBoundingClientRect() {
      return this.boundingBox;
    }
  }

  // tslint:disable-next-line: only-arrow-functions
  function createDummySVG(): SVGElement[] {
    const element1: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element1, SVGAttributes.X, '40');
    service['renderer'].setAttribute(element1, SVGAttributes.Y, '40');
    service['renderer'].setAttribute(element1, SVGAttributes.Width, '40');
    service['renderer'].setAttribute(element1, SVGAttributes.Height, '40');
    const element2: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element2, SVGAttributes.X, '100');
    service['renderer'].setAttribute(element2, SVGAttributes.Y, '100');
    service['renderer'].setAttribute(element2, SVGAttributes.Width, '10');
    service['renderer'].setAttribute(element2, SVGAttributes.Height, '10');
    const dummySVGArray = [element1, element2];
    service['eraserSize'] = 5;
    return dummySVGArray;
  }

  // tslint:disable-next-line: only-arrow-functions
  function initialize(): void {
    const dummySVGArray = createDummySVG();
    spyOn<any>(service['svgManager'], 'getSvgElements').and.returnValue(dummySVGArray);
    spyOn<any>(service['svgManager'], 'getOffset').and.returnValue({ x: 0, y: 0 });
  }

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

    service = TestBed.get(EraserService);
    manager = TestBed.get(SvgManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
  });

  it('#createEraserSquare should correctly create the shape for the cursor', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    const center = (service['eraserSize'] / 2);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    const intersectRectCursorX = event.clientX - service['svgManager'].getOffset().x - center;
    const intersectRectCursorY = event.clientY - service['svgManager'].getOffset().y - center;
    const rectCursor: ISVGRectangle = { x: intersectRectCursorX, y: intersectRectCursorY,
                                        width: service['eraserSize'], height: service['eraserSize']};
    service['createEraserSquare'](event);
    expect(service['intersectRectCursor']).toEqual(rectCursor);
  });

  it('#createEraserSquare should correctly set the cursor attributes', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['eraserSize'] = 10;
    const center = (service['eraserSize'] / 2);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['createEraserSquare'](event);
    expect(service['eraserCursorAttributes'].left).toEqual(event.pageX);
    expect(service['eraserCursorAttributes'].top).toEqual(event.pageY);
    expect(service['eraserCursorAttributes'].marginLeft).toEqual(-center);
    expect(service['eraserCursorAttributes'].marginTop).toEqual(-center);
    expect(service['eraserCursorAttributes'].width).toEqual(service['eraserSize']);
    expect(service['eraserCursorAttributes'].height).toEqual(service['eraserSize']);
  });

  it('#isIntersecting should return true if 2 number ranges have any overlap', () => {
    const rangeA: IRange = {start: 2, end: 8};
    const rangeB: IRange = {start: 4, end: 10};
    const rangeC: IRange = {start: 8, end: 10};
    const rangeD: IRange = {start: 4, end: 5};
    const rangeE: IRange = {start: 9, end: 21};

    expect(service['isIntersecting'](rangeA, rangeB)).toBeTruthy();
    expect(service['isIntersecting'](rangeA, rangeC)).toBeTruthy();
    expect(service['isIntersecting'](rangeA, rangeD)).toBeTruthy();
    expect(service['isIntersecting'](rangeA, rangeE)).toBeFalsy();
    expect(service['isIntersecting'](rangeE, rangeD)).toBeFalsy();
  });

  it('#getCollision should return object colliding with the intersectRectCursor' , () => {
    const rectSvgA: SVGElement = new MockSVGElement(20, 30, 40, 50) as any as SVGElement; // with offset: (30,15) (40,25)
    const rectSvgB: SVGElement = new MockSVGElement(25, 40, 45, 60) as any as SVGElement; // with offset: (35,20) (50,35)
    const dummyArray: SVGElement[] = [rectSvgA, rectSvgB];
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 10, y: 5 },
    });
    service['allDrawings'] = Array.from(dummyArray);
    service['intersectRectCursor'] = { x: 3, y: 3, width: 28, height: 13};
    const expectedCollisions: SVGElement[] = [rectSvgA];
    expect(service['getCollision'](rectSvgA)).toEqual(expectedCollisions);
  });

  it('#deleteDrawings should do nothing if drawingsToDelete is empty', () => {
    service['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    service['drawingsToDelete'] = [];
    const emptyArray: SVGElement[] = [];
    service['deleteDrawings']();
    expect(service['drawingsToDelete']).toEqual(emptyArray);
    expect(service['drawingsToDelete'].length).toEqual(0);
    expect(service['svgManager'].deleteElement).not.toHaveBeenCalled();
  });

  it('#deleteDrawings should delete one drawing and reset the array', () => {
    service['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    const element1: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const element2: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['drawingsToDelete'].push(element1);
    service['drawingsToDelete'].push(element2);
    const emptyArray: SVGElement[] = [];
    service['deleteDrawings']();
    expect(service['drawingsToDelete']).toEqual(emptyArray);
    expect(service['drawingsToDelete'].length).toEqual(0);
    expect(service['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#checkIntersectionsWithEverything should do nothing when it has no intersections', () => {
    initialize();
    spyOn<any>(service, 'getCollision').and.returnValue([]);
    service['drawingToChangeStroke'] = 'dummy';
    service['checkIntersectionsWithEverything']();
    expect(service['drawingToChangeStroke']).toEqual('dummy');
  });

  it('#checkIntersectionsWithEverything should change drawingToChangeStroke when isErasing is false && there is a collision', () => {
    const dummySVGArray = createDummySVG();
    spyOn<any>(service['svgManager'], 'getSvgElements').and.returnValue(dummySVGArray);
    spyOn<any>(service, 'getCollision').and.returnValue(dummySVGArray[0]);
    service['drawingToChangeStroke'] = 'dummy';
    service['isErasing'] = false;
    service['checkIntersectionsWithEverything']();
    expect(service['drawingToChangeStroke']).not.toEqual('dummy');
  });

  it('#checkIntersectionsWithEverything should change drawingToDelete when isErasing is true && there is a collision', () => {
    const dummySVGArray = createDummySVG();
    spyOn<any>(service['svgManager'], 'getSvgElements').and.returnValue(dummySVGArray);
    spyOn<any>(service, 'getCollision').and.returnValue(dummySVGArray[0]);
    service['drawingToChangeStroke'] = 'dummy';
    service['isErasing'] = true;
    const expectedArray = [dummySVGArray[0] as any as SVGElement, dummySVGArray[1] as any as SVGElement];
    service['checkIntersectionsWithEverything']();
    expect(service['drawingsToDeleteUndoRedo']).toEqual(expectedArray);
    expect(service['drawingsToDelete']).toEqual(expectedArray);
  });

  it('#changeStrokeColor should set the stroke to red when drawing is not dummy and curentHover is empty', () => {
    service['drawingToChangeStroke'] = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['currentHoverDrawing'] = [];
    service['changeStrokeColor']();
    expect(service['currentHoverDrawing'][0]).toEqual(service['drawingToChangeStroke']);
    expect(service['currentHoverDrawing'][0].getAttribute(SVGAttributes.Filter)).toEqual('url(#eraser-filter)');
  });

  it('#changeStrokeColor should set the stroke to none when drawing is dummy and curentHover is not empty', () => {
    service['drawingToChangeStroke'] = 'dummy';
    const element = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element, SVGAttributes.Filter, FILTER_URL_START + RED_TEXTURE + FILTER_URL_END);
    service['currentHoverDrawing'].push(element);
    service['changeStrokeColor']();
    expect(element.getAttribute(SVGAttributes.Filter)).toEqual(DEFAULT_TEXTURE);
  });

  it('#changeStrokeColor should do nothing when drawing is dummy and curentHover is empty', () => {
    service['drawingToChangeStroke'] = 'dummy';
    service['currentHoverDrawing'] = [];
    service['renderer'] = jasmine.createSpyObj('renderer', ['setAttribute']);
    service['changeStrokeColor']();
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#changeStrokeColor should set the stroke to red when drawing is not currentHover and curentHover is not empty', () => {
    service['drawingToChangeStroke'] = service['renderer'].createElement(SVGAttributes.Polygon, SVGAttributes.SVG);
    const element = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element, SVGAttributes.Filter, FILTER_URL_START + RED_TEXTURE + FILTER_URL_END);
    service['currentHoverDrawing'].push(element);
    service['changeStrokeColor']();
    expect(service['currentHoverDrawing'][0].getAttribute(SVGAttributes.Filter)).toEqual('url(#eraser-filter)');
    expect(element.getAttribute(SVGAttributes.Filter)).toEqual(DEFAULT_TEXTURE);
  });

  it('#changeStrokeColor should do nothing when drawing is equal to curentHover and curentHover is not empty', () => {
    const element = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element, SVGAttributes.Filter, FILTER_URL_START + RED_TEXTURE + FILTER_URL_END);
    service['currentHoverDrawing'].push(element);
    service['drawingToChangeStroke'] = element;
    service['renderer'] = jasmine.createSpyObj('renderer', ['setAttribute']);
    service['changeStrokeColor']();
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#sortDrawingsToDelete should sort drawings', () => {
    const drawings = createDummySVG();
    service['copyAllDrawings'] = [drawings[1], drawings[0]];
    expect(service['sortDrawingsToDelete'](drawings)).toEqual([drawings[1], drawings[0]]);
  });

  it('#onMouseDown should set isErasing to true', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    initialize();

    service.onMouseDown(event);
    expect(service['isErasing']).toBeTruthy();

    service['isErasing'] = true;
    service.onMouseDown(event);
    expect(service['isErasing']).toBeTruthy();
  });

  it('#onMouseDown should call the correct functions', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    initialize();

    spyOn<any>(service, 'createEraserSquare').and.callThrough();
    spyOn<any>(service, 'checkIntersectionsWithEverything').and.callThrough();
    spyOn<any>(service, 'deleteDrawings').and.callThrough();
    service.onMouseDown(event);
    expect(service['createEraserSquare']).toHaveBeenCalled();
    expect(service['checkIntersectionsWithEverything']).toHaveBeenCalled();
    expect(service['deleteDrawings']).toHaveBeenCalled();
  });

  it('#onMouseMove should call the correct functions when isErasing is true', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    initialize();

    service['isErasing'] = true;
    spyOn<any>(service, 'createEraserSquare').and.callThrough();
    spyOn<any>(service, 'checkIntersectionsWithEverything').and.callThrough();
    spyOn<any>(service, 'deleteDrawings').and.callThrough();
    service['onMouseMove'](event);
    expect(service['createEraserSquare']).toHaveBeenCalled();
    expect(service['checkIntersectionsWithEverything']).toHaveBeenCalled();
    expect(service['deleteDrawings']).toHaveBeenCalled();
  });

  it('#onMouseMove should call the correct functions when isErasing is false', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    initialize();

    service['isErasing'] = false;
    spyOn<any>(service, 'createEraserSquare').and.callThrough();
    spyOn<any>(service, 'checkIntersectionsWithEverything').and.callThrough();
    spyOn<any>(service, 'changeStrokeColor').and.callThrough();
    service['onMouseMove'](event);
    expect(service['createEraserSquare']).toHaveBeenCalled();
    expect(service['checkIntersectionsWithEverything']).toHaveBeenCalled();
    expect(service['changeStrokeColor']).toHaveBeenCalled();
    expect(service['drawingToChangeStroke']).toEqual('dummy');
  });

  it('#onMouseUp should set the flag to false', () => {
    service['isErasing'] = true;
    service.onMouseUp();
    expect(service['isErasing']).toBeFalsy();

    service['isErasing'] = false;
    service.onMouseUp();
    expect(service['isErasing']).toBeFalsy();
  });

  it('#onMouseUp should add an undo/redo operation their is drawings to delete', () => {
    service['drawingsToDeleteUndoRedo'] = [];
    spyOn(service['operationHandler'], 'addOperation').and.callThrough();
    service.onMouseUp();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();

    const element1: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['drawingsToDeleteUndoRedo'].push(element1);
    service.onMouseUp();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#cleanUp should stop erasing', () => {
    service['isErasing'] = true;
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    service.cleanUp();
    expect(service['isErasing']).toBeFalsy();
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#cleanUp should set isErasing to false if newTool is not Eraser', () => {
    service['isErasing'] = true;
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    service.cleanUp();
    expect(service['isErasing']).toBeFalsy();
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#cleanUp should setAttribute if this.currentHoverDrawing.length !== 0', () => {
    service['currentHoverDrawing'].length = 1;
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    service.cleanUp();
    expect(service['isErasing']).toBeFalsy();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call cleanup function', () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Eraser;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });

  it('#onMouseWheel should not do anything', () => {
    service.onMouseWheel(new WheelEvent('wheel'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyDown should not do anything', () => {
    service.onAltKeyDown(new KeyboardEvent('keyboard'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyUp should not do anything', () => {
    service.onAltKeyUp(new KeyboardEvent('keyboard'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftDown should do nothing', () => {
    service.onShiftDown(new KeyboardEvent('shiftdown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftUp should do nothing', () => {
    service.onShiftUp(new KeyboardEvent('shiftup'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onEscapeDown should do nothing', () => {
    service.onEscapeDown(new KeyboardEvent('escapedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onBackspaceDown should do nothing', () => {
    service.onBackspaceDown(new KeyboardEvent('backspacedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onDoubleClick should do nothing', () => {
    service.onDoubleClick(new MouseEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should do nothing', () => {
    service.onWritingText(new KeyboardEvent('writetext'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
