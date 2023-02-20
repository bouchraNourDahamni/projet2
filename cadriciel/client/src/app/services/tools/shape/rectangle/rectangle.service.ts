import { Injectable } from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { RectangleServiceConstants } from '../../../../constants/rectangle-service-constants';
import { SVGAttributes } from '../../../../enums/svg-attributes';
import { ColorService } from '../../../color/color.service';
import { OperationHandlerService } from '../../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../../tool-selector/tool-selector.service';
import { ShapeService } from '../shape.service';
import { ShapeModes } from './../../../../enums/shape-modes';
import { ShapeOutlines } from './../../../../enums/shape-outlines';
import { RectangleDimensionsService } from './rectangle-dimensions/rectangle-dimensions.service';
import { SquareService } from './square/square.service';

@Injectable({
  providedIn: 'root',
})

export class RectangleService extends ShapeService {
  public smallestDimension: string;

  private primaryColor: string;
  private secondaryColor: string;

  private fillTransparency: number;
  private outlineTransparency: number;

  constructor(
    svgManager: SvgManagerService,
    toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService) {
      super(svgManager, toolAttributesService);
      this.initialCoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
      this.currentCoordinates = RectangleServiceConstants.CURRENT_COORDINATES;
      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.primaryColor = primary;
      });
      this.colorService.currentSecondaryColor.subscribe((secondary: string) => {
        this.secondaryColor = secondary;
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
    if (newTool !== Tools.Rectangle) {
      this.cleanUp();
    }
  }

  public updateShape(): void {
    this.perimeterWidth = RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x);
    this.perimeterHeight = RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y);
    this.checkShape();
  }

  private checkShape(): void {
    if (this.isRegular) {
      this.smallestDimension = RectangleDimensionsService.getMin(Math.abs(this.initialCoordinates.x - this.currentCoordinates.x),
        Math.abs(this.initialCoordinates.y - this.currentCoordinates.y)).toString();
      this.updateSquareAttributes();
    } else {
      this.updateRectangleAttributes();
    }
  }

  private updateRectangleAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.X,
      RectangleDimensionsService.getMin(this.initialCoordinates.x, this.currentCoordinates.x).toString());
    this.renderer.setAttribute(this.newShape, SVGAttributes.Y,
          RectangleDimensionsService.getMin(this.initialCoordinates.y, this.currentCoordinates.y).toString());
    this.renderer.setAttribute(this.newShape, SVGAttributes.Width,
          RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x).toString());
    this.renderer.setAttribute(this.newShape, SVGAttributes.Height,
          RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y).toString());
  }

  private updateSquareAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.X,
      SquareService.getXPosition(this.initialCoordinates.x, this.currentCoordinates.x,
                                 this.perimeterWidth, this.perimeterHeight));
    this.renderer.setAttribute(this.newShape, SVGAttributes.Y,
          SquareService.getYPosition(this.initialCoordinates.y, this.currentCoordinates.y,
                                    this.perimeterWidth, this.perimeterHeight));
    this.renderer.setAttribute(this.newShape, SVGAttributes.Width, this.smallestDimension);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Height, this.smallestDimension);
  }

  public setTexture(): void {
    switch (this.transformer) {
      case ShapeOutlines.Default: {
        this.updateDefaultOutline();
        break;
      }
      case ShapeOutlines.Round: {
        this.updateRoundOutline();
        break;
      }
      case ShapeOutlines.Dash: {
        this.updateDashedOutline();
        break;
      }
    }
  }

  private updateDashedOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeDasharray, RectangleServiceConstants.RECTANGLE_DASH_DASHARRAY);
    this.renderer.setAttribute(this.newShape, SVGAttributes.RX, RectangleServiceConstants.RECTANGLE_DEFAULT_RX);
  }

  private updateRoundOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeDasharray, RectangleServiceConstants.RECTANGLE_DEFAULT_DASHARRAY);
    this.renderer.setAttribute(this.newShape, SVGAttributes.RX, RectangleServiceConstants.RECTANGLE_ROUND_RX);
  }

  private updateDefaultOutline(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeDasharray, RectangleServiceConstants.RECTANGLE_DEFAULT_DASHARRAY);
    this.renderer.setAttribute(this.newShape, SVGAttributes.RX, RectangleServiceConstants.RECTANGLE_DEFAULT_RX);
  }

  public setMode(): void {
    switch (this.mode) {
      case ShapeModes.Outline: {
        this.updateOutlineAttributes();
        break;
      }
      case ShapeModes.Full: {
        this.updateFillAttributes();
        break;
      }
      case ShapeModes.Both: {
        this.updateBothAttributes();
        break;
      }
    }
  }

  private updateBothAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, this.outlineTransparency.toString());
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  private updateFillAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.primaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, RectangleServiceConstants.TRANSPARENT_STROKE);
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  private updateOutlineAttributes(): void {
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.FillOpacity, RectangleServiceConstants.TRANSPARENT_FILL);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeOpacity, this.outlineTransparency.toString());
  }

  private createShapeRectangle(): void {
    this.newShape = this.renderer.createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Fill, this.primaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.Stroke, this.secondaryColor);
    this.renderer.setAttribute(this.newShape, SVGAttributes.StrokeAlignment, RectangleServiceConstants.STROKE_ALIGNMENT);
  }

  private createNewPerimeter(): void {
    this.newPerimeter = this.renderer.createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.FillOpacity,
                                                  RectangleServiceConstants.PERIMETER_FILL_OPACITY); // transparent filling
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.Stroke,
                                                  RectangleServiceConstants.PERIMETER_OUTLINE_COLOR);  // gray outline
    this.renderer.setAttribute(this.newPerimeter, SVGAttributes.StrokeDasharray,
                                                  RectangleServiceConstants.PERIMETER_DASHARRAY); // dashed outline
  }

  private updateInitialCoordinates(event: MouseEvent): void {
    this.initialCoordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.initialCoordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  private updateCurrentCoordinates(event: MouseEvent): void {
    this.currentCoordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.currentCoordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  public cleanUp(): void {
    if (this.isDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newShape, this.svgManager));
    }
    this.svgManager.deleteElement(this.newPerimeter);
    this.isDrawing = false;
    this.isRegular = false;
  }

  private updatePerimeterDimensions(): void {
    this.perimeterWidth = RectangleDimensionsService.getWidth(this.initialCoordinates.x, this.currentCoordinates.x);
    this.perimeterHeight = RectangleDimensionsService.getHeight(this.initialCoordinates.y, this.currentCoordinates.y);
  }

  public onMouseDown(event: MouseEvent): void {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.updateInitialCoordinates(event);
      this.createNewPerimeter();
      this.createShapeRectangle();
      this.setLineWidth();
      this.setTexture();
      this.setMode();
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isDrawing) {
      this.updateCurrentCoordinates(event);
      this.updatePerimeterDimensions();
      // Perimeter
      this.svgManager.addElement(this.newPerimeter);
      this.updatePerimeter();
      // Rectangle
      this.svgManager.addElement(this.newShape);
      this.isRegular = event.shiftKey;
      this.updateShape();
    }
  }

  public onMouseUp(event: MouseEvent): void {
    if (this.isDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newShape, this.svgManager));
    }
    this.svgManager.deleteElement(this.newPerimeter);
    this.isDrawing = false;
    this.isRegular = false;
  }

  public onShiftDown(event: KeyboardEvent): void {
    if (!event.repeat) {
      if (this.isDrawing) {
        this.isRegular = true;
        this.updateShape();
      }
    }
  }

  public onShiftUp(event: KeyboardEvent): void {
    if (this.isDrawing) {
      this.isRegular = false;
      this.updateShape();
    }
  }
}
