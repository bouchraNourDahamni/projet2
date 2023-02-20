import { Injectable, Renderer2 } from '@angular/core';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ICoordinates } from 'src/app/interfaces/coordinates';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';

const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};
const LEFT_COORDINATES: ICoordinates = {
  x: -3,
  y: -3,
};
const RIGHT_COORDINATES: ICoordinates = {
  x: 1,
  y: 1,
};
const LINE_STYLE = 'stroke-linecap:round;stroke-linejoin:round';
const COMMA = ',';
const SPACE = ' ';
const STROKE_WIDTH = '2px';
const PLANE_ANGLE = 180;
const PERPENDICULAR_ANGLE = 90;
const START = '';
const DIVIDER = 2;

@Injectable({
  providedIn: 'root',
})
export class FeatherService {

  private lineHeight: number;
  private angle: number;
  private altKeyPressed: boolean;

  private renderer: Renderer2;

  private points: string;
  private color: string;

  private isFeatherDrawing: boolean;

  private coordinates: ICoordinates;
  private leftCoordinates: ICoordinates;
  private rightCoordinates: ICoordinates;

  private newFeatherLine: SVGElement;
  private container: SVGElement;

  private startLeftX: number;
  private startLeftY: number;
  private startRightX: number;
  private startRightY: number;
  private fillTransparency: number;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService) {
      this.renderer = svgManager.renderer;
      this.coordinates = INITIAL_COORDINATES;
      this.leftCoordinates = LEFT_COORDINATES;
      this.rightCoordinates = RIGHT_COORDINATES;
      this.isFeatherDrawing = false;
      this.altKeyPressed = false;

      this.toolAttributesService.currentAngle.subscribe((angle: number) => {
        this.angle = angle;
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
      });
      this.toolAttributesService.currentFeatherLength.subscribe((height: number) => {
        this.lineHeight = height;
      });
      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  public validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Feather) {
      this.cleanUp();
    }
  }

  public cleanUp(): void {
    this.isFeatherDrawing = false;
    this.altKeyPressed = false;
  }

  private setMouseCoordinates(event: MouseEvent): void {
    this.coordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.coordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  private setPointsLeft(): void {
    this.startLeftX = this.leftCoordinates.x;
    this.startLeftY = this.leftCoordinates.y;
  }

  private setPointsRight(): void {
    this.startRightX = this.rightCoordinates.x;
    this.startRightY = this.rightCoordinates.y;
  }

  public onMouseDown(event: MouseEvent): void {
    this.createContainer(event);
    this.createFeatherAsPolygons();
    this.setMouseCoordinates(event);
    this.findPoints(this.convertToRadian(this.angle));
    this.setPointsLeft();
    this.setPointsRight();
    this.createFeatherLine();
    this.appendPointsToFeather();
    this.appendLine(this.container);
    this.isFeatherDrawing = true;
  }

  public onMouseUp(): void {
    if (this.isFeatherDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.container, this.svgManager));
    }
    this.isFeatherDrawing = false;
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isFeatherDrawing) {
      this.setPointsLeft();
      this.setPointsRight();
      this.setMouseCoordinates(event);
      this.createFeatherAsPolygons();
      this.setFeatherAttributes();
      this.setContainerAttribute();
      this.findPoints(this.convertToRadian(this.angle));
      this.createFeatherLine();
      this.appendPointsToFeather();
      this.appendLine(this.container);
    }
  }

  public onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    // event.deltaY < 0 ==> scrolling up
    if (event.deltaY < 0) {
      this.toolAttributesService.setAngle((this.altKeyPressed) ? this.angle + 1 : this.angle + 15);
    } else {
      this.toolAttributesService.setAngle((this.altKeyPressed) ? this.angle - 1 : this.angle - 15);
    }
  }

  public onAltKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = true;
    }
  }

  public onAltKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = false;
    }
  }

  private appendPointsToFeather(): void {
    this.renderer.setAttribute(this.newFeatherLine, SVGAttributes.Points, this.points);
  }

  private createFeatherAsPolygons(): void {
    this.newFeatherLine = this.renderer.createElement(SVGAttributes.Polygon, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newFeatherLine, SVGAttributes.Fill, this.color);
    this.renderer.setAttribute(this.newFeatherLine, SVGAttributes.Stroke, this.color);
    this.svgManager.addElement(this.newFeatherLine);
  }

  private setFeatherAttributes(): void {
    this.renderer.setAttribute(this.newFeatherLine, SVGAttributes.Style, LINE_STYLE);
    this.renderer.setAttribute(this.newFeatherLine, SVGAttributes.StrokeWidth, STROKE_WIDTH );
  }

  private setContainerAttribute(): void {
    this.renderer.setAttribute(this.container, SVGAttributes.Opacity, this.fillTransparency.toString());
    this.renderer.setAttribute(this.container, SVGAttributes.Class, SVGAttributes.Feather);
  }

  private insertElement(event: MouseEvent): void {
    const parent = ((event.target as HTMLElement).parentNode as HTMLElement);
    if (parent.nodeName !== SVGAttributes.SVG) {
      this.renderer.insertBefore(event.target, this.container, (event.target as HTMLElement).lastChild);
    } else {
      this.renderer.insertBefore(parent, this.container, parent.lastChild);
    }
  }

  private createContainer(event: MouseEvent): void {
    this.container = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.insertElement(event);
    this.svgManager.addElement(this.container);
  }

  private appendLine(parent: SVGElement): void {
    this.renderer.insertBefore(parent, this.newFeatherLine, parent.lastChild);
  }

  private findPoints(angle: number): void {
    const opposite = (this.lineHeight / DIVIDER) * Math.cos(angle);
    const adjacent = (this.lineHeight / DIVIDER) * Math.sin(angle);
    if (this.angle === PERPENDICULAR_ANGLE) {
      this.updateLeftCoordinates();
      this.updateRightCoordinates();
    } else {
      this.updateCoordinatesWithAngle(opposite, adjacent);
    }
  }

  private updateLeftCoordinates(): void {
    this.leftCoordinates.x = this.coordinates.x;
    this.leftCoordinates.y = this.coordinates.y - this.lineHeight / DIVIDER;
  }

  private updateRightCoordinates(): void {
    this.rightCoordinates.x = this.coordinates.x;
    this.rightCoordinates.y = this.coordinates.y + this.lineHeight / DIVIDER;
  }

  private updateCoordinatesWithAngle(oppositeAngleLength: number, adjacentAngleLength: number): void {
    this.leftCoordinates.x = this.coordinates.x + oppositeAngleLength;
    this.leftCoordinates.y = this.coordinates.y - adjacentAngleLength;
    this.rightCoordinates.x = this.coordinates.x - oppositeAngleLength;
    this.rightCoordinates.y = this.coordinates.y + adjacentAngleLength;
  }

  private createFeatherLine(): void {
    this.points = START + this.startLeftX + COMMA + this.startLeftY +
                  SPACE + this.leftCoordinates.x + COMMA + this.leftCoordinates.y +
                  SPACE + this.rightCoordinates.x + COMMA + this.rightCoordinates.y +
                  SPACE + this.startRightX + COMMA + this.startRightY;
  }

  private convertToRadian(angle: number): number {
    return angle * (Math.PI / PLANE_ANGLE);
  }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
