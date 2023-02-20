import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ShiftService } from '../../../tools/selection/selection-operation/selection/shift/shift.service';
import { AbstractOperation } from '../operation';

export class DuplicateOperation implements AbstractOperation {

  private duplicatedDrawings: SVGElement[];
  private svgManager: SvgManagerService;
  private shiftService: ShiftService;
  private previousShift: number;
  private newShift: number;

  constructor(
    duplicatedDrawings: SVGElement[],
    svgManager: SvgManagerService,
    shiftService: ShiftService,
    previousShift: number,
    newShift: number) {
      this.duplicatedDrawings = duplicatedDrawings;
      this.svgManager = svgManager;
      this.shiftService = shiftService;
      this.previousShift = previousShift;
      this.newShift = newShift;
  }

  public undo() {
    for (const drawing of this.duplicatedDrawings) {
      this.svgManager.deleteElement(drawing);
    }
    this.shiftService.duplicateShift = this.previousShift;
  }

  public redo() {
    for (const drawing of this.duplicatedDrawings) {
      this.svgManager.addElement(drawing);
    }
    this.shiftService.duplicateShift = this.newShift;
  }
}
