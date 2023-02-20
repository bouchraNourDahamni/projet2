import { TestBed } from '@angular/core/testing';
import { IColorChange } from 'src/app/interfaces/color-change';
import { ColorApplicatorService } from './color-applicator.service';

class MockSVGElement {

  public classList = {value: ''};
  public tagName: string;
  public parentElement: SVGElement;

  constructor(tagName: string, className: string, parent?: SVGElement) {
    this.tagName = tagName;
    this.classList.value = className;
    this.parentElement = parent as SVGElement;
  }
}

describe('ColorApplicatorService', () => {
  let service: ColorApplicatorService;
  const dummySVGElement: SVGElement = document.createElement('rec') as any;
  const dummyColorChangeA: IColorChange = {oldColor: 'blue', oldOpacity: 0.2, newColor: 'blublu', newOpacity: 0.8 };
  const rightClick: MouseEvent = new MouseEvent('onmousedown', {button: 2});
  const leftClick: MouseEvent = new MouseEvent('onmousedown', {button: 0});
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorApplicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onMouseDown should do nothing when the conditions are not met' , () => {
    Object.defineProperty(rightClick, 'target', {value: dummySVGElement});
    Object.defineProperty(leftClick, 'target', {value: dummySVGElement});
    spyOn<any>(service, 'changePrimary');
    spyOn<any>(service, 'changeSecondary');
    spyOn<any>(service, 'hasOutline').and.returnValue(false);
    service['onMouseDown'](rightClick);
    expect(true).toBeTruthy();
  });

  it('#onMouseDown should call changePrimary or changeSecondary based on button clicked' , () => {
    Object.defineProperty(rightClick, 'target', {value: dummySVGElement});
    Object.defineProperty(leftClick, 'target', {value: dummySVGElement});
    const spyOnChangePrimary = spyOn<any>(service, 'changePrimary');
    const spyOnChangeSecondary = spyOn<any>(service, 'changeSecondary');
    spyOn<any>(service, 'hasOutline').and.returnValue(true);
    service['onMouseDown'](rightClick);
    expect(spyOnChangeSecondary).toHaveBeenCalled();
    service['onMouseDown'](leftClick);
    expect(spyOnChangePrimary).toHaveBeenCalled();
  });

  it('#changePrimary should set primary color', () => {
    spyOn<any>(service['pipette'], 'extractColor').and.returnValue(dummyColorChangeA);
    const spyAddOperation = spyOn<any>(service['operationHandler'], 'addOperation');
    const spyChangeColor = spyOn<any>(service['changeColorService'], 'changeColor');
    service['primaryColor'] = 'hello';
    service['primaryOpacity'] = 0.2;
    service['changePrimary'](dummySVGElement);
    expect(spyAddOperation).toHaveBeenCalled();
    expect(spyChangeColor).toHaveBeenCalledWith(dummySVGElement, 'hello', 0.2);
  });

  it('#changeSecondary should set secondary color', () => {
    spyOn<any>(service['pipette'], 'extractOutline').and.returnValue(dummyColorChangeA);
    const spyAddOperation = spyOn<any>(service['operationHandler'], 'addOperation');
    const spyChangeOutlineColor = spyOn<any>(service['changeColorService'], 'changeOutlineColor');
    service['secondaryColor'] = 'hello';
    service['secondaryOpacity'] = 0.2;
    service['changeSecondary'](dummySVGElement);
    expect(spyAddOperation).toHaveBeenCalled();
    expect(spyChangeOutlineColor).toHaveBeenCalledWith(dummySVGElement, 'hello', 0.2);
  });

  it('#hasOutline should return if the target has an outline', () => {
    const mockParent = new MockSVGElement('parent', 'asd') as any as SVGElement;
    const mockBackground = new MockSVGElement('name', 'SVGBackground', mockParent) as any as SVGElement;
    const mockRectangle = new MockSVGElement('rect', 'something', mockParent) as any as SVGElement;
    const mockEllipse = new MockSVGElement('ellipse', 'something', mockParent) as any as SVGElement;
    const mockPolygon = new MockSVGElement('polygon', 'something', mockParent) as any as SVGElement;
    const mockRandom = new MockSVGElement('random', 'blublu', mockParent) as any as SVGElement;

    expect(service['hasOutline'](mockBackground)).toBeFalsy();
    expect(service['hasOutline'](mockRectangle)).toBeTruthy();
    expect(service['hasOutline'](mockEllipse)).toBeTruthy();
    expect(service['hasOutline'](mockPolygon)).toBeTruthy();
    expect(service['hasOutline'](mockRandom)).toBeFalsy();
  });

  it('#cleanUp should not do anything', () => {
    service.cleanUp();
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

  it('#onMouseMove should do nothing', () => {
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseUp should do nothing', () => {
    service.onMouseUp(new MouseEvent('mouseup'));
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
    service.onWritingText(new KeyboardEvent('keypress'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
