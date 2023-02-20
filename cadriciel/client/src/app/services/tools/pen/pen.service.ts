import { Injectable, Renderer2 } from '@angular/core';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ICoordinates } from '../../../interfaces/coordinates';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { AbstractToolService } from '../tool/tool.service';

const SPEED_MIN = 100;
const SPEED_MULTIPLIOR = 100;
const SPEED_MAX = 5000;
const POWER_TWO_CONSTANT = 2;
const LINE_STYLE = 'fill:none;stroke-linecap:round;stroke-linejoin:round';

const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};

@Injectable({
  providedIn: 'root',
})
export class PenService implements AbstractToolService {

  private renderer: Renderer2;
  private firstCoordinates: ICoordinates;
  private newCoordinates: ICoordinates;
  private lineIsDrawing: boolean;
  private lineWidthMin: number;
  private lineWidthMax: number;

  private newLine: SVGElement;
  private newContainer: SVGElement;
  private currentTime: number;
  private color: string;
  private fillTransparency: number;
  private speed: number;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService ) {
      this.renderer = svgManager.renderer;
      this.lineIsDrawing = false;
      this.firstCoordinates = INITIAL_COORDINATES;
      this.currentTime = Date.now();
      this.speed = 0;

      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
      });
      this.toolAttributesService.currentLineWidthMin.subscribe((lineWidth: number) => {
        this.lineWidthMin = lineWidth;
      });
      this.toolAttributesService.currentLineWidthMax.subscribe((lineWidth: number) => {
        this.lineWidthMax = lineWidth;
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Pen) {
      this.cleanUp();
    }
  }

  private createNewContainer(): void {
    this.newContainer = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Opacity, this.fillTransparency.toString());
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Class, SVGAttributes.Pen);
    this.svgManager.addElement(this.newContainer);
  }

  private checkSpeed(event: MouseEvent, now: number): void {
    const dt: number = now - this.currentTime;

    if (dt !== 0) {
      this.speed = Math.round(this.calculateMovementMouseEvent(event) / dt * SPEED_MULTIPLIOR);
    }
  }

  public getMouseCoordinate(event: MouseEvent): ICoordinates {
    return { x: event.clientX - this.svgManager.getOffset().x , y: event.clientY - this.svgManager.getOffset().y};
  }

  private calculateMovementMouseEvent(event: MouseEvent): number {
    return this.calculatePythagoreDistance(event.movementX, event.movementY);
  }

  private calculatePythagoreDistance(x: number, y: number): number {
    return Math.sqrt(Math.pow(x, POWER_TWO_CONSTANT) + Math.pow(y, POWER_TWO_CONSTANT));
  }

  private calculateSlope(): number {
    return (this.lineWidthMax - this.lineWidthMin) / (SPEED_MIN - SPEED_MAX);
  }

  private calculateB(): number {
    return this.lineWidthMin - this.calculateSlope() * SPEED_MAX;
  }

  private calculateCurrentLineWidth(event: MouseEvent): void {
    let newLineWidth = 0;
    if (this.speed <= SPEED_MIN) {
      newLineWidth = this.lineWidthMax;
    } else if (this.speed > SPEED_MIN && this.speed < SPEED_MAX) {
      newLineWidth = this.calculateSlope() * this.speed + this.calculateB();
    } else {
      newLineWidth = this.lineWidthMin;
    }
    this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeWidth, newLineWidth.toString());
  }

  private setAllPenAttributes(): void {
    this.renderer.setAttribute(this.newLine, SVGAttributes.Stroke, this.color);
    this.renderer.setAttribute(this.newLine, SVGAttributes.X1, this.firstCoordinates.x.toString());
    this.renderer.setAttribute(this.newLine, SVGAttributes.Y1, this.firstCoordinates.y.toString());
    this.renderer.setAttribute(this.newLine, SVGAttributes.X2, this.newCoordinates.x.toString());
    this.renderer.setAttribute(this.newLine, SVGAttributes.Y2, this.newCoordinates.y.toString());
    this.renderer.setAttribute(this.newLine, SVGAttributes.Style, LINE_STYLE);
  }

  private createSegment(): void {
    this.newLine = this.renderer.createElement(SVGAttributes.Line, SVGAttributes.SVG);
    this.renderer.appendChild(this.newContainer, this.newLine);
    this.setAllPenAttributes();
  }

  public cleanUp(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newContainer, this.svgManager));
    }
  }

  public onMouseDown(event: MouseEvent): void {
    this.firstCoordinates = this.getMouseCoordinate(event);
    this.createNewContainer();
    this.lineIsDrawing = true;
  }

  public onMouseMove(event: MouseEvent): void {
    this.currentTime = Date.now();
    if (this.lineIsDrawing) {
      this.newCoordinates = this.getMouseCoordinate(event);
      this.createSegment();
      this.checkSpeed(event, Date.now());
      this.calculateCurrentLineWidth(event);
      this.firstCoordinates = this.newCoordinates;
    }
  }

  public onMouseUp(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newContainer, this.svgManager));
    }
    this.lineIsDrawing = false;
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
