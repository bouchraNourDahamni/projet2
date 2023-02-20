import { IColorChange } from 'src/app/interfaces/color-change';
import { ChangeColorService } from '../../../tools/color-applicator/change-color/change-color.service';
import { ChangeFillColorOperation } from './change-fill-color-operation';

describe('ChangeFillColorOperation', () => {

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
    expect(new ChangeFillColorOperation(element, colors, changeColorService)).toBeTruthy();
  });

  it('#undo should call changeColor', () => {
    const operation = new ChangeFillColorOperation(element, colors, changeColorService);
    operation['changeColorService'] = jasmine.createSpyObj('ColorService', ['changeColor']);
    operation.undo();
    expect(operation['changeColorService'].changeColor).toHaveBeenCalled();
  });

  it('#redo should call changeColor', () => {
    const operation = new ChangeFillColorOperation(element, colors, changeColorService);
    operation['changeColorService'] = jasmine.createSpyObj('ColorService', ['changeColor']);
    operation.redo();
    expect(operation['changeColorService'].changeColor).toHaveBeenCalled();
  });
});
