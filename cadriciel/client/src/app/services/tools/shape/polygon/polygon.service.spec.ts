import { TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../../color/color.service';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../../enums/shape-modes';
import { ShapeOutlines } from './../../../../enums/shape-outlines';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  let service: PolygonService;
  let manager: SvgManagerService;
  let toolAttributes: ToolAttributesService;
  let colorService: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
    ColorService, ToolAttributesService, SvgManagerService ],
      });
    service = TestBed.get(PolygonService);
    manager = TestBed.get(SvgManagerService);
    toolAttributes = TestBed.get(ToolAttributesService);
    colorService = TestBed.get(ColorService) ;
  });

  it('PolygonService should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(toolAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#updateShape should call setAttributes once ', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);

    service.updateShape();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('#setTexture should call setAttribute twice per case', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['transformer'] = ShapeOutlines.Default;
    service.setTexture();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(2);
    service['transformer'] = ShapeOutlines.Dash;
    service.setTexture();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(4);
  });

  it('#setMode should call setAttribute twice per case and once for ShapeModes.Both', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['mode'] = ShapeModes.Outline;
    service.setMode();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(3);
    service['mode'] = ShapeModes.Full;
    service.setMode();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(6);
    service['mode'] = ShapeModes.Both;
    service.setMode();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(9);
  });

  it('#setLineWidth should call setAttribute once', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service.setLineWidth();
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(1);
  });

  it('#onMouseDown should call setAttribute 10 times and createElement 2 times', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['transformer'] = ShapeOutlines.Default;
    service['mode'] = ShapeModes.Both;
    service.onMouseDown(new MouseEvent('mousedown'));
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(12);
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(2);
  });

  it('#onMouseDown should do nothing when isDrawing is true', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['isDrawing'] = true;
    service['transformer'] = ShapeOutlines.Default;
    service['mode'] = ShapeModes.Both;
    service.onMouseDown(new MouseEvent('mousedown'));
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(service['renderer'].createElement).not.toHaveBeenCalled();
  });

  it('#onMouseMove should not do anything when isDrawing is false ', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'createElement']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['isDrawing'] = false;
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(0);
  });

  it('#onMouseMove should call set Attributes 5 times', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    service['svgManager']['renderer'] = jasmine.createSpyObj('renderer2', ['appendChild']);

    service['isDrawing'] = true;
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(service['renderer'].setAttribute).toHaveBeenCalledTimes(5);
  });

  it('#onMouseUp should call deleteElement from the svgManager ', () => {
    service['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    service['isDrawing'] = false;
    service.onMouseUp(new MouseEvent('mouseup'));
    expect(service['svgManager'].deleteElement).toHaveBeenCalledTimes(1);
    expect(service['isDrawing']).toBeFalsy();
  });

  it('#onMouseUp should call deleteElement from the svgManager AND call addOperation when isDrawing is true', () => {
    service['svgManager'] = jasmine.createSpyObj('svgManager', ['deleteElement']);
    service['isDrawing'] = true;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    service.onMouseUp(new MouseEvent('mouseup'));
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
    expect(service['svgManager'].deleteElement).toHaveBeenCalledTimes(1);
    expect(service['isDrawing']).toBeFalsy();
  });

  it('#cleanUp should call deleteElement and not call addOperation if newTool is not Polygon and isDrawing is false', () => {
    service['isDrawing'] = false;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    spyOn<any>(service['svgManager'], 'deleteElement').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
    expect(service['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#cleanUp should call deleteElement and addOperation if newTool is not Polygon and isDrawing is true', () => {
    service['isDrawing'] = true;
    spyOn<any>(service['operationHandler'], 'addOperation').and.callThrough();
    spyOn<any>(service['svgManager'], 'deleteElement').and.callThrough();
    service.cleanUp();
    expect(service['operationHandler'].addOperation).toHaveBeenCalled();
    expect(service['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call the cleanup function', () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Polygon;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });
});
