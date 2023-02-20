import { Injectable, Renderer2 } from '@angular/core';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { IEraserCursorAttributes } from 'src/app/interfaces/eraser-cursor';
import { IRange } from 'src/app/interfaces/range';
import { ISVGRectangle } from 'src/app/interfaces/SVGRectangle';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { DeleteOperation } from '../../operation-handler/operations/delete/delete-operation';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { AbstractToolService } from '../tool/tool.service';
import { EraserCursorService } from './eraser-cursor/eraser-cursor.service';

const DEFAULT_TEXTURE = 'none';
const RED_TEXTURE = 'eraser-filter';
const DUMMY_SVG_ELEMENT = 'dummy';

const FILTER_URL_START = 'url(#';
const FILTER_URL_END = ')';

const DIVIDE_BY_TWO = 2;

@Injectable({
  providedIn: 'root',
})
export class EraserService implements AbstractToolService {

  private renderer: Renderer2;

  private isErasing: boolean;

  private eraserSize: number;
  private eraserCursorAttributes: IEraserCursorAttributes;
  private intersectRectCursor: ISVGRectangle;

  private currentHoverDrawing: SVGElement[];

  private allDrawings: SVGElement[];
  private copyAllDrawings: SVGElement[];
  private drawingsToDelete: SVGElement[];
  private drawingsToDeleteUndoRedo: SVGElement[];
  private drawingToChangeStroke: any; // to be able to set to the DUMMY_SVG_ELEMENT

  constructor(
    private svgManager: SvgManagerService,
    private eraserCursorService: EraserCursorService,
    private toolSelector: ToolSelectorService,
    private operationHandler: OperationHandlerService) {
      this.renderer = svgManager.renderer;
      this.isErasing = false;
      this.currentHoverDrawing = [];
      this.allDrawings = [];
      this.copyAllDrawings = [];
      this.drawingsToDelete = [];
      this.drawingsToDeleteUndoRedo = [];
      this.drawingToChangeStroke = DUMMY_SVG_ELEMENT;
      this.eraserCursorService.currentSize.subscribe((size: number) => {
        this.eraserSize = size;
      });
      this.eraserCursorService.currentEraserCursorAttributes.subscribe((attributes: IEraserCursorAttributes) => {
        this.eraserCursorAttributes = attributes;
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Eraser) {
      this.cleanUp();
    }
  }

  private createEraserSquare(event: MouseEvent): void {
    const newX = event.pageX;
    const newY = event.pageY;
    const center = (this.eraserSize / DIVIDE_BY_TWO);
    this.eraserCursorAttributes.left = newX;
    this.eraserCursorAttributes.top = newY;
    this.eraserCursorAttributes.marginLeft = -center;
    this.eraserCursorAttributes.marginTop = -center;
    this.eraserCursorAttributes.width = this.eraserSize;
    this.eraserCursorAttributes.height = this.eraserSize;

    const intersectRectCursorX = event.clientX - this.svgManager.getOffset().x - center;
    const intersectRectCursorY = event.clientY - this.svgManager.getOffset().y - center;
    this.intersectRectCursor = {x: intersectRectCursorX, y: intersectRectCursorY,
                                width: this.eraserSize, height: this.eraserSize};
  }

  private isIntersecting(rangeA: IRange, rangeB: IRange): boolean {
    const min: IRange = (rangeA.start < rangeB.start ? rangeA : rangeB);
    const max: IRange = (min === rangeA ? rangeB : rangeA);
    return (min.end >= max.start);
  }

  private getCollision(drawing: SVGElement): SVGElement[] {
    const collision: SVGElement[] = [];
    const rangeXSelection: IRange = {
      start: this.intersectRectCursor.x,
      end: this.intersectRectCursor.x + this.intersectRectCursor.width,
    };
    const rangeYSelection: IRange = {
      start: this.intersectRectCursor.y,
      end: this.intersectRectCursor.y + this.intersectRectCursor.height,
    };
    const rangeXElement: IRange = {
      start: drawing.getBoundingClientRect().left - this.svgManager.getOffset().x,
      end: drawing.getBoundingClientRect().right - this.svgManager.getOffset().x,
    };
    const rangeYElement: IRange = {
      start: drawing.getBoundingClientRect().top - this.svgManager.getOffset().y,
      end:  drawing.getBoundingClientRect().bottom - this.svgManager.getOffset().y,
    };
    if (this.isIntersecting(rangeXElement, rangeXSelection) && this.isIntersecting(rangeYElement, rangeYSelection)) {
      collision.push(drawing);
    }
    return collision;
  }

  private checkIntersectionsWithEverything(): void {
    this.allDrawings = this.svgManager.getSvgElements();
    for (const drawing of this.allDrawings) {
      if (this.getCollision(drawing).length !== 0) {
        if (this.isErasing) {
          this.drawingsToDeleteUndoRedo.push(drawing);
          this.drawingsToDelete.push(drawing);
        }
        this.drawingToChangeStroke = drawing;
      }
    }
  }

  private deleteDrawings(): void {
    if (this.drawingsToDelete.length !== 0) {
      const drawing = this.drawingsToDelete.pop();
      this.svgManager.deleteElement(drawing as SVGElement);
    }
    this.drawingsToDelete = []; // reset the array
  }

  private changeStrokeColor(): void {
    if (this.drawingToChangeStroke !== DUMMY_SVG_ELEMENT && this.currentHoverDrawing.length === 0) {
      this.currentHoverDrawing.push(this.drawingToChangeStroke);
      this.renderer.setAttribute(this.currentHoverDrawing[0], SVGAttributes.Filter, FILTER_URL_START + RED_TEXTURE + FILTER_URL_END);
    } else if (this.currentHoverDrawing.length !== 0) {
      if (this.drawingToChangeStroke === DUMMY_SVG_ELEMENT) {
        this.renderer.setAttribute(this.currentHoverDrawing.pop(), SVGAttributes.Filter, DEFAULT_TEXTURE);
      } else if (this.drawingToChangeStroke !== this.currentHoverDrawing[0]) {
        this.renderer.setAttribute(this.currentHoverDrawing.pop(), SVGAttributes.Filter, DEFAULT_TEXTURE);
        this.currentHoverDrawing.push(this.drawingToChangeStroke);
        this.renderer.setAttribute(this.currentHoverDrawing[0], SVGAttributes.Filter, FILTER_URL_START + RED_TEXTURE + FILTER_URL_END);
      }
    }
  }

  private sortDrawingsToDelete(drawings: SVGElement[]): SVGElement[] {
    const sortedDrawingsToDelete: SVGElement[] = [];
    sortedDrawingsToDelete.length = drawings.length;
    let sorted = false;
    while (!sorted) {
      for (const drawing of drawings) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0 ; i < this.copyAllDrawings.length ; i++) {
          if (drawing === this.copyAllDrawings[i]) {
            sortedDrawingsToDelete[i] = drawing;
          }
        }
      }
      sorted = true;
    }
    return sortedDrawingsToDelete;
  }

  public cleanUp(): void {
    this.isErasing = false;
    if (this.currentHoverDrawing.length !== 0) {
      this.renderer.setAttribute(this.currentHoverDrawing.pop(), SVGAttributes.Filter, DEFAULT_TEXTURE);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    this.copyAllDrawings = this.svgManager.getSvgElements();
    this.isErasing = true;
    this.createEraserSquare(event);
    this.checkIntersectionsWithEverything();
    this.deleteDrawings();
  }

  public onMouseMove(event: MouseEvent): void {
    this.createEraserSquare(event);
    this.checkIntersectionsWithEverything();
    if (this.isErasing) {
      this.deleteDrawings();
    } else {
      this.changeStrokeColor();
      this.drawingToChangeStroke = DUMMY_SVG_ELEMENT; // reset
    }
  }

  public onMouseUp(): void {
    if (this.drawingsToDeleteUndoRedo.length !== 0) {
      const sortedDrawingsToDelete = this.sortDrawingsToDelete(this.drawingsToDeleteUndoRedo);
      this.operationHandler.addOperation(new DeleteOperation(sortedDrawingsToDelete, this.svgManager));
      this.drawingsToDeleteUndoRedo = []; // reset the array
    }
    this.isErasing = false;
    this.copyAllDrawings = [];
  }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
