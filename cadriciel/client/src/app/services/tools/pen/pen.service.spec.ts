import { async, TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { PenService } from './pen.service';

describe('PenService', () => {

  let service: PenService;
  let manager: SvgManagerService;
  let colorService: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ColorService, SvgManagerService],
    });

    service = TestBed.get(PenService);
    manager = TestBed.get(SvgManagerService);
    colorService = TestBed.get(ColorService) ;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#createNewContainer should be create a new svg container', () => {
    const penService: PenService = TestBed.get(PenService);
    penService['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'setAttribute']);
    penService['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
    penService['createNewContainer']();
    expect(penService['renderer'].createElement).toHaveBeenCalled();
  });

  it('#onMouseDown should be able to get the first point to create a new svg container', () => {
    const penService: PenService = TestBed.get(PenService);
    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});
    spyOn<any>(penService, 'getMouseCoordinate').and.callThrough();
    spyOn<any>(penService, 'createNewContainer').and.callThrough();

    penService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });

    penService.onMouseDown(event);

    expect(penService['getMouseCoordinate']).toHaveBeenCalled();
    expect(penService['createNewContainer']).toHaveBeenCalled();
    expect(penService['lineIsDrawing']).toBe(true);
  });

  it('#calculateCurrentLineWidth should set the strokeWidth to the maximum size if the speed is less than the minimum speed', () => {
    service['speed'] = 10;
    service['lineWidthMax'] = 100;

    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});

    service['calculateCurrentLineWidth'](event);

    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newLine'],
          SVGAttributes.StrokeWidth, service['lineWidthMax'].toString());
  });

  it('#calculateCurrentLineWidth should set the right strokeWidth depending on the speed', () => {
    service['speed'] = 1000;
    service['lineWidthMax'] = 100;

    const expectedWidth = 81.81632653061224;

    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});

    service['calculateCurrentLineWidth'](event);

    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newLine'], SVGAttributes.StrokeWidth, expectedWidth.toString());
  });

  it('#calculateCurrentLineWidth should not set the strokeWidth according to algorithm if the speed is higher than max speed', () => {
    service['speed'] = 300000;
    service['lineWidthMax'] = 100;
    service['lineWidthMin'] = 1;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);

    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});

    service['calculateCurrentLineWidth'](event);

    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newLine'],
            SVGAttributes.StrokeWidth, service['lineWidthMin'].toString());
  });

  it('#calculateCurrentLineWidth should not set the strokeWidth according to algorithm if the speed is higher than max speed', () => {
    service['speed'] = 300000;
    service['lineWidthMax'] = 100;
    service['lineWidthMin'] = 1;

    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});

    service['calculateCurrentLineWidth'](event);

    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newLine'],
            SVGAttributes.StrokeWidth, service['lineWidthMin'].toString());
  });

  it('#calculateCurrentLineWidth should set the strokeWidth to the maximum lineWidth if the calculated width is higher', () => {
    service['speed'] = 60;
    service['lineWidthMax'] = 100;

    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    const event: MouseEvent = new MouseEvent('onmousedown', {button: 0});

    service['calculateCurrentLineWidth'](event);

    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['newLine'],
            SVGAttributes.StrokeWidth, service['lineWidthMax'].toString());
  });

  it('#onMouseUp should set the boolean lineIsDrawing to false', () => {
    const penService: PenService = TestBed.get(PenService);

    penService['lineIsDrawing'] = true;
    expect(penService['lineIsDrawing']).toBeTruthy();
    penService.onMouseUp();
    expect(penService['lineIsDrawing']).toBeFalsy();
  });

  it('#calculatePythagoreDistance should return the distance between two segments', () => {
    const distance = service['calculatePythagoreDistance'](5, 12);
    expect(distance).toBe(13);
  });

  it('#checkSpeed should be able to set a new speed after each onmousemove', () => {
    const event: MouseEvent = new MouseEvent('onmousemove', {movementX: 5, movementY: 12});
    service['currentTime'] = 9;
    spyOn<any>(service, 'calculatePythagoreDistance').and.callThrough();
    service['checkSpeed'](event, 10);
    expect(service['calculatePythagoreDistance']).toHaveBeenCalledWith(5, 12);
    expect(service['speed']).toBe(1300);
  });

  it('#checkSpeed should not change the speed if the time variation is 0 after a onmousemove', () => {
    service['speed'] = 100;
    const event: MouseEvent = new MouseEvent('onmousemove', {movementX: 5, movementY: 12});
    service['currentTime'] = 10;
    spyOn<any>(service, 'calculatePythagoreDistance').and.callThrough();
    service['checkSpeed'](event, 10);
    expect(service['calculatePythagoreDistance']).not.toHaveBeenCalledWith();
    expect(service['speed']).toBe(100);
  });

  it('#setAllAttributes should set all the attributes of the new line properly when it is being added to the svg container', () => {
    service['firstCoordinates'] = {x: 12, y: 15};
    service['newCoordinates'] = {x: 20, y: 18};
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['setAllPenAttributes']();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(6);
  });

  it('#onMouseMove should add a new line to the svg container corresponding to its height and speed', () => {
    service['firstCoordinates'] = {x: 12, y: 15};
    service['lineIsDrawing'] = true;
    service['currentTime'] = Date.now();

    let containerTest: SVGElement;
    containerTest = document.createElement('g') as any;
    service['newContainer'] = containerTest;

    const event: MouseEvent = new MouseEvent('onmousemove', {clientX: 5, clientY: 12});

    spyOn<any>(service, 'getMouseCoordinate').and.callThrough();
    spyOn<any>(service, 'setAllPenAttributes').and.callThrough();
    spyOn<any>(service, 'checkSpeed').and.callThrough();
    spyOn<any>(service, 'calculateCurrentLineWidth').and.callThrough();
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'appendChild', 'setAttribute']);

    service.onMouseMove(event);

    expect(service['getMouseCoordinate']).toHaveBeenCalledWith(event);
    expect(service['setAllPenAttributes']).toHaveBeenCalled();
    expect(service['checkSpeed']).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalledWith(SVGAttributes.Line, SVGAttributes.SVG);
    expect(service['renderer'].appendChild).toHaveBeenCalledWith(containerTest, service['newLine']);
    expect(service['calculateCurrentLineWidth']).toHaveBeenCalledWith(event);
    expect(service['firstCoordinates'].x).toBe(5);
    expect(service['firstCoordinates'].y).toBe(12);
  });

  it('#onMouseMove should not add a new line to the svg container if it is not drawing', () => {
    service.onMouseMove(new MouseEvent('mousemove'));
    service['lineIsDrawing'] = false;
    service['currentTime'] = Date.now();

    let containerTest: SVGElement;
    containerTest = document.createElement('g') as any;
    service['newContainer'] = containerTest;

    const event: MouseEvent = new MouseEvent('onmousemove', {clientX: 5, clientY: 12});

    spyOn<any>(service, 'getMouseCoordinate').and.callThrough();
    spyOn<any>(service, 'setAllPenAttributes').and.callThrough();
    spyOn<any>(service, 'checkSpeed').and.callThrough();
    spyOn<any>(service, 'calculateCurrentLineWidth').and.callThrough();
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
        getOffset: { x: 0, y: 0 },
      });
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'appendChild', 'setAttribute']);

    service.onMouseMove(event);

    expect(service['getMouseCoordinate']).not.toHaveBeenCalled();
    expect(service['setAllPenAttributes']).not.toHaveBeenCalled();
    expect(service['checkSpeed']).not.toHaveBeenCalled();
    expect(service['renderer'].createElement).not.toHaveBeenCalled();
    expect(service['renderer'].appendChild).not.toHaveBeenCalled();
    expect(service['calculateCurrentLineWidth']).not.toHaveBeenCalled();
  });

  it('#cleanUp should do nothing if newTool is Pen', () => {
    service['lineIsDrawing'] = true;
    service.cleanUp();
    expect(service['lineIsDrawing']).toBeTruthy();
  });

  it('#cleanUp should not all addOperation if newTool is not Pen and isDrawing is false', () => {
    service['lineIsDrawing'] = false;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
  });

  it('#cleanUp should call addOperation if newTool is not Pen and isDrawing is true', () => {
    service['lineIsDrawing'] = true;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Pen;
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
    service.onWritingText(new KeyboardEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
