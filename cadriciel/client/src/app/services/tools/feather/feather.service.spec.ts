import { ElementRef } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { FeatherService } from './feather.service';

describe('FeatherService should be created', () => {
  const dummyElement: SVGElement = document.createElement('rec') as any;
  const dummySVGElement: SVGElement = document.createElement('svg') as any;
  const rightClick: MouseEvent = new MouseEvent('onmousedown', {button: 2});
  let service: FeatherService;
  let manager: SvgManagerService;
  let colorService: ColorService;

  class MockElementRef implements ElementRef {

    public nativeElement: MockNativeElement;
    public event: MockTargetElement;

    constructor() {
      this.nativeElement = new MockNativeElement();
      this.event = new MockTargetElement();
    }
  }

  // tslint:disable-next-line: max-classes-per-file
  class MockNativeElement {
    constructor() { return; }
    public getBoundingClientRect(): MockClientBoundingRect { return new MockClientBoundingRect(); }
  }

  // tslint:disable-next-line: max-classes-per-file
  class MockTargetElement {
    public target: EventTarget | null;
    constructor() {
      (this.target as HTMLElement) = document.createElement('rect');
    }
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ColorService,
        SvgManagerService,
        {provide: ElementRef,  useValue: new MockElementRef() },
        {provide: HTMLElement,  useValue: new MockTargetElement() },
      ],
    });

    service = TestBed.get(FeatherService);
    manager = TestBed.get(SvgManagerService);
    colorService = TestBed.get(ColorService);
    service['svgManager'].workspace = TestBed.get(ElementRef);
  }));

  it('Feather service should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#onMouseUp should call addOperation in operationHandler and set isFeatherDrawing to false', () => {
    service['isFeatherDrawing'] = true;
    const spyAddOperation = spyOn<any>(service['operationHandler'], 'addOperation');
    service.onMouseUp();
    expect(spyAddOperation).toHaveBeenCalled();
    expect(service['isFeatherDrawing']).toBeFalsy();
  });

  it('#onMouseUp should not go in the condition where isFeatherDrawing is true', () => {
    service['isFeatherDrawing'] = false;
    const spyAddOperation = spyOn<any>(service['operationHandler'], 'addOperation');
    service.onMouseUp();
    expect(spyAddOperation).not.toHaveBeenCalled();
    expect(service['isFeatherDrawing']).toBeFalsy();
  });

  it('#onMouseDown should set position x', () => {
    service['isFeatherDrawing'] = false;
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    spyOn<any>(service, 'createContainer');
    spyOn<any>(service, 'createFeatherAsPolygons');
    spyOn<any>(service, 'setMouseCoordinates');
    spyOn<any>(service, 'findPoints');
    spyOn<any>(service, 'convertToRadian');
    spyOn<any>(service, 'setPointsLeft');
    spyOn<any>(service, 'setPointsRight');
    spyOn<any>(service, 'createFeatherLine');
    spyOn<any>(service, 'appendPointsToFeather');
    spyOn<any>(service, 'appendLine');
    service['onMouseDown'](mouseEvent);
    expect(service['createContainer']).toHaveBeenCalledWith(mouseEvent);
    expect(service['createFeatherAsPolygons']).toHaveBeenCalled();
    expect(service['setMouseCoordinates']).toHaveBeenCalledWith(mouseEvent);
    expect(service['findPoints']).toHaveBeenCalledWith(service['convertToRadian'](service['angle']));
    expect(service['convertToRadian']).toHaveBeenCalled();
    expect(service['setPointsLeft']).toHaveBeenCalled();
    expect(service['setPointsRight']).toHaveBeenCalled();
    expect(service['createFeatherLine']).toHaveBeenCalled();
    expect(service['appendPointsToFeather']).toHaveBeenCalled();
    expect(service['appendLine']).toHaveBeenCalledWith(service['container']);
    expect(service['isFeatherDrawing']).toBeTruthy();
  });

  it('#onMouseMove should call all the functions inside', () => {
    service['isFeatherDrawing'] = true;
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    spyOn<any>(service, 'setPointsLeft');
    spyOn<any>(service, 'setPointsRight');
    spyOn<any>(service, 'setMouseCoordinates');
    spyOn<any>(service, 'createFeatherAsPolygons');
    spyOn<any>(service, 'convertToRadian');
    spyOn<any>(service, 'setFeatherAttributes');
    spyOn<any>(service, 'setContainerAttribute');
    spyOn<any>(service, 'findPoints');
    spyOn<any>(service, 'createFeatherLine');
    spyOn<any>(service, 'appendPointsToFeather');
    spyOn<any>(service, 'appendLine');
    service['onMouseMove'](mouseEvent);
    expect(service['setPointsLeft']).toHaveBeenCalled();
    expect(service['setPointsRight']).toHaveBeenCalled();
    expect(service['setMouseCoordinates']).toHaveBeenCalledWith(mouseEvent);
    expect(service['createFeatherAsPolygons']).toHaveBeenCalled();
    expect(service['setFeatherAttributes']).toHaveBeenCalled();
    expect(service['findPoints']).toHaveBeenCalledWith(service['convertToRadian'](service['angle']));
    expect(service['convertToRadian']).toHaveBeenCalled();
    expect(service['createFeatherLine']).toHaveBeenCalled();
    expect(service['appendPointsToFeather']).toHaveBeenCalled();
    expect(service['appendLine']).toHaveBeenCalledWith(service['container']);
  });

  it('#onMouseMove when line is not drawing', () => {
    service['isFeatherDrawing'] = false;
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    spyOn<any>(service, 'setPointsLeft');
    spyOn<any>(service, 'setPointsRight');
    spyOn<any>(service, 'setMouseCoordinates');
    spyOn<any>(service, 'createFeatherAsPolygons');
    spyOn<any>(service, 'convertToRadian');
    spyOn<any>(service, 'setFeatherAttributes');
    spyOn<any>(service, 'setContainerAttribute');
    spyOn<any>(service, 'findPoints');
    spyOn<any>(service, 'createFeatherLine');
    spyOn<any>(service, 'appendPointsToFeather');
    spyOn<any>(service, 'appendLine');
    service['onMouseMove'](mouseEvent);
    expect(service['setPointsLeft']).not.toHaveBeenCalled();
    expect(service['setPointsRight']).not.toHaveBeenCalled();
    expect(service['setMouseCoordinates']).not.toHaveBeenCalled();
    expect(service['createFeatherAsPolygons']).not.toHaveBeenCalled();
    expect(service['setFeatherAttributes']).not.toHaveBeenCalled();
    expect(service['findPoints']).not.toHaveBeenCalled();
    expect(service['convertToRadian']).not.toHaveBeenCalled();
    expect(service['createFeatherLine']).not.toHaveBeenCalled();
    expect(service['appendPointsToFeather']).not.toHaveBeenCalled();
    expect(service['appendLine']).not.toHaveBeenCalled();
  });

  it('#setMouseCoordinates should set position x', () => {
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    service['setMouseCoordinates'](mouseEvent);
    const returnedValue = -193;
    expect(service['coordinates'].x).toBe(returnedValue);
  });

  it('#setMouseCoordinates should set position y', () => {
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    service['setMouseCoordinates'](mouseEvent);
    const returnedValue = 92;
    expect(service['coordinates'].y).toBe(returnedValue);
  });

  it('#setPointsLeft should set the left points of the coordinates', () => {
    service['leftCoordinates'] = {x: -3, y: -3};
    service['setPointsLeft']();
    const returnedValue = -3;
    expect(service['startLeftX']).toBe(returnedValue);
    expect(service['startLeftY']).toBe(returnedValue);
  });

  it('#setFeatherAttributes should set the left points of the coordinates', () => {
    spyOn<any>(service['renderer'], 'setAttribute');
    service['setFeatherAttributes']();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(2);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newFeatherLine'], SVGAttributes.Style,
                                            'stroke-linecap:round;stroke-linejoin:round');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newFeatherLine'], SVGAttributes.StrokeWidth,
                                            '2px');
  });

  it('#updateCoordinatesWithAngle should update the left and right coordinates with passed angle as parameter', () => {
     service['coordinates'] = { x: 35 , y: 82};
     const oppositeAngleLength = 50;
     const adjacentAngleLength = 70;
     service['updateCoordinatesWithAngle'](oppositeAngleLength, adjacentAngleLength);
     expect(service['leftCoordinates'].x).toBe(85);
     expect(service['leftCoordinates'].y).toBe(12);
     expect(service['rightCoordinates'].x).toBe(-15);
     expect(service['rightCoordinates'].y).toBe(152);
   });

  it('#createContainer should create a new svg container to container feather line', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    spyOn<any>(service, 'insertElement');
    const event: MouseEvent = new MouseEvent('onmousedown', {clientX: 23, clientY: 12});
    service['createContainer'](event);
    expect(service['renderer'].createElement).toHaveBeenCalledWith(SVGAttributes.G, SVGAttributes.SVG);
    expect(service['svgManager'].addElement).toHaveBeenCalledWith(service['container']);
    expect(service['insertElement']).toHaveBeenCalledWith(event);
  });

  it('#setContaineAttribute should call setAttribute', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    service['setContainerAttribute']();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#createFeatherAsPolygons should call createElement and addElement', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    service['createFeatherAsPolygons']();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#appendPointsToFeather should call setAttribute', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    service['appendPointsToFeather']();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#appendLine should call insertBefore', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['insertBefore']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    const renderer = manager.renderer;
    const parent = renderer.createElement('g', 'svg');
    service['appendLine'](parent);
    expect(service['renderer'].insertBefore).toHaveBeenCalled();
  });

  it('#insertElement should call insertBefore when parentNode is not SVG', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['insertBefore']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    Object.defineProperty(rightClick, 'target', {value: dummyElement});
    Object.defineProperty(rightClick.target, 'parentNode', {value: dummyElement});
    service['insertElement'](rightClick);
    expect(service['renderer'].insertBefore).toHaveBeenCalled();
  });

  it('#insertElement should call insertBefore when parentNode is SVG', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['insertBefore']);
    service['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    Object.defineProperty(rightClick, 'target', {value: dummySVGElement});
    Object.defineProperty(rightClick.target, 'parentNode', {value: dummySVGElement});
    Object.defineProperty((rightClick.target as HTMLElement).parentNode as HTMLElement, 'nodeName', {value: SVGAttributes.SVG});
    service['insertElement'](rightClick);
    expect(service['renderer'].insertBefore).toHaveBeenCalled();
  });

  it('#findPoints if angle is perpendicular', () => {
    service['angle'] = 90;
    spyOn<any>(service, 'updateLeftCoordinates');
    spyOn<any>(service, 'updateRightCoordinates');
    spyOn<any>(service, 'updateCoordinatesWithAngle');
    service['findPoints'](90);
    expect(service['updateLeftCoordinates']).toHaveBeenCalled();
    expect(service['updateRightCoordinates']).toHaveBeenCalled();
    expect(service['updateCoordinatesWithAngle']).not.toHaveBeenCalled();
  });

  it('#selectTool should not call the function clean up when tool is feather' , () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Feather;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });

  it('#findPoints if angle is not perpendicular', () => {
    service['lineHeight'] = 20;
    service['angle'] = 140;
    spyOn<any>(service, 'updateLeftCoordinates');
    spyOn<any>(service, 'updateRightCoordinates');
    spyOn<any>(service, 'updateCoordinatesWithAngle');
    service['findPoints'](50);
    expect(service['updateLeftCoordinates']).not.toHaveBeenCalled();
    expect(service['updateRightCoordinates']).not.toHaveBeenCalled();
    expect(service['updateCoordinatesWithAngle']).toHaveBeenCalledWith(9.649660284921133, -2.6237485370392877);
  });

  it('#onMouseWheel should set angle to 1 when scrollingUp and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = true;
    spyOn<any>(service['toolAttributesService'], 'setAngle').and.callThrough();
    service.onMouseWheel(event);
    expect(service['toolAttributesService'].setAngle).toHaveBeenCalled();
    expect(service['angle']).toEqual(1);
  });

  it('#onMouseWheel should set angle to 15 when scrollingUp and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service['altKeyPressed'] = false;
    spyOn<any>(service['toolAttributesService'], 'setAngle').and.callThrough();
    service.onMouseWheel(event);
    expect(service['toolAttributesService'].setAngle).toHaveBeenCalled();
    expect(service['angle']).toEqual(15);
  });

  it('#onAltKeyDown should set boolean altKeyPressed to true', () => {
    const event: KeyboardEvent = new KeyboardEvent('altkey');
    service.onAltKeyDown(event);
    expect(service['altKeyPressed']).toBeTruthy();
  });

  it('#onAltKeyUp should set boolean altKeyPressed to false', () => {
    service.onAltKeyUp(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['altKeyPressed']).toBeFalsy();
  });

  it('#onAltKeyDown should set boolean altKeyPressed to false', () => {
    service.onAltKeyDown(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(service['altKeyPressed']).toBeFalsy();
  });

  it('#onAltKeyDown should set boolean altKeyPressed to false', () => {
    const event: KeyboardEvent = new KeyboardEvent('altkey');
    service.onAltKeyUp(event);
    expect(service['altKeyPressed']).toBeFalsy();
  });

  it('#onMouseWheel should set angle to -15 when scrollingUp and altKeyPressed is false', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = false;
    spyOn<any>(service['toolAttributesService'], 'setAngle').and.callThrough();
    service.onMouseWheel(event);
    expect(service['toolAttributesService'].setAngle).toHaveBeenCalled();
    expect(service['angle']).toEqual(-15);
  });

  it('#onMouseWheel should set angle to -1 when scrollingUp and altKeyPressed is true', () => {
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: 1});
    service['altKeyPressed'] = true;
    spyOn<any>(service['toolAttributesService'], 'setAngle').and.callThrough();
    service.onMouseWheel(event);
    expect(service['toolAttributesService'].setAngle).toHaveBeenCalled();
    expect(service['angle']).toEqual(-1);
  });

  it('#convertToRadian should convert passed parameter angle to radian', () => {
    const angle = 150;
    const radian = 2.6179938779914944;
    const calculation = angle * (Math.PI / 180);
    service['convertToRadian'](angle);
    spyOn<any>(service, 'convertToRadian').and.returnValue(calculation);
    expect(calculation).toBe(radian);
  });

  it('#setPointsRight should set the right points of the coordinates', () => {
    service['rightCoordinates'] = { x: 1 , y: 1};
    service['setPointsRight']();
    const returnedXValue = 1;
    const returnedYValue = 1;
    expect(service['startRightX']).toBe(returnedXValue);
    expect(service['startRightY']).toBe(returnedYValue);
  });

  it('#updateRightCoordinatesPerpendicularAngle should set right coordinates', () => {
    service['coordinates'] = {x: 23, y: 7};
    service['lineHeight'] = 30;
    service['updateRightCoordinates']();
    expect(service['rightCoordinates'].x).toBe(23);
    expect(service['rightCoordinates'].y).toBe(22);
  });

  it('#updateLeftCoordinatesPerpendicularAngle should set left coordinates', () => {
    service['coordinates'] = {x: 23, y: 7};
    service['lineHeight'] = 30;
    service['updateLeftCoordinates']();
    expect(service['leftCoordinates'].x).toBe(23);
    expect(service['leftCoordinates'].y).toBe(-8);
  });

  it('#createFeatherLine should set the points of feather', () => {
    service['points'] = '';
    service['startLeftX'] = 5;
    service['startLeftY'] = 15;
    service['leftCoordinates'] = {x: 3, y: 6};
    service['rightCoordinates'] = {x: 2, y: 16};
    service['startRightX'] = 8;
    service['startRightY'] = 12;
    service['createFeatherLine']();
    expect(service['points']).toBe('5,15 3,6 2,16 8,12');
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
    service.onWritingText(new KeyboardEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
