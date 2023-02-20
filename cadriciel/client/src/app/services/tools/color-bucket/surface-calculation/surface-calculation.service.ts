import { Injectable } from '@angular/core';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { IPixelSurroundings } from '../../../../interfaces/pixel-surroundings';
import { IRGBColor } from '../../../../interfaces/RGBColor';
import { ColorBucketSvgService } from '../color-bucket-svg/color-bucket-svg.service';

const TOP_LEFT = 0;
const TOP = 1;
const TOP_RIGHT = 2;
const RIGHT = 3;
const BOTTOM_RIGHT = 4;
const BOTTOM = 5;
const BOTTOM_LEFT = 6;
const LEFT = 7;
const DIRECTION_BASE = 8;
const SEPARATOR = ',';
const RGB_MAX = 255;
const POURCENTAGE_DIVIDER = 100;

@Injectable({
  providedIn: 'root',
})
export class SurfaceCalculationService {

  private imageWidth: number;
  private imageHeight: number;
  private surfaceArray: (boolean|null)[][];
  private allOutlinePixels: Set<string>;
  private lastDirection: number;
  private outlines: ICoordinates[][];
  constructor(private bucketSVG: ColorBucketSvgService) {
    this.surfaceArray = [];
    this.allOutlinePixels = new Set<string>();
    this.outlines = [];
  }

  public createSurfaceObject(image: IRGBColor[][], startingPoint: ICoordinates, tolerance: number): void {
    this.imageWidth = image.length;
    this.imageHeight = image[0].length;
    this.extractValidSurface(image, startingPoint, tolerance);
    this.trimSurface();
    this.addOutlineToSet();
    this.extractOutlines();
    this.bucketSVG.createSurface(this.outlines);
  }

  private initializeNullArray(width: number, height: number): (boolean|null)[][] {
    const nullArray: (boolean|null)[][] = [];
    for (let x = 0; x < width; x++) {
      nullArray[x] = [];
      for (let y = 0; y < height; y++) {
        nullArray[x][y] = null;
      }
    }
    return nullArray;
  }

  private extractValidSurface(image: IRGBColor[][], startingPoint: ICoordinates, tolerance: number): void {
    const referenceColor: IRGBColor = image[startingPoint.x][startingPoint.y];

    this.surfaceArray = this.initializeNullArray(this.imageWidth, this.imageHeight);

    this.surfaceArray[startingPoint.x][startingPoint.y] = true;
    const pointsToLookAround: ICoordinates[] = [{x: startingPoint.x, y: startingPoint.y}];
    while (pointsToLookAround.length) {
      const lastPoint: ICoordinates = pointsToLookAround.pop() as ICoordinates;
      const pixelsToCheck = this.getNullCrossPixels(lastPoint);
      for (const pixel of pixelsToCheck) {
        const isValid = this.colorIsValid(referenceColor, image[pixel.x][pixel.y], tolerance);
        this.surfaceArray[pixel.x][pixel.y] = isValid;
        if (isValid) {
          pointsToLookAround.push(pixel);
        }
      }
    }
  }

  private pixelIsInBound(pixel: ICoordinates): boolean {
    return (pixel.x >= 0 && pixel.y >= 0 && pixel.x < this.imageWidth && pixel.y < this.imageHeight);
  }

  private getNullCrossPixels(centerPixel: ICoordinates): ICoordinates[] {
    const validPixels: ICoordinates[] = [];
    const coordinates = this.getCoordinatesAround(centerPixel);
    const tempPixels: ICoordinates[] = [coordinates[TOP], coordinates[RIGHT], coordinates[LEFT], coordinates[BOTTOM]];
    for (const pixel of tempPixels) {
      if (this.pixelIsInBound(pixel) && this.surfaceArray[pixel.x][pixel.y] === null) {
        validPixels.push(pixel);
      }
    }
    return validPixels;
  }

  private colorIsValid(colorA: IRGBColor, colorB: IRGBColor, tolerance: number): boolean {
    const colorGap = (RGB_MAX * tolerance) / POURCENTAGE_DIVIDER;
    const redIsValid = (colorA.red <= colorB.red + colorGap) && (colorA.red >= colorB.red - colorGap);
    const greenIsValid = (colorA.green <= colorB.green + colorGap) && (colorA.green >= colorB.green - colorGap);
    const blueIsValid = (colorA.blue <= colorB.blue + colorGap) && (colorA.blue >= colorB.blue - colorGap);

    return (redIsValid && greenIsValid && blueIsValid);
  }

  private getSurfaceValuesAround(pixel: ICoordinates): IPixelSurroundings {
    const coordinates = this.getCoordinatesAround(pixel);
    const surroundings: IPixelSurroundings = {
    topLeft: this.getSurfaceValue(coordinates[TOP_LEFT]),
    top: this.getSurfaceValue(coordinates[TOP]),
    topRight: this.getSurfaceValue(coordinates[TOP_RIGHT]),
    right: this.getSurfaceValue(coordinates[RIGHT]),
    bottomRight: this.getSurfaceValue(coordinates[BOTTOM_RIGHT]),
    bottom: this.getSurfaceValue(coordinates[BOTTOM]),
    bottomLeft: this.getSurfaceValue(coordinates[BOTTOM_LEFT]),
    left: this.getSurfaceValue(coordinates[LEFT]) };
    return surroundings;
  }

  private getSurfaceValue(pixel: ICoordinates): boolean {
    if (!this.pixelIsInBound(pixel)) {
      return false;
    } else {
      return Boolean((this.surfaceArray[pixel.x][pixel.y]));
    }
  }

  private trimSurface(): void {
    const extraPixels: ICoordinates[] = [];
    for (let x = 0; x < this.imageWidth; x++) {
      for (let y = 0; y < this.imageHeight; y++) {
        if (this.touchesInvalidPixel(x, y)) {
          extraPixels.push({x, y});
        }
      }
    }
    for (const pixel of extraPixels) {
      this.surfaceArray[pixel.x][pixel.y] = false;
    }
  }

  private touchesInvalidPixel(x: number, y: number): boolean {
    const surroundings = this.getSurfaceValuesAround({x, y});
    return (!surroundings.bottom || !surroundings.top || !surroundings.left || !surroundings. right);
  }

  private touchesValidPixel(x: number, y: number): boolean {
    const surroundings = this.getSurfaceValuesAround({x, y});
    return (surroundings.bottom || surroundings.top || surroundings.left || surroundings. right);

  }

  public addOutlineToSet(): void {
    for (let x = 0; x < this.imageWidth; x++) {
      for (let y = 0; y < this.imageHeight; y++) {
        if (!this.surfaceArray[x][y] && this.touchesValidPixel(x, y)) {
          this.allOutlinePixels.add(x + SEPARATOR + y);
        }
      }
    }
  }

  private extractOutline(firstPixel: ICoordinates): ICoordinates[] {
    const outline: ICoordinates[] = [];
    outline.push(firstPixel);
    this.lastDirection = BOTTOM_RIGHT;
    let currentPixel = this.getNextPixel(firstPixel);
    while (currentPixel.x !== firstPixel.x || currentPixel.y !== firstPixel.y) {
      outline.push(currentPixel);
      this.allOutlinePixels.delete(currentPixel.x + SEPARATOR + currentPixel.y) ;
      const nextPixel = this.getNextPixel(currentPixel);
      if (nextPixel.x === currentPixel.x && nextPixel.y === currentPixel.y) {
        break;
      }
      currentPixel = nextPixel;
    }
    this.allOutlinePixels.delete(firstPixel.x + SEPARATOR + firstPixel.y);
    return outline;
  }

  private getNextPixel(currentPixel: ICoordinates): ICoordinates {
    this.lastDirection = (this.lastDirection + BOTTOM_LEFT) % DIRECTION_BASE;
    const coordinatesAround = this.getCoordinatesAround(currentPixel);
    for (let i = 0; i < DIRECTION_BASE; i++) {
      const pixelKey = coordinatesAround[this.lastDirection].x + SEPARATOR + coordinatesAround[this.lastDirection].y;
      if (this.allOutlinePixels.has(pixelKey)) {
        return coordinatesAround[this.lastDirection];
      }
      this.lastDirection = this.incrementDirection(this.lastDirection);
    }
    return currentPixel;
  }

  private incrementDirection(direction: number): number {
    return (++direction) % DIRECTION_BASE;
  }

  private getCoordinatesAround(pixel: ICoordinates): ICoordinates[] {
    const pixels: ICoordinates[] = [];
    pixels.push({x: pixel.x - 1, y: pixel.y - 1});
    pixels.push({x: pixel.x, y: pixel.y - 1 });
    pixels.push({x: pixel.x + 1, y: pixel.y - 1});
    pixels.push({x: pixel.x + 1, y: pixel.y});
    pixels.push({x: pixel.x + 1, y: pixel.y + 1});
    pixels.push({x: pixel.x, y: pixel.y + 1});
    pixels.push({x: pixel.x - 1, y: pixel.y + 1});
    pixels.push({x: pixel.x - 1, y: pixel.y});
    return pixels;
  }

  public extractOutlines(): void {
    this.outlines = [];
    while (this.allOutlinePixels.size) {
      const firstPixel = this.stringToCoordinates(this.allOutlinePixels.keys().next().value);
      this.outlines.push(this.extractOutline(firstPixel));
    }
  }

  private stringToCoordinates(coordinateString: string): ICoordinates {
    const coordinates = coordinateString.split(SEPARATOR);
    return {x: Number(coordinates[0]), y: Number(coordinates[1])};
  }

}
