import { ShiftService } from 'src/app/services/tools/selection/selection-operation/selection/shift/shift.service';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { CopyOperation } from './copy-operation';

describe('CopyOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() { }
  }

  const pastedDrawings = new MockClass() as any as SVGElement[];
  const svgManager = new MockClass() as any as SvgManagerService;
  const shiftService = new MockClass() as any as ShiftService;
  const previousShift = new MockClass() as any as number;
  const newShift = new MockClass() as any as number;

  it('should create an instance', () => {
    expect(new CopyOperation(pastedDrawings, svgManager, shiftService, previousShift, newShift)).toBeTruthy();
  });

  it('#undo should call deleteElement', () => {
    const operation = new CopyOperation(pastedDrawings, svgManager, shiftService, previousShift, newShift);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['deleteElement']);
    const element = new MockClass() as any as SVGElement;
    operation['pastedDrawings'] = [element];
    operation.undo();
    expect(operation['svgManager'].deleteElement).toHaveBeenCalled();
  });

  it('#redo should call addElement', () => {
    const operation = new CopyOperation(pastedDrawings, svgManager, shiftService, previousShift, newShift);
    operation['svgManager'] = jasmine.createSpyObj('OperationService', ['addElement']);
    const element = new MockClass() as any as SVGElement;
    operation['pastedDrawings'] = [element];
    operation.redo();
    expect(operation['svgManager'].addElement).toHaveBeenCalled();
  });
});
