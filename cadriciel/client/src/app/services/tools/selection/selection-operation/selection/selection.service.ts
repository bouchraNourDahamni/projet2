import { Injectable } from '@angular/core';
import { RectangleServiceConstants } from '../../../../../constants/rectangle-service-constants';
import { Tools } from '../../../../../enums/tools';
import { ICoordinates } from '../../../../../interfaces/coordinates';
import { IRange } from '../../../../../interfaces/range';
import { ISVGRectangle } from '../../../../../interfaces/SVGRectangle';
import { OperationHandlerService } from '../../../../operation-handler/operation-handler.service';
import { DeleteOperation } from '../../../../operation-handler/operations/delete/delete-operation';
import { SvgManagerService } from '../../../../svg-manager/svg-manager.service';
import { ToolSelectorService } from '../../../tool-selector/tool-selector.service';
import { AbstractSelectionOperationService } from '../abstract-selection-operation.service';
import { ClipboardService } from './clipboard/clipboard.service';
import { SelectionSvgService } from './selection-svg/selection-svg.service';

const LEFT_CLICK = 0;
const RIGHT_CLICK = 2;
const LEFT_MOVE = 1;

@Injectable({
  providedIn: 'root',
})
export class SelectionService implements AbstractSelectionOperationService {

  public currentSelection: SVGElement[];
  public currentSelectionRect: ISVGRectangle;
  private isSelecting: boolean;
  private initialCoordinates: ICoordinates;
  private currentCoordinates: ICoordinates;
  private allDrawings: SVGElement[];
  private tempSelection: SVGElement[];
  private workspaceOffset: ICoordinates;
  private hasMoved: boolean;

  constructor(
    private svgManager: SvgManagerService,
    private toolSelector: ToolSelectorService,
    private selectionSvg: SelectionSvgService,
    private clipboardService: ClipboardService,
    private operationHandler: OperationHandlerService) {
      this.isSelecting = false;
      this.initialCoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
      this.currentCoordinates = RectangleServiceConstants.CURRENT_COORDINATES;
      this.currentSelection = [];
      this.tempSelection = [];
      this.hasMoved = false;
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.handleToolChange(newTool);
      });
  }

  public cleanUp(): void {
    this.isSelecting = false;
    this.clearSelection();
  }

  public onMouseDown(event: MouseEvent): void {
    if (!this.isSelecting) {
      this.initializeMouseDown(event);
    }
  }

  public onMouseUp(event: MouseEvent): void {
    this.selectionSvg.removePerimeter();
    this.isSelecting = false;
    if (!this.hasMoved) {
      this.setCoordinates(event);
      const collisions: SVGElement[] = this.getCollisions();
      const topElement: SVGElement[] = [];
      if (collisions.length) {
        topElement.push(collisions[collisions.length - 1]);
      }
      if (event.button === LEFT_CLICK) {
        this.updateSelectionRect(topElement);
      } else if (event.button === RIGHT_CLICK) {
        this.invertSelection(topElement);
      }
    }
    this.hasMoved = false;
    if (event.button === RIGHT_CLICK) {
      this.setCurrentSelection(Array.from(this.tempSelection), this.findSelectionRect(this.tempSelection));
    }
  }

  public onMouseMove(event: MouseEvent): void {
    this.hasMoved = true;
    if (this.isSelecting) {
      this.currentCoordinates.x = event.clientX - this.workspaceOffset.x;
      this.currentCoordinates.y = event.clientY - this.workspaceOffset.y;
      const collisions: SVGElement[] = this.getCollisions();
      if (event.buttons === LEFT_MOVE) {
        this.updateSelectionRect(collisions);
      } else if (event.buttons === RIGHT_CLICK) {
        this.invertSelection(collisions);
      }
      this.selectionSvg.updatePerimeter(this.currentCoordinates);
    }
  }

  private handleToolChange(newTool: Tools): void {
    if (newTool !== Tools.Selection) {
      this.clearSelection();
      this.selectionSvg.removePerimeter();
      this.isSelecting = false;
    }
  }

  private setCoordinates(event: MouseEvent): void {
    this.workspaceOffset = this.svgManager.getOffset();
    this.initialCoordinates.x = event.clientX - this.workspaceOffset.x;
    this.initialCoordinates.y = event.clientY - this.workspaceOffset.y;
    this.currentCoordinates.x = event.clientX - this.workspaceOffset.x;
    this.currentCoordinates.y = event.clientY - this.workspaceOffset.y;
  }

  private initializeMouseDown(event: MouseEvent): void {
    this.hasMoved = false;
    this.isSelecting = true;
    this.workspaceOffset = this.svgManager.getOffset();
    this.initialCoordinates.x = event.clientX - this.workspaceOffset.x;
    this.initialCoordinates.y = event.clientY - this.workspaceOffset.y;
    this.allDrawings = this.svgManager.getSvgElements();

    this.currentCoordinates.x = event.clientX - this.workspaceOffset.x;
    this.currentCoordinates.y = event.clientY - this.workspaceOffset.y;
    this.selectionSvg.createPerimeter(this.initialCoordinates);
  }

  public updateSelectionRect(collisions: SVGElement[]): void {
    if (collisions.length > 0) {
      this.setCurrentSelection(collisions, this.findSelectionRect(collisions));
      this.selectionSvg.createSelectionRectangle(this.currentSelectionRect);
    } else {
      this.clearSelection();
    }
  }

  private invertSelection(collisions: SVGElement[]): void {
    this.tempSelection = Array.from(this.currentSelection);
    if (collisions.length) {
      for (const collision of collisions) {
        const index = this.tempSelection.indexOf(collision);
        (index > -1) ? this.tempSelection.splice(index, 1) : this.tempSelection.push(collision);
      }
    }
    if (this.tempSelection.length) {
      this.currentSelectionRect = this.findSelectionRect(this.tempSelection);
      this.selectionSvg.createSelectionRectangle(this.currentSelectionRect);
    } else {
      this.clearSelection();
    }
  }

  private findSelectionRect(selection: SVGElement[]): ISVGRectangle {
    if (!selection.length) {
      return this.generateNullRect();
    }
    const topLeft: ICoordinates = {
      x: selection[0].getBoundingClientRect().left - this.workspaceOffset.x,
      y: selection[0].getBoundingClientRect().top - this.workspaceOffset.y,
    };
    const bottomRight: ICoordinates = {
      x: selection[0].getBoundingClientRect().right - this.workspaceOffset.x,
      y: selection[0].getBoundingClientRect().bottom - this.workspaceOffset.y,
    };

    for (let i = 1; i < selection.length; i++) {
      const topLeftElement: ICoordinates = {
        x: selection[i].getBoundingClientRect().left - this.workspaceOffset.x,
        y: selection[i].getBoundingClientRect().top - this.workspaceOffset.y,
      };
      const bottomRightElement: ICoordinates = {
        x: selection[i].getBoundingClientRect().right - this.workspaceOffset.x,
        y: selection[i].getBoundingClientRect().bottom - this.workspaceOffset.y,
      };
      if (topLeftElement.x < topLeft.x) {
        topLeft.x = topLeftElement.x;
      }
      if (topLeftElement.y < topLeft.y) {
        topLeft.y = topLeftElement.y;
      }
      if (bottomRightElement.x > bottomRight.x) {
        bottomRight.x = bottomRightElement.x;
      }
      if (bottomRightElement.y > bottomRight.y) {
        bottomRight.y = bottomRightElement.y;
      }
    }
    const selectionRect: ISVGRectangle = {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
    return selectionRect;
  }

  private getCollisions(): SVGElement[] {
    const collisions: SVGElement[] = [];
    const rangeXSelection: IRange = {
      start: Math.min(this.initialCoordinates.x, this.currentCoordinates.x),
      end: Math.max(this.initialCoordinates.x, this.currentCoordinates.x),
    };
    const rangeYSelection: IRange = {
      start: Math.min(this.initialCoordinates.y, this.currentCoordinates.y),
      end: Math.max(this.initialCoordinates.y, this.currentCoordinates.y),
    };

    for (const drawing of this.allDrawings) {
      const rangeXElement: IRange = {
        start: drawing.getBoundingClientRect().left - this.workspaceOffset.x,
        end: drawing.getBoundingClientRect().right - this.workspaceOffset.x,
      };
      const rangeYElement: IRange = {
        start: drawing.getBoundingClientRect().top - this.workspaceOffset.y,
        end:  drawing.getBoundingClientRect().bottom - this.workspaceOffset.y,
      };
      if (this.isIntersecting(rangeXElement, rangeXSelection) && this.isIntersecting(rangeYElement, rangeYSelection)) {
        collisions.push(drawing);
      }
    }
    return collisions;
  }

  public isIntersecting(rangeA: IRange, rangeB: IRange): boolean {
    const min: IRange = (rangeA.start < rangeB.start ? rangeA : rangeB);
    const max: IRange = (min === rangeA ? rangeB : rangeA);
    return (min.end >= max.start);
  }

  private generateNullRect(): ISVGRectangle {
    const nullRect: ISVGRectangle = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    return nullRect;
  }

  private setCurrentSelection(selection: SVGElement[], selectionRect: ISVGRectangle): void {
    this.currentSelection = selection;
    this.currentSelectionRect = selectionRect;
    this.clipboardService.selectionRect = this.currentSelectionRect;
    this.clipboardService.setSelection(this.currentSelection);
  }

  public clearSelection(): void {
    this.svgManager.deleteSelectionRect();
    this.currentSelection = [];
    this.clipboardService.setSelection([]);
  }

  public cut(): void {
    if (this.currentSelection.length) {
      this.clipboardService.setClipboard(this.currentSelection);
      this.clipboardService.clipboardRect = this.currentSelectionRect;
      this.deleteSelection();
    }
  }

  public copy(): void {
    if (this.currentSelection.length) {
      this.clipboardService.setClipboard(this.currentSelection);
      this.clipboardService.clipboardRect = this.currentSelectionRect;
    }
  }

  public paste(): void {
    this.clipboardService.paste();
    this.clearSelection();
  }

  public duplicate(): void {
    if (this.currentSelection.length) {
      this.clipboardService.duplicate();
    }
  }

  public deleteSelection(): void {
    if (this.currentSelection.length) {
      for (const drawingElement of this.currentSelection) {
        this.svgManager.deleteElement(drawingElement);
      }
      this.operationHandler.addOperation(new DeleteOperation(this.currentSelection, this.svgManager));
      this.clearSelection();
    }
  }

  public selectAll(): void {
    this.workspaceOffset = this.svgManager.getOffset();
    this.currentSelection = Array.from(this.svgManager.getSvgElements());
    this.updateSelectionRect(this.currentSelection);
  }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
