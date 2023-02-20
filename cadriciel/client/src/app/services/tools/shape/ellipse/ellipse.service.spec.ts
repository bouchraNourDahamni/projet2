import { TestBed } from '@angular/core/testing';
import { ShapeModes } from 'src/app/enums/shape-modes';
import { ShapeOutlines } from 'src/app/enums/shape-outlines';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../../color/color.service';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
  let ellipseService: EllipseService;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
    ColorService, ToolAttributesService, SvgManagerService ],
      });
    ellipseService = TestBed.get(EllipseService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
  });

  it('EllipseService should be created', () => {
    expect(ellipseService).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#updateShape should make the right shape depending on isRegular ', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);

    ellipseService['initialCoordinates'].x = 10;
    ellipseService['currentCoordinates'].x = 20;

    ellipseService['initialCoordinates'].y = 60;
    ellipseService['currentCoordinates'].y = 10;

    ellipseService['isRegular'] = true;
    ellipseService.updateShape();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['smallestDimension']).toBe('5');

    ellipseService['isRegular'] = true;
    ellipseService.updateShape();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTexture should set the texture to default if transformer is default', () => {
    ellipseService['transformer'] = ShapeOutlines.Default;
    spyOn<any>(ellipseService, 'updateDefaultOutline');
    spyOn<any>(ellipseService, 'updateDashOutline');
    ellipseService['setTexture']();
    expect(ellipseService['updateDefaultOutline']).toHaveBeenCalled();
    expect(ellipseService['updateDashOutline']).not.toHaveBeenCalled();
  });

  it('#setTexture should set the texture to dash texture if transformer is dash', () => {
    ellipseService['transformer'] = ShapeOutlines.Dash;
    spyOn<any>(ellipseService, 'updateDefaultOutline');
    spyOn<any>(ellipseService, 'updateDashOutline');
    ellipseService['setTexture']();
    expect(ellipseService['updateDefaultOutline']).not.toHaveBeenCalled();
    expect(ellipseService['updateDashOutline']).toHaveBeenCalled();
  });

  it('#setMode should set the shape mode to outline if current mode is outline', () => {
    ellipseService['mode'] = ShapeModes.Outline;
    spyOn<any>(ellipseService, 'updateFill');
    spyOn<any>(ellipseService, 'updateOutline');
    ellipseService['setMode']();
    expect(ellipseService['updateFill']).not.toHaveBeenCalled();
    expect(ellipseService['updateOutline']).toHaveBeenCalled();
  });

  it('#setMode should set the shape mode to outline if current mode is full', () => {
    ellipseService['mode'] = ShapeModes.Full;
    spyOn<any>(ellipseService, 'updateFill');
    spyOn<any>(ellipseService, 'updateOutline');
    ellipseService['setMode']();
    expect(ellipseService['updateFill']).toHaveBeenCalled();
    expect(ellipseService['updateOutline']).not.toHaveBeenCalled();
  });

  it('#onMouseDown should update the shape', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'listen']);
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });

    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['transformer'] = 'default';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['transformer'] = 'round';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['transformer'] = 'dash';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['mode'] = 'outline';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['mode'] = 'full';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();

    ellipseService['mode'] = 'both';
    ellipseService.onMouseDown(new MouseEvent('mousedown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['renderer'].createElement).toHaveBeenCalled();
  });

  it('#onMouseUp should  set isDrawing to false if ellipse was drawing', () => {
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
      deleteElement: jasmine.createSpy('deleteElement'),
    });
    ellipseService['isDrawing'] = true;
    ellipseService['isRegular'] = true;
    spyOn<any>(ellipseService['operationHandler'], 'addOperation');
    ellipseService.onMouseUp(new MouseEvent('mouseup'));
    expect(ellipseService['svgManager'].deleteElement).toHaveBeenCalled();
    expect(ellipseService['isDrawing']).toBeFalsy();
    expect(ellipseService['isRegular']).toBeFalsy();
    expect(ellipseService['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#cleanUp should  set isDrawing to false if ellipse was drawing', () => {
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
      deleteElement: jasmine.createSpy('deleteElement'),
    });
    ellipseService['isDrawing'] = true;
    ellipseService['isRegular'] = true;
    spyOn<any>(ellipseService['operationHandler'], 'addOperation');
    ellipseService.cleanUp();
    expect(ellipseService['svgManager'].deleteElement).toHaveBeenCalled();
    expect(ellipseService['isDrawing']).toBeFalsy();
    expect(ellipseService['isRegular']).toBeFalsy();
    expect(ellipseService['operationHandler'].addOperation).toHaveBeenCalled();
  });

  it('#onMouseUp should not add operation when ellipse is not drawing', () => {
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
      deleteElement: jasmine.createSpy('deleteElement'),
    });
    ellipseService['isDrawing'] = false;
    ellipseService['isRegular'] = true;
    spyOn<any>(ellipseService['operationHandler'], 'addOperation');
    ellipseService.onMouseUp(new MouseEvent('mouseup'));
    expect(ellipseService['svgManager'].deleteElement).toHaveBeenCalled();
    expect(ellipseService['isDrawing']).toBeFalsy();
    expect(ellipseService['isRegular']).toBeFalsy();
    expect(ellipseService['operationHandler'].addOperation).not.toHaveBeenCalled();
  });

  it('#updateOutline should set all its attributes for outline', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['updateOutline']();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalledTimes(3);
  });

  it('#updateFill should set all its attributes for the fill', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['updateFill']();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalledTimes(3);
  });

  it('#updateDashOutline should set all its attributes for the dash outline', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['updateDashOutline']();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalledTimes(2);
  });

  it('#updateDefaultOutline should set all its attributes for the default outline', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['updateDefaultOutline']();
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalledTimes(2);
  });

  it('#onMouseMove should not update if isDrawing is false', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    ellipseService['isDrawing'] = false;
    ellipseService.onMouseMove(new MouseEvent('mousemove'));
    expect(ellipseService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onMouseMove should update if isDrawing is true and shiftKey is true', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    ellipseService['isDrawing'] = true;
    ellipseService.onMouseMove(new MouseEvent('mousemove', {shiftKey: true}));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#onMouseMove should update if isDrawing is true and shiftKey is false', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    ellipseService['isDrawing'] = true;
    ellipseService.onMouseMove(new MouseEvent('mousemove', {shiftKey: false}));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#onShiftDown should update shape and put isRegular to true if isDrawing est true', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['isDrawing'] = true;
    ellipseService.onShiftDown(new KeyboardEvent('shiftDown'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['isRegular']).toBeTruthy();
  });

  it('#onShiftDown should not update shape if isDrawing est false', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['isDrawing'] = false;
    ellipseService.onShiftDown(new KeyboardEvent('shiftDown'));
    expect(ellipseService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onShiftDown should not update continuosly if held down', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['isDrawing'] = true;
    ellipseService.onShiftDown(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(ellipseService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onShiftUp should not do anything if isDrawing is false', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['isRegular'] = true;
    ellipseService['isDrawing'] = false;
    ellipseService.onShiftUp(new KeyboardEvent('shiftUp'));
    expect(ellipseService['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(ellipseService['isRegular']).toBeTruthy();
  });

  it('#onShiftUp should set isSquare to false and update shape is isDrawing is true', () => {
    ellipseService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    ellipseService['isRegular'] = true;
    ellipseService['isDrawing'] = true;
    ellipseService.onShiftUp(new KeyboardEvent('shiftUp'));
    expect(ellipseService['renderer'].setAttribute).toHaveBeenCalled();
    expect(ellipseService['isRegular']).toBeFalsy();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(ellipseService, 'cleanUp');
    const tool = Tools.Ellipse;
    ellipseService['validateSelectedTool'](tool);
    expect(ellipseService['cleanUp']).not.toHaveBeenCalled();
  });
});
