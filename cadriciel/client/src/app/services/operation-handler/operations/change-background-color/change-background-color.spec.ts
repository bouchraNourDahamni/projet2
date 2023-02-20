import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ChangeBackgroundColor } from './change-background-color';

describe('ChangeBackgroundColor', () => {

  class MockClass  {
    // tslint:disable-next-line: no-empty
    constructor() {
    }
    // tslint:disable-next-line: no-empty
    public setBackgroundColor() {}
  }
  const svgManager = new MockClass() as any as SvgManagerService;

  it('should create an instance', () => {
    expect(new ChangeBackgroundColor('blue', 'red', svgManager)).toBeTruthy();
  });

  it('#undo should change the svgManager background color to the old color', () => {
    const operation = new ChangeBackgroundColor('blue', 'red', svgManager);
    const spyUndo = spyOn<any>(operation['svgManager'], 'setBackgroundColor');
    operation.undo();
    expect(spyUndo).toHaveBeenCalledWith('blue');
  });

  it('#redo should change the svgManager background color to the new color', () => {
    const operation = new ChangeBackgroundColor('blue', 'red', svgManager);
    const spyRedo = spyOn<any>(operation['svgManager'], 'setBackgroundColor');
    operation.redo();
    expect(spyRedo).toHaveBeenCalledWith('red');
  });
});
