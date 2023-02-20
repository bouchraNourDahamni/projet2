import { IColorChange } from '../../../../interfaces/color-change';
import { ChangeColorService } from '../../../tools/color-applicator/change-color/change-color.service';
import { AbstractOperation } from '../operation';

export class ChangeOutlineColorOperation implements AbstractOperation {

  private target: SVGElement;
  private colors: IColorChange;
  private changeColorService: ChangeColorService;

  constructor(element: SVGElement, colors: IColorChange, changeColorService: ChangeColorService) {
    this.target = element;
    this.colors = colors;
    this.changeColorService = changeColorService;
  }

  public undo(): void {
    this.changeColorService.changeOutlineColor(this.target, this.colors.oldColor, this.colors.oldOpacity);
  }

  public redo(): void {
    this.changeColorService.changeOutlineColor(this.target, this.colors.newColor, this.colors.newOpacity);
  }
}
