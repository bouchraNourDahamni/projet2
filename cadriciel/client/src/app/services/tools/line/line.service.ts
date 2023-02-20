import { Injectable, Renderer2} from '@angular/core';
import { RectangleServiceConstants } from 'src/app/constants/rectangle-service-constants';
import { Tools } from 'src/app/enums/tools';
import { SVGAttributes } from '../../../enums/svg-attributes';
import { ICoordinates } from '../../../interfaces/coordinates';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { AbstractToolService } from '../tool/tool.service';
import { LineModes } from './line-modes';
import { LineOutlines } from './line-outlines';
import { LinePointsService } from './line-points/line-points.service';

const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};

const MIN_LINE_POINTS_LENGTH = 2;
const MIN_VERTICES_LENGTH = 1;
const VERTICES_LINE_SUBSTRACTOR = 1;
const RESET_VERTICES_LENGTH_VALUE = 0;

const SPACE = ' ';
const LINE_WIDTH_FIRST_DASH_MULTIPLIOR = 4;
const LINE_WIDTH_SECOND_MULTIPLIOR = 1.5;
const LINE_WIDTH_DOTTED_DASH_MULTIPLIOR = 2;

const SHARP_LINEJOIN = 'miter';
const ROUND_LINEJOIN = 'round';
const LINE_FILL = 'none';
const FULL_DASHARRAY = '0';
const FULL_LINECAP = 'butt';
const DOTTED_DASHARRAY_PREFIX = '0 ';
const DOTTED_LINECAP = 'round';
const DASHED_LINECAP = 'butt';
const LINE_MITER_LIMIT = '0';
const DEFAULT_STROKE_COLOR = 'black';

@Injectable({
  providedIn: 'root',
})

export class LineService implements AbstractToolService {

  private renderer: Renderer2;
  private lineIsDrawing: boolean;
  private newContainer: SVGElement;
  private newLine: SVGElement;
  private linePoints: string[];
  private vertices: SVGElement[];
  private linewidth: string;
  private mode: string;
  private transformer: string;
  private verticesRadius: string;
  private currentCoordinates: ICoordinates;
  private isVertexMode: boolean;
  private strokeColor: string;
  private strokeOpacity: number;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService, ) {
      this.renderer = svgManager.renderer;
      this.lineIsDrawing = false;
      this.strokeColor = DEFAULT_STROKE_COLOR;

      this.currentCoordinates = INITIAL_COORDINATES;
      this.linePoints = [];
      this.vertices = [];
      this.transformer = LineOutlines.Full;
      this.mode = LineModes.Sharp;
      this.isVertexMode = false;
      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.strokeColor = primary;
        this.validateColor();
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.strokeOpacity = fillTransparency;
        this.validateOpacity();
      });
      this.toolAttributesService.currentLineWidth.subscribe((linewidth: number) => {
        this.linewidth = linewidth.toString();
        this.validateLineDrawing();
      });
      this.toolAttributesService.currentVerticesRadius.subscribe((verticesRadius: string) => {
        this.verticesRadius = verticesRadius;
        this.endLineEarly();
      });
      this.toolAttributesService.currentCornerMode.subscribe((mode: string) => {
        this.mode = mode;
        this.endLineEarly();
      });
      this.toolAttributesService.currentLineMode.subscribe((lineTexture: string) => {
        this.transformer = lineTexture;
        this.validateLineTexture();
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Line) {
      this.cleanUp();
    }
  }

  private addSegment(): void {
    LinePointsService.addCoordinates(this.linePoints, this.currentCoordinates);
    this.updateLine();
  }

  private validateLineTexture(): void {
    if (this.lineIsDrawing) {
      this.setTexture();
    }
  }

  private removeRecentSegment(): void {
    LinePointsService.removeLastCoordinates(this.linePoints);
    this.updateLine();
  }

  private removeRecentVertex(): void {
    this.renderer.removeChild(this.newContainer, this.vertices[this.vertices.length - VERTICES_LINE_SUBSTRACTOR]);
    this.vertices.pop();
  }

  private endLine(): void {
    this.addSegment();
    this.lineIsDrawing = false;
    LinePointsService.resetLinePoints(this.linePoints);
    this.resetVerticesLength();
  }

  private updateLine(): void {
    this.renderer.setAttribute(this.newLine, SVGAttributes.Points, LinePointsService.linePointsToString(this.linePoints));
  }

  private updatePreview(): void {
    LinePointsService.updateLastCoordinate(this.linePoints, this.currentCoordinates);
    this.updateLine();
  }

  private setLineWidth(): void {
    this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeWidth, this.linewidth);
  }

  private createNewContainer(): void {
    this.newContainer = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Class, SVGAttributes.Line);
    this.renderer.setAttribute(this.newContainer, SVGAttributes.Opacity, this.strokeOpacity.toString());
    this.svgManager.addElement(this.newContainer);
  }

  private createNewLine(): void {
    this.newLine = this.renderer.createElement(SVGAttributes.Polyline, SVGAttributes.SVG);
    this.renderer.appendChild(this.newContainer, this.newLine);
    this.setAllLineAttributes();
    this.setLineWidth();
    // important to have setTexture after setLineWidth, because setTexture uses the linewidth
    this.setTexture();
    this.setMode();
  }

  private setAllLineAttributes(): void {
    this.renderer.setAttribute(this.newLine, SVGAttributes.Stroke, this.strokeColor);
    this.renderer.setAttribute(this.newLine, SVGAttributes.Fill, LINE_FILL);
    this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeMiterLimit, LINE_MITER_LIMIT);
  }

  private validateLineDrawing(): void {
    if (this.lineIsDrawing) {
      this.setLineWidth();
    }
  }

  private setAllVerticesAttributes(newVertex: SVGElement): void {
    this.renderer.setAttribute(newVertex, SVGAttributes.Fill, this.strokeColor);
    this.renderer.setAttribute(newVertex, SVGAttributes.StrokeOpacity,
      RectangleServiceConstants.TRANSPARENT_STROKE + RectangleServiceConstants.TRANSPARENCY_POURCENTAGE_STRING);
    this.renderer.setAttribute(newVertex, SVGAttributes.R, this.verticesRadius);
    this.renderer.setAttribute(newVertex, SVGAttributes.CX, this.currentCoordinates.x.toString());
    this.renderer.setAttribute(newVertex, SVGAttributes.CY, this.currentCoordinates.y.toString());
  }

  private createNewVertex(): void {
    const newVertex: SVGElement = this.renderer.createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    this.setAllVerticesAttributes(newVertex);
    this.vertices.push(newVertex);
    this.renderer.appendChild(this.newContainer, newVertex);
  }

  private closeLine(): void {
    LinePointsService.closeLine(this.linePoints);
    this.updateLine();
    this.lineIsDrawing = false;
    LinePointsService.resetLinePoints(this.linePoints);
    this.resetVerticesLength();
  }

  private validateOpacity(): void {
    if (this.lineIsDrawing) {
      this.renderer.setAttribute(this.newContainer, SVGAttributes.Opacity, this.strokeOpacity.toString());
    }
  }

  private resetVerticesLength(): void {
    if (this.isVertexMode) {
      this.vertices.length = RESET_VERTICES_LENGTH_VALUE;
    }
  }

  private validateColor(): void {
    if (this.lineIsDrawing) {
      this.renderer.setAttribute(this.newLine, SVGAttributes.Stroke, this.strokeColor);
    }
  }

  private setMode(): void {
    switch (this.mode) {
      case LineModes.Sharp: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLinejoin, SHARP_LINEJOIN);
        this.isVertexMode = false;
        break;
      }
      case LineModes.Round: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLinejoin, ROUND_LINEJOIN);
        this.isVertexMode = false;
        break;
      }
      case LineModes.Vertice: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLinejoin, SHARP_LINEJOIN);
        this.isVertexMode = true;
        break;
      }
    }
  }

  private setTexture(): void {
    switch (this.transformer) {
      case LineOutlines.Full: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLineCap, FULL_LINECAP);
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeDasharray, FULL_DASHARRAY);
        break;
      }
      case LineOutlines.Dot: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLineCap, DOTTED_LINECAP);
        const dasharrayParameter: string = DOTTED_DASHARRAY_PREFIX +
                                  (Number(this.linewidth) * LINE_WIDTH_DOTTED_DASH_MULTIPLIOR).toString();
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeDasharray, dasharrayParameter);
        break;
      }
      case LineOutlines.Dash: {
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeLineCap, DASHED_LINECAP);
        const dasharrayParameter: string = (Number(this.linewidth) * LINE_WIDTH_FIRST_DASH_MULTIPLIOR).toString() +
                                  SPACE + (Number(this.linewidth) * LINE_WIDTH_SECOND_MULTIPLIOR).toString();
        this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeDasharray, dasharrayParameter);
        break;
      }
    }
  }

  private endLineEarly(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newContainer, this.svgManager));
      LinePointsService.removeLastCoordinates(this.linePoints);
      this.updateLine();
    }
    this.lineIsDrawing = false;
    LinePointsService.resetLinePoints(this.linePoints);
    this.resetVerticesLength();
  }

  public cleanUp(): void {
    this.endLineEarly();
  }

  public onMouseDown(event: MouseEvent): void {
    this.setMouseCoordinates(event);

    if (!this.lineIsDrawing) {
      this.lineIsDrawing = true;
      this.createNewContainer(),
      this.createNewLine();
      this.addSegment();
    }
    this.addSegment();
    if (this.isVertexMode) {
      this.createNewVertex();
    }
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.lineIsDrawing) {
      this.setMouseCoordinates(event);
      this.updatePreview();
    }
  }

  private setMouseCoordinates(event: MouseEvent): void {
    this.currentCoordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.currentCoordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  public onEscapeDown(event: KeyboardEvent): void {
    if (this.lineIsDrawing) {
      LinePointsService.resetLinePoints(this.linePoints);
      this.vertices.length = RESET_VERTICES_LENGTH_VALUE;
      this.svgManager.deleteElement(this.newContainer);
      this.lineIsDrawing = false;
    }
  }

  public onBackspaceDown(event: KeyboardEvent): void {
    if (this.lineIsDrawing) {
      // prevent removal of last point
      if (this.linePoints.length > MIN_LINE_POINTS_LENGTH) {
        this.removeRecentSegment();
        this.updatePreview();
      }
      if (this.isVertexMode && this.vertices.length > MIN_VERTICES_LENGTH) {
        this.removeRecentVertex();
      }
    }
  }

  public onDoubleClick(event: MouseEvent): void {
    if (this.lineIsDrawing) {
      // remove last coordinates caused by double click = 2 single clicks
      LinePointsService.removeLastCoordinates(this.linePoints);
      LinePointsService.removeLastCoordinates(this.linePoints);
      if (this.isVertexMode) {
        this.removeRecentVertex();
      }
      this.finishLine(event);
      this.operationHandler.addOperation(new AddObjectOperation(this.newContainer, this.svgManager));
    }
  }

  public finishLine(event: MouseEvent): void {
    if (event.shiftKey) {
      this.closeLine();
    } else {
      this.endLine();
    }
  }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

}
