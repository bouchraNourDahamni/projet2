import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { DeleteOperation } from './delete-operation';

describe('DeleteOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() { }
  }

  const deletedElements = new MockClass() as any as SVGElement[];
  const svgManager = new MockClass() as any as SvgManagerService;

  it('should create an instance', () => {
    expect(new DeleteOperation(deletedElements, svgManager)).toBeTruthy();
  });

  it('#undo should call addElement', () => {
    const operation = new DeleteOperation(deletedElements, svgManager);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['addElement']);
    const element = new MockClass() as any as SVGElement;
    operation['deletedElements'] = [element];
    operation.undo();
    expect(operation['svgManager'].addElement).toHaveBeenCalled();
  });

  it('#redo should call deleteElement', () => {
    const operation = new DeleteOperation(deletedElements, svgManager);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['deleteElement']);
    const element = new MockClass() as any as SVGElement;
    operation['deletedElements'] = [element];
    operation.redo();
    expect(operation['svgManager'].deleteElement).toHaveBeenCalled();
  });
});
