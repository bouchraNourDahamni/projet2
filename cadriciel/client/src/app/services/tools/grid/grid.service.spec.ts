import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

describe('GridService', () => {
  let rendererSpy: Renderer2;
  let service: GridService;

  class MockElementRef implements ElementRef {

    public nativeElement: MockNativeElement;

    constructor() {
      this.nativeElement = new MockNativeElement();
    }
  }
  const dummySvgElement = document.createElement('dummy') as any;

  // tslint:disable-next-line: max-classes-per-file
  class MockNativeElement {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2],
    });
    service = TestBed.get(GridService);
    rendererSpy = jasmine.createSpyObj('Renderer2', {
      setAttribute: null,
      createElement: dummySvgElement,
      removeChild: null,
      appendChild: null});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#toggleGrid should toggle the visibility value', () => {
    let isVisible = false;
    service['renderer'] = rendererSpy;
    service.isVisible.subscribe((newIsVisible: boolean) => {
      isVisible = newIsVisible;
    });
    expect(isVisible).toBeFalsy();
    service.toggleGrid();
    expect(isVisible).toBeTruthy();
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'display', 'inline');
    service.toggleGrid();
    expect(isVisible).toBeFalsy();
    const serviceCopy = service as any;
    expect(serviceCopy['renderer'].setAttribute.calls.all()[1].args).toEqual([service['container'], 'display', 'none']);
  });

  it('#scaleGridUp should set the grid size to next multiple of 5', () => {
    service['squareSize'] = 10;
    service.generateGrid = jasmine.createSpy();
    service.scaleGridUp();
    expect(service['squareSize']).toEqual(15);
    expect(service.generateGrid).toHaveBeenCalled();

    service['squareSize'] = 21;
    service.scaleGridUp();
    expect(service['squareSize']).toEqual(25);

    service['squareSize'] = 24;
    service.scaleGridUp();
    expect(service['squareSize']).toEqual(25);
  });

  it('#scaleGridUp should not put grid size above 500', () => {
    const maxValue = 500;
    service['squareSize'] = maxValue - 5;
    service.generateGrid = jasmine.createSpy();
    service.scaleGridUp();
    expect(service['squareSize']).toEqual(maxValue);
    service.scaleGridUp();
    expect(service['squareSize']).toEqual(maxValue);
  });

  it('#scaleGridDown should set the grid size to previous multiple of 5', () => {
    service['squareSize'] = 25;
    service.generateGrid = jasmine.createSpy();
    service.scaleGridDown();
    expect(service['squareSize']).toEqual(20);
    expect(service.generateGrid).toHaveBeenCalled();

    service['squareSize'] = 21;
    service.scaleGridDown();
    expect(service['squareSize']).toEqual(20);

    service['squareSize'] = 24;
    service.scaleGridDown();
    expect(service['squareSize']).toEqual(20);
  });

  it('#scaleGridDown should not put grid size below 10', () => {
    const minValue = 10;
    service['squareSize'] = minValue + 5;
    service.generateGrid = jasmine.createSpy();
    service.scaleGridDown();
    expect(service['squareSize']).toEqual(minValue);
    service.scaleGridDown();
    expect(service['squareSize']).toEqual(minValue);
  });

  it('#setGridSize should update the grid size and keep it between 10 and 500', () => {
    const minValue = 10;
    const maxValue = 500;
    service.generateGrid = jasmine.createSpy();

    service.setGridSize(56);
    expect(service['squareSize']).toEqual(56);

    service.setGridSize(maxValue);
    expect(service['squareSize']).toEqual(maxValue);
    service.setGridSize(maxValue + 1);
    expect(service['squareSize']).toEqual(maxValue);

    service.setGridSize(minValue);
    expect(service['squareSize']).toEqual(minValue);
    service.setGridSize(minValue - 1);
    expect(service['squareSize']).toEqual(minValue);
    expect(service.generateGrid).toHaveBeenCalled();
  });

  it('#setTransparency should set transparency default min if value is below', () => {
    service['renderer'] = rendererSpy;
    service.setTransparency(0);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'stroke-opacity', '0.2');
    service.setTransparency(0.5);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'stroke-opacity', '0.5');
  });

  it('#resetGrid should put visibility back to false and reset grid size to default', () => {
    const gridSize = 20;
    let isVisible = true;
    service.isVisible.subscribe((newIsVisible: boolean) => {
      isVisible = newIsVisible;
    });
    service['setIsVisible'](true);
    service['squareSize'] = 45;
    service.resetGrid();
    expect(isVisible).toBeFalsy();
    expect(service['squareSize']).toEqual(gridSize);
  });

  it('#initializeContainer should remove previous container from DOM and add a new one', () => {
    service['renderer'] = rendererSpy;
    const dummyAnchorGrid: ElementRef = new MockElementRef();
    service.anchorGrid = dummyAnchorGrid;
    service['initializeContainer']();
    expect(service['renderer'].removeChild).not.toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(1);
    expect(service['renderer'].appendChild).toHaveBeenCalledWith(dummyAnchorGrid.nativeElement, dummySvgElement);

    const newDummyContainer: SVGElement = document.createElement('g') as any;
    service['container'] = newDummyContainer;
    service['initializeContainer']();
    expect(service['renderer'].removeChild).toHaveBeenCalled();
    expect(service['renderer'].createElement).toHaveBeenCalledTimes(2);
    expect(service['renderer'].appendChild).toHaveBeenCalledTimes(2);
  });

  it('#initializeContainer should set container values to current attributes', () => {
    service['renderer'] = rendererSpy;
    const dummyAnchorGrid: ElementRef = new MockElementRef();
    service.anchorGrid = dummyAnchorGrid;
    service['setIsVisible'](true);
    service['initializeContainer']();
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'stroke', 'black');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'stroke-width', '2');
    expect(service['renderer'].setAttribute).not.toHaveBeenCalledWith(service['container'], 'display', 'none');

    service['setIsVisible'](false);
    service['initializeContainer']();
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(service['container'], 'display', 'none');
  });

  it('#generateGrid should fit in the canvas as many as lines as possible, in Y and X', () => {
    const dummyAnchorGrid: ElementRef = new MockElementRef();
    service.anchorGrid = dummyAnchorGrid;
    service['renderer'] = rendererSpy;
    service.workspaceHeight = 65;
    service.workspaceWidth = 40;
    service['squareSize'] = 10;
    const spyOnInitialize = spyOn<any>(service, 'initializeContainer');
    service.generateGrid();
    expect(spyOnInitialize).toHaveBeenCalled();
    // append should have been called 7 times in y, and 5 in x
    expect(service['renderer'].appendChild).toHaveBeenCalledTimes(12);
  });

  it('generateGrid should generate lines with length, height and gap taken from attributes', () => {
    const dummyAnchorGrid: ElementRef = new MockElementRef();
    service.anchorGrid = dummyAnchorGrid;
    service['renderer'] = rendererSpy;
    service.workspaceHeight = 65;
    service.workspaceWidth = 40;
    service['squareSize'] = 9;
    const spyOnInitialize = spyOn<any>(service, 'initializeContainer');
    service.generateGrid();
    expect(spyOnInitialize).toHaveBeenCalled();
    // lines in X
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'x1', '0');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'x1', '9');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'x1', '36');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'y2', '65');
    expect(service['renderer'].setAttribute).not.toHaveBeenCalledWith(dummySvgElement, 'x1', '45');

    // lines in Y
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'y1', '0');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'y1', '9');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'y1', '63');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(dummySvgElement, 'x2', '40');
    expect(service['renderer'].setAttribute).not.toHaveBeenCalledWith(dummySvgElement, 'y1', '72');

  });
});
