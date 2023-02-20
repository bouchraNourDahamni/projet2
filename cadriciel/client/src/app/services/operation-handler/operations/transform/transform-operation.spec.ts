import { Renderer2 } from '@angular/core';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { SelectionService } from 'src/app/services/tools/selection/selection-operation/selection/selection.service';
import { TransformOperation } from './transform-operation';

describe('DuplicateOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() { }
  }

  const modifiedDrawings = new MockClass() as any as SVGElement[];
  const oldTransforms = new MockClass() as any as string[];
  const newTransforms = new MockClass() as any as string[];
  const renderer = new MockClass() as any as Renderer2;
  const selectionService = new MockClass() as any as SelectionService;

  it('should create an instance', () => {
    expect(new TransformOperation(modifiedDrawings, oldTransforms, newTransforms, renderer, selectionService)).toBeTruthy();
  });

  it('#undo should call deleteElement', () => {
    const operation = new TransformOperation(modifiedDrawings, oldTransforms, newTransforms, renderer, selectionService);
    operation['renderer'] = jasmine.createSpyObj('OperationService', ['setAttribute']);
    operation['selectionService'] = jasmine.createSpyObj('SelectionService', ['clearSelection']);
    const element = new MockClass() as any as SVGElement;
    const elementString = new MockClass() as any as string;
    operation['modifiedDrawings'] = [element];
    operation['oldTransforms'] = [elementString];
    operation.undo();
    expect(operation['selectionService'].clearSelection).toHaveBeenCalled();
    expect(operation['renderer'].setAttribute).toHaveBeenCalledWith(element, SVGAttributes.Transform, element);
  });

  it('#redo should call addElement', () => {
    const operation = new TransformOperation(modifiedDrawings, oldTransforms, newTransforms, renderer, selectionService);
    operation['renderer'] = jasmine.createSpyObj('OperationService', ['setAttribute']);
    operation['selectionService'] = jasmine.createSpyObj('SelectionService', ['clearSelection']);
    const element = new MockClass() as any as SVGElement;
    const elementString = new MockClass() as any as string;
    operation['modifiedDrawings'] = [element];
    operation['newTransforms'] = [elementString];
    operation.redo();
    expect(operation['selectionService'].clearSelection).toHaveBeenCalled();
    expect(operation['renderer'].setAttribute).toHaveBeenCalledWith(element, SVGAttributes.Transform, element);
  });
});
