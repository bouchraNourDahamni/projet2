import { Injectable } from '@angular/core';
import { ISVGRectangle } from 'src/app/interfaces/SVGRectangle';
import { SvgManagerService } from '../../../../../svg-manager/svg-manager.service';

const SHIFT_INCREMENT = 10;

@Injectable({
  providedIn: 'root',
})
export class ShiftService {

  public pasteShift: number;
  public duplicateShift: number;
  private workspaceHeight: number;
  private workspaceWidth: number;

  constructor(private svgManager: SvgManagerService) {
    this.pasteShift = SHIFT_INCREMENT;
    this.duplicateShift = SHIFT_INCREMENT;
    this.svgManager.currentHeight.subscribe((height: number) => {
      this.workspaceHeight = height;
    });
    this.svgManager.currentWidth.subscribe((width: number) => {
      this.workspaceWidth = width;
    });
  }

  public hasSpaceToShift(referenceRectangle: ISVGRectangle, currentShift: number): boolean {
    const xPosition = referenceRectangle.x + referenceRectangle.width + currentShift;
    const yPosition = referenceRectangle.y + referenceRectangle.height + currentShift;
    return (xPosition <= this.workspaceWidth && yPosition <= this.workspaceHeight);
  }

  public incrementPasteShift(clipboardRect: ISVGRectangle): number {
    if (!this.hasSpaceToShift(clipboardRect, this.pasteShift)) {
      this.pasteShift = this.pasteShift === SHIFT_INCREMENT ? 0 : SHIFT_INCREMENT;
    }
    const shiftValue = this.pasteShift;
    this.pasteShift += SHIFT_INCREMENT;
    return shiftValue;
  }

  public incrementDuplicateShift(clipboardRect: ISVGRectangle): number {
    if (!this.hasSpaceToShift(clipboardRect, this.duplicateShift)) {
      this.duplicateShift = this.duplicateShift === SHIFT_INCREMENT ? 0 : SHIFT_INCREMENT;
    }
    const shiftValue = this.duplicateShift;
    this.duplicateShift += SHIFT_INCREMENT;
    return shiftValue;
  }
}
