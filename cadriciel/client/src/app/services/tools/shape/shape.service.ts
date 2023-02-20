import { Injectable, Renderer2 } from '@angular/core';
import { RectangleServiceConstants } from 'src/app/constants/rectangle-service-constants';
import { SVGAttributes } from '../../../enums/svg-attributes';
import { ICoordinates } from '../../../interfaces/coordinates';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { AbstractToolService } from '../tool/tool.service';
import { RectangleDimensionsService } from './rectangle/rectangle-dimensions/rectangle-dimensions.service';

@Injectable({
  providedIn: 'root',
})
export class ShapeService implements AbstractToolService {

  protected renderer: Renderer2;
  protected newPerimeter: SVGElement;
  protected newShape: SVGElement;
  protected perimeterWidth: number;
  protected perimeterHeight: number;
  protected smallestDimension: string;
  protected isDrawing: boolean;
  protected isRegular: boolean; // isSquare, isCircle, etc.
  protected initialCoordinates: ICoordinates;
  protected currentCoordinates: ICoordinates;

  protected mode: string;
  protected transformer: string;
  protected lineWidth: string;

  constructor(
    protected svgManager: SvgManagerService,
    protected toolAttributesService: ToolAttributesService) {
      this.renderer = svgManager.renderer;
      this.isDrawing = false;
      this.isRegular = false;
      this.initialCoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
      this.currentCoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
      this.toolAttributesService.currentMode.subscribe((mode: string) => {
        this.mode = mode;
      });
      this.toolAttributesService.currentLineWidth.subscribe((lineWidth: number) => {
        this.lineWidth = lineWidth.toString();
      });
      this.toolAttributesService.currentLineTexture.subscribe((lineTexture: string) => {
        this.transformer = lineTexture;
      });
  }

  public createPerimeter(): void {
    this.newPerimeter = this.renderer.createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    this.updateStyleAttributes();
  }

  private updateStyleAttributes(): void {
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.FillOpacity,
      RectangleServiceConstants.PERIMETER_FILL_OPACITY); // transparent filling
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.Stroke,
      RectangleServiceConstants.PERIMETER_OUTLINE_COLOR);  // gray outline
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.StrokeDasharray,
      RectangleServiceConstants.PERIMETER_DASHARRAY); // dashed outline
  }

  public updatePerimeter(): void {
    this.perimeterWidth = RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x);
    this.perimeterHeight = RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y);
    this.updatePerimeterAttributes();
  }

  private updatePerimeterAttributes(): void {
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.X,
      RectangleDimensionsService.getMin(this.initialCoordinates.x, this.currentCoordinates.x).toString());
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.Y,
      RectangleDimensionsService.getMin(this.initialCoordinates.y, this.currentCoordinates.y).toString());
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.Width,
      RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x).toString());
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.Height,
      RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y).toString());
  }

  public createShape(shape: string): void {
    this.newShape = this.renderer.createElement(shape, SVGAttributes.SVG);
  }

  public setLineWidth(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeWidth, this.lineWidth);
  }

  public cleanUp(): void { return; }

  public updateShape(): void { return; }

  public setTexture(): void { return; }

  public setMode(): void { return; }

  public onMouseDown(event: MouseEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
