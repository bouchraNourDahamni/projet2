import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { AddObjectOperation } from './add-object-operation';

describe('AddObjectOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() { }
  }

  const element = new MockClass() as any as SVGElement;
  const svgManager = new MockClass() as any as SvgManagerService;

  it('should create an instance', () => {
    expect(new AddObjectOperation(element, svgManager)).toBeTruthy();
  });

  it('#undo should call deleteElement', () => {
    const operation = new AddObjectOperation(element, svgManager);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['deleteElement']);
    operation.undo();
    expect(operation['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#redo should call addElement', () => {
    const operation = new AddObjectOperation(element, svgManager);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['addElement']);
    operation.redo();
    expect(operation['svgManager'].addElement).toHaveBeenCalled();
  });
});
