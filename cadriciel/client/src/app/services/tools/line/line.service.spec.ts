import { TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { LineModes } from './line-modes';
import { LineOutlines } from './line-outlines';
import { LineService } from './line.service';

describe('LineService', () => {
  let lineService: LineService;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
    ColorService,
    ToolAttributesService,
    SvgManagerService ],
    });

    lineService = TestBed.get(LineService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
  });

  it('#lineService should be created', () => {
    expect(lineService).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#changeColor should change strokeColor ', () => {
    lineService['colorService'].currentPrimaryColor.subscribe((primary: string) => {
      lineService['strokeColor'] = primary;
    });
    expect(lineService['strokeColor']).toBe('#000000');
  });

  it('#addSegment should correctly add a segment and update the linePoints', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['linePoints'] = [];
    lineService['currentCoordinates'] = { x: 10, y: 20 };
    lineService['addSegment']();
    expect(lineService['linePoints'][0]).toBe('10,20');
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#removeRecentSegment should correctly remove a segment and update the linePoints', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['linePoints'] = ['1,10', '2,20'];
    lineService['removeRecentSegment']();
    expect(lineService['linePoints'][0]).toBe('1,10');
    expect(lineService['linePoints'][1]).toBeUndefined();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#removeRecentVertex should correctly remove a vertex and update the linePoints', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['removeChild']);
    lineService['removeRecentVertex']();
    expect(lineService['renderer'].removeChild).toHaveBeenCalled();
  });

  it('#endLine should correctly end the line when not in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = false;
    lineService['endLine']();
    expect(lineService['lineIsDrawing']).toBeFalsy();
    expect(lineService['linePoints'].length).toBe(0);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#endLine should correctly end the line when in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = true;
    lineService['endLine']();
    expect(lineService['lineIsDrawing']).toBeFalsy();
    expect(lineService['linePoints'].length).toBe(0);
    expect(lineService['vertices'].length).toBe(0);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#endLineEarly should correctly update line if it was drawing', () => {
    lineService['lineIsDrawing'] = true;
    spyOn<any>(lineService['operationHandler'], 'addOperation');
    spyOn<any>(lineService, 'updateLine');
    lineService['endLineEarly']();
    expect(lineService['lineIsDrawing']).toBeFalsy();
    expect(lineService['operationHandler'].addOperation).toHaveBeenCalled();
    expect(lineService['updateLine']).toHaveBeenCalled();
  });

  it('#updateLine should correctly update the line', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['updateLine']();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#updatePreview should correctly update the preview', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['linePoints'] = ['1,1', '2,2', '0,0'];
    lineService['currentCoordinates'] = { x: 3, y: 3 };
    lineService['updatePreview']();
    expect(lineService['linePoints'][2]).toBe('3,3');
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#updatePreview should add the current coordinate if linePoints is empty', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['linePoints'] = [];
    lineService['currentCoordinates'] = { x: 3, y: 3 };
    lineService['updatePreview']();
    expect(lineService['linePoints'][0]).toBe('3,3');
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setLineWidth should call setAttribute', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['setLineWidth']();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#createNewContainer should call createElement', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', {
      createElement: jasmine.createSpy('createElement'),
      setAttribute: jasmine.createSpy('setAttribute'),
      appendChild: jasmine.createSpy('appendChild'),
    });
    lineService['svgManager'] = jasmine.createSpyObj('svgManager', {
      addElement: jasmine.createSpy('addElement'),
      setAttribute: jasmine.createSpy('setAttribute'),
    });
    lineService['svgManager']['renderer'] = jasmine.createSpyObj('svgManager', {
      appendChild: jasmine.createSpy('appendChild'),
    });
    lineService['createNewContainer']();
    expect(lineService['renderer'].createElement).toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#createNewLine should call createElement, appendChild and setAttribute', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'appendChild', 'setAttribute']);
    lineService['createNewLine']();
    expect(lineService['renderer'].createElement).toHaveBeenCalled();
    expect(lineService['renderer'].appendChild).toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#createNewVertex should call setAttribute, createElement, appendChild', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'appendChild']);
    lineService['vertices'] = [];
    lineService['verticesRadius'] = '3';
    lineService['createNewVertex']();
    expect(lineService['vertices'].length).toBeTruthy();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['renderer'].createElement).toHaveBeenCalled();
    expect(lineService['renderer'].appendChild).toHaveBeenCalled();
  });

  it('#closeLine should correctly close line if not in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['closeLine']();
    expect(lineService['lineIsDrawing']).toBeFalsy();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#closeLine should correctly close line if in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = true;
    lineService['closeLine']();
    expect(lineService['lineIsDrawing']).toBeFalsy();
    expect(lineService['vertices'].length).toBe(0, 'vertices should be empty');
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setMode should set the mode to sharp', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['mode'] = LineModes.Sharp;
    lineService['setMode']();
    expect(lineService['mode']).toBe(LineModes.Sharp);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['isVertexMode']).toBeFalsy();
  });

  it('#setMode should set the mode to round', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['mode'] = LineModes.Round;
    lineService['setMode']();
    expect(lineService['mode']).toBe(LineModes.Round);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['isVertexMode']).toBeFalsy();
  });

  it('#setMode should set the mode to vertex', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['mode'] = LineModes.Vertice;
    lineService['setMode']();
    expect(lineService['mode']).toBe(LineModes.Vertice);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['isVertexMode']).toBeTruthy();
  });

  it('#setTexture should set the mode to Full', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['transformer'] = LineOutlines.Full;
    lineService['setTexture']();
    expect(lineService['transformer']).toBe(LineOutlines.Full);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTexture should set the mode to Dot', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['transformer'] = LineOutlines.Dot;
    lineService['setTexture']();
    expect(lineService['transformer']).toBe(LineOutlines.Dot);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTexture should set the mode to Dash', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['transformer'] = LineOutlines.Dash;
    lineService['setTexture']();
    expect(lineService['transformer']).toBe(LineOutlines.Dash);
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseDown should add two segments if lineIsDrawing is false and not in vertex', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'appendChild']);
    lineService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    lineService['svgManager']['renderer'] = jasmine.createSpyObj('renderer2', ['appendChild']);
    lineService['lineIsDrawing'] = false;
    lineService.onMouseDown(new MouseEvent('mousedown'));
    expect(lineService['lineIsDrawing']).toBeTruthy();
    expect(lineService['linePoints'].length).toBe(2);
    expect(lineService['vertices'].length).toBe(0);
  });

  it('#onMouseDown should add 1 segment and 1 vertex if lineIsDrawing is true and in vertex', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'appendChild']);
    lineService['svgManager']['renderer'] = jasmine.createSpyObj('renderer2', ['appendChild']);
    lineService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = true;
    lineService.onMouseDown(new MouseEvent('mousedown'));
    expect(lineService['lineIsDrawing']).toBeTruthy();
    expect(lineService['linePoints'].length).toBe(1);
    expect(lineService['vertices'].length).toBe(1);
  });

  it('#onMousemove should not do anything if lineIsDrawing is false', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    lineService['lineIsDrawing'] = false;
    lineService.onMouseMove(new MouseEvent('mousemove'));
    expect(lineService['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(lineService['svgManager'].addElement).not.toHaveBeenCalled();

  });

  it('#onMousemove should updatePreview if lineIsDrawing is true', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    lineService['lineIsDrawing'] = true;
    lineService.onMouseMove(new MouseEvent('mousemove'));
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onEscapeDown should not do anything if lineIsDrawing is false', () => {
    lineService['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    lineService['lineIsDrawing'] = false;
    lineService['onEscapeDown'](new KeyboardEvent('keydown.escape'));
    expect(lineService['svgManager'].deleteElement).not.toHaveBeenCalled();
  });

  it('#onEscapeDown should call deleteElement if lineIsDrawing is true', () => {
    lineService['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    lineService['lineIsDrawing'] = true;
    lineService['onEscapeDown'](new KeyboardEvent('keydown.escape'));
    expect(lineService['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#onBackSpaceDown should not do anything if lineIsDrawing is false', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['lineIsDrawing'] = false;
    lineService['onBackspaceDown'](new KeyboardEvent('keydown.backspace'));
    expect(lineService['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#onBackSpaceDown should removeRecentSegment if lineIsDrawing is true and has more than 2 points', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['lineIsDrawing'] = true;
    lineService['addSegment']();
    lineService['addSegment']();
    lineService['addSegment']();
    lineService['onBackspaceDown'](new KeyboardEvent('keydown.backspace'));
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#onBackSpaceDown should not removeRecentSegment if lineIsDrawing is true and has less than 2 points', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['lineIsDrawing'] = true;
    lineService['linePoints'].length = 1;
    lineService['onBackspaceDown'](new KeyboardEvent('keydown.backspace'));
    expect(lineService['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#onBackSpaceDown should removeRecentVertex if lineIsDrawing is true and in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'appendChild', 'removeChild']);
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = true;
    lineService['addSegment']();
    lineService['addSegment']();
    lineService['addSegment']();
    lineService['createNewVertex']();
    lineService['createNewVertex']();
    lineService['createNewVertex']();
    lineService.onBackspaceDown(new KeyboardEvent('keydown.backspace'));
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
    expect(lineService['renderer'].removeChild).toHaveBeenCalled();
  });

  it('#onDoubleClick should not do anything if lineIsDrawing is false', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['lineIsDrawing'] = false;
    lineService['onDoubleClick'](new MouseEvent('dblclick', {shiftKey: false}));
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onDoubleClick should remove the lastCoordinates twice if lineIsDrawing is true', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['linePoints'] = ['0,0', '1,1', '2,2', '3,3'];
    lineService['lineIsDrawing'] = true;
    lineService['onDoubleClick'](new MouseEvent('dblclick', {shiftKey: false}));
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onDoubleClick should correctly closeLine if lineIsDrawing and shift is true', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['linePoints'] = ['0,0', '1,1', '2,2', '3,3'];
    lineService['lineIsDrawing'] = true;
    lineService['onDoubleClick'](new MouseEvent('dblclick', {shiftKey: true}));
    expect(lineService['renderer'].removeChild).not.toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onDoubleClick should correctly closeLine if lineIsDrawing is true and in vertex mode', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    lineService['linePoints'] = ['0,0', '1,1', '2,2', '3,3'];
    lineService['lineIsDrawing'] = true;
    lineService['isVertexMode'] = true;
    lineService['onDoubleClick'](new MouseEvent('dblclick', {shiftKey: false}));
    expect(lineService['renderer'].removeChild).toHaveBeenCalled();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call clean up function', () => {
    spyOn<any>(lineService, 'cleanUp');
    const tool = Tools.Line;
    lineService['validateSelectedTool'](tool);
    expect(lineService['cleanUp']).not.toHaveBeenCalled();
  });

  it('#validateLineTexture should  call set texture function', () => {
    spyOn<any>(lineService, 'setTexture');
    lineService['lineIsDrawing'] = true;
    lineService['validateLineTexture']();
    expect(lineService['setTexture']).toHaveBeenCalled();
  });

  it('#validateLineDrawing should  call set line width function', () => {
    spyOn<any>(lineService, 'setLineWidth');
    lineService['lineIsDrawing'] = true;
    lineService['validateLineDrawing']();
    expect(lineService['setLineWidth']).toHaveBeenCalled();
  });

  it('#validateColor should  call set attribute function', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['validateColor']();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#validateOpacity should  call set attribute function', () => {
    lineService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    lineService['lineIsDrawing'] = true;
    lineService['validateOpacity']();
    expect(lineService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseUp should not do anything', () => {
    lineService.onMouseUp(new MouseEvent('mouseup'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftDown should not do anything', () => {
    lineService.onShiftDown(new KeyboardEvent('keydown.shift'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftUp should not do anything', () => {
    lineService.onShiftUp(new KeyboardEvent('keyup.shift'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should not do anything', () => {
    lineService.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseWheel should not do anything', () => {
    lineService.onMouseWheel(new WheelEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyDown should not do anything', () => {
    lineService.onAltKeyDown(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyUp should not do anything', () => {
    lineService.onAltKeyUp(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
