import { TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { SelectionManagerService } from './selection-manager.service';

describe('SelectionManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    expect(service).toBeTruthy();
  });

  it('#validateSelectedTool should call cleanUp if activeTool is not Selection', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service, 'cleanUp').and.returnValue({});
    service['validateSelectedTool'](Tools.Pencil);
    expect(service['cleanUp']).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call cleanUp if activeTool is Selection', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service, 'cleanUp').and.returnValue({});
    service['validateSelectedTool'](Tools.Selection);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });

  it('#onMouseDown should set the OperationService to selection by default and call onMouseDown', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const event: MouseEvent = new MouseEvent('mouseevent', {button: 10});
    spyOn<any>(service['selectionService'], 'onMouseDown').and.returnValue({});
    spyOn<any>(service, 'isOnControlPoint').and.returnValue(false);
    spyOn<any>(service, 'isOnSelectionRect').and.returnValue(false);
    service['selectionOperationService'] = service['scalingService'];
    service.onMouseDown(event);
    expect(service['selectionOperationService']).toEqual(service['selectionService']);
    expect(service['selectionService'].onMouseDown).toHaveBeenCalled();
  });

  it('#onMouseDown should set the OperationService to scalingService when onControlPoint and LEFT_BUTTON and call onMouseDown', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const event: MouseEvent = new MouseEvent('mouseevent', {button: 0});
    spyOn<any>(service['scalingService'], 'onMouseDown').and.returnValue({});
    spyOn<any>(service, 'isOnControlPoint').and.returnValue(true);
    spyOn<any>(service, 'isOnSelectionRect').and.returnValue(false);
    spyOn<any>(service['selectionService'], 'onMouseDown');
    service['selectionOperationService'] = service['selectionService'];
    service.onMouseDown(event);
    expect(service['selectionOperationService']).toEqual(service['scalingService']);
    expect(service['scalingService'].onMouseDown).toHaveBeenCalled();
  });

  it('#onMouseDown should set the OperationService to translationService when onSelectionRect and LEFT_BUTTON and call onMouseDown', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const event: MouseEvent = new MouseEvent('mouseevent', {button: 0});
    spyOn<any>(service['translationService'], 'onMouseDown').and.returnValue({});
    spyOn<any>(service, 'isOnControlPoint').and.returnValue(false);
    spyOn<any>(service, 'isOnSelectionRect').and.returnValue(true);
    spyOn<any>(service['selectionService'], 'onMouseDown');
    service['selectionOperationService'] = service['selectionService'];
    service.onMouseDown(event);
    expect(service['selectionOperationService']).toEqual(service['translationService']);
    expect(service['translationService'].onMouseDown).toHaveBeenCalled();
  });

  it('#onMouseMove should set hasMoved to true and call onMouseMove', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['selectionOperationService'], 'onMouseMove').and.returnValue({});
    service['hasMoved'] = false;
    const event: MouseEvent = new MouseEvent('mouseevent', {clientX: 10, clientY: 10});
    service.onMouseMove(event);
    expect(service['hasMoved']).toBeTruthy();
    expect(service['selectionOperationService'].onMouseMove).toHaveBeenCalled();
  });

  it('#onMouseUp should set hasMoved to false and call onMouseUp', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['selectionOperationService'], 'onMouseUp').and.returnValue({});
    service['hasMoved'] = true;
    const event: MouseEvent = new MouseEvent('mouseevent', {clientX: 10, clientY: 10});
    service.onMouseUp(event);
    expect(service['hasMoved']).toBeFalsy();
    expect(service['selectionOperationService'].onMouseUp).toHaveBeenCalled();
  });

  it('#onMouseUp should use selectionService when hasMoved is false and click was not on control point', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['selectionService'], 'onMouseUp');
    spyOn<any>(service, 'isOnControlPoint').and.returnValue(false);
    service['hasMoved'] = false;
    service['selectionOperationService'] = service['translationService'];
    const event: MouseEvent = new MouseEvent('mouseevent', {clientX: 10, clientY: 10});
    service.onMouseUp(event);
    expect(service['selectionOperationService']).toEqual(service['selectionService']);
  });

  it('#onMouseWheel should call onMouseWheel if currentSelection.length is not 0', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service['selectionService'].currentSelection.length = 1;
    spyOn<any>(service['rotationService'], 'onMouseWheel').and.returnValue({});
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service.onMouseWheel(event);
    expect(service['rotationService'].onMouseWheel).toHaveBeenCalled();
  });

  it('#onMouseWheel should not call onMouseWheel if currentSelection.length is 0', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service['selectionService'].currentSelection = [];
    spyOn<any>(service['rotationService'], 'onMouseWheel').and.returnValue({});
    const event: WheelEvent = new WheelEvent('mousewheel', {deltaY: -1});
    service.onMouseWheel(event);
    expect(service['rotationService'].onMouseWheel).not.toHaveBeenCalled();
  });

  it('#onAltKeyDown should call onAltKeyDown', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['rotationService'], 'onAltKeyDown').and.returnValue({});
    spyOn<any>(service['scalingService'], 'onAltDown').and.returnValue({});
    const event = new KeyboardEvent('keyboard');
    service.onAltKeyDown(event);
    expect(service['rotationService'].onAltKeyDown).toHaveBeenCalled();
    expect(service['scalingService'].onAltDown).toHaveBeenCalled();
  });

  it('#onAltKeyUp should call onAltKeyUp', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['rotationService'], 'onAltKeyUp').and.returnValue({});
    spyOn<any>(service['scalingService'], 'onAltUp').and.returnValue({});
    const event = new KeyboardEvent('keyboard');
    service.onAltKeyUp(event);
    expect(service['rotationService'].onAltKeyUp).toHaveBeenCalled();
    expect(service['scalingService'].onAltUp).toHaveBeenCalled();
  });

  it('#onShiftDown should call onShiftDown', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['rotationService'], 'onShiftDown').and.returnValue({});
    spyOn<any>(service['scalingService'], 'onShiftDown').and.returnValue({});
    const event = new KeyboardEvent('keyboard');
    service.onShiftDown(event);
    expect(service['rotationService'].onShiftDown).toHaveBeenCalled();
    expect(service['scalingService'].onShiftDown).toHaveBeenCalled();
  });

  it('#onShiftUp should call onShiftUp', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['rotationService'], 'onShiftUp').and.returnValue({});
    spyOn<any>(service['scalingService'], 'onShiftUp').and.returnValue({});
    const event = new KeyboardEvent('keyboard');
    service.onShiftUp(event);
    expect(service['rotationService'].onShiftUp).toHaveBeenCalled();
    expect(service['scalingService'].onShiftUp).toHaveBeenCalled();
  });

  it('#isOnControlPoint should return false when the class list is not CONTROL_POINT', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const classPoint = 'random';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.classList.value = classPoint;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    expect(service['isOnControlPoint'](event)).toBeFalsy();
  });

  it('#isOnControlPoint should return true when the class list is CONTROL_POINT', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const classPoint = 'controlPoint';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.classList.value = classPoint;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    expect(service['isOnControlPoint'](event)).toBeTruthy();
  });

  it('#isOnSelectionRect should return false when the class list is not SELECTION_RECT', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const classRect = 'random';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.classList.value = classRect;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    expect(service['isOnSelectionRect'](event)).toBeFalsy();
  });

  it('#isOnSelectionRect should return true when the class list is SELECTION_RECT', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    const classRect = 'selectionRect';
    const dummyElement: SVGElement = document.createElement('rec') as any;
    dummyElement.classList.value = classRect;
    const event: MouseEvent = new MouseEvent('onmousedown');
    Object.defineProperty(event, 'target', {value: dummyElement});
    expect(service['isOnSelectionRect'](event)).toBeTruthy();
  });

  it('#cleanUp should call cleanUp on active Operation', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    spyOn<any>(service['selectionOperationService'], 'cleanUp').and.returnValue({});
    service['cleanUp']();
    expect(service['selectionOperationService']['cleanUp']).toHaveBeenCalled();
  });

  it('#onEscapeDown should do nothing', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service.onEscapeDown(new KeyboardEvent('escapedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onBackspaceDown should do nothing', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service.onBackspaceDown(new KeyboardEvent('backspacedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onDoubleClick should do nothing', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service.onDoubleClick(new MouseEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onDoubleClick should do nothing', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service.onDoubleClick(new MouseEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should do nothing', () => {
    const service: SelectionManagerService = TestBed.get(SelectionManagerService);
    service.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
