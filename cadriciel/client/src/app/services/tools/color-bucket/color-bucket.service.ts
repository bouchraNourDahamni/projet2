import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ICoordinates } from '../../../interfaces/coordinates';
import { IRGBColor } from '../../../interfaces/RGBColor';
import { ImageService } from '../../Image/image.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ColorBucketSvgService } from './color-bucket-svg/color-bucket-svg.service';
import { SurfaceCalculationService } from './surface-calculation/surface-calculation.service';

const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};
const CANVAS_CONTEXT = '2d';
const CANVAS_ELEMENT = 'canvas';

@Injectable({
  providedIn: 'root',
})
export class ColorBucketService {

  private drawing: HTMLImageElement;

  private svgPixels: IRGBColor[][] = [];
  private renderer: Renderer2;
  public svg: SVGElement;
  private mouseCoordinates: ICoordinates;
  private canvas: HTMLCanvasElement;
  private tolerance: number;

  constructor(
    private imageService: ImageService,
    private rendererFactory: RendererFactory2,
    private toolAttributes: ToolAttributesService,
    private svgManager: SvgManagerService,
    private surfaceCalculation: SurfaceCalculationService,
    private bucketSVGService: ColorBucketSvgService) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
      this.mouseCoordinates = INITIAL_COORDINATES;

      this.toolAttributes.currentBucketTolerance.subscribe((tolerance: number) => {
        this.tolerance = tolerance;
      });
  }

  private setCanvasDimensions(canvas: HTMLCanvasElement): void {
    canvas.width = this.imageService.workspaceWidth;
    canvas.height = this.imageService.workspaceHeight;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement(CANVAS_ELEMENT);
    this.setCanvasDimensions(canvas);
    return canvas;
  }

  private updateCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return (canvas.getContext(CANVAS_CONTEXT) as CanvasRenderingContext2D);
  }

  public updateCanvasColors(event: MouseEvent): void {
    this.drawing = new Image();
    const blob: Blob = this.createFileSvg();
    const domURL = window.URL || (window as any).webkitURL || window;
    const url: string = domURL.createObjectURL(blob);
    this.drawing.src = url;
    this.loadImage(this.drawing).then(() => {
    this.onImageLoad(this.drawing, event);
    this.surfaceCalculation.createSurfaceObject(this.svgPixels, this.mouseCoordinates, this.tolerance);
    });
  }

  private createFileSvg(): Blob {
    return new Blob([this.imageService.image], { type: 'image/svg+xml' });
  }

  private onImageLoad(image: HTMLImageElement, event: MouseEvent): void {
    this.canvas = this.createCanvas();
    const ctx: CanvasRenderingContext2D = this.updateCanvasContext(this.canvas);
    ctx.drawImage(image, 0, 0);
    const canvasData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < canvasData.width; i++) {
      this.svgPixels[i] = [];
    }
    let x = 0;
    let y = 0;
    for (let i = 0; i < canvasData.data.length; i++) {
      const pixel: IRGBColor = {red: canvasData.data[i], green: canvasData.data[++i], blue: canvasData.data[++i] };
      i++;
      this.svgPixels[x][y] = pixel;
      if (++x >= canvasData.width) {
        y++;
        x = 0;
      }
    }
  }

  private async loadImage(image: HTMLImageElement): Promise <HTMLImageElement> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve) => {
      image.onload = () => resolve();
    });
  }

  public onMouseDown(event: MouseEvent): void {
    this.bucketSVGService.setIsProcessing(true);
    this.mouseCoordinates.x = Math.round(event.clientX - this.svgManager.getOffset().x);
    this.mouseCoordinates.y = Math.round(event.clientY - this.svgManager.getOffset().y);
    this.updateCanvasColors(event);
  }

  public cleanUp(): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

  public onMouseWheel(event: MouseEvent): void { return; }

  public onAltKey(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

}
