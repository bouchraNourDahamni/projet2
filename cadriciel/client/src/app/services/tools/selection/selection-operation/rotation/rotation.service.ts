import { Injectable, Renderer2 } from '@angular/core';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { ICoordinates } from 'src/app/interfaces/coordinates';
import { ITransformMatrix } from 'src/app/interfaces/transform-matrix';
import { OperationHandlerService } from 'src/app/services/operation-handler/operation-handler.service';
import { TransformOperation } from 'src/app/services/operation-handler/operations/transform/transform-operation';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { MatrixManipulationsService } from '../matrix-manipulations/matrix-manipulations.service';
import { SelectionService } from '../selection/selection.service';

const SMALL_ANGLE_RADIANS = 0.0174533;
const LARGE_ANGLE_RADIANS = 0.261799;
const IDENTITY_MATRIX = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
const DECIMALS = 3;

@Injectable({
  providedIn: 'root',
})
export class RotationService {

  private angle: number;
  private renderer: Renderer2;
  private altKeyPressed: boolean;
  private isShiftPressed: boolean;
  private oldTransforms: string[];
  private newTransforms: string[];

  constructor(
    private svgManager: SvgManagerService,
    private selection: SelectionService,
    private matrixManipulations: MatrixManipulationsService,
    private operationHandler: OperationHandlerService) {
      this.isShiftPressed = false;
      this.renderer = svgManager.renderer;
      this.altKeyPressed = false;
      this.oldTransforms = [];
      this.newTransforms = [];
  }

  public onMouseWheel(event: WheelEvent): void {
    this.checkOldTransforms();
    // event.deltaY < 0 ==> scrolling up
    if (event.deltaY < 0) {
      this.angle = ((this.altKeyPressed) ? SMALL_ANGLE_RADIANS : LARGE_ANGLE_RADIANS);
    } else {
      this.angle = ((this.altKeyPressed) ? - SMALL_ANGLE_RADIANS : - LARGE_ANGLE_RADIANS);
    }
    this.updateRotations();
    this.operationHandler.addOperation(new TransformOperation(
      this.selection.currentSelection,
      this.oldTransforms,
      this.newTransforms,
      this.renderer,
      this.selection));
  }

  public onAltKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = false;
    }
  }

  public onAltKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = true;
    }
  }

  public onShiftDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.isShiftPressed = true;
    }
  }

  public onShiftUp(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.isShiftPressed = false;
    }
  }

  private checkOldTransforms(): void {
    this.oldTransforms = [];
    for (const element of this.selection.currentSelection) {
      let oldTransform = element.getAttribute(SVGAttributes.Transform) as string;
      if (!oldTransform) {
        oldTransform = this.matrixManipulations.matrixToString(IDENTITY_MATRIX);
      }
      this.oldTransforms.push(oldTransform);
    }
  }

  private setRotation(element: SVGElement, rotate: ITransformMatrix): void {
    this.renderer.setAttribute(element, SVGAttributes.Transform, this.matrixManipulations.matrixToString(rotate));
  }

  private getCenterOfSVGElement(element: SVGElement): ICoordinates {
    const topLeft: ICoordinates = {
      x: element.getBoundingClientRect().left - this.svgManager.getOffset().x,
      y: element.getBoundingClientRect().top - this.svgManager.getOffset().y,
    };
    const bottomRight: ICoordinates = {
      x: element.getBoundingClientRect().right - this.svgManager.getOffset().x,
      y: element.getBoundingClientRect().bottom - this.svgManager.getOffset().y,
    };
    return {x: topLeft.x + ((bottomRight.x - topLeft.x) / 2), y: topLeft.y + ((bottomRight.y - topLeft.y) / 2)};
  }

  private getMatrixRotate(center: ICoordinates): ITransformMatrix {
    // taken from https://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/index.htm
    const cos = Math.cos(this.angle) % (2 * Math.PI);
    const sin = Math.sin(this.angle) % (2 * Math.PI);
    return {a: Number(cos.toFixed(DECIMALS)), b: Number(sin.toFixed(DECIMALS)),
            c: Number(-sin.toFixed(DECIMALS)), d: Number(cos.toFixed(DECIMALS)),
            e: Number((center.x - cos * center.x + sin * center.y).toFixed(DECIMALS)),
            f: Number((center.y - sin * center.x - cos * center.y).toFixed(DECIMALS))};
  }

  private rotateEachElement(center?: ICoordinates): void {
    this.newTransforms = [];
    for (const element of this.selection.currentSelection) {
      let rotationMatrix: ITransformMatrix;
      if (center === undefined) {
        rotationMatrix = this.getMatrixRotate(this.getCenterOfSVGElement(element));
      } else {
        rotationMatrix = this.getMatrixRotate(center);
      }

      let oldMatrix: ITransformMatrix = IDENTITY_MATRIX;
      const transform = element.getAttribute(SVGAttributes.Transform);
      if (transform !== null) {
        oldMatrix = this.matrixManipulations.extractMatrixParam(transform);
      }
      rotationMatrix = this.matrixManipulations.matrixMultiply(rotationMatrix, oldMatrix);
      this.setRotation(element, rotationMatrix);
      this.newTransforms.push(this.matrixManipulations.matrixToString(rotationMatrix));
    }
  }

  private updateRotations(): void {
    if (this.isShiftPressed) {
      this.rotateEachElement();
    } else {
      const center = {x: this.selection.currentSelectionRect.x + (this.selection.currentSelectionRect.width / 2),
                      y: this.selection.currentSelectionRect.y + (this.selection.currentSelectionRect.height / 2)};
      this.rotateEachElement(center);
    }
    this.selection.updateSelectionRect(this.selection.currentSelection);
  }
}
