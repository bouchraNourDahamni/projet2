import { Injectable } from '@angular/core';
import { RectangleServiceConstants } from 'src/app/constants/rectangle-service-constants';
import { Tools } from 'src/app/enums/tools';
import { SVGAttributes } from '../../../../enums/svg-attributes';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { ColorService } from '../../../color/color.service';
import { OperationHandlerService } from '../../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../../tool-selector/tool-selector.service';
import { RectangleDimensionsService } from '../rectangle/rectangle-dimensions/rectangle-dimensions.service';
import { ShapeService } from '../shape.service';
import { ShapeModes } from './../../../../enums/shape-modes';
import { ShapeOutlines } from './../../../../enums/shape-outlines';
import { PolygonDimensionsService } from './polygon-dimensions/polygon-dimensions.service';

@Injectable({
  providedIn: 'root',
})
export class PolygonService extends ShapeService {

  private primaryColor: string;
  private secondaryColor: string;

  private fillTransparency: number;
  private outlineTransparency: number;

  private sides: number;
  private positions: string[];

  constructor(
    svgManager: SvgManagerService,
    toolAttributesService: ToolAttributesService,
    public colorService: ColorService,
    private toolSelector: ToolSelectorService,
    private operationHandler: OperationHandlerService) {
      super(svgManager, toolAttributesService);
      this.positions = [];
      this.initialCoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
      this.currentCoordinates = RectangleServiceConstants.CURRENT_COORDINATES;
      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.primaryColor = primary;
      });
      this.colorService.currentSecondaryColor.subscribe((secondary: string) => {
        this.secondaryColor = secondary;
      });
      this.toolAttributesService.currentPolygonSides.subscribe((sides: number) => {
        this.sides = sides;
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
      });
      this.colorService.currentOutline.subscribe((outlineTransparency: number) => {
        this.outlineTransparency = outlineTransparency;
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Polygon) {
      this.cleanUp();
    }
  }

  private updateDimensions(): void {
    this.perimeterWidth = RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x);
    this.perimeterHeight = RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y);
  }

  private updatePositions(): void {
    const radius: number = PolygonDimensionsService.getSmallestRadius(this.initialCoordinates, this.currentCoordinates);
    const center: ICoordinates = PolygonDimensionsService.getCenter(this.initialCoordinates, this.currentCoordinates);
    this.positions = PolygonDimensionsService.getPositions(center, radius, this.sides);
  }

  public updateShape(): void {
    this.updateDimensions();
    this.updatePositions();
    this.renderer.setAttribute(this.newShape, SVGAttributes.Points, PolygonDimensionsService.positionsToString(this.positions));
  }

  public setMode(): void {
    switch (this.mode) {
      case ShapeModes.Outline: {
        this.updateOutline();
        break;
      }
      case ShapeModes.Full: {
        this.updateFill();
        break;
      }
      case ShapeModes.Both: {
        this.updateFillOutline();
        break;
      }
    }
  }

  private updateOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, RectangleServiceConstants.TRANSPARENT_FILL);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, this.outlineTransparency.toString());
  }

  private updateFill(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.primaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, RectangleServiceConstants.TRANSPARENT_STROKE);
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  private updateFillOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, this.outlineTransparency.toString());
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  public setTexture(): void {
    switch (this.transformer) {
      case ShapeOutlines.Default: {
        this.updateDefaultOutline();
        break;
      }
      case ShapeOutlines.Dash: {
        this.updateDashedOutline();
        break;
      }
    }
  }

  private updateDefaultOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeDasharray,
      RectangleServiceConstants.RECTANGLE_DEFAULT_DASHARRAY);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Points,
          RectangleServiceConstants.RECTANGLE_DEFAULT_RX);
  }

  private updateDashedOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeDasharray, RectangleServiceConstants.RECTANGLE_DASH_DASHARRAY);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Points, RectangleServiceConstants.RECTANGLE_DEFAULT_RX);
  }

  public setLineWidth(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeWidth, this.lineWidth);
  }

  public cleanUp(): void {
    if (this.isDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newShape, this.svgManager));
    }
    this.svgManager.deleteElement(this.newPerimeter);
    this.isDrawing = false;

  }

  public onMouseDown(event: MouseEvent): void {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.updateInitialCoordinates(event);
      this.createPerimeter();
      this.createShape(SVGAttributes.Polygon);
      this.updateShapeAttributes();
      this.setLineWidth();
      this.setTexture();
      this.setMode();
    }
  }

  private updateShapeAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Fill, this.primaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeAlignment, RectangleServiceConstants.STROKE_ALIGNMENT);
  }

  private updateInitialCoordinates(event: MouseEvent): void {
    this.initialCoordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.initialCoordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  private updateCurrentCoordinates(event: MouseEvent): void {
    this.currentCoordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.currentCoordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.updateCurrentCoordinates(event);
      this.updateDimensions();
      // Perimeter
      this.svgManager.addElement(this.newPerimeter);
      this.updatePerimeter();
      // Polygon
      this.svgManager.addElement(this.newShape);
      this.updateShape();
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (this.isDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newShape, this.svgManager));
    }
    this.svgManager.deleteElement(this.newPerimeter);
    this.isDrawing = false;
  }
}
