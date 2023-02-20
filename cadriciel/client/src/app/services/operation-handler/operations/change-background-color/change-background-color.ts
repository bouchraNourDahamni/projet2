import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { AbstractOperation } from '../operation';

export class ChangeBackgroundColor implements AbstractOperation {

  private oldColor: string;
  private newColor: string;
  private svgManager: SvgManagerService;

  constructor(oldColor: string, newColor: string, svgManager: SvgManagerService) {
   this.oldColor = oldColor;
   this.newColor = newColor;
   this.svgManager = svgManager;
  }

  public undo(): void {
    this.svgManager.setBackgroundColor(this.oldColor);
  }

  public redo(): void {
    this.svgManager.setBackgroundColor(this.newColor);
  }
}
