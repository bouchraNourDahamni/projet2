import { Injectable } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { ToolSelectorService } from '../../tool-selector/tool-selector.service';
import { AbstractToolService } from '../../tool/tool.service';
import { AbstractSelectionOperationService } from '../selection-operation/abstract-selection-operation.service';
import { RotationService } from '../selection-operation/rotation/rotation.service';
import { ScalingService } from '../selection-operation/scaling/scaling.service';
import { SelectionService } from '../selection-operation/selection/selection.service';
import { TranslationService } from '../selection-operation/translation/translation.service';

const SELECTION_RECT_CLASS = 'selectionRect';
const CONTROL_POINT_CLASS = 'controlPoint';
const LEFT_BUTTON = 0;

@Injectable({
  providedIn: 'root',
})
export class SelectionManagerService implements AbstractToolService {

  private hasMoved: boolean;

  private selectionOperationService: AbstractSelectionOperationService;

  constructor(
    private selectionService: SelectionService,
    private translationService: TranslationService,
    private scalingService: ScalingService,
    private rotationService: RotationService,
    private toolSelector: ToolSelectorService) {
      this.hasMoved = false;
      this.selectionOperationService = this.selectionService;
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
    }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Selection) {
      this.cleanUp();
    }
  }

  public onMouseDown(event: MouseEvent): void {
    this.hasMoved = false;
    this.selectionService.onMouseDown(event);
    this.selectionOperationService = this.selectionService;
    if (this.isOnControlPoint(event) && event.button === LEFT_BUTTON) {
      this.selectionOperationService = this.scalingService;
    } else if (this.isOnSelectionRect(event) && event.button === LEFT_BUTTON) {
      this.selectionOperationService = this.translationService;
    }
    this.selectionOperationService.onMouseDown(event);
  }

  public onMouseMove(event: MouseEvent): void {
    this.hasMoved = true;
    this.selectionOperationService.onMouseMove(event);
  }

  public onMouseUp(event: MouseEvent): void {
    if (!this.hasMoved && !this.isOnControlPoint(event)) {
      this.selectionOperationService = this.selectionService;
    }
    this.selectionOperationService.onMouseUp(event);
    this.hasMoved = false;
  }

  public onMouseWheel(event: WheelEvent): void {
    if (this.selectionService.currentSelection.length) {
      event.preventDefault();
      this.rotationService.onMouseWheel(event);
    }
  }

  public onAltKeyDown(event: KeyboardEvent): void {
    this.rotationService.onAltKeyDown(event);
    this.scalingService.onAltDown();
  }

  public onAltKeyUp(event: KeyboardEvent): void {
    this.rotationService.onAltKeyUp(event);
    this.scalingService.onAltUp();
  }

  public onShiftDown(event: KeyboardEvent): void {
    this.rotationService.onShiftDown(event);
    this.scalingService.onShiftDown();
  }

  public onShiftUp(event: KeyboardEvent): void {
    this.rotationService.onShiftUp(event);
    this.scalingService.onShiftUp();
  }

  private isOnControlPoint(event: MouseEvent): boolean {
    const target = event.target as SVGElement;
    return target.classList.value === CONTROL_POINT_CLASS;
  }

  private isOnSelectionRect(event: MouseEvent): boolean {
    const target = event.target as SVGElement;
    return target.classList.value === SELECTION_RECT_CLASS;
  }

  public cleanUp(): void {
    this.selectionOperationService.cleanUp();
  }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
