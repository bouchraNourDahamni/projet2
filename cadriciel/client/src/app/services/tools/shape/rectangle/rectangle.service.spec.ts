import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../../color/color.service';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../../enums/shape-modes';
import { ShapeOutlines } from './../../../../enums/shape-outlines';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
  let rectangleService: RectangleService;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    providers: [
    ColorService, ToolAttributesService, SvgManagerService, Renderer2 ],
      });
    rectangleService = TestBed.get(RectangleService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
  }));

  it('RectangleService should be created', () => {
    expect(rectangleService).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#updateShape should make the right shape depending on isRegular ', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);

    rectangleService['initialCoordinates'].x = 10;
    rectangleService['currentCoordinates'].x = 20;

    rectangleService['initialCoordinates'].y = 60;
    rectangleService['currentCoordinates'].y = 10;

    rectangleService['isRegular'] = true;
    rectangleService.updateShape();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService.smallestDimension).toBe('10');

    rectangleService['isRegular'] = true;
    rectangleService.updateShape();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseDown should update the shape', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement', 'listen']);
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });

    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['transformer'] = 'default';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['transformer'] = 'round';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['transformer'] = 'dash';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['mode'] = 'outline';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['mode'] = 'full';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();

    rectangleService['mode'] = 'both';
    rectangleService.onMouseDown(new MouseEvent('mousedown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['renderer'].createElement).toHaveBeenCalled();
  });

  it('#onMouseUp should  set isDrawing and isRegular to false', () => {
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      deleteElement: jasmine.createSpy('deleteElement'),
    });
    rectangleService.onMouseUp(new MouseEvent('mousedown'));
    expect(rectangleService['svgManager'].deleteElement).toHaveBeenCalled();
    expect(rectangleService['isDrawing']).toBeFalsy();
    expect(rectangleService['isRegular']).toBeFalsy();
  });

  it('#onMouseUp should set isDrawing and isRegular to false AND call addOperation if isDrawing is true', () => {
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      deleteElement: jasmine.createSpy('deleteElement'),
    });
    spyOn<any>(rectangleService['operationHandler'], 'addOperation').and.callThrough();
    rectangleService['isDrawing'] = true;
    rectangleService.onMouseUp(new MouseEvent('mousedown'));
    expect(rectangleService['svgManager'].deleteElement).toHaveBeenCalled();
    expect(rectangleService['operationHandler'].addOperation).toHaveBeenCalled();
    expect(rectangleService['isDrawing']).toBeFalsy();
    expect(rectangleService['isRegular']).toBeFalsy();
  });

  it('#onMouseMove should not update if isDrawing is false', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    rectangleService['isDrawing'] = false;
    rectangleService.onMouseMove(new MouseEvent('mousemove'));
    expect(rectangleService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onMouseMove should update if isDrawing is true and shiftKey is true', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    rectangleService['isDrawing'] = true;
    rectangleService.onMouseMove(new MouseEvent('mousemove', {shiftKey: true}));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#onMouseMove should update if isDrawing is true and shiftKey is false', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    rectangleService['isDrawing'] = true;
    rectangleService.onMouseMove(new MouseEvent('mousemove', {shiftKey: false}));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#onShiftDown should update shape and put isRegular to true if isDrawing est true', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['isDrawing'] = true;
    rectangleService.onShiftDown(new KeyboardEvent('shiftDown'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['isRegular']).toBeTruthy();
  });

  it('#onShiftDown should not update shape if isDrawing est false', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['isDrawing'] = false;
    rectangleService.onShiftDown(new KeyboardEvent('shiftDown'));
    expect(rectangleService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onShiftDown should not update continuosly if held down', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['isDrawing'] = true;
    rectangleService.onShiftDown(new KeyboardEvent('shiftDown', {repeat: true}));
    expect(rectangleService['renderer'].setAttribute).not.toHaveBeenCalled();
  });

  it('#onShiftUp should not do anything if isDrawing is false', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['isRegular'] = true;
    rectangleService['isDrawing'] = false;
    rectangleService.onShiftUp(new KeyboardEvent('shiftUp'));
    expect(rectangleService['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(rectangleService['isRegular']).toBeTruthy();
  });

  it('#onShiftUp should set isRegular to false and update shape is isDrawing is true', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['isRegular'] = true;
    rectangleService['isDrawing'] = true;
    rectangleService.onShiftUp(new KeyboardEvent('shiftUp'));
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalled();
    expect(rectangleService['isRegular']).toBeFalsy();
  });

  it('#setTexture should call setAttribute twice per case', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['transformer'] = ShapeOutlines.Default;
    rectangleService.setTexture();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(2);
    rectangleService['transformer'] = ShapeOutlines.Dash;
    rectangleService.setTexture();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(4);
    rectangleService['transformer'] = ShapeOutlines.Round;
    rectangleService.setTexture();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(6);
  });

  it('#setMode should call setAttribute twice per case and once for ShapeModes.Both', () => {
    rectangleService['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    rectangleService['mode'] = ShapeModes.Outline;
    rectangleService.setMode();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(3);
    rectangleService['mode'] = ShapeModes.Full;
    rectangleService.setMode();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(6);
    rectangleService['mode'] = ShapeModes.Both;
    rectangleService.setMode();
    expect(rectangleService['renderer'].setAttribute).toHaveBeenCalledTimes(9);
  });

  it('#cleanUp should call deleteElement and not call addOperation if newTool is not Rectangle and isDrawing is false', () => {
    rectangleService['isDrawing'] = false;
    spyOn<any>(rectangleService['operationHandler'], 'addOperation').and.callThrough();
    spyOn<any>(rectangleService['svgManager'], 'deleteElement').and.callThrough();
    rectangleService.cleanUp();
    expect(rectangleService['operationHandler'].addOperation).not.toHaveBeenCalled();
    expect(rectangleService['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#cleanUp should call deleteElement and addOperation if newTool is not Rectangle and isDrawing is true', () => {
    rectangleService['isDrawing'] = true;
    spyOn<any>(rectangleService['operationHandler'], 'addOperation').and.callThrough();
    spyOn<any>(rectangleService['svgManager'], 'deleteElement').and.callThrough();
    rectangleService.cleanUp();
    expect(rectangleService['operationHandler'].addOperation).toHaveBeenCalled();
    expect(rectangleService['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(rectangleService, 'cleanUp');
    const tool = Tools.Rectangle;
    rectangleService['validateSelectedTool'](tool);
    expect(rectangleService['cleanUp']).not.toHaveBeenCalled();
  });
});
