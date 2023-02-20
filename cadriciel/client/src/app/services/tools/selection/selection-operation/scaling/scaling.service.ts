import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ScalingMode } from '../../../../../enums/scaling-modes';
import { SVGAttributes } from '../../../../../enums/svg-attributes';
import { ICoordinates } from '../../../../../interfaces/coordinates';
import { ISVGRectangle } from '../../../../../interfaces/SVGRectangle';
import { ITransformMatrix } from '../../../../../interfaces/transform-matrix';
import { OperationHandlerService } from '../../../../operation-handler/operation-handler.service';
import { TransformOperation } from '../../../../operation-handler/operations/transform/transform-operation';
import { SvgManagerService } from '../../../../svg-manager/svg-manager.service';
import { AbstractSelectionOperationService } from '../abstract-selection-operation.service';
import { MatrixManipulationsService } from '../matrix-manipulations/matrix-manipulations.service';
import { SelectionService } from '../selection/selection.service';

const TOP_LEFT_ID = 'topLeft';
const TOP_ID = 'top';
const TOP_RIGHT_ID = 'topRight';
const LEFT_ID = 'left';
const RIGHT_ID = 'right';
const BOTTOM_LEFT_ID = 'bottomLeft';
const BOTTOM_ID = 'bottom';
const BOTTOM_RIGHT_ID = 'bottomRight';
const IDENTITY_MATRIX: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
const DUMMY = '';

@Injectable({
  providedIn: 'root',
})
export class ScalingService implements AbstractSelectionOperationService {

  private initialCoordinates: ICoordinates;
  private scaleModeX: ScalingMode;
  private scaleModeY: ScalingMode;
  private selectionRect: ISVGRectangle;
  private selection: SVGElement[];
  private isScaling: boolean;
  private renderer: Renderer2;
  private oldCenters: ICoordinates[];

  private oldWidth: number;
  private oldHeight: number;
  private oldLeft: number;
  private oldTop: number;

  private newWidth: number;
  private newHeight: number;

  private oldTransforms: string[];
  private newTransforms: string[];
  private keepRatio: boolean;
  private lastMouseMove: MouseEvent;
  private mirrorScalingOn: boolean;

  private deltaX: number;
  private deltaY: number;
  private ratioX: number;
  private ratioY: number;

  constructor(
    private selectionService: SelectionService,
    private rendererFactory: RendererFactory2,
    private svgManager: SvgManagerService,
    private matrixManipulations: MatrixManipulationsService,
    private operationHandler: OperationHandlerService) {
      this.isScaling = false;
      this.keepRatio = false;
      this.mirrorScalingOn = false;
      this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public cleanUp(): void {
    const dummyEvent = new MouseEvent(DUMMY);
    this.onMouseUp(dummyEvent);
  }

  public onMouseDown(event: MouseEvent): void {
    this.initMouseDown(event);
    this.findOldAttributes();
    this.chooseMode(event);
  }

  public onMouseMove(event: MouseEvent): void {
    this.lastMouseMove = event;
    if (this.isScaling) {
      this.scaleAllObjects(event);
      this.selectionService.updateSelectionRect(this.selection);
    }
  }

  private chooseMode(event: MouseEvent): void {
    const el = event.target as SVGElement;
    const id = el.id;
    switch (id) {
      case TOP_LEFT_ID: {
        this.scaleModeX = ScalingMode.Inverse;
        this.scaleModeY = ScalingMode.Inverse;
        break;
      }
      case TOP_ID: {
        this.scaleModeX = ScalingMode.None;
        this.scaleModeY = ScalingMode.Inverse;
        break;
      }
      case TOP_RIGHT_ID: {
        this.scaleModeX = ScalingMode.Regular;
        this.scaleModeY = ScalingMode.Inverse;
        break;
      }
      case LEFT_ID: {
        this.scaleModeX = ScalingMode.Inverse;
        this.scaleModeY = ScalingMode.None;
        break;
      }
      case RIGHT_ID: {
        this.scaleModeX = ScalingMode.Regular;
        this.scaleModeY = ScalingMode.None;
        break;
      }
      case BOTTOM_LEFT_ID: {
        this.scaleModeX = ScalingMode.Inverse;
        this.scaleModeY = ScalingMode.Regular;
        break;
      }
      case BOTTOM_ID: {
        this.scaleModeX = ScalingMode.None;
        this.scaleModeY = ScalingMode.Regular;
        break;
      }
      case BOTTOM_RIGHT_ID: {
        this.scaleModeX = ScalingMode.Regular;
        this.scaleModeY = ScalingMode.Regular;
        break;
      }
    }
  }

  private findOldAttributes(): void {
    this.oldCenters = [];
    this.oldTransforms = [];
    for (const element of this.selection) {
      const boundingBox = element.getBoundingClientRect();
      const oldCenter: ICoordinates = {
        x: boundingBox.left - this.oldLeft + (boundingBox.width / 2),
        y: boundingBox.top - this.oldTop + (boundingBox.height / 2),
      };
      this.oldCenters.push(oldCenter);
      let oldTransform = element.getAttribute(SVGAttributes.Transform) as string;
      if (!oldTransform) {
        oldTransform = this.matrixManipulations.matrixToString(IDENTITY_MATRIX);
      }
      this.oldTransforms.push(oldTransform);
    }
  }

  private initMouseDown(event: MouseEvent): void {
    this.initialCoordinates = {
      x: event.clientX,
      y: event.clientY,
    };
    this.selectionRect = this.selectionService.currentSelectionRect;
    this.selection = this.selectionService.currentSelection;
    this.isScaling = true;

    this.oldWidth = this.selectionRect.width;
    this.oldHeight = this.selectionRect.height;
    this.oldLeft = this.selectionRect.x + this.svgManager.getOffset().x;
    this.oldTop = this.selectionRect.y + this.svgManager.getOffset().y;
  }

  private scaleAllObjects(event: MouseEvent): void {
    this.newTransforms = [];
    this.updateDeltas(event);
    this.updateRatios();
    if (this.keepRatio && this.scaleModeX !== ScalingMode.None && this.scaleModeY !== ScalingMode.None) {
      this.getNewRatios();
    }
    for (let i = 0; i < this.selection.length; i++) {
      this.scaleObject(i);
    }
  }

  private scaleObject(index: number): void {
    let fullTransformX: ITransformMatrix = IDENTITY_MATRIX;
    let fullTransformY: ITransformMatrix = IDENTITY_MATRIX;
    const oldMatrix = this.matrixManipulations.extractMatrixParam(this.oldTransforms[index]);
    if (this.scaleModeX !== ScalingMode.None) {
      fullTransformX = this.getTransformX(index, oldMatrix);
    }
    if (this.scaleModeY !== ScalingMode.None) {
      fullTransformY = this.getTransformY(index, oldMatrix);
    }

    this.applyFinalTransform(fullTransformX, fullTransformY, oldMatrix, index);
  }

  private updateDeltas(event: MouseEvent): void {
    this.deltaX = event.clientX - this.initialCoordinates.x;
    this.deltaY = event.clientY - this.initialCoordinates.y;
    if (this.mirrorScalingOn) {
      this.deltaX *= 2;
      this.deltaY *= 2;
    }
  }

  private updateRatios(): void {
    this.newWidth = this.scaleModeX === ScalingMode.Regular ? this.oldWidth + this.deltaX : this.oldWidth - this.deltaX;
    this.ratioX = (this.newWidth) / this.oldWidth;
    this.newHeight = this.scaleModeY === ScalingMode.Regular ? this.oldHeight + this.deltaY : this.oldHeight - this.deltaY;
    this.ratioY = (this.newHeight) / this.oldHeight;
  }

  private getNewRatios(): void {
    const ratio = Math.max(this.ratioX, this.ratioY);
    this.ratioX = this.ratioY = ratio;
    this.newWidth = this.oldWidth * ratio;
    this.newHeight = this.oldHeight * ratio;

    this.deltaX = this.scaleModeX === ScalingMode.Regular ? this.newWidth - this.oldWidth : this.oldWidth - this.newWidth;
    this.deltaY = this.scaleModeY === ScalingMode.Regular ? this.newHeight - this.oldHeight : this.oldHeight - this.newHeight;
  }

  private findExpectedCenterX(index: number): number {
    const oldCenter = this.oldCenters[index];
    let expectedX = oldCenter.x * this.ratioX;
    if (this.scaleModeX === ScalingMode.Inverse) {
      expectedX += this.deltaX;
    }
    return expectedX;
  }

  private findExpectedCenterY(index: number): number {
    const oldCenter = this.oldCenters[index];
    let expectedY = oldCenter.y * this.ratioY;
    if (this.scaleModeY === ScalingMode.Inverse) {
      expectedY += this.deltaY;
    }
    return expectedY;
  }

  private findCurrentCenterX(index: number, oldMatrix: ITransformMatrix, scalingMatrix: ITransformMatrix): number {
    const newMatrix = this.matrixManipulations.matrixMultiply(scalingMatrix, oldMatrix);
    this.renderer.setAttribute(this.selection[index], SVGAttributes.Transform, this.matrixManipulations.matrixToString(newMatrix));
    const boundingBox = this.selection[index].getBoundingClientRect();
    return (boundingBox.left - this.oldLeft) + (boundingBox.width / 2);
  }

  private findCurrentCenterY(index: number, oldMatrix: ITransformMatrix, scalingMatrix: ITransformMatrix): number {
    const newMatrix = this.matrixManipulations.matrixMultiply(scalingMatrix, oldMatrix);
    this.renderer.setAttribute(this.selection[index], SVGAttributes.Transform, this.matrixManipulations.matrixToString(newMatrix));
    const boundingBox = this.selection[index].getBoundingClientRect();
    return (boundingBox.top - this.oldTop) + (boundingBox.height / 2);
  }

  private getFullTransformX(expectedX: number, currentX: number, scalingMatrix: ITransformMatrix): ITransformMatrix {
    const translateX = expectedX - currentX;
    const translateMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: translateX, f: 0};
    return this.matrixManipulations.matrixMultiply(translateMatrix, scalingMatrix);
  }

  private getFullTransformY(expectedY: number, currentY: number, scalingMatrix: ITransformMatrix): ITransformMatrix {
    const translateY = expectedY - currentY;
    const translateMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: translateY};
    return this.matrixManipulations.matrixMultiply(translateMatrix, scalingMatrix);
  }

  private applyFinalTransform(
    fullTransformX: ITransformMatrix,
    fullTransformY: ITransformMatrix,
    oldMatrix: ITransformMatrix,
    index: number): void {
      const fullTransform = this.matrixManipulations.matrixMultiply(fullTransformX,
        this.matrixManipulations.matrixMultiply(fullTransformY, oldMatrix));
      const newTransform = this.matrixManipulations.matrixToString(fullTransform);
      this.renderer.setAttribute(this.selection[index], SVGAttributes.Transform, newTransform);
      this.newTransforms.push(newTransform);
  }

  private getAltMatrixX(fullTransformX: ITransformMatrix): ITransformMatrix {
    const mirrorAjustmentMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: -this.deltaX / 2, f: 0};
    return this.matrixManipulations.matrixMultiply(mirrorAjustmentMatrix, fullTransformX);
  }

  private getAltMatrixY(fullTransformY: ITransformMatrix): ITransformMatrix {
    const mirrorAjustmentMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: - this.deltaY / 2};
    return this.matrixManipulations.matrixMultiply(mirrorAjustmentMatrix, fullTransformY);
  }

  private getTransformX(index: number, oldMatrix: ITransformMatrix): ITransformMatrix {
    const expectedX = this.findExpectedCenterX(index);
    const scalingMatrix: ITransformMatrix = {a: this.ratioX, b: 0, c: 0, d: 1, e: 0, f: 0};
    const currentX = this.findCurrentCenterX(index, oldMatrix, scalingMatrix);
    let fullTransformX = this.getFullTransformX(expectedX, currentX, scalingMatrix);
    if (this.mirrorScalingOn) {
      fullTransformX = this.getAltMatrixX(fullTransformX);
    }
    return fullTransformX;
  }

  private getTransformY(index: number, oldMatrix: ITransformMatrix): ITransformMatrix {
    const expectedY = this.findExpectedCenterY(index);
    const scalingMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: this.ratioY, e: 0, f: 0};
    const currentY = this.findCurrentCenterY(index, oldMatrix, scalingMatrix);
    let fullTransformY = this.getFullTransformY(expectedY, currentY, scalingMatrix);
    if (this.mirrorScalingOn) {
      fullTransformY = this.getAltMatrixY(fullTransformY);
    }
    return fullTransformY;
  }

  public onMouseUp(event: MouseEvent): void {
    this.isScaling = false;
    this.operationHandler.addOperation(new TransformOperation(
      this.selection,
      this.oldTransforms,
      this.newTransforms,
      this.renderer,
      this.selectionService));
  }

  public onShiftDown(): void {
    this.keepRatio = true;
    if (this.isScaling) {
      this.onMouseMove(this.lastMouseMove);
    }
  }

  public onShiftUp(): void {
    this.keepRatio = false;
    if (this.isScaling) {
      this.onMouseMove(this.lastMouseMove);
    }
  }

  public onAltDown(): void {
    this.mirrorScalingOn = true;
    if (this.isScaling) {
      this.onMouseMove(this.lastMouseMove);
    }
  }

  public onAltUp(): void {
    this.mirrorScalingOn = false;
    if (this.isScaling) {
      this.onMouseMove(this.lastMouseMove);
    }
  }

}
