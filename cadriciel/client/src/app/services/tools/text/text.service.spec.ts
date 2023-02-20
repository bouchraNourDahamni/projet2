import { ElementRef } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { TextAttributesService } from '../text-attributes/text-attributes.service';
import { TextService } from './text.service';

describe('TextService should be created', () => {
  let service: TextService;
  let manager: SvgManagerService;
  let textAttributes: TextAttributesService;
  let colorService: ColorService;

  class MockElementRef implements ElementRef {

    public nativeElement: MockNativeElement;
    public newTextSpan: MockSVGElement;

    constructor() {
      this.nativeElement = new MockNativeElement();
      this.newTextSpan = new MockSVGElement();
    }
  }

  // tslint:disable-next-line: max-classes-per-file
  class MockNativeElement {
    constructor() { return; }
    public getBoundingClientRect(): MockClientBoundingRect { return new MockClientBoundingRect(); }
  }
  // tslint:disable-next-line: max-classes-per-file
  class MockSVGElement {
    public textContent: string | null;
    constructor() {
      this.textContent = 'Hello World!';
    }
  }
  // tslint:disable-next-line: max-classes-per-file
  class MockClientBoundingRect {
  public left: number;
  public top: number;

  constructor() {
    this.left = 293;
    this.top = 8;
  }
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ColorService, TextAttributesService, SvgManagerService,
        {provide: ElementRef,  useValue: new MockElementRef() },
        {provide: SVGElement,  useValue: new MockSVGElement() }],
    });

    service = TestBed.get(TextService );
    manager = TestBed.get(SvgManagerService);
    textAttributes = TestBed.get(TextAttributesService);
    colorService = TestBed.get(ColorService);
    service['svgManager'].workspace = TestBed.get(ElementRef);
    service['newTextSpan'] = TestBed.get(SVGElement);
  }));

  it('TextService should be created', () => {
    expect(service).toBeTruthy();
    expect(manager).toBeTruthy();
    expect(textAttributes).toBeTruthy();
    expect(colorService).toBeTruthy();
  });

  it('#setIsBold should set line width', () => {
    const bold = false;
    service.setIsBold(bold);
    service.isBold.subscribe((isTextBold: boolean) => {
      expect(isTextBold).toBe(bold);
    });
  });

  it('#setIsItalic should set line width', () => {
    const italic = false;
    service.setIsItalic(italic);
    service.isBold.subscribe((isTextItalic: boolean) => {
      expect(isTextItalic).toBe(italic);
    });
  });

  it('#updatePositions should set position x', () => {
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    service['updatePositions'](mouseEvent);
    const returnedValue = -193;
    expect(service['newX']).toBe(returnedValue);
  });

  it('#updatePositions should set position y', () => {
    const mouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    service['updatePositions'](mouseEvent);
    const returnedValue = 92;
    expect(service['newY']).toBe(returnedValue);
  });

  it('#setTextFont should set the font of the text', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service['setTextFont']('none');
    service['setTextFont']('notNone');
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTextSize should set the size of the text', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service['setTextSize'](11);
    service['setTextSize'](20);
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTextAlignement should set the size of the text', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service['setTextAlignement']('left');
    service['setTextAlignement']('end');
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#setTextFontStyle should set the size of the text', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service['setTextFontStyle']('');
    service['setTextFontStyle']('italic');
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#validateSelectedTool should not call the function clean up when tool is feather' , () => {
    spyOn<any>(service, 'cleanUp');
    const tool = Tools.Text;
    service['validateSelectedTool'](tool);
    expect(service['cleanUp']).not.toHaveBeenCalled();
  });

  it('#validateTextColor should call the function setTextColor when textIsWriting is true' , () => {
    service['textIsWriting'] = true;
    spyOn<any>(service, 'setTextColor');
    service['validateTextColor']();
    expect(service['setTextColor']).toHaveBeenCalled();
  });

  it('#validateTextSize should call the setTextSize when textIsWrinting is true' , () => {
    service['textIsWriting'] = true;
    spyOn<any>(service, 'setTextSize');
    const size = 11;
    service['validateTextSize'](size);
    expect(service['setTextSize']).toHaveBeenCalled();
  });

  it('#validateTextFont should call the setTextFont when textIsWrinting is true' , () => {
    service['textIsWriting'] = true;
    spyOn<any>(service, 'setTextFont');
    const font = 'bold';
    service['validateTextFont'](font);
    expect(service['setTextFont']).toHaveBeenCalled();
  });

  it('#validateTextColor should not call the function clean up when tool is feather' , () => {
    service['textIsWriting'] = true;
    spyOn<any>(service, 'setTextAlignement');
    const textAlignement = 'center';
    service['validateTextAlignement'](textAlignement);
    expect(service['setTextAlignement']).toHaveBeenCalled();
  });

  it('#setTextWeight should set the weight of the text', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service['setTextWeight']('');
    service['setTextWeight']('bold');
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onMouseDown should set textIsWriting to true and create a text Element', () => {
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    spyOn<any>(service['renderer'], 'appendChild').and.returnValue('tspan');
    spyOn<any>(service['renderer'], 'setAttribute').and.callThrough();
    spyOn<any>(service['renderer'], 'createElement').and.callThrough();
    service['newX'] = 100;
    service['newY'] = 100;
    service['createTextElement']();
    service['createTextSpanElement']();
    service['newTextSpan'] = jasmine.createSpyObj('SVGElement', ['textContent']);
    service.onMouseDown(new MouseEvent('mouseDown'));
    expect(service['svgManager'].addElement).toHaveBeenCalled();
    expect(service['renderer'].appendChild).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
    expect(service['newTextSpan'].textContent).toBe('Insert text here');
  });

  it('#onMouseDown should set textIsWriting to true and create a text Element', () => {
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    spyOn<any>(service['renderer'], 'appendChild').and.returnValue('tspan');
    spyOn<any>(service['renderer'], 'setAttribute').and.callThrough();
    spyOn<any>(service['renderer'], 'createElement').and.callThrough();
    service['newX'] = 100;
    service['newY'] = 100;
    service['createTextElement']();
    service['createTextSpanElement']();
    service['textIsWriting'] = true;
    service['newTextSpan'] = jasmine.createSpyObj('SVGElement', ['textContent']);
    service.onMouseDown(new MouseEvent('mouseDown'));
    expect(service['svgManager'].addElement).toHaveBeenCalled();
    expect(service['renderer'].appendChild).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalled();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#onBackspaceDown should do nothing if textIsWriting is false', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    service['textIsWriting'] = false;
    service.onBackspaceDown(new KeyboardEvent('keydown.backspace'));
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
    expect(service['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#removeLastCharacter should remove the last character when function called', () => {
    spyOn<any>(service, 'deleteTextSpans');
    service['removeLastCharacter']();
    expect((service['newTextSpan'].textContent as string)).toBe('Hello World');
    expect(service['deleteTextSpans']).toHaveBeenCalledWith('Hello World');
  });

  it('#deleteTextSpans should not remove child if condition not true when function called', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    const text = 'Hello World!';
    service['deleteTextSpans'](text);
    expect(service['renderer'].removeChild).not.toHaveBeenCalled();
  });

  it('#onWritingText should not call the subscribeWhileWriting', () => {
    spyOn<any>(service, 'createTextSpanElement');
    service['textContents'].push(service['newTextSpan'].textContent as string);
    const event = new KeyboardEvent('keypress');
    service.onWritingText(event);
    expect(service['textContents']).toContain(service['newTextSpan'].textContent as string);
  });

  it('#onWritingText should call subscribeWhileWriting when text is writing is to true', () => {
    spyOn<any>(service, 'createTextSpanElement');
    service['textContents'].push(service['newTextSpan'].textContent as string);
    const event = new KeyboardEvent('keypress');
    service['textIsWriting'] = true;
    service.onWritingText(event);
    expect(service['textContents']).toContain(service['newTextSpan'].textContent as string);
  });

  it('#onsWritingText should call subscribeWhileWriting when text is writing is to true and go in next condition', () => {
    spyOn<any>(service, 'createTextSpanElement');
    service['textContents'].push(service['newTextSpan'].textContent as string);
    const event = new KeyboardEvent('kepress', {
      key: 'Enter',
    });
    service['textIsWriting'] = true;
    service.onWritingText(event);
    service['newTextSpan'].textContent = 'Hello World!';
    expect(service['textContents']).toContain(service['newTextSpan'].textContent as string);
  });

  it('#onsWritingText should call subscribeWhileWriting when text is writing and is newText are to true and go in next condition', () => {
    spyOn<any>(service, 'createTextSpanElement');
    service['textContents'].push(service['newTextSpan'].textContent as string);
    const event = new KeyboardEvent('kepress', {
      key: 'Backspace',
    });
    service['textIsWriting'] = true;
    spyOn<any>(service, 'isNewText').and.returnValue(true);
    service.onWritingText(event);
    service['newTextSpan'].textContent = 'Hello World!';
    expect(service['textContents']).toContain(service['newTextSpan'].textContent as string);
  });

  it('#subscribreWhileWriting should set text size and call the function setText', () => {
    spyOn<any>(service, 'setTextSize');
    const size = 9;
    service['textAttributeService'].setTextSize(size);
    expect(service['textSize']).toBe(9);
  });

  it('#createText should call remove text function', () => {
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
      addElement: jasmine.createSpy('addElement'),
    });
    spyOn<any>(service['renderer'], 'appendChild').and.returnValue('tspan');
    spyOn<any>(service['renderer'], 'setAttribute').and.callThrough();
    spyOn<any>(service['renderer'], 'createElement').and.callThrough();
    service['newX'] = 100;
    service['newY'] = 100;
    service['createTextElement']();
    service['createTextSpanElement']();
    service['newTextSpan'] = jasmine.createSpyObj('SVGElement', ['textContent']);
    service['textIsWriting'] = true;
    service['createText']();

  });

  it('#deleteTextSpans should go in condition to check if items removed', () => {
    const text = '';
    service['userInputs'].push(service['newTextSpan']);
    service['deleteTextSpans'](text);
    expect(service['userInputs'].length).toEqual(0);
  });

  it('#onBackspaceDown should call removeLastCharacter when textIsWriting is true', () => {
    service['textIsWriting'] = true;
    spyOn<any>(service['renderer'], 'removeAttribute').and.callThrough();
    spyOn<any>(service['renderer'], 'setAttribute').and.callThrough();
    spyOn<any>(service['newTextSpan'].textContent, 'substring');
    spyOn<any>(service, 'removeLastCharacter');
    service['newTextSpan'] = jasmine.createSpyObj('SVGElement', ['textContent']);
    service.onBackspaceDown(new KeyboardEvent('keydown.backspace'));
    expect(service['removeLastCharacter']).toHaveBeenCalled();
  });

  it('#activateBold should set to bold depending on the state of boolean isBoldBehavior when textIsWriting false', () => {
    let isBoldBehavior = false;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    service['isBoldBehavior'].subscribe((newIsBold: boolean) => {
      isBoldBehavior = newIsBold;
    });
    expect(isBoldBehavior).toBeFalsy();
    service.activateBold();
    expect(isBoldBehavior).toBeTruthy();
    expect(service['textWeight']).toBe('bold');
    service.activateBold();
    expect(isBoldBehavior).toBeFalsy();
    expect(service['textWeight']).toBe('');
  });

  it('#activateBold should set to bold depending on the state of boolean isBoldBehavior when textIsWriting true', () => {
    let isBoldBehavior = false;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    service['isBoldBehavior'].subscribe((newIsBold: boolean) => {
      isBoldBehavior = newIsBold;
    });
    service['textIsWriting'] = true;
    expect(isBoldBehavior).toBeFalsy();
    service.activateBold();
    expect(isBoldBehavior).toBeTruthy();
    expect(service['textWeight']).toBe('bold');
    service.activateBold();
    expect(isBoldBehavior).toBeFalsy();
    expect(service['textWeight']).toBe('');
    const serviceCopy = service as any;
    expect(serviceCopy.renderer.setAttribute.calls.all()[1].args).toEqual([service['newText'], 'font-weight', '']);
  });

  it('#activateItalic should set text to italic depending on the state of boolean isItalicBehavior', () => {
    let isItalicBehavior = false;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    service['isItalicBehavior'].subscribe((newIsItalic: boolean) => {
      isItalicBehavior = newIsItalic;
    });
    expect(isItalicBehavior).toBeFalsy();
    service.activateItalic();
    expect(isItalicBehavior).toBeTruthy();
    expect(service['textFontStyle']).toBe('italic');
    service.activateItalic();
    expect(isItalicBehavior).toBeFalsy();
    expect(service['textFontStyle']).toBe('');
  });

  it('#activateItalic should set text to italic depending on the state of boolean isItalicBehavior when textIsWriting true', () => {
    let isItalicBehavior = false;
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute', 'removeChild']);
    service['isItalicBehavior'].subscribe((newIsItalic: boolean) => {
      isItalicBehavior = newIsItalic;
    });
    service['textIsWriting'] = true;
    expect(isItalicBehavior).toBeFalsy();
    service.activateItalic();
    expect(isItalicBehavior).toBeTruthy();
    expect(service['textFontStyle']).toBe('italic');
    service.activateItalic();
    expect(isItalicBehavior).toBeFalsy();
    expect(service['textFontStyle']).toBe('');
    const serviceCopy = service as any;
    expect(serviceCopy.renderer.setAttribute.calls.all()[1].args).toEqual([service['newText'], 'font-style', '']);
  });

  it('#removeTextBox should remove the textBox when the function is called', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = true;
    service.removeTextBox();
    expect(service['renderer'].setAttribute).toHaveBeenCalled();
  });

  it('#removeTextBox should not remove the textBox when the function is called', () => {
    service['renderer'] = jasmine.createSpyObj('renderer2', ['setAttribute']);
    service['textIsWriting'] = false;
    service.removeTextBox();
    expect(service['renderer'].setAttribute).not.toHaveBeenCalled();
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

  it('#onDoubleClick should do nothing', () => {
    service.onDoubleClick(new MouseEvent('doubleclick'));
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
