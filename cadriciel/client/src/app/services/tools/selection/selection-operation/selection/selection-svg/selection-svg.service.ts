import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { RectangleServiceConstants } from '../../../../../../constants/rectangle-service-constants';
import { SVGAttributes } from '../../../../../../enums/svg-attributes';
import { ICoordinates } from '../../../../../../interfaces/coordinates';
import { ISVGRectangle } from '../../../../../../interfaces/SVGRectangle';
import { SvgManagerService } from '../../../../../svg-manager/svg-manager.service';
import { RectangleDimensionsService } from '../../../../../tools/shape/rectangle/rectangle-dimensions/rectangle-dimensions.service';

const TOP_LEFT_ID = 'topLeft';
const TOP_ID = 'top';
const TOP_RIGHT_ID = 'topRight';
const LEFT_ID = 'left';
const RIGHT_ID = 'right';
const BOTTOM_LEFT_ID = 'bottomLeft';
const BOTTOM_ID = 'bottom';
const BOTTOM_RIGHT_ID = 'bottomRight';

const SELECTION_DASHARRAY = '5,5';
const SELECTION_OPACITY = '0';
const SELECTION_COLOR = 'DodgerBlue';
const CONTROL_POINT_COLOR = 'DodgerBlue';
const SELECTION_WIDTH = '2';
const CONTROL_POINT_RADIUS = '4.5';
const MID_DIVIDER = 2;
const SELECTION_RECT_CLASS = 'selectionRect';
const CONTROL_POINT_CLASS = 'controlPoint';

const DEFAULT_CURSOR = 'auto';
const MOVE_CURSOR = 'move';

const NWSE_CURSOR = 'nwse-resize';
const NESW_CURSOR = 'nesw-resize';
const NS_CURSOR = 'ns-resize';
const EW_CURSOR = 'ew-resize';

@Injectable({
  providedIn: 'root',
})
export class SelectionSvgService {

  private renderer: Renderer2;
  private perimeter: SVGElement;
  private initialCoordinates: ICoordinates;
  private selectionContainer: SVGElement;

  constructor(
    private rendererFactory: RendererFactory2,
    private svgManager: SvgManagerService) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public createPerimeter(initialCoordinates: ICoordinates): void {
    this.initialCoordinates = initialCoordinates;
    this.perimeter = this.renderer.createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    this.renderer.setAttribute(this.perimeter, SVGAttributes.FillOpacity,
                                                  RectangleServiceConstants.PERIMETER_FILL_OPACITY); // transparent filling
    this.renderer.setAttribute(this.perimeter, SVGAttributes.Stroke,
                                                  RectangleServiceConstants.PERIMETER_OUTLINE_COLOR);  // gray outline
    this.renderer.setAttribute(this.perimeter, SVGAttributes.StrokeDasharray,
                                                  RectangleServiceConstants.PERIMETER_DASHARRAY); // dashed outline
    this.svgManager.addElement(this.perimeter);
  }

  public updatePerimeter(newCoordinates: ICoordinates): void {
    this.renderer.setAttribute(this.perimeter, SVGAttributes.X,
                                RectangleDimensionsService.getMin(this.initialCoordinates.x, newCoordinates.x).toString());
    this.renderer.setAttribute(this.perimeter, SVGAttributes.Y,
                                RectangleDimensionsService.getMin(this.initialCoordinates.y, newCoordinates.y).toString());
    this.renderer.setAttribute(this.perimeter, SVGAttributes.Width,
                                RectangleDimensionsService.getWidth(this.initialCoordinates.x, newCoordinates.x).toString());
    this.renderer.setAttribute(this.perimeter, SVGAttributes.Height,
                                RectangleDimensionsService.getHeight(this.initialCoordinates.y, newCoordinates.y).toString());
  }

  public removePerimeter(): void {
    this.svgManager.deleteElement(this.perimeter);
  }

  public createSelectionRectangle(rectangle: ISVGRectangle): void {
    if (this.selectionContainer) {
      this.svgManager.deleteSelectionRect();
    }
    this.selectionContainer = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    const selectionRectangle = this.renderer.createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.X, rectangle.x.toString());
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Y, rectangle.y.toString());
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Width, rectangle.width.toString());
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Height, rectangle.height.toString());
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.StrokeWidth, SELECTION_WIDTH);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Stroke, SELECTION_COLOR);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.StrokeDasharray, SELECTION_DASHARRAY);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.FillOpacity, SELECTION_OPACITY);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Class, SELECTION_RECT_CLASS);
    this.renderer.setAttribute(selectionRectangle, SVGAttributes.Cursor, MOVE_CURSOR);
    this.renderer.appendChild(this.selectionContainer, selectionRectangle);

    this.createControlPoints(rectangle);
    this.svgManager.addSelectionRect(this.selectionContainer);
  }

  public createPoint(x: number, y: number, id: string): SVGCircleElement {
    const controlPoint: SVGCircleElement = this.renderer.createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    this.renderer.setAttribute(controlPoint, SVGAttributes.CX, x.toString());
    this.renderer.setAttribute(controlPoint, SVGAttributes.CY, y.toString());
    this.renderer.setAttribute(controlPoint, SVGAttributes.R, CONTROL_POINT_RADIUS);
    this.renderer.setAttribute(controlPoint, SVGAttributes.Class, CONTROL_POINT_CLASS);
    this.renderer.setAttribute(controlPoint, SVGAttributes.Id, id);
    this.setControlPointCursor(controlPoint, id);
    return controlPoint;
  }

  private setControlPointCursor(controlPoint: SVGCircleElement, id: string): void {
    let cursor: string = DEFAULT_CURSOR;
    switch (id) {
      case TOP_LEFT_ID:
      case BOTTOM_RIGHT_ID:
        cursor = NWSE_CURSOR;
        break;
      case TOP_RIGHT_ID:
      case BOTTOM_LEFT_ID:
        cursor = NESW_CURSOR;
        break;

      case BOTTOM_ID:
      case TOP_ID:
        cursor = NS_CURSOR;
        break;
      case LEFT_ID:
      case RIGHT_ID:
        cursor = EW_CURSOR;
        break;
    }
    this.renderer.setAttribute(controlPoint, SVGAttributes.Cursor, cursor);
  }

  public createControlPoints(rectangle: ISVGRectangle): void {
    const controlPoints = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.renderer.setAttribute(controlPoints, SVGAttributes.Stroke, CONTROL_POINT_COLOR);
    this.renderer.appendChild(this.selectionContainer, controlPoints);

    this.renderer.appendChild(controlPoints, this.createPoint(rectangle.x, rectangle.y, TOP_LEFT_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(rectangle.x + rectangle.width / MID_DIVIDER, rectangle.y, TOP_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(rectangle.x + rectangle.width, rectangle.y, TOP_RIGHT_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(rectangle.x, rectangle.y + rectangle.height / MID_DIVIDER, LEFT_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(
      rectangle.x + rectangle.width,
      rectangle.y + rectangle.height / MID_DIVIDER,
      RIGHT_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(rectangle.x, rectangle.y + rectangle.height, BOTTOM_LEFT_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(
      rectangle.x + rectangle.width / MID_DIVIDER,
      rectangle.y + rectangle.height,
      BOTTOM_ID));
    this.renderer.appendChild(controlPoints, this.createPoint(
      rectangle.x + rectangle.width,
      rectangle.y + rectangle.height,
      BOTTOM_RIGHT_ID));
  }
}
