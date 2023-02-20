import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SVGAttributes } from '../../../../enums/svg-attributes';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { ColorService } from '../../../color/color.service';
import { OperationHandlerService } from '../../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../../enums/shape-modes';

const MOVE_TO = 'M ';
const CLOSE_PATH = 'Z ';
const DRAW_TO = 'L ';
const SEPARATOR = ',';
const BUCKET_CLASS = 'bucket';

@Injectable({
  providedIn: 'root',
})
export class ColorBucketSvgService {

  private renderer: Renderer2;
  private outlineWidth: number;
  private fillColor: string;
  private outlineColor: string;
  private fillOpacity: number;
  private outlineOpacity: number;
  private currentMode: string;

  public isProcessing: Observable<boolean>;
  private isProcessingBehavior: BehaviorSubject<boolean>;

  constructor(
    private svgManager: SvgManagerService,
    private rendererFactory: RendererFactory2,
    private toolAttributes: ToolAttributesService,
    private operationHandler: OperationHandlerService,
    private colorService: ColorService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isProcessingBehavior = new BehaviorSubject(false);
    this.isProcessing = this.isProcessingBehavior.asObservable();
    this.handleSubscribtions();
  }

  private handleSubscribtions(): void {
    this.toolAttributes.currentBucketOutlineWidth.subscribe((outlineWidth: number) => {
      this.outlineWidth = outlineWidth;
    });

    this.colorService.currentPrimaryColor.subscribe((newFill: string) => {
      this.fillColor = newFill;
    });

    this.colorService.currentSecondaryColor.subscribe((newOutline: string) => {
      this.outlineColor = newOutline;
    });

    this.colorService.currentFill.subscribe((newFillOpacity: number) => {
      this.fillOpacity = newFillOpacity;
    });

    this.colorService.currentOutline.subscribe((newOutlineOpacity: number) => {
      this.outlineOpacity = newOutlineOpacity;
    });

    this.toolAttributes.currentMode.subscribe((newMode: string) => {
      this.currentMode = newMode;
    });
  }

  public setIsProcessing(isProcessing: boolean): void {
    this.isProcessingBehavior.next(isProcessing);
  }

  private generateOutlineString(outlines: ICoordinates[][]): string {
    let outlinesString = '';
    for (const outline of outlines) {
      outlinesString += this.outlineToString(outline);
    }
    return outlinesString;
  }

  private outlineToString(outline: ICoordinates[]): string {
    let outlineString = MOVE_TO + outline[0].x + SEPARATOR + outline[0].y + ' ';
    for (const pixel of outline) {
      outlineString += DRAW_TO + pixel.x + SEPARATOR + pixel.y + ' ';
    }
    outlineString += CLOSE_PATH;
    return outlineString;
  }

  public createSurface(outlines: ICoordinates[][]): void {
    const surface = this.renderer.createElement(SVGAttributes.Path, SVGAttributes.SVG);
    const points = this.generateOutlineString(outlines);
    this.renderer.setAttribute(surface, SVGAttributes.D, points);
    this.renderer.setAttribute(surface, SVGAttributes.FillRule, SVGAttributes.EvenOdd);
    this.renderer.setAttribute(surface, SVGAttributes.Class, BUCKET_CLASS);
    this.setFill(surface);
    this.setOutline(surface);
    this.svgManager.addElement(surface);
    this.operationHandler.addOperation(new AddObjectOperation(surface, this.svgManager));
    this.setIsProcessing(false);
  }

  private setFill(surface: SVGElement): void {
    const fillOpacity = (this.currentMode === ShapeModes.Full || this.currentMode === ShapeModes.Both) ? this.fillOpacity : 0;
    this.renderer.setAttribute(surface, SVGAttributes.Fill, this.fillColor);
    this.renderer.setAttribute(surface, SVGAttributes.FillOpacity, fillOpacity.toString());
  }

  private setOutline(surface: SVGElement): void {
    const outlineOpacity = (this.currentMode === ShapeModes.Outline || this.currentMode === ShapeModes.Both) ? this.outlineOpacity : 0;
    this.renderer.setAttribute(surface, SVGAttributes.StrokeWidth, this.outlineWidth.toString());
    this.renderer.setAttribute(surface, SVGAttributes.Stroke, this.outlineColor);
    this.renderer.setAttribute(surface, SVGAttributes.StrokeOpacity, outlineOpacity.toString());
  }

}
