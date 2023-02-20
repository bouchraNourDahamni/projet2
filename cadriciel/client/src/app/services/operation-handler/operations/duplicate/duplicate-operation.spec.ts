import { ShiftService } from 'src/app/services/tools/selection/selection-operation/selection/shift/shift.service';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { DuplicateOperation } from './duplicate-operation';

describe('DuplicateOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() { }
  }

  const duplicatedDrawings = new MockClass() as any as SVGElement[];
  const svgManager = new MockClass() as any as SvgManagerService;
  const shiftService = new MockClass() as any as ShiftService;
  const previousShift = new MockClass() as any as number;
  const newShift = new MockClass() as any as number;

  it('should create an instance', () => {
    expect(new DuplicateOperation(duplicatedDrawings, svgManager, shiftService, previousShift, newShift)).toBeTruthy();
  });

  it('#undo should call deleteElement', () => {
    const operation = new DuplicateOperation(duplicatedDrawings, svgManager, shiftService, previousShift, newShift);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['deleteElement']);
    const element = new MockClass() as any as SVGElement;
    operation['duplicatedDrawings'] = [element];
    operation.undo();
    expect(operation['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#redo should call addElement', () => {
    const operation = new DuplicateOperation(duplicatedDrawings, svgManager, shiftService, previousShift, newShift);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['addElement']);
    const element = new MockClass() as any as SVGElement;
    operation['duplicatedDrawings'] = [element];
    operation.redo();
    expect(operation['svgManager'].addElement).toHaveBeenCalled();
  });
});
