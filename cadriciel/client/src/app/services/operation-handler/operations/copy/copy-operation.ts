import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ShiftService } from '../../../tools/selection/selection-operation/selection/shift/shift.service';
import { AbstractOperation } from '../operation';

export class CopyOperation implements AbstractOperation {

  private pastedDrawings: SVGElement[];
  private svgManager: SvgManagerService;
  private shiftService: ShiftService;
  private previousShift: number;
  private newShift: number;

  constructor(
    pastedDrawings: SVGElement[],
    svgManager: SvgManagerService,
    shiftService: ShiftService,
    previousShift: number,
    newShift: number) {
      this.pastedDrawings = Array.from(pastedDrawings);
      this.svgManager = svgManager;
      this.shiftService = shiftService;
      this.previousShift = previousShift;
      this.newShift = newShift;
  }

  public undo() {
    for (const drawing of this.pastedDrawings) {
      this.svgManager.deleteElement(drawing);
    }
    this.shiftService.pasteShift = this.previousShift;
  }

  public redo() {
    for (const drawing of this.pastedDrawings) {
      this.svgManager.addElement(drawing);
    }
    this.shiftService.pasteShift = this.newShift;
  }
}
