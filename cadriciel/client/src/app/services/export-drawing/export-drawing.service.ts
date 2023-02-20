import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { FileExtensions } from 'src/app/enums/file-extensions';
import { ImageService } from '../Image/image.service';
import { CanvasToBMP } from './canvas-to-bmp';
import { IFileInfo } from './fileInfo';

const CANVAS = 'canvas';
const TWO_DIMENSION = '2d';
const IMAGE_XML = 'image/svg+xml';
const A_ELEMENT = 'a';
const IMAGE = 'image';
const DOT = '.';
const SLASH = '/';

@Injectable({
  providedIn: 'root',
})
export class ExportDrawingService {

  public renderer: Renderer2;

  constructor(
    private imageService: ImageService,
    private rendererFactory: RendererFactory2) {
      this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  private setCanvasDimensions(canvas: HTMLCanvasElement): void {
    canvas.width = this.imageService.workspaceWidth;
    canvas.height = this.imageService.workspaceHeight;
  }

  public canvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = this.renderer.createElement(CANVAS);
    this.setCanvasDimensions(canvas);
    return canvas;
  }

  private canvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return (canvas.getContext(TWO_DIMENSION) as CanvasRenderingContext2D);
  }

  private triggerDownload(imageURI: string, fileName: string, format: FileExtensions): void {
    const anchorElement = this.renderer.createElement(A_ELEMENT);
    anchorElement.href = imageURI;
    anchorElement.download = fileName + format;
    anchorElement.click();
  }

  private createFileSvg(): Blob {
    return new Blob([this.imageService.image], { type: IMAGE_XML });
  }

  private imageType(format: FileExtensions): string {
    return IMAGE + format.replace(DOT, SLASH); // image/svg - image/png - image/jpeg - image/bmp
  }

  private bmpURI(domURL: any, canvas: HTMLCanvasElement ): string {
    const canvasToBmp: CanvasToBMP = new CanvasToBMP();
    return domURL.createObjectURL(canvasToBmp.toBlob(canvas));
  }
  // domURL de type any parcequ'on a pas le choix pour accomoder les différents browsers
  private onImageLoad(newImage: HTMLImageElement, domURL: any, url: string, fileInfo: IFileInfo): void {
    const canvas: HTMLCanvasElement = this.canvas();
    const ctx: CanvasRenderingContext2D = this.canvasContext(canvas);
    ctx.drawImage(newImage, 0, 0);
    domURL.revokeObjectURL(url);
    const imageURI: string = (fileInfo.fileExtension === FileExtensions.JPEG || fileInfo.fileExtension === FileExtensions.PNG) ?
                                canvas.toDataURL(this.imageType(fileInfo.fileExtension), 1.0) : this.bmpURI(domURL, canvas);
    this.triggerDownload(imageURI, fileInfo.fileName, fileInfo.fileExtension);
    domURL.revokeObjectURL(imageURI);
  }

  private async loadImage(image: HTMLImageElement): Promise <HTMLImageElement> {
    // tslint:disable-next-line: no-shadowed-variable
    return new Promise((resolve) => {
      image.onload = () => resolve();
    });
  }
  public async exportImage(imageName: string, format: FileExtensions): Promise<void> {
    const blob: Blob = this.createFileSvg();
    const domURL = window.URL || (window as any).webkitURL || window;
    const url: string = domURL.createObjectURL(blob);

    switch (format) {
      case FileExtensions.SVG:
        this.triggerDownload(url, imageName, format);
        break;
      case FileExtensions.PNG:
      case FileExtensions.JPEG:
      case FileExtensions.BMP:
        const newImage: HTMLImageElement = new Image();
        const fileInfo: IFileInfo = {fileName: imageName, fileExtension: format};
        newImage.src = url;
        this.loadImage(newImage).then(() => {
          this.onImageLoad(newImage, domURL, url, fileInfo);
        });
        break;
    }
  }
}
