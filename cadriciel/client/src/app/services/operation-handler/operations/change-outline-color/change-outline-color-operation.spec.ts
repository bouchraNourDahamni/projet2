import { IColorChange } from 'src/app/interfaces/color-change';
import { ChangeColorService } from '../../../tools/color-applicator/change-color/change-color.service';
import { ChangeOutlineColorOperation } from './change-outline-color-operation';

describe('ChangeOutlineColorOperation', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor(public opacity: string, public color: string) {
      opacity = '';
      color = '';
    }
  }
  const opacityDummy = '';
  const colorDummy = '';
  const element = new MockClass(opacityDummy, colorDummy) as any as SVGElement;
  const colors = new MockClass(opacityDummy, colorDummy) as any as IColorChange;
  const changeColorService = new MockClass(opacityDummy, colorDummy) as any as ChangeColorService;

  it('should create an instance', () => {
    expect(new ChangeOutlineColorOperation(element, colors, changeColorService)).toBeTruthy();
  });

  it('#undo should call changeOutlineColor', () => {
    const operation = new ChangeOutlineColorOperation(element, colors, changeColorService);
    operation['changeColorService'] = jasmine.createSpyObj('ColorService', ['changeOutlineColor']);
    operation.undo();
    expect(operation['changeColorService'].changeOutlineColor).toHaveBeenCalled();
  });

  it('#redo should call changeOutlineColor', () => {
    const operation = new ChangeOutlineColorOperation(element, colors, changeColorService);
    operation['changeColorService'] = jasmine.createSpyObj('ColorService', ['changeOutlineColor']);
    operation.redo();
    expect(operation['changeColorService'].changeOutlineColor).toHaveBeenCalled();
  });
});
