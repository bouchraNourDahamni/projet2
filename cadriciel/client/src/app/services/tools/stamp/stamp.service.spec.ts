import { ElementRef } from '@angular/core';
import { async, TestBed} from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { StampTextures } from './stamp-textures';
import { StampService } from './stamp.service';

const SMALL_ANGLE_RADIANS = 0.0174533;
const LARGE_ANGLE_RADIANS = 0.261799;

class MockElementRef implements ElementRef {

  public nativeElement: MockNativeElement;

  constructor() {
    this.nativeElement = new MockNativeElement();
  }
}

// tslint:disable-next-line: max-classes-per-file
class MockNativeElement {
  constructor() { return; }
  public getBoundingClientRect(): MockClientBoundingRect { return new MockClientBoundingRect(); }
}

// tslint:disable-next-line: max-classes-per-file
class MockClientBoundingRect {
public left: number;
public top: number;

constructor() {
    this.left = 293;
    this.top = 8;
  }
}

describe('StampService', () => {
  let service: StampService ;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ColorService, ToolAttributesService, SvgManagerService, {provide: ElementRef,  useValue: new MockElementRef()}],
    });

    service = TestBed.get(StampService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
    service['svgManager'].workspace = TestBed.get(ElementRef);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#onMouseDown should do nothing if the texture is none', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['stampPreview'] = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['stampTexture'] = StampTextures.None;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      addElement: jasmine.createSpy('addElement'),
      getOffset: { x: 0, y: 0 },
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service['operationHandler'] = jasmine.createSpyObj('operationHandler', ['addOperation']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    spyOn<any>(service, 'setMouseCoordinate').and.callThrough();
    service.onMouseDown(event);
    expect(service['setMouseCoordinate']).not.toHaveBeenCalled();
    expect(service['renderer'].createElement).not.toHaveBeenCalled();
    expect(service['svgManager'].addElement).not.toHaveBeenCalled();
    expect(service['setAllStampAttributes']).not.toHaveBeenCalled();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
  });

  it('#onMouseDown should call five functions if the texture is not none', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['stampPreview'] = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['stampTexture'] = StampTextures.Stamp1;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      addElement: jasmine.createSpy('addElement'),
      getOffset: { x: 0, y: 0 },
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service['operationHandler'] = jasmine.createSpyObj('operationHandler', ['addOperation']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    spyOn<any>(service, 'setMouseCoordinate').and.callThrough();
    service.onMouseDown(event);
    expect(service['setMouseCoordinate']).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['svgManager'].addElement).toHaveBeenCalled();
    expect(service['setAllStampAttributes']).toHaveBeenCalled();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#onMouseMove should only call two functions when previewIsShowing to true', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['stampPreview'] = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['stampTexture'] = StampTextures.None;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      addElement: jasmine.createSpy('addElement'),
      getOffset: { x: 0, y: 0 },
    });
    service['previewIsShowing'] = true;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    spyOn<any>(service, 'setMouseCoordinate').and.callThrough();
    service.onMouseMove(event);
    expect(service['setMouseCoordinate']).toHaveBeenCalled();
    expect(service['renderer'].createElement).not.toHaveBeenCalled();
    expect(service['svgManager'].addElement).not.toHaveBeenCalled();
    expect(service['setAllStampAttributes']).toHaveBeenCalled();
  });

  it('#onMouseMove should call four functions when previewIsShowing to false', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['stampPreview'] = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['stampTexture'] = StampTextures.Stamp1;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      addElement: jasmine.createSpy('addElement'),
      getOffset: { x: 0, y: 0 },
    });
    service['previewIsShowing'] = false;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    spyOn<any>(service, 'setMouseCoordinate').and.callThrough();
    service.onMouseMove(event);
    expect(service['setMouseCoordinate']).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['svgManager'].addElement).toHaveBeenCalled();
    expect(service['setAllStampAttributes']).toHaveBeenCalled();
  });

  it('#onMouseWheel should set angle to small_angle and call setAllStampAttributes when scrollingUp and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = true;
    service['previewIsShowing'] = true;
    service['angle'] = 0;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['stampPreview'] = jasmine.createSpyObj('preview', {
      getBoundingClientRect: {left: 0, top: 0, right: 0, bottom: 0},
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    service.onMouseWheel(event);
    expect(service['setAllStampAttributes']).toHaveBeenCalled();
    expect(service['angle']).toEqual(SMALL_ANGLE_RADIANS);
  });

  it('#onMouseWheel should set angle to large_angle and not call setAllStampAttributes when scrollingUp and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = false;
    service['previewIsShowing'] = false;
    service['angle'] = 0;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['stampPreview'] = jasmine.createSpyObj('preview', {
      getBoundingClientRect: {left: 0, top: 0, right: 0, bottom: 0},
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    service.onMouseWheel(event);
    expect(service['setAllStampAttributes']).not.toHaveBeenCalled();
    expect(service['angle']).toEqual(LARGE_ANGLE_RADIANS);
  });

  // tslint:disable-next-line: max-line-length
  it('#onMouseWheel should set angle to -small_angle and not call setAllStampAttributes when scrollingDown and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = true;
    service['previewIsShowing'] = false;
    service['angle'] = 0;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['stampPreview'] = jasmine.createSpyObj('preview', {
      getBoundingClientRect: {left: 0, top: 0, right: 0, bottom: 0},
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    service.onMouseWheel(event);
    expect(service['setAllStampAttributes']).not.toHaveBeenCalled();
    expect(service['angle']).toEqual(-SMALL_ANGLE_RADIANS);
  });

  it('#onMouseWheel should set angle to -large_angle and call setAllStampAttributes when scrollingDown and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = false;
    service['previewIsShowing'] = true;
    service['angle'] = 0;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['stampPreview'] = jasmine.createSpyObj('preview', {
      getBoundingClientRect: {left: 0, top: 0, right: 0, bottom: 0},
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    spyOn<any>(service, 'setAllStampAttributes').and.returnValue({});
    service.onMouseWheel(event);
    expect(service['setAllStampAttributes']).toHaveBeenCalled();
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

  it('#setMouseCoordinate should give the correct coordinates', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 10, clientY: 20});
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 10, y: 5 },
    });
    service['setMouseCoordinate'](event);
    expect(service['currentMouseCoordinates']).toEqual({x: 0, y: 15});
  });

  it('#setStampImage should setAttribute and getBoundingClientRect', () => {
    const element = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    spyOn<any>(element, 'getBoundingClientRect').and.returnValue({});
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    spyOn<any>(service, 'cleanUp');
    service['setStampImage'](element);
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
    expect(element.getBoundingClientRect).toHaveBeenCalled();
  });

  it('#setColor should call setAttribute 2 times', () => {
    const element = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    service['setColor'](element);
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(2);
  });

  it('#findCenter should get the center', () => {
    service['stampBoundingRect'] = {left: 10, top: 20, right: 30, bottom: 40} as ClientRect;
    service['size'] = 1;
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    expect(service['findCenter']()).toEqual({x: 10, y: 10});
  });

  it('#getMatrixRotate should get the correct matrix', () => {
    service['angle'] = 0.5;
    expect(service['getMatrixRotate']({x: 10, y: 10})).toEqual({a: 0.878, b: 0.479, c: -0.479, d: 0.878, e: 6.018, f: -3.57});
  });

  it('#setTransformation should call findCenter, getMatrixRotate, matrixMultiply 2 times, setAttribute, matrixToString', () => {
    const element = service['renderer'].createElement(SVGAttributes.DPath, SVGAttributes.SVG);
    spyOn<any>(service, 'findCenter').and.returnValue({});
    spyOn<any>(service, 'getMatrixRotate').and.returnValue({});
    spyOn<any>(service['matrixManipulations'], 'matrixMultiply').and.returnValue({});
    spyOn<any>(service['matrixManipulations'], 'matrixToString').and.returnValue({});
    spyOn<any>(service['renderer'], 'setAttribute').and.returnValue({});
    service['setTransformation'](element);
    expect(service['findCenter']).toHaveBeenCalled();
    expect(service['getMatrixRotate']).toHaveBeenCalled();
    expect(service['matrixManipulations']['matrixMultiply']).toHaveBeenCalledTimes(2);
    expect(service['matrixManipulations']['matrixToString']).toHaveBeenCalled();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setAllStampAttributes should call getColor and setTransformation', () => {
    const element = service['renderer'].createElement(SVGAttributes.DPath, SVGAttributes.SVG);
    spyOn<any>(service, 'setColor').and.returnValue({});
    spyOn<any>(service, 'setTransformation').and.returnValue({});
    service['setAllStampAttributes'](element);
    expect(service['setColor']).toHaveBeenCalled();
    expect(service['setTransformation']).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Stamp;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });

  it('#updatePreview should not call the function', () => {
    spyOn<any>(service, 'setTransformation');
    service['updatePreview']();
    expect(service['setTransformation']).not.toHaveBeenCalled();
  });

  it('#updatePreview should not call the function', () => {
    spyOn<any>(service, 'setTransformation');
    service['previewIsShowing'] = true;
    service['updatePreview']();
    expect(service['setTransformation']).toHaveBeenCalled();
  });

  it('#updateStampImage should call setStampImage when previewIsShowing', () => {
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    spyOn<any>(service['renderer'], 'createElement').and.returnValue({});
    spyOn<any>(service['svgManager'], 'addElement').and.returnValue({});
    service['previewIsShowing'] = true;
    service['updateStampImage']();
    expect(service['setStampImage']).toHaveBeenCalled();
  });

  it('#updateStampImage should not call setStampImage when not previewIsShowing', () => {
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    spyOn<any>(service['renderer'], 'createElement').and.returnValue({});
    spyOn<any>(service['svgManager'], 'addElement').and.returnValue({});
    service['updateStampImage']();
    expect(service['setStampImage']).not.toHaveBeenCalled();
  });

  it('#updateStampColor should not call the function', () => {
    spyOn<any>(service, 'setColor');
    service['updateStampColor']();
    expect(service['setColor']).not.toHaveBeenCalled();
  });

  it('#updateStampColor should call the function', () => {
    spyOn<any>(service, 'setColor');
    service['previewIsShowing'] = true;
    service['updateStampColor']();
    expect(service['setColor']).toHaveBeenCalled();
  });

  it('#updateStampTransformation should not call the function', () => {
    spyOn<any>(service, 'setTransformation').and.returnValue({});
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    service['updateStampTransformation']();
    expect(service['setTransformation']).not.toHaveBeenCalled();
  });

  it('#updateStampTransformation should call the function', () => {
    spyOn<any>(service, 'setTransformation').and.returnValue({});
    spyOn<any>(service, 'setStampImage').and.returnValue({});
    service['previewIsShowing'] = true;
    service['updateStampTransformation']();
    expect(service['setTransformation']).toHaveBeenCalled();
  });

  it('#onMouseUp should do nothing', () => {
    service.onMouseUp();
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
    service.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });

});
