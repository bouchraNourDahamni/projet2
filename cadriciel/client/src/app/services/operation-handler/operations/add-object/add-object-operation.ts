import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { AbstractOperation } from '../operation';

export class AddObjectOperation implements AbstractOperation {

  private drawingObject: SVGElement;
  private svgManager: SvgManagerService;

  constructor(object: SVGElement, svgManager: SvgManagerService) {
    this.drawingObject = object;
    this.svgManager = svgManager;
  }

  public undo() {
    this.svgManager.deleteElement(this.drawingObject);
  }

  public redo() {
    this.svgManager.addElement(this.drawingObject);
  }
}
