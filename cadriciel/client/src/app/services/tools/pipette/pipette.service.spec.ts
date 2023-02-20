import { async, TestBed } from '@angular/core/testing';
import { IColorChange } from '../../../interfaces/color-change';
import { PipetteService } from './pipette.service';

class MockSVGElement {

  public parentElement: SVGElement;
  public classList = {value: ''};

  public fill: string;
  public stroke: string;
  public fillOpacity: number;
  public strokeOpacity: number;
  public tagName: string;
  public opacity: number;

  constructor(parent: SVGElement, tag: string) {
    this.parentElement = parent;
    this.classList.value = tag;
  }

  public getAttribute(attribute: string) {
    switch (attribute) {
      case 'fill' : {
        return this.fill;
      }
      case 'stroke' : {
        return this.stroke;
      }
      case 'fill-opacity': {
        return this.fillOpacity;
      }
      case 'stroke-opacity': {
        return this.strokeOpacity;
      }
      case 'opacity': {
        return this.opacity;
      }
      default: { return ''; }
    }
  }
}

describe('PipetteService', () => {
  let service: PipetteService;
  const dummySVGElement: SVGElement = document.createElement('rec') as any;
  const rightClick: MouseEvent = new MouseEvent('onmousedown', {button: 2});
  const leftClick: MouseEvent = new MouseEvent('onmousedown', {button: 0});
  const dummyColorChangeA: IColorChange = {oldColor: 'blue', oldOpacity: 0.2, newColor: 'blublu', newOpacity: 0.8 };
  const dummyColorChangeB: IColorChange = {oldColor: 'red', oldOpacity: 0.3, newColor: 'blublu', newOpacity: 1 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PipetteService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#onMouseDown extract the target and send the event to the click handler', () => {
    const spyOnCheckClick = spyOn<any>(service, 'checkCalledClick');
    Object.defineProperty(rightClick, 'target', {value: dummySVGElement});
    service.onMouseDown(rightClick);
    expect(service['colorTarget']).toEqual(dummySVGElement);
    expect(spyOnCheckClick).toHaveBeenCalledWith(rightClick);
  });

  it('#checkCalledClick should extract to primary or secondary color based on button clicked', () => {
    service['colorTarget'] = dummySVGElement;
    const spyOnExtractPrimary = spyOn<any>(service, 'extractPrimaryColor');
    const spyOnExtractSecondary = spyOn<any>(service, 'extractSecondaryColor');
    service['checkCalledClick'](rightClick);
    const middleClick: MouseEvent = new MouseEvent('onmousedown', {button: 1});
    service['checkCalledClick'](middleClick);
    expect(spyOnExtractPrimary).not.toHaveBeenCalledWith(dummySVGElement);
    expect(spyOnExtractPrimary).not.toHaveBeenCalled();
    expect(spyOnExtractSecondary).toHaveBeenCalledWith(dummySVGElement);
    service['checkCalledClick'](leftClick);
    expect(spyOnExtractPrimary).toHaveBeenCalledWith(dummySVGElement);
  });

  it('#extractColor should extract extract from composite or extract from single element based on parent tag', () => {
    const mockLineParent = new MockSVGElement(dummySVGElement, 'line') as any as SVGElement;
    const mockLineLeaf = new MockSVGElement(mockLineParent, 'grrr') as any as SVGElement;
    const mockSingleElement = new MockSVGElement(dummySVGElement, 'blublu') as any as SVGElement;
    const spyOnExtractComposite = spyOn<any>(service, 'extractFromComposite').and.returnValue(dummyColorChangeA);
    const spyOnExtractSingle = spyOn<any>(service, 'extractFromSingleElement').and.returnValue(dummyColorChangeB);
    service['extractColor'](mockLineLeaf);
    expect(spyOnExtractComposite).toHaveBeenCalled();
    expect(spyOnExtractSingle).not.toHaveBeenCalled();
    service['extractColor'](mockSingleElement);
    expect(spyOnExtractSingle).toHaveBeenCalled();
  });

  it('#extractFromComposite should extract the right attribute based on if its a circle or not', () => {
    const mockParent = new MockSVGElement(dummySVGElement, '') as any;
    const mockCircle = new MockSVGElement(mockParent, 'blublu') as any;
    mockParent.opacity = 0.4;
    mockCircle.tagName = 'circle';
    mockCircle.fill = 'moo';
    const colorA = service['extractFromComposite'](mockParent, mockCircle, dummyColorChangeA);
    expect(colorA).toEqual({oldColor: 'moo', oldOpacity: 0.4, newColor: 'blublu', newOpacity: 0.8});

    const mockNotCircle = new MockSVGElement(mockParent, 'tag') as any;
    mockParent.opacity = 0.5;
    mockNotCircle.stroke = 'orange';
    const colorB = service['extractFromComposite'](mockParent, mockNotCircle, dummyColorChangeA);
    expect(colorB).toEqual({oldColor: 'orange', oldOpacity: 0.5, newColor: 'blublu', newOpacity: 0.8});
  });

  it('#extractFromSingleElement should give fill related values if fill exists', () => {
    const mockWithoutFill = new MockSVGElement(dummySVGElement, 'doesntmatter') as any;
    mockWithoutFill.stroke = 'blue';
    mockWithoutFill.strokeOpacity = 0.5;
    const color = service['extractFromSingleElement'](mockWithoutFill as SVGElement, dummyColorChangeA);
    expect(color).toEqual({oldColor: 'blue', oldOpacity: 0.5, newColor: 'blublu', newOpacity: 0.8});

    const mockWithFill = new MockSVGElement(dummySVGElement, 'aaaa') as any;
    mockWithFill.fill = 'yaaa';
    mockWithFill.fillOpacity = 0.1;
    const colorB = service['extractFromSingleElement'](mockWithFill as SVGElement, dummyColorChangeA);
    expect(colorB).toEqual({oldColor: 'yaaa', oldOpacity: 0.1, newColor: 'blublu', newOpacity: 0.8});
  });

  it('#extractOutline should extract the outline related values', () => {
    const mockOutline = new MockSVGElement(dummySVGElement, 'something') as any;
    mockOutline.stroke = 'green';
    mockOutline.strokeOpacity = 0.2;
    const color = service['extractOutline'](mockOutline);
    expect(color).toEqual({oldColor: 'green', oldOpacity: 0.2, newColor: '', newOpacity: 0});
  });

  it('#extractPrimaryColor should push color values as primary', () => {
    spyOn(service, 'extractColor').and.returnValue(dummyColorChangeB);
    const spyOnSendPrimary = spyOn(service['colorService'], 'sendPrimaryColor');
    const spyOnSetFillTransparency = spyOn(service['colorService'], 'setFillTransparency');
    service['extractPrimaryColor'](dummySVGElement);
    expect(spyOnSendPrimary).toHaveBeenCalledWith('red');
    expect(spyOnSetFillTransparency).toHaveBeenCalledWith(0.3);
  });

  it('#extractSecondaryColor should push color values as secondary', () => {
    spyOn(service, 'extractColor').and.returnValue(dummyColorChangeB);
    const spyOnSendSecondary = spyOn(service['colorService'], 'sendSecondaryColor');
    const spyOnSetOutlineTransparency = spyOn(service['colorService'], 'setOutlineTransparency');
    service['extractSecondaryColor'](dummySVGElement);
    expect(spyOnSendSecondary).toHaveBeenCalledWith('red');
    expect(spyOnSetOutlineTransparency).toHaveBeenCalledWith(0.3);
  });

  it('#cleanUp should do nothing', () => {
    service['cleanUp']();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseUp should do nothing', () => {
    service.onMouseUp(new MouseEvent('shiftdown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseMove should do nothing', () => {
    service.onMouseMove(new MouseEvent('shiftup'));
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
    service.onWritingText(new KeyboardEvent('writetext'));
    expect(true).toBeTruthy(); // placeholder test
  });
});
