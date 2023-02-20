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

const PIXEL_RADIUS = '0.5';
const PI_MULTIPLIOR = 2;
const SPRAY_PER_SECOND_MULTIPLIOR = 0.1;
const SPRAY_INTERVAL = 100;
const DIAMETER_TO_RADIUS_DIVIDOR = 2;
const INITIAL_INTERVAL = 0;

const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};

@Injectable({
  providedIn: 'root',
})

export class AerosolService implements AbstractToolService {
  private renderer: Renderer2;
  private sprayRadius: number;
  private sprayPerSecond: number;
  private lineIsDrawing: boolean;
  private randomCoordinate: ICoordinates;
  private currentCoordinate: ICoordinates;
  private color: string;
  private fillTransparency: number;
  private newContainer: SVGElement;
  private interval: number;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService) {
      this.renderer = svgManager.renderer;
      this.svgManager = svgManager;
      this.lineIsDrawing = false;
      this.randomCoordinate = INITIAL_COORDINATES;
      this.currentCoordinate = INITIAL_COORDINATES;
      this.interval = INITIAL_INTERVAL;

      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
      });

      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
      });

      this.toolAttributesService.currentSprayPerSecond.subscribe((sprayPerSecond: number) => {
        this.sprayPerSecond = sprayPerSecond;
      });

      this.toolAttributesService.currentSprayDiameter.subscribe((diameter: number) => {
        this.sprayRadius = diameter / DIAMETER_TO_RADIUS_DIVIDOR;
      });

      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });

  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Aerosol) {
      this.cleanUp();
    }
  }

  public cleanUp(): void {
    this.lineIsDrawing = false;
  }

  private getMouseCoordinate(event: MouseEvent): void {
    this.currentCoordinate = { x: event.clientX - this.svgManager.getOffset().x,
                               y: event.clientY - this.svgManager.getOffset().y };
  }

  private getRandomRadius(): number {
    return Math.random() * this.sprayRadius;
  }

  private getRandomAngle(): number {
    return Math.random() * PI_MULTIPLIOR * Math.PI;
  }

  private getRandomCoordinate(event: MouseEvent): void {
    this.getMouseCoordinate(event);
    const randomRadius = this.getRandomRadius();
    const randomAngle = this.getRandomAngle();
    this.randomCoordinate = { x: this.currentCoordinate.x + Math.cos(randomAngle) * randomRadius,
                              y: this.currentCoordinate.y + Math.sin(randomAngle) * randomRadius };
  }

  private createNewContainer(): void {
    this.newContainer = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Class, SVGAttributes.Aerosol);
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Opacity, this.fillTransparency.toString());
    this.svgManager.addElement(this.newContainer);
  }

  private createPixel(event: MouseEvent): void {
    const pixel: SVGElement = this.renderer.createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    this.renderer.setAttribute(pixel, SVGAttributes.CX, this.randomCoordinate.x.toString());
    this.renderer.setAttribute(pixel, SVGAttributes.CY, this.randomCoordinate.y.toString());
    this.renderer.setAttribute(pixel, SVGAttributes.R, PIXEL_RADIUS);
    this.renderer.setAttribute(pixel, SVGAttributes.Fill, this.color);
    this.renderer.appendChild(this.newContainer, pixel);
  }

  private createPixelsPerSpray(event: MouseEvent): void {
    for ( let i = 0; i < this.sprayPerSecond * SPRAY_PER_SECOND_MULTIPLIOR; i++ ) {
      this.getRandomCoordinate(event);
      this.createPixel(event);
    }
  }

  private createPixelsOnInterval(event: MouseEvent): void {
    this.interval = window.setInterval(() => {
      this.createPixelsPerSpray(event);
    }, SPRAY_INTERVAL);
  }

  public onMouseDown(event: MouseEvent): void {
    this.createNewContainer();
    this.createPixelsOnInterval(event);
    this.lineIsDrawing = true;
  }

  public onMouseUp(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newContainer, this.svgManager));
    }
    this.lineIsDrawing = false;
    window.clearInterval(this.interval);
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.lineIsDrawing) {
      window.clearInterval(this.interval);
      this.createPixelsPerSpray(event);
      this.createPixelsOnInterval(event);
    }
  }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

}
