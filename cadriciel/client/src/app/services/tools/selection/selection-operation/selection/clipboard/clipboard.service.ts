import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SVGAttributes } from '../../../../../../enums/svg-attributes';
import { ISVGRectangle } from '../../../../../../interfaces/SVGRectangle';
import { ITransformMatrix } from '../../../../../../interfaces/transform-matrix';
import { OperationHandlerService } from '../../../../../operation-handler/operation-handler.service';
import { CopyOperation } from '../../../../../operation-handler/operations/copy/copy-operation';
import { DuplicateOperation } from '../../../../../operation-handler/operations/duplicate/duplicate-operation';
import { SvgManagerService } from '../../../../../svg-manager/svg-manager.service';
import { MatrixManipulationsService } from '../../matrix-manipulations/matrix-manipulations.service';
import { ShiftService } from '../shift/shift.service';

const SHIFT_INCREMENT = 10;

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {

  public clipboardRect: ISVGRectangle;
  public selectionRect: ISVGRectangle;
  public clipboardIsEmpty: Observable<boolean>;
  public selectionIsEmpty: Observable<boolean>;
  private clipboard: SVGElement[];
  private selection: SVGElement[];
  private renderer: Renderer2;

  private clipboardIsEmptyBehavior: BehaviorSubject<boolean>;
  private selectionIsEmptyBehavior: BehaviorSubject<boolean>;

  constructor(
    private rendererFactory: RendererFactory2,
    private svgManager: SvgManagerService,
    private operationHandler: OperationHandlerService,
    private shiftService: ShiftService,
    private matrixManipulations: MatrixManipulationsService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.clipboardIsEmptyBehavior = new BehaviorSubject(true);
    this.selectionIsEmptyBehavior = new BehaviorSubject(true);
    this.clipboardIsEmpty = this.clipboardIsEmptyBehavior.asObservable();
    this.selectionIsEmpty = this.selectionIsEmptyBehavior.asObservable();
  }

  public setClipboard(elements: SVGElement[]): void {
    this.clipboard = Array.from(elements);
    this.shiftService.pasteShift = SHIFT_INCREMENT;
    this.clipboardIsEmptyBehavior.next(false);
  }

  public setSelection(selection: SVGElement[]): void {
    this.selection = selection;
    this.shiftService.duplicateShift = SHIFT_INCREMENT;
    this.selectionIsEmptyBehavior.next(!selection.length);
  }

  public paste(): void {
    if (this.clipboard.length) {
      const oldShift = this.shiftService.pasteShift;
      const newElements = this.cloneAndShift(this.clipboard, this.shiftService.incrementPasteShift(this.clipboardRect));
      const newShift = this.shiftService.pasteShift;
      this.operationHandler.addOperation(new CopyOperation(newElements, this.svgManager, this.shiftService, oldShift, newShift));
    }
  }

  public duplicate(): void {
    if (this.selection.length) {
      const oldShift = this.shiftService.duplicateShift;
      const newElements = this.cloneAndShift(this.selection, this.shiftService.incrementDuplicateShift(this.selectionRect));
      const newShift = this.shiftService.duplicateShift;
      this.operationHandler.addOperation(new DuplicateOperation(newElements, this.svgManager, this.shiftService, oldShift, newShift));
    }
  }

  private cloneAndShift(elements: SVGElement[], shift: number): SVGElement[] {
    const newElements: SVGElement[] = [];
    for (const drawingElement of elements) {
      const newElement = drawingElement.cloneNode(true) as SVGElement;
      const currentTransform = newElement.getAttribute(SVGAttributes.Transform);
      let oldMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
      if (currentTransform) {
        oldMatrix = this.matrixManipulations.extractMatrixParam(currentTransform);
      }
      const shiftMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: shift, f: shift};
      const newMatrix = this.matrixManipulations.matrixMultiply(shiftMatrix, oldMatrix);

      this.renderer.setAttribute(newElement, SVGAttributes.Transform, this.matrixManipulations.matrixToString(newMatrix));
      this.svgManager.addElement(newElement);
      newElements.push(newElement);
    }
    return newElements;
  }
}
