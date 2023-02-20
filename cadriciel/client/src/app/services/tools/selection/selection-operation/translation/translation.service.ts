import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { TranslationControlPoints } from 'src/app/enums/translation-control-points';
import { ICoordinates } from 'src/app/interfaces/coordinates';
import { ITransformMatrix } from 'src/app/interfaces/transform-matrix';
import { OperationHandlerService } from 'src/app/services/operation-handler/operation-handler.service';
import { TransformOperation } from 'src/app/services/operation-handler/operations/transform/transform-operation';
import { SvgManagerService } from 'src/app/services/svg-manager/svg-manager.service';
import { GridService } from '../../../grid/grid.service';
import { AbstractSelectionOperationService } from '../abstract-selection-operation.service';
import { MatrixManipulationsService } from '../matrix-manipulations/matrix-manipulations.service';
import { SelectionService } from '../selection/selection.service';

const MOUSE_MOVE = 'mousemove';
const DEFAULT_MOUSE_EVENT = new MouseEvent(MOUSE_MOVE, {clientX: 0, clientY: 0});
const IDENTITY_MATRIX = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
const DUMMY = '';

@Injectable({
  providedIn: 'root',
})
export class TranslationService implements AbstractSelectionOperationService {

  private renderer: Renderer2;
  private oldMouseEvent: MouseEvent;
  private gridSize: number;
  private isTranslating: boolean;
  private oldTransforms: string[];
  private newTransforms: string[];

  public isMagnetize: Observable<boolean>;
  private isMagnetizeBehavior: BehaviorSubject<boolean>;
  public currentControlPoints: Observable<TranslationControlPoints>;
  private controlPointsBehavior: BehaviorSubject<TranslationControlPoints>;

  constructor(
    private svgManager: SvgManagerService,
    private gridService: GridService,
    private selection: SelectionService,
    private matrixManipulations: MatrixManipulationsService,
    private operationHandler: OperationHandlerService) {
      this.renderer = svgManager.renderer;
      this.oldMouseEvent = DEFAULT_MOUSE_EVENT;
      this.isTranslating = false;
      this.oldTransforms = [];
      this.newTransforms = [];
      this.gridService.currentGridSize.subscribe((size: number) => {
        this.gridSize = size;
      });

      this.isMagnetizeBehavior = new BehaviorSubject(false);
      this.isMagnetize = this.isMagnetizeBehavior.asObservable();
      this.controlPointsBehavior = new BehaviorSubject(TranslationControlPoints.TopLeft);
      this.currentControlPoints = this.controlPointsBehavior.asObservable();
  }

  public cleanUp(): void {
    const dummyEvent = new MouseEvent(DUMMY);
    this.onMouseUp(dummyEvent);
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.selection.currentSelection.length !== 0) {
      this.isTranslating = true;
      this.oldMouseEvent = event;
      this.checkOldTransforms();
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isTranslating) {
      this.updateTranslations(event);
      this.selection.updateSelectionRect(this.selection.currentSelection);
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (this.isTranslating) {
      this.isTranslating = false;
      this.operationHandler.addOperation(new TransformOperation(
        this.selection.currentSelection,
        this.oldTransforms,
        this.newTransforms,
        this.renderer,
        this.selection));
    }
  }

  public toggleMag(): void {
    this.isMagnetizeBehavior.next(!this.isMagnetizeBehavior.getValue());
  }

  public setControlPoints(point: TranslationControlPoints): void {
    this.controlPointsBehavior.next(point);
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

  private setTranslate(element: SVGElement, matrix: ITransformMatrix): void {
    this.renderer.setAttribute(element, SVGAttributes.Transform, this.matrixManipulations.matrixToString(matrix));
  }

  private translateEachElement(translate: ICoordinates): void {
    this.newTransforms = [];
    for (const element of this.selection.currentSelection) {
      let translateMatrix: ITransformMatrix = {a: 1, b: 0, c: 0, d: 1, e: translate.x, f: translate.y};
      let oldMatrix: ITransformMatrix = IDENTITY_MATRIX;
      const transform = element.getAttribute(SVGAttributes.Transform);
      if (transform !== null) {
        oldMatrix = this.matrixManipulations.extractMatrixParam(transform);
      }
      translateMatrix = this.matrixManipulations.matrixMultiply(translateMatrix, oldMatrix);
      this.setTranslate(element, translateMatrix);
      this.newTransforms.push(this.matrixManipulations.matrixToString(translateMatrix));
    }
  }

  private calculateTanslationNeeded(translate: ICoordinates): ICoordinates {
    switch (this.controlPointsBehavior.getValue()) {
      case TranslationControlPoints.TopLeft:
        return {x: translate.x - (this.selection.currentSelectionRect.x),
                y: translate.y - (this.selection.currentSelectionRect.y)};
      case TranslationControlPoints.TopCenterRight:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width / 2),
                y: translate.y - (this.selection.currentSelectionRect.y)};
      case TranslationControlPoints.TopRight:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width),
                y: translate.y - (this.selection.currentSelectionRect.y)};
      case TranslationControlPoints.RightCenterBot:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width),
                y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height / 2)};
      case TranslationControlPoints.BotRight:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width),
          y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height)};
      case TranslationControlPoints.BotCenterLeft:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width / 2),
                y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height)};
      case TranslationControlPoints.BotLeft:
        return {x: translate.x - (this.selection.currentSelectionRect.x),
                y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height)};
      case TranslationControlPoints.LeftCenterTop:
        return {x: translate.x - (this.selection.currentSelectionRect.x),
                y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height / 2)};
      case TranslationControlPoints.Center:
        return {x: translate.x - (this.selection.currentSelectionRect.x + this.selection.currentSelectionRect.width / 2),
                y: translate.y - (this.selection.currentSelectionRect.y + this.selection.currentSelectionRect.height / 2)};
      default:
        return {x: translate.x - (this.selection.currentSelectionRect.x),
                y: translate.y - (this.selection.currentSelectionRect.y)};
    }
  }

  private updateTranslations(event: MouseEvent): void {
    if (this.oldMouseEvent.clientX !== event.clientX || this.oldMouseEvent.clientY !== event.clientY) {
      if (this.isMagnetizeBehavior.getValue()) {
        const translate = {x: Math.round((event.clientX - this.svgManager.getOffset().x) / this.gridSize) * this.gridSize,
                           y: Math.round((event.clientY - this.svgManager.getOffset().y) / this.gridSize) * this.gridSize};
        this.translateEachElement(this.calculateTanslationNeeded(translate));
      } else {
        this.translateEachElement({x: event.clientX - this.oldMouseEvent.clientX, y: event.clientY - this.oldMouseEvent.clientY});
      }
      this.oldMouseEvent = event;
    }
  }
}
