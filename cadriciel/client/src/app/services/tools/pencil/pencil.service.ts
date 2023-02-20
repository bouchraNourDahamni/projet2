import { Injectable, Renderer2, RendererFactory2} from '@angular/core';
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

const DEFAULT_TEXTURE = 'none';
const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};
const LINE_STYLE = 'fill:none;stroke-linecap:round;stroke-linejoin:round';
const COMMA = ',';
const SPACE = ' ';
const FILTER_URL_START = 'url(#';
const FILTER_URL_END = ')';

@Injectable({
  providedIn: 'root',
})

export class PencilService implements AbstractToolService {

  private renderer: Renderer2;
  private newLine: SVGElement;
  private points: string;
  private lineIsDrawing: boolean;
  private linewidth: string;

  private color: string;
  private fillTransparency: number;
  private texture: string;
  private coordinates: ICoordinates;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private rendererFactory: RendererFactory2,
    private operationHandler: OperationHandlerService, ) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
      this.lineIsDrawing = false;
      this.texture = DEFAULT_TEXTURE;
      this.coordinates = INITIAL_COORDINATES;

      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
      });
      this.toolAttributesService.currentLineWidth.subscribe((linewidth: number) => {
        this.linewidth = linewidth.toString();
      });
      this.toolAttributesService.currentLineTexture.subscribe((lineTexture: string) => {
        this.texture = lineTexture;
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Pencil) {
      this.cleanUp();
    }
  }

  public cleanUp(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newLine, this.svgManager));
    }
    this.lineIsDrawing = false;
  }

  private createLine(): void {
    const container = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.newLine = this.renderer.createElement(SVGAttributes.Polyline, SVGAttributes.SVG);
    this.renderer.appendChild(container, this.newLine);
    this.svgManager.addElement(container);
  }

  private setMouseCoordinates(event: MouseEvent): void {
    //event client X : me retourne le x de l'espace client 
    //event client y : me retourne le y de l'esapce client
    //l'esapce client dans un browser
    this.coordinates.x = event.clientX - this.svgManager.getOffset().x;
    this.coordinates.y = event.clientY - this.svgManager.getOffset().y;
  }

  private setMousePosition(event: MouseEvent): void {
    this.setMouseCoordinates(event);
    this.points = this.coordinates.x + SPACE + this.coordinates.y + COMMA +
                  this.coordinates.x + SPACE + this.coordinates.y;  // coordinates twice to draw on single click
  }

  private setPencilAttributes(): void {
    this.renderer.setAttribute(this.newLine, SVGAttributes.Points, this.points);
    this.renderer.setAttribute(this.newLine, SVGAttributes.Style, LINE_STYLE);
    this.renderer.setAttribute(this.newLine, SVGAttributes.Stroke, this.color);
    this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeOpacity, this.fillTransparency.toString());
    this.renderer.setAttribute(this.newLine, SVGAttributes.StrokeWidth, this.linewidth);
  }

  public onMouseDown(event: MouseEvent): void {
    this.lineIsDrawing = true;
    this.setMousePosition(event);
    this.createLine();
    this.setPencilAttributes();
    this.setTexture(this.texture);
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.lineIsDrawing) {
      this.setMouseCoordinates(event);
      this.points += SPACE + this.coordinates.x + SPACE + this.coordinates.y;
      this.renderer.setAttribute(this.newLine, SVGAttributes.Points, this.points);
    }
  }

  public onMouseUp(): void {
    if (this.lineIsDrawing) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newLine, this.svgManager));
    }
    this.lineIsDrawing = false;
  }

  private setTexture(texture: string): void {
    if (texture === DEFAULT_TEXTURE) {
      this.renderer.setAttribute(this.newLine, SVGAttributes.Filter, DEFAULT_TEXTURE);
    } else {
      this.renderer.setAttribute(this.newLine, SVGAttributes.Filter, FILTER_URL_START + texture + FILTER_URL_END);
    }
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
