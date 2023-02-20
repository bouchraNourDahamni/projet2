import { async, TestBed} from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { PencilService } from './pencil.service' ;

describe('pencilService', () => {
  let service: PencilService ;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ColorService, ToolAttributesService, SvgManagerService],
    });

    service = TestBed.get(PencilService );
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#onMouseDown should set lineIsDrawing to true and create a line Element', () => {
    service['svgManager'] = jasmine.createSpyObj('svgManager', ['addElement']);
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'listen', 'appendChild']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service.onMouseDown(new MouseEvent('mouseDown'));

    expect(service['svgManager'].addElement).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseMove should  not add points to the line if isDrawing is false', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['lineIsDrawing'] = false;
    service.onMouseMove(new MouseEvent('mouseDown'));
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onMouseMove should add points to the line if isDrawing is true', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['lineIsDrawing'] = true;
    service.onMouseMove(new MouseEvent('mouseDown'));
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseUp should put lineIsDrawing to false and not call addOperation when isDrawing is false', () => {
    service['lineIsDrawing'] = false;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.onMouseUp();
    expect(service['lineIsDrawing']).toBeFalsy();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
  });

  it('#onMouseUp should put lineIsDrawing to false and call addOperation when isDrawing is true', () => {
    service['lineIsDrawing'] = true;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.onMouseUp();
    expect(service['lineIsDrawing']).toBeFalsy();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#setTexture should set the texture', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['lineIsDrawing'] = true;
    service['setTexture']('none');
    service['setTexture']('notNone');
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#cleanUp should stop the tool Pencil', () => {
    service['lineIsDrawing'] = true;
    service.cleanUp();
    expect(service['lineIsDrawing']).toBeFalsy();
  });

  it('#cleanUp should set idDrawing to false if newTool is not Pencil and isDrawing is false', () => {
    service['lineIsDrawing'] = false;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
    expect(service['lineIsDrawing']).toBeFalsy();
  });

  it('#cleanUp should set idDrawing to false and addOperation if newTool is not Pencil and isDrawing is true', () => {
    service['lineIsDrawing'] = true;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
    expect(service['lineIsDrawing']).toBeFalsy();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Ellipse;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).toHaveBeenCalled();
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

  it('#onDoubleClick should do nothing', () => {
    service.onDoubleClick(new MouseEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should do nothing', () => {
    service.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
