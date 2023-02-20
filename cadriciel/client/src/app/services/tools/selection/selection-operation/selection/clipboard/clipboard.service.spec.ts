import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CopyOperation } from 'src/app/services/operation-handler/operations/copy/copy-operation';
import { DuplicateOperation } from 'src/app/services/operation-handler/operations/duplicate/duplicate-operation';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { ClipboardService } from './clipboard.service';

class MockSVGElement {

  public transform: string;

  constructor(transform: string) {
    this.transform = transform;
  }

  public cloneNode(deepCopy: boolean) {
    return this as any as SVGElement;
  }
  public getAttribute(attribute: string) {
    return this.transform;
  }
}

describe('ClipboardService', () => {
  let service: ClipboardService;
  let svgManagerSpy: SvgManagerService;
  let rendererSpy: Renderer2;
  const dummySVGElementA: SVGElement = document.createElement('dummyA') as any;
  const dummySVGElementB: SVGElement = document.createElement('dummyB') as any;
  const dummySVGArray: SVGElement[] = [dummySVGElementA, dummySVGElementB];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ClipboardService);

    svgManagerSpy = jasmine.createSpyObj('SvgManager', {
      deleteElement: null,
      addElement: null,
      getOffset: {x: 10, y: 5},
      getSvgElements: dummySVGArray,
      deleteSelectionRect: null,
      addSelectionRect: null,
    });

    rendererSpy = jasmine.createSpyObj('Renderer2', {
      setAttribute: null,
      createElement: dummySVGElementA,
      removeChild: null,
      appendChild: null,
    });

    service['svgManager'] = svgManagerSpy;
    service['renderer'] = rendererSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setClipboard should update the clipboard value and initialize the paste shift with default value', () => {
    service.setClipboard(dummySVGArray);
    expect(service['clipboard']).toEqual(dummySVGArray);
    expect(service['shiftService'].pasteShift).toEqual(10);
  });

  it('#setClipboard should change clipboardIsEmpty value to false', () => {
    let clipboardIsEmpty = false;
    service.clipboardIsEmpty.subscribe((isEmpty: boolean) => {
      clipboardIsEmpty = isEmpty;
    });
    expect(clipboardIsEmpty).toBeTruthy();
    service.setClipboard(dummySVGArray);
    expect(clipboardIsEmpty).toBeFalsy();
  });

  it('#setSelection should update the selection value and initialize duplicate shift with default value', () => {
    service.setSelection(dummySVGArray);
    expect(service['selection']).toEqual(dummySVGArray);
    expect(service['shiftService'].duplicateShift).toEqual(10);
  });

  it('#setSelection should change selectionIsEmpty value based on if the given selection is empty or not', () => {
    let selectionIsEmpty = false;
    service.selectionIsEmpty.subscribe((isEmpty: boolean) => {
      selectionIsEmpty = isEmpty;
    });
    service.setSelection([]);
    expect(selectionIsEmpty).toBeTruthy();
    service.setSelection(dummySVGArray);
    expect(selectionIsEmpty).toBeFalsy();
  });

  it('#paste should copy and shift the current clipboard and update the clipboard shift value', () => {
    const spyCloneAndShift = spyOn<any>(service, 'cloneAndShift').and.returnValue(dummySVGArray);
    spyOn(service['shiftService'], 'incrementPasteShift').and.returnValue(15);
    service['clipboard'] = [];
    service.paste();
    expect(spyCloneAndShift).not.toHaveBeenCalled();
    service['clipboard'] = dummySVGArray;
    service.paste();
    expect(spyCloneAndShift).toHaveBeenCalledWith(dummySVGArray, 15);

  });

  it('#paste should add a CopyOperation to the operation handler', () => {
    spyOn<any>(service, 'cloneAndShift').and.returnValue(dummySVGArray);
    spyOn(service['shiftService'], 'incrementPasteShift').and.returnValue(15);
    const spyAddOperation = spyOn(service['operationHandler'], 'addOperation');
    service['shiftService'].pasteShift = 3;
    service['clipboard'] = dummySVGArray;
    service.paste();
    expect(spyAddOperation).toHaveBeenCalledWith(new CopyOperation(
      dummySVGArray,
      service['svgManager'],
      service['shiftService'],
      3,
      3, ));
  });

  it('#duplicate should copy and shift the current selection and update selection the shift value', () => {
    const spyCloneAndShift = spyOn<any>(service, 'cloneAndShift').and.returnValue(dummySVGArray);
    spyOn(service['shiftService'], 'incrementDuplicateShift').and.returnValue(12);
    service['selection'] = [];
    service.duplicate();
    expect(spyCloneAndShift).not.toHaveBeenCalled();
    service['selection'] = dummySVGArray;
    service.duplicate();
    expect(spyCloneAndShift).toHaveBeenCalledWith(dummySVGArray, 12);
  });

  it('#duplicate should add a DuplicateOperation to the operation Handler', () => {
    spyOn<any>(service, 'cloneAndShift').and.returnValue(dummySVGArray);
    spyOn(service['shiftService'], 'incrementDuplicateShift').and.returnValue(12);
    const spyAddOperation = spyOn(service['operationHandler'], 'addOperation');
    service['shiftService'].duplicateShift = 4;
    service['selection'] = dummySVGArray;
    service.duplicate();
    expect(spyAddOperation).toHaveBeenCalledWith(new DuplicateOperation(
      dummySVGArray,
      service['svgManager'],
      service['shiftService'],
      4,
      4, ));
  });

  it('#cloneAndShift should clone all the elements and add a transform if absent', () => {
    const mockSvgA = new MockSVGElement('') as any as SVGElement;
    const mockSvgB = new MockSVGElement('') as any as SVGElement;
    const mockArray = [mockSvgA, mockSvgB];
    service['cloneAndShift'](mockArray, 10);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(mockSvgA, 'transform', 'matrix(1 0 0 1 10 10)');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(mockSvgB, 'transform', 'matrix(1 0 0 1 10 10)');
    expect(service['svgManager'].addElement).toHaveBeenCalledWith(mockSvgA);
    expect(service['svgManager'].addElement).toHaveBeenCalledWith(mockSvgB);
  });

  it('#cloneAndShift should update all elements transform if present', () => {
    const mockSvgA = new MockSVGElement('matrix(2 0 0 3 0 0)') as any as SVGElement;
    const mockSvgB = new MockSVGElement('matrix(1 0 0 1 10 10)') as any as SVGElement;
    const mockArray = [mockSvgA, mockSvgB];
    service['cloneAndShift'](mockArray, 11);
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(mockSvgA, 'transform', 'matrix(2 0 0 3 11 11)');
    expect(service['renderer'].setAttribute).toHaveBeenCalledWith(mockSvgB, 'transform', 'matrix(1 0 0 1 21 21)');
  });

});
