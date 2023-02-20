import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IImageMetaData } from '../../interfaces/image-metadata';
import { ISVGImage } from '../../interfaces/SVGImage';
import { SendHttpRequest } from '../../services/send-http-request/send-http-request.service';
import { ImageService } from '../Image/image.service';

const MAX_IMAGE = 8;
const TEXT = '.txt';

@Injectable({
  providedIn: 'root',
})
export class ImageServerService {

  public imagesReceived: ISVGImage[];
  public drawingToRenderer: ISVGImage[];
  private indexServer: number;
  private indexIterration: number;
  private eightDrawingToRenderer: ISVGImage[];
  public imageMetaDataServer: IImageMetaData[];
  private imageId: string[];
  public images: string[];
  public imagesWithMetaData: ISVGImage[];

  constructor(
    private imageService: ImageService,
    private sendHttpRequest: SendHttpRequest,
    private sanitizer: DomSanitizer) {
      this.imagesReceived = [];
      this.images = [];
      this.eightDrawingToRenderer = [];
      this.imageMetaDataServer = [];
      this.imageId = [];
      this.imagesWithMetaData = [];
  }

  public sendImageToServer(name: string, tag: string[]): void {
    // tslint:disable-next-line: no-empty
    this.sendHttpRequest.sendHTML(this.imageService.image, name, tag).subscribe((data: ISVGImage) => { });
  }

  private getArrayServerIndex(): number {
    this.indexServer = (this.imagesReceived.length >= MAX_IMAGE) ? this.imagesReceived.length - MAX_IMAGE : 0;
    return this.indexServer;
  }

  private getArrayRendererIndex(): number {
    this.indexIterration = (this.imagesReceived.length >= MAX_IMAGE) ? MAX_IMAGE : this.imagesReceived.length;
    return this.indexIterration;
  }

  private setImageToRenderer(): void {
    this.resetDrawings();
    // tslint:disable-next-line: one-variable-per-declaration && no-unused-expression
    for (let i = 0, j = this.getArrayServerIndex(); i < this.getArrayRendererIndex(), j < this.imagesReceived.length; i++ , j++) {
      this.eightDrawingToRenderer[i] = this.imagesReceived[j];
    }
  }

  public rendererImagesServer(): void {
    this.resetDrawings();
    this.setImageToRenderer();
    this.drawingToRenderer = this.eightDrawingToRenderer.map((v: ISVGImage) => {
      return {
        imageName: v.imageName,
        imageTags: v.imageTags,
        image: this.sanitizer.bypassSecurityTrustHtml(v.image),
      } as ISVGImage;
    });
    this.drawingToRenderer = [...this.drawingToRenderer];
  }

  public resetDrawings(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.eightDrawingToRenderer.length; i++) {
      this.eightDrawingToRenderer.pop();
    }
  }

  public getImagesId(imageMetaData: IImageMetaData[]): void {
    this.imageMetaDataServer = imageMetaData;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < imageMetaData.length; i++) {
      this.imageId.push(imageMetaData[i].id);
    }
    this.getImagesFromCloud();
  }

  public getImagesFromCloud(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.imageId.length; i++) {
      const key: string = this.imageId[i] + TEXT;
      this.sendHttpRequest.getImageFromCloud(key).subscribe((image: string) => {
        this.images.push(image);
        this.mapImages(this.images);
      });
    }
  }

  public mapImages(images: string[]): void {
    for (let i = 0; i < this.images.length; i++) {
      const imageName = this.imageMetaDataServer[i].imageName;
      const imageTags = this.imageMetaDataServer[i].imageTags;
      const image = images[i];
      const imageWithMetaData: ISVGImage = { image, imageTags, imageName };
      this.imagesWithMetaData.push(imageWithMetaData);
    }
  }

  public resetImages(images: string[]): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      images.pop();
    }
  }

  public resetImagesWithMetaData(images: ISVGImage[]): void {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < images.length; i++) {
      images.pop();
    }
  }
}
