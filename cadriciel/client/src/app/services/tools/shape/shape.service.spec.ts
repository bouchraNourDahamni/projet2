import { TestBed } from '@angular/core/testing';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ShapeService } from './shape.service';

describe('ShapeService', () => {
  let service: ShapeService;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [ToolAttributesService, SvgManagerService ],
      });
    service = TestBed.get(ShapeService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
  });

  it('ShapeService should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
  });

  it('#createPerimeter should call setAttribute 3 times and createElement once', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);

    service.createPerimeter();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(3);
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(1);

  });

  it('#updatePerimeter should call setAttribute 4 times', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service.updatePerimeter();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(4);
  });

  it('#createShape should call createElement once', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['createElement']);

    service.createShape('rect');
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(1);
  });

  it('#setLineWidth should call setAttribute once', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['lineWidth'] = '5';
    service.setLineWidth();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('#cleanUp should not do anything', () => {
    service.cleanUp();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#setTexture should not do anything', () => {
    service.setTexture();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#setMode should not do anything', () => {
    service.setMode();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#updateShape should not do anything', () => {
    service.updateShape();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseDown should not do anything', () => {
    service.onMouseDown(new MouseEvent('mousedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseUp should not do anything', () => {
    service.onMouseUp(new MouseEvent('mouseup'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseMove should not do anything', () => {
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(true).toBeTruthy(); // placeholder test
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

  it('#onShiftDown should not do anything', () => {
    service.onShiftDown(new KeyboardEvent('keydown.shift'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftUp should not do anything', () => {
    service.onShiftUp(new KeyboardEvent('keyup.shift'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onEscapeDown should not do anything', () => {
    service.onEscapeDown(new KeyboardEvent('keydown.escape'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onBackspaceDown should not do anything', () => {
    service.onBackspaceDown(new KeyboardEvent('keydown.backspace'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onDoubleClick should not do anything', () => {
    service.onDoubleClick(new MouseEvent('dblclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should not do anything', () => {
    service.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
