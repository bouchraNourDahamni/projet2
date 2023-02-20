import { ElementRef, Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { GridService } from '../tools/grid/grid.service';
import { SvgManagerService } from './svg-manager.service';

describe('SvgManagerService', () => {
  let service: SvgManagerService;
  let gridService: GridService;

  class MockElementRef implements ElementRef {

    public nativeElement: MockNativeElement;

    constructor() {
      this.nativeElement = new MockNativeElement();
    }
  }

  // tslint:disable-next-line: max-classes-per-file
  class MockNativeElement {
    constructor() { return; }
  public getBoundingClientRect(): MockClientBoundingRect { return new MockClientBoundingRect(); }
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

  const mockedRenderer: any = {
    removeChild: jasmine.createSpy('removeChild'),
    appendChild: jasmine.createSpy('appendChild'),
    createElement: jasmine.createSpy('createElement'),
    setAttribute: jasmine.createSpy('setAttribute'),
    getSvgElements: jasmine.createSpy('getSvgElements'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [GridService, SvgManagerService , {provide: ElementRef,  useValue: new MockElementRef() },
        {provide: Renderer2,  useValue: mockedRenderer }],
    });
    service = TestBed.get(SvgManagerService);
    service.svgAnchor = TestBed.get(ElementRef);
    service.renderer = TestBed.get(Renderer2);
    gridService = TestBed.get(GridService);
    gridService['renderer'] = TestBed.get(Renderer2);
    gridService.anchorGrid = TestBed.get(ElementRef);
    service.workspace = TestBed.get(ElementRef);

  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(gridService).toBeTruthy();
  });

  it('#createNewDrawing should create a new drawing', () => {
    spyOn<any>(service, 'resetCanvas').and.callThrough();

    service.createDrawing(400, 500, 'red');
    expect(service.renderer).toBeDefined();
    expect(service.svgAnchor).toBeDefined();

    expect(service.renderer.appendChild).toHaveBeenCalled();
    expect(service.renderer.createElement).toHaveBeenCalled();
    expect(service['resetCanvas']).toHaveBeenCalled();

  });

  it('#resetCanvas should not remove child from renderer if container does not exist', () => {

    const serviceSVG: SvgManagerService = TestBed.get(SvgManagerService);
    serviceSVG.renderer = jasmine.createSpyObj('renderer2', ['removeChild']);
    service['resetCanvas']();
    expect(serviceSVG.renderer.removeChild).not.toHaveBeenCalled();

  });

  it('#resetCanvas should remove child from renderer if container exists', () => {

    service['container'] = document.createElement('rec') as any;
    const svg: SVGElement = document.createElement('rec') as any;
    spyOn(gridService, 'resetGrid').and.callThrough();
    service['resetCanvas']();
    expect(service.renderer.removeChild).toHaveBeenCalled();
    expect(gridService.resetGrid).toHaveBeenCalled();

    service.renderer.removeChild(service['container'], svg);

  });

  it('#deleteElement should remove properly an svg element in renderer', () => {
    service['container'] = document.createElement('rec') as any;
    const svg: SVGElement = document.createElement('rec') as any;

    service.deleteElement(svg);
    expect(service.renderer.removeChild).toHaveBeenCalled();
    service.renderer.removeChild(service['container'], svg);
  });

  it('#deleteSelectionRec should remove the selection rectangle if it exists', () => {
    const svg: SVGElement = document.createElement('rec') as any;
    service['selectionRectContainer'] = svg;
    service.deleteSelectionRect();
    expect(service.renderer.removeChild).toHaveBeenCalled();

  });

  it('#addElement should add an element to the container', () => {
    service.hasBeenModified = false;
    const svg: SVGElement = document.createElement('rec') as any;
    service.addElement(svg);
    expect(service.hasBeenModified).toBe(true);
    expect(service.renderer.appendChild).toHaveBeenCalled();

  });

  it('#addSelectionRect should delete element in container if already exists and creates another', () => {
    service['selectionRectContainer'] = document.createElement('rec') as any;
    const svg: SVGElement = document.createElement('rec') as any;
    spyOn(service, 'deleteSelectionRect').and.callThrough();
    service.addSelectionRect(svg);
    expect(service.deleteSelectionRect).toHaveBeenCalled();
    expect(service.renderer.createElement).toHaveBeenCalled();
    expect(service.renderer.appendChild).toHaveBeenCalled();
  });
  it('#addSelectionRect select a new container', () => {
    const svg: SVGElement = document.createElement('rec') as any;
    spyOn(service, 'deleteSelectionRect').and.callThrough();
    service.addSelectionRect(svg);
    expect(service.deleteSelectionRect).not.toHaveBeenCalled();
    expect(service.renderer.createElement).toHaveBeenCalled();
    expect(service.renderer.appendChild).toHaveBeenCalled();
  });
  it('#setBackgroundColor should set the new color to the background.', () => {
    const background = '#ffffff';
    service.setBackgroundColor(background);
    service.currentBackground.subscribe((color: string) => {
      expect(color).toBe(background);
    });
  });

  it('#getOffSet should return the coordinates of a point.', () => {
    spyOn(service.workspace.nativeElement, 'getBoundingClientRect').and.callThrough();
    service.getOffset();
    expect(service.workspace.nativeElement.getBoundingClientRect).toHaveBeenCalledTimes(2);
    expect(service.workspace.nativeElement.getBoundingClientRect().left).toBe(293);
    expect(service.workspace.nativeElement.getBoundingClientRect().top).toBe(8);
  });

  it('#deleteElement should do nothing', () => {
    service['deleteElement'].call(true);
    expect(true).toBeTruthy();
  });

  it('#deleteSelectionRec should do nothing', () => {
    service['deleteSelectionRect'].call(true);
    expect(true).toBeTruthy();
  });

  it('#getSvgElements should return an array', () => {
    spyOn(service, 'getSvgElements').and.callThrough();
    service['container'] = jasmine.createSpyObj('SVGElement', ['children']);
    const array = Array.from(service['container'].children) as SVGElement[];
    service.getSvgElements();
    expect(service.getSvgElements()).toEqual(array);
  });
});
