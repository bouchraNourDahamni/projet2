import { TestBed } from '@angular/core/testing';
import { Tools } from '../../../../../enums/tools';
import { ICoordinates } from '../../../../../interfaces/coordinates';
import { IRange } from '../../../../../interfaces/range';
import { ISVGRectangle } from '../../../../../interfaces/SVGRectangle';
import { DeleteOperation } from '../../../../operation-handler/operations/delete/delete-operation';
import { SvgManagerService } from '../../../../svg-manager/svg-manager.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  let service: SelectionService;
  let svgManagerSpy: SvgManagerService;
  const dummySVGElementA: SVGElement = document.createElement('dummyA') as any;
  const dummySVGElementB: SVGElement = document.createElement('dummyB') as any;
  const dummySVGArray: SVGElement[] = [dummySVGElementA, dummySVGElementB];
  const dummySVGEmptyArray: SVGElement[] = [];
  const mouseLeftClick: MouseEvent = new MouseEvent('mouseDown', {button: 0, clientX: 70, clientY: 60});
  const mouseRightClick: MouseEvent = new MouseEvent('mouseDown', {button: 2});
  const dummySVGRectangle: ISVGRectangle = {x: 5, y: 6, width: 20, height: 10};
  const mouseLeftMove: MouseEvent = new MouseEvent('mouseMove', {buttons: 1, clientX: 50, clientY: 40});
  const mouseRightMove: MouseEvent = new MouseEvent('mouseMove', {buttons: 2});
  const mouseRandomMove: MouseEvent = new MouseEvent('mouseMove', {buttons: 0});

  class MockSVGElement {

    public boundingBox = {top: 0, bottom: 0, left: 0, right: 0};

    constructor(top: number, bottom: number, left: number, right: number) {
      this.boundingBox.top = top;
      this.boundingBox.bottom = bottom;
      this.boundingBox.left = left;
      this.boundingBox.right = right;
    }

    public getBoundingClientRect() {
      return this.boundingBox;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SelectionService);

    svgManagerSpy = jasmine.createSpyObj('SvgManager', {
      deleteElement: null,
      addElement: null,
      getOffset: {x: 10, y: 5},
      getSvgElements: dummySVGArray,
      deleteSelectionRect: null,
      addSelectionRect: null,
    });

    service['svgManager'] = svgManagerSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#cleanUp should set isSelecting to false and clean the current selection', () => {
    const spyClearSelection = spyOn<any>(service, 'clearSelection');
    service['isSelecting'] = true;
    service.cleanUp();
    expect(service['isSelecting']).toBeFalsy();
    expect(spyClearSelection).toHaveBeenCalled();
  });

  it('#onMouseDown should intialize click-related attributes and get top collision', () => {
    const spyOnInitialize = spyOn<any>(service, 'initializeMouseDown');

    service.onMouseDown(mouseLeftClick);
    expect(spyOnInitialize).toHaveBeenCalled();
  });

  it('#onMouseDown should intialize click-related attributes and get top collision for empty array', () => {
    const spyOnInitialize = spyOn<any>(service, 'initializeMouseDown');
    service.onMouseDown(mouseLeftClick);
    expect(spyOnInitialize).toHaveBeenCalled();
  });

  it('#onMouseUp should delete the perimeter and set isDrawing to false', () => {
    service['isSelecting'] = true;
    service['tempSelection'] = dummySVGArray;
    const spyGetCollisions = spyOn<any>(service, 'getCollisions').and.returnValue(dummySVGEmptyArray);
    const spyOnGetSelectionRect = spyOn<any>(service, 'updateSelectionRect');

    const spyOnDeletePerimeter = spyOn(service['selectionSvg'], 'removePerimeter');
    service.onMouseUp(mouseLeftClick);
    expect(spyOnDeletePerimeter).toHaveBeenCalled();
    expect(service['isSelecting']).toBeFalsy();
    expect(spyGetCollisions).toHaveBeenCalled();
    expect(spyOnGetSelectionRect).toHaveBeenCalledWith([]);
  });

  it('#onMouseUp should update the currentSelection to the tempSelection on right click', () => {
    service['allDrawings'] = [];
    service['isSelecting'] = true;
    service['tempSelection'] = dummySVGArray;
    const spyOnFindSelectionRect = spyOn<any>(service, 'findSelectionRect').and.returnValue(dummySVGRectangle);
    const spyOnSetCurrentSelection = spyOn<any>(service, 'setCurrentSelection');
    const spyGetCollisions = spyOn<any>(service, 'getCollisions').and.returnValue(dummySVGEmptyArray);
    const spyOnGetSelectionRect = spyOn<any>(service, 'updateSelectionRect');

    service.onMouseUp(mouseLeftClick);
    expect(spyOnSetCurrentSelection).not.toHaveBeenCalled();
    service.onMouseUp(mouseRightClick);
    expect(spyOnSetCurrentSelection).toHaveBeenCalledWith([], dummySVGRectangle);
    expect(spyOnFindSelectionRect).toHaveBeenCalled();
    expect(spyGetCollisions).toHaveBeenCalled();
    expect(spyOnGetSelectionRect).toHaveBeenCalledWith([]);
  });

  it('#onMouseMove should update the current coordinates and update the perimeter', () => {
    service['workspaceOffset'] = {x: 10, y: 5};
    const newCoordinates: ICoordinates = {x: 40, y: 35};

    const spyGetCollisions = spyOn<any>(service, 'getCollisions');
    const spyUpdatePerimeter = spyOn<any>(service['selectionSvg'], 'updatePerimeter');
    spyOn<any>(service, 'updateSelectionRect');
    spyOn<any>(service, 'invertSelection');

    service.onMouseMove(mouseLeftMove);
    expect(spyGetCollisions).not.toHaveBeenCalled();
    expect(spyUpdatePerimeter).not.toHaveBeenCalled();
    service['isSelecting'] = true;
    service.onMouseMove(mouseLeftMove);
    expect(service['currentCoordinates']).toEqual(newCoordinates);
    expect(spyGetCollisions).toHaveBeenCalled();
    expect(spyUpdatePerimeter).toHaveBeenCalled();
  });

  it('#onMouseMove should call the correct update method based on the button clicked ', () => {
    service['isSelecting'] = true;
    service['workspaceOffset'] = {x: 10, y: 5};
    spyOn<any>(service, 'getCollisions');
    spyOn<any>(service['selectionSvg'], 'updatePerimeter');
    const spyUpdateSelection = spyOn<any>(service, 'updateSelectionRect');
    const spyInvertSelection = spyOn<any>(service, 'invertSelection');

    service.onMouseMove(mouseLeftMove);
    expect(spyUpdateSelection).toHaveBeenCalled();
    expect(spyInvertSelection).not.toHaveBeenCalled();
    service.onMouseMove(mouseRightMove);
    expect(spyInvertSelection).toHaveBeenCalled();
  });

  it('#onMouseMove should call the correct update method based on the button clicked ', () => {
    service['isSelecting'] = true;
    service['workspaceOffset'] = {x: 10, y: 5};
    spyOn<any>(service, 'getCollisions');
    spyOn<any>(service['selectionSvg'], 'updatePerimeter');
    const spyUpdateSelection = spyOn<any>(service, 'updateSelectionRect');
    const spyInvertSelection = spyOn<any>(service, 'invertSelection');

    service.onMouseMove(mouseRandomMove);
    expect(spyUpdateSelection).not.toHaveBeenCalled();
    expect(spyInvertSelection).not.toHaveBeenCalled();
  });

  it('#handleToolChange should clean up the current selection operation if current tool is not selection', () => {
    service['isSelecting'] = true;
    const spyClearSelection = spyOn<any>(service, 'clearSelection');
    const spyRemovePerimeter = spyOn<any>(service['selectionSvg'], 'removePerimeter');
    service['handleToolChange'](Tools.Line);
    expect(service['isSelecting']).toBeFalsy();
    expect(spyClearSelection).toHaveBeenCalled();
    expect(spyRemovePerimeter).toHaveBeenCalled();
  });

  it('#initializeMouseDown should get the workspace offset and the list of drawing elements', () => {
    spyOn<any>(service['selectionSvg'], 'createPerimeter');
    const offset: ICoordinates = {x: 10, y: 5};
    service['initializeMouseDown'](mouseLeftClick);
    expect(service['workspaceOffset']).toEqual(offset);
    expect(service['allDrawings']).toEqual(dummySVGArray);
  });

  it('#initializeMouseDown should update the initial and current coordinates and initialize the perimeter', () => {
    const spyCreatePerimeter = spyOn<any>(service['selectionSvg'], 'createPerimeter');
    service['initializeMouseDown'](mouseLeftClick);
    expect(service['initialCoordinates']).toEqual({x: 60, y: 55});
    expect(service['currentCoordinates']).toEqual({x: 60, y: 55});
    expect(spyCreatePerimeter).toHaveBeenCalledWith({x: 60, y: 55});
  });

  it('#updateSelectionRect should clear the selectionRect if no collisions are detected', () => {
    const spyClearSelection = spyOn<any>(service, 'clearSelection');
    spyOn<any>(service, 'setCurrentSelection');
    spyOn<any>(service, 'findSelectionRect');
    spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');
    service['updateSelectionRect']([dummySVGElementA]);
    expect(spyClearSelection).not.toHaveBeenCalled();
    service['updateSelectionRect']([]);
    expect(spyClearSelection).toHaveBeenCalled();
  });

  it('#updateSelectionRect should generate a new selection rectangle if collisions are detected', () => {
    service['currentSelectionRect'] = dummySVGRectangle;
    spyOn<any>(service, 'setCurrentSelection');
    spyOn<any>(service, 'findSelectionRect');
    const spyCreateRectangle = spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');

    service['updateSelectionRect']([]);
    expect(spyCreateRectangle).not.toHaveBeenCalled();
    service['updateSelectionRect'](dummySVGArray);
    expect(spyCreateRectangle).toHaveBeenCalledWith(dummySVGRectangle);
  });

  it('#updateSelectionRect should update the list of selected objects', () => {
    const spyOnSetCurrentSelection = spyOn<any>(service, 'setCurrentSelection');
    spyOn<any>(service, 'findSelectionRect').and.returnValue(dummySVGRectangle);
    spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');
    service['updateSelectionRect'](dummySVGArray);
    expect(spyOnSetCurrentSelection).toHaveBeenCalledWith(dummySVGArray, dummySVGRectangle);
  });

  it('#invertSelection should create a copy of the current selection and remove common objects with collisions', () => {
    spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');
    spyOn<any>(service, 'findSelectionRect');
    service['currentSelection'] = dummySVGArray;
    service['invertSelection']([]);
    expect(service['tempSelection']).toEqual(dummySVGArray);
    service['invertSelection'](dummySVGArray);
    expect(service['tempSelection']).toEqual([]);
  });

  it('#invertSelection should add to the current selection copy object in collisions not in the copy ', () => {
    spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');
    spyOn<any>(service, 'findSelectionRect');
    const svgArray: SVGElement[] = [dummySVGElementB];
    service['currentSelection'] = svgArray;
    service['invertSelection'](dummySVGArray);
    expect(service['tempSelection']).toEqual([dummySVGElementA]);
  });

  it('#invertSelection should create a new rectangle if tempSelection is not empty, delete the rectangle otherwise', () => {
    const spyCreateRectangle = spyOn<any>(service['selectionSvg'], 'createSelectionRectangle');
    spyOn<any>(service, 'findSelectionRect');
    service['currentSelection'] = dummySVGArray;
    service['invertSelection'](dummySVGArray);
    expect(spyCreateRectangle).not.toHaveBeenCalled();
    expect(service['svgManager'].deleteSelectionRect).toHaveBeenCalledTimes(1);
    service['currentSelection'] = [];
    service['invertSelection'](dummySVGArray);
    expect(spyCreateRectangle).toHaveBeenCalled();
    expect(service['svgManager'].deleteSelectionRect).toHaveBeenCalledTimes(1);
  });

  it('#findSelectionRect should find the smallest rectangle containing all listed elements', () => {
    const rectSvgA: SVGElement = new MockSVGElement(20, 30, 40, 50) as any as SVGElement;
    const rectSvgB: SVGElement = new MockSVGElement(22, 28, 42, 48) as any as SVGElement;
    const rectSvgC: SVGElement = new MockSVGElement(25, 40, 45, 60) as any as SVGElement;
    const rectSvgD: SVGElement = new MockSVGElement(18, 19, 40, 50) as any as SVGElement;
    const dummyArray: SVGElement[] = [rectSvgA, rectSvgB, rectSvgC, rectSvgD];
    service['workspaceOffset'] = {x: 10, y: 5};
    const newRectangle: ISVGRectangle = service['findSelectionRect'](dummyArray);
    const expectedRectangle: ISVGRectangle = {x: 30, y: 13, width: 20, height: 22};
    expect(newRectangle).toEqual(expectedRectangle);
  });

  it('#findSelectionRect should go in first condition wheres array is empty', () => {
    const dummyArray: SVGElement[] = [];
    service['workspaceOffset'] = {x: 10, y: 5};
    const newRectangle: ISVGRectangle = service['findSelectionRect'](dummyArray);
    const expectedRectangle: ISVGRectangle = {x: 0, y: 0, width: 0, height: 0};
    expect(newRectangle).toEqual(expectedRectangle);
  });

  it('#getCollision should return all objects colliding with the current selection perimeter' , () => {

    const rectSvgA: SVGElement = new MockSVGElement(20, 30, 40, 50) as any as SVGElement; // with offset: (30,15) (40,25)
    const rectSvgB: SVGElement = new MockSVGElement(22, 28, 42, 48) as any as SVGElement; // with offset: (32,17) (38,23)
    const rectSvgC: SVGElement = new MockSVGElement(25, 40, 45, 60) as any as SVGElement; // with offset: (35,20) (50,35)
    const rectSvgD: SVGElement = new MockSVGElement(18, 19, 40, 50) as any as SVGElement; // with offset: (30,13) (40,14)
    const dummyArray: SVGElement[] = [rectSvgA, rectSvgB, rectSvgC, rectSvgD];
    service['workspaceOffset'] = {x: 10, y: 5};
    service['allDrawings'] = Array.from(dummyArray);
    service['initialCoordinates'] = {x: 3, y: 3};
    service['currentCoordinates'] = {x: 31, y: 16};
    let expectedCollisions: SVGElement[] = [rectSvgA, rectSvgD];
    expect(service['getCollisions']()).toEqual(expectedCollisions);
    service['initialCoordinates'] = {x: 500, y: 500};
    service['currentCoordinates'] = {x: 50, y: 35};
    expectedCollisions = [rectSvgC];
    expect(service['getCollisions']()).toEqual(expectedCollisions);
  });

  it('#isIntersecting should return true if 2 number ranges have any overlap', () => {
    const rangeA: IRange = {start: 2, end: 8};
    const rangeB: IRange = {start: 4, end: 10};
    const rangeC: IRange = {start: 8, end: 10};
    const rangeD: IRange = {start: 4, end: 5};
    const rangeE: IRange = {start: 9, end: 21};

    expect(service.isIntersecting(rangeA, rangeB)).toBeTruthy();
    expect(service.isIntersecting(rangeA, rangeC)).toBeTruthy();
    expect(service.isIntersecting(rangeA, rangeD)).toBeTruthy();
    expect(service.isIntersecting(rangeA, rangeE)).toBeFalsy();
    expect(service.isIntersecting(rangeE, rangeD)).toBeFalsy();
  });

  it('#generateNullRect should provide an SVGRectangle with null values', () => {
    const nullRectangle = service['generateNullRect']();
    expect(nullRectangle.height).toEqual(0);
    expect(nullRectangle.width).toEqual(0);
    expect(nullRectangle.x).toEqual(0);
    expect(nullRectangle.y).toEqual(0);
  });

  it('#setCurrentSelection should update the current selection and selectionRect, and send those the values to clipboard', () => {
    const spyOnSetSelection = spyOn(service['clipboardService'], 'setSelection');
    service['setCurrentSelection'](dummySVGArray, dummySVGRectangle);
    expect(service['currentSelection']).toEqual(dummySVGArray);
    expect(service['currentSelectionRect']).toEqual(dummySVGRectangle);
    expect(service['clipboardService'].selectionRect).toEqual(dummySVGRectangle);
    expect(spyOnSetSelection).toHaveBeenCalledWith(dummySVGArray);
  });

  it('#clearSelection should remove the selection rectangle, set to empty the current selection of selection and clipboard', () => {
    const spyOnSetSelection = spyOn(service['clipboardService'], 'setSelection');
    service['currentSelection'] = dummySVGArray;
    service['clearSelection']();
    expect(service['currentSelection']).toEqual([]);
    expect(service['svgManager'].deleteSelectionRect).toHaveBeenCalled();
    expect(spyOnSetSelection).toHaveBeenCalledWith([]);
  });

  it('#cut if selection is not empty, should delete the current selection and send it to the clipboard', () => {
    const spyOnSetSelection = spyOn(service['clipboardService'], 'setClipboard');
    const spyOnDeleteSelection = spyOn<any>(service, 'deleteSelection');
    service['currentSelection'] = [];
    service.cut();
    expect(spyOnSetSelection).not.toHaveBeenCalled();
    expect(spyOnDeleteSelection).not.toHaveBeenCalled();
    service['currentSelection'] = dummySVGArray;
    service['currentSelectionRect'] = dummySVGRectangle;
    service.cut();
    expect(spyOnSetSelection).toHaveBeenCalledWith(dummySVGArray);
    expect(service['clipboardService'].clipboardRect).toEqual(dummySVGRectangle);
    expect(spyOnDeleteSelection).toHaveBeenCalled();
  });

  it('#copy if selection is not empty, should send it to the clipboard', () => {
    const spyOnSetSelection = spyOn(service['clipboardService'], 'setClipboard');
    service['currentSelection'] = [];
    service.copy();
    expect(spyOnSetSelection).not.toHaveBeenCalled();
    service['currentSelection'] = dummySVGArray;
    service['currentSelectionRect'] = dummySVGRectangle;
    service.copy();
    expect(spyOnSetSelection).toHaveBeenCalledWith(dummySVGArray);
    expect(service['clipboardService'].clipboardRect).toEqual(dummySVGRectangle);

  });

  it('#paste should remove the currentSelection and ask clipboard to paste', () => {
    const spyOnClearSelection = spyOn(service, 'clearSelection');
    const spyOnPaste = spyOn(service['clipboardService'], 'paste');
    service.paste();
    expect(spyOnClearSelection).toHaveBeenCalled();
    expect(spyOnPaste).toHaveBeenCalled();
  });

  it('#duplicate should ask clipboard to duplicate if selection is not empty', () => {
    const spyOnDuplicate = spyOn(service['clipboardService'], 'duplicate');
    service['currentSelection'] = [];
    service.duplicate();
    expect(spyOnDuplicate).not.toHaveBeenCalled();
    service['currentSelection'] = dummySVGArray;
    service.duplicate();
    expect(spyOnDuplicate).toHaveBeenCalled();
  });

  it('#deleteSelection should remove all selected elements from the Workspace', () => {
    const spyOnClearSelection = spyOn(service, 'clearSelection');
    service['currentSelection'] = [];
    service.deleteSelection();
    expect(spyOnClearSelection).not.toHaveBeenCalled();
    service['currentSelection'] = dummySVGArray;
    service.deleteSelection();
    expect(service['svgManager'].deleteElement).toHaveBeenCalledWith(dummySVGElementA);
    expect(service['svgManager'].deleteElement).toHaveBeenCalledWith(dummySVGElementB);
    expect(spyOnClearSelection).toHaveBeenCalled();
  });

  it('#deleteSelection should add a DeleteOperation to the operationHandler', () => {
    spyOn(service, 'clearSelection');
    const spyOnAddOperation = spyOn(service['operationHandler'], 'addOperation');
    service['currentSelection'] = dummySVGArray;
    const operation = new DeleteOperation(dummySVGArray, service['svgManager']);
    service.deleteSelection();
    expect(spyOnAddOperation).toHaveBeenCalledWith(operation);
  });

  it('#selectAll should set as selected all the elements in the canevas', () => {
    const spyUpdateRectangle = spyOn<any>(service, 'updateSelectionRect');
    service.selectAll();
    expect(service['currentSelection']).toEqual(dummySVGArray);
    expect(spyUpdateRectangle).toHaveBeenCalledWith(dummySVGArray);
  });

  it('#handleToolChange should do nothing', () => {
    const tool = Tools.Selection;
    service['handleToolChange'](tool);
    expect(true).toBeTruthy();
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
