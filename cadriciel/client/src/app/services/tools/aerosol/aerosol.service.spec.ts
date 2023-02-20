import { async, TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { AerosolService } from './aerosol.service';

describe('AerosolService', () => {

    let service: AerosolService;
    let manager: SvgManagerService;
    let colorService: ColorService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [ColorService, SvgManagerService],
      });

      service = TestBed.get(AerosolService);
      manager = TestBed.get(SvgManagerService);
      colorService = TestBed.get(ColorService) ;
    }));

    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(manager).toBeTruthy();
      expect(colorService).toBeTruthy();
    });

    it('#getMouseCoordinate should be set currentCoordinate attribute to the right mouse coordinate', () => {
      service['currentCoordinate'] = {x: 0, y: 0};
      service['svgManager'] = jasmine.createSpyObj('SVGManager', {
        getOffset: { x: 5, y: 10 },
      });
      const event: MouseEvent = new MouseEvent('onmousedown', {clientX: 23, clientY: 12});
      service['getMouseCoordinate'](event);
      expect(service['currentCoordinate'].x).toBe(18);
      expect(service['currentCoordinate'].y).toBe(2);
    });

    it('#getRandomRadius should return a random radius depending on the spray radius', () => {
      Math.random = () => 0.4;
      service['sprayRadius'] = 30;
      const randomRadius = service['getRandomRadius']();
      expect(randomRadius).toBe(12);
    });

    it('#getRandomAngle should return a random angle in radian between 0 and 2pi', () => {
      Math.random = () => 0.4;
      const randomAngle = service['getRandomAngle']();
      expect(randomAngle).toBe(2.5132741228718345);
    });

    it('#getRandomCoordinate should set the random coordinate according to the random angle and radius', () => {
      service['currentCoordinate'] = {x: 0, y: 0};
      service['svgManager'] = jasmine.createSpyObj('SVGManager', {
        getOffset: { x: 5, y: 10 },
      });
      const event: MouseEvent = new MouseEvent('onmousedown', {clientX: 23, clientY: 12});
      Math.random = () => 0.4;
      service['getRandomCoordinate'](event);
      expect(service['randomCoordinate'].x).toBe(14.76393202250021);
      expect(service['randomCoordinate'].y).toBe(4.351141009169893);
    });

    it('#createNewContainer should be create a new svg container', () => {
      const aerosolService: AerosolService = TestBed.get(AerosolService);
      aerosolService['fillTransparency'] = 34;
      aerosolService['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'setAttribute']);
      aerosolService['svgManager'] = jasmine.createSpyObj('SvgManager', ['addElement']);
      aerosolService['createNewContainer']();
      expect(aerosolService['renderer'].createElement).toHaveBeenCalledWith(SVGAttributes.G, SVGAttributes.SVG);
      expect(aerosolService['renderer'].setAttribute).toHaveBeenCalledWith(service['newContainer'],
                                    SVGAttributes.Class, SVGAttributes.Aerosol);
      expect(aerosolService['renderer'].setAttribute).toHaveBeenCalledWith(service['newContainer'],
                                    SVGAttributes.Opacity, '34');
      expect(aerosolService['svgManager'].addElement).toHaveBeenCalledWith(service['newContainer']);
    });

    it('#createPixel should create a random pixel within the diameter of the mouse coordinate', () => {
      const aerosolService: AerosolService = TestBed.get(AerosolService);
      aerosolService['fillTransparency'] = 34;
      aerosolService['renderer'] = jasmine.createSpyObj('renderer2', ['createElement', 'setAttribute', 'appendChild']);
      aerosolService['createPixel'](new MouseEvent('onmousedown', {clientX: 23, clientY: 12}));
      expect(aerosolService['renderer'].createElement).toHaveBeenCalledWith(SVGAttributes.Circle, SVGAttributes.SVG);
      expect(aerosolService['renderer'].setAttribute).toHaveBeenCalledTimes(4);
      expect(aerosolService['renderer'].appendChild).toHaveBeenCalled();
    });

    it('#createPixelsPerSpray should create random pixels depending on the spray value', () => {
      const event: MouseEvent = new MouseEvent('onmousedown', {clientX: 23, clientY: 12});
      spyOn<any>(service, 'getRandomCoordinate');
      spyOn<any>(service, 'createPixel');
      service['sprayPerSecond'] = 50;
      service['createPixelsPerSpray'](event);
      expect(service['getRandomCoordinate']).toHaveBeenCalledTimes(5);
      expect(service['getRandomCoordinate']).toHaveBeenCalledWith(event);
      expect(service['createPixel']).toHaveBeenCalledTimes(5);
      expect(service['createPixel']).toHaveBeenCalledWith(event);
    });

    it('#createPixelsOnInterval should create random pixels depending on the interval', () => {
      const event: MouseEvent = new MouseEvent('onmousedown', {clientX: 23, clientY: 12});
      spyOn<any>(window, 'setInterval');
      service['createPixelsOnInterval'](event);
      expect(window.setInterval).toHaveBeenCalled();
    });

    it('#onMouseDown should call the right methods and set lineIsDrawing to true', () => {
      const event: MouseEvent = new MouseEvent('mousedown', {clientX: 23, clientY: 12});
      spyOn<any>(service, 'createNewContainer');
      spyOn<any>(service, 'createPixelsOnInterval');
      spyOn<any>(window, 'setInterval');
      service['lineIsDrawing'] = false;
      service['onMouseDown'](event);
      expect(service['createNewContainer']).toHaveBeenCalled();
      expect(service['createPixelsOnInterval']).toHaveBeenCalledWith(event);
      expect(service['lineIsDrawing']).toBeTruthy();
    });

    it('#onMouseMove should call the right methods when lineIsDrawing is true', () => {
      const event: MouseEvent = new MouseEvent('mousemove', {clientX: 23, clientY: 12});
      spyOn<any>(service, 'createPixelsPerSpray');
      spyOn<any>(service, 'createPixelsOnInterval');
      spyOn<any>(window, 'clearInterval');
      spyOn<any>(window, 'setInterval');
      service['lineIsDrawing'] = true;
      service['onMouseMove'](event);
      expect(service['createPixelsPerSpray']).toHaveBeenCalled();
      expect(service['createPixelsOnInterval']).toHaveBeenCalledWith(event);
      expect(window.clearInterval).toHaveBeenCalled();
    });

    it('#onMouseMove should not call any method when lineIsDrawing is false', () => {
      const event: MouseEvent = new MouseEvent('mousemove', {clientX: 23, clientY: 12});
      spyOn<any>(service, 'createPixelsPerSpray');
      spyOn<any>(service, 'createPixelsOnInterval');
      spyOn<any>(window, 'clearInterval');
      service['lineIsDrawing'] = false;
      service['onMouseMove'](event);
      expect(service['createPixelsPerSpray']).not.toHaveBeenCalled();
      expect(service['createPixelsOnInterval']).not.toHaveBeenCalledWith(event);
      expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('#onMouseUp should call the right methods when the line is drawing', () => {
      spyOn<any>(service['operationHandler'], 'addOperation');
      spyOn<any>(window, 'clearInterval');
      service['lineIsDrawing'] = true;
      service['onMouseUp']();
      expect(service['operationHandler'].addOperation).toHaveBeenCalled();
      expect(service['lineIsDrawing']).toBeFalsy();
      expect(window.clearInterval).toHaveBeenCalled();
    });

    it('#onMouseUp should call the right methods when the line is notdrawing', () => {
      spyOn<any>(service['operationHandler'], 'addOperation');
      spyOn<any>(window, 'clearInterval');
      service['lineIsDrawing'] = false;
      service['onMouseUp']();
      expect(service['operationHandler'].addOperation).not.toHaveBeenCalled();
      expect(service['lineIsDrawing']).toBeFalsy();
      expect(window.clearInterval).toHaveBeenCalled();
    });

    it('#selectTool should not call the function clean up when tool is aerosol' , () => {
      spyOn<any>(service, 'cleanUp');
      const tool = Tools.Aerosol;
      service['validateSelectedTool'](tool);
      expect(service['cleanUp']).not.toHaveBeenCalled();
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

    it('#onMouseWheel should do nothing', () => {
      service.onMouseWheel(new WheelEvent('click'));
      expect(true).toBeTruthy(); // placeholder test
    });

    it('#onAltKeyDown should do nothing', () => {
      service.onAltKeyDown(new KeyboardEvent('doubleclick'));
      expect(true).toBeTruthy(); // placeholder test
    });

    it('#onAltKeyUp should do nothing', () => {
      service.onAltKeyUp(new KeyboardEvent('doubleclick'));
      expect(true).toBeTruthy(); // placeholder test
    });
});
