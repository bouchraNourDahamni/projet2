import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ShapeModes } from './../../../enums/shape-modes';
import { StampTextures } from './../stamp/stamp-textures';

const DEFAULT_LINE_TEXTURE = 'none';
const DEFAULT_OUTLINE_MODE = 'default';
const DEFAULT_CORNER_MODE = 'sharp';
const DEFAULT_LINE_MODE = 'full';
const DEFAULT_VERTICES_RADIUS = '3';
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_LINE_WIDTH_MIN_SLIDER = 1;
const DEFAULT_LINE_WIDTH_MAX_SLIDER = 6;
const DEFAULT_LINE_LENGTH = 1;
const DEFAULT_SIZE = 1;
const DEFAULT_ANGLE = 0;
const DEFAULT_POLYGON_SIDE = 3;
const DEFAULT_SPRAY_PER_SECOND = 100;
const DEFAULT_SPRAY_DIAMETER = 20;
const DEFAULT_BUCKET_TOLERANCE = 0;
const DEFAULT_BUCKET_OUTLINE = 1;

const STAMP1 = 'stamp1';
const STAMP2 = 'stamp2';
const STAMP3 = 'stamp3';
const STAMP4 = 'stamp4';
const STAMP5 = 'stamp5';

@Injectable({
  providedIn: 'root',
})

export class ToolAttributesService {

  public altKeyPressed: boolean;

  private lengthFeatherSource: BehaviorSubject<number>;
  private lineWidthSource: BehaviorSubject<number>;
  private lineWidthMin: BehaviorSubject<number>;
  private lineWidthMax: BehaviorSubject<number>;
  private sizeSource: BehaviorSubject<number>;
  private lineTextureSource: BehaviorSubject<string>;
  private modeSource: BehaviorSubject<string>;
  private polygonSides: BehaviorSubject<number>;
  private verticesRadius: BehaviorSubject<string>;
  private angleSource: BehaviorSubject<number>;
  private stampTextureSource: BehaviorSubject<StampTextures>;
  private sprayPerSecond: BehaviorSubject<number>;
  private sprayDiameter: BehaviorSubject<number>;
  private bucketTolerance: BehaviorSubject<number>;
  private bucketOutlineWidth: BehaviorSubject<number>;
  private outlineMode: BehaviorSubject<string>;
  private lineMode: BehaviorSubject<string>;
  private cornerMode: BehaviorSubject<string>;

  public currentFeatherLength: Observable<number>;
  public currentLineWidth: Observable<number>;
  public currentLineWidthMin: Observable<number>;
  public currentLineWidthMax: Observable<number>;
  public currentSize: Observable<number>;
  public currentLineTexture: Observable<string>;
  public currentMode: Observable<string>;
  public currentPolygonSides: Observable<number>;
  public currentVerticesRadius: Observable<string>;
  public currentAngle: Observable<number>;
  public currentStampTexture: Observable<StampTextures>;
  public currentSprayPerSecond: Observable<number>;
  public currentSprayDiameter: Observable<number>;
  public currentBucketTolerance: Observable<number>;
  public currentBucketOutlineWidth: Observable<number>;
  public currentOutlineMode: Observable<string>;
  public currentLineMode: Observable<string>;
  public currentCornerMode: Observable<string>;

  constructor() {
    this.lengthFeatherSource = new BehaviorSubject(DEFAULT_LINE_LENGTH);
    this.lineWidthSource = new BehaviorSubject(DEFAULT_LINE_WIDTH);
    this.lineWidthMin = new BehaviorSubject(DEFAULT_LINE_WIDTH_MIN_SLIDER);
    this.lineWidthMax = new BehaviorSubject(DEFAULT_LINE_WIDTH_MAX_SLIDER);
    this.sizeSource = new BehaviorSubject(DEFAULT_SIZE);
    this.lineTextureSource = new BehaviorSubject(DEFAULT_LINE_TEXTURE);
    this.modeSource = new BehaviorSubject(ShapeModes.Both);
    this.angleSource = new BehaviorSubject(DEFAULT_ANGLE);
    this.stampTextureSource = new BehaviorSubject(StampTextures.None);
    this.polygonSides = new BehaviorSubject(DEFAULT_POLYGON_SIDE);
    this.verticesRadius = new BehaviorSubject(DEFAULT_VERTICES_RADIUS);
    this.sprayPerSecond = new BehaviorSubject(DEFAULT_SPRAY_PER_SECOND);
    this.sprayDiameter = new BehaviorSubject(DEFAULT_SPRAY_DIAMETER);
    this.polygonSides = new BehaviorSubject(DEFAULT_POLYGON_SIDE);
    this.bucketTolerance = new BehaviorSubject(DEFAULT_BUCKET_TOLERANCE);
    this.bucketOutlineWidth = new BehaviorSubject(DEFAULT_BUCKET_OUTLINE);
    this.outlineMode = new BehaviorSubject(DEFAULT_OUTLINE_MODE);
    this.lineMode = new BehaviorSubject(DEFAULT_LINE_MODE);
    this.cornerMode = new BehaviorSubject(DEFAULT_CORNER_MODE);

    this.currentFeatherLength = this.lengthFeatherSource.asObservable();
    this.currentLineWidth = this.lineWidthSource.asObservable();
    this.currentLineWidthMin = this.lineWidthMin.asObservable();
    this.currentLineWidthMax = this.lineWidthMax.asObservable();
    this.currentSize = this.sizeSource.asObservable();
    this.currentLineTexture = this.lineTextureSource.asObservable();
    this.currentMode = this.modeSource.asObservable();
    this.currentPolygonSides = this.polygonSides.asObservable();
    this.currentVerticesRadius = this.verticesRadius.asObservable();
    this.currentAngle = this.angleSource.asObservable();
    this.currentStampTexture = this.stampTextureSource.asObservable();
    this.altKeyPressed = false;
    this.currentSprayPerSecond = this.sprayPerSecond.asObservable();
    this.currentSprayDiameter = this.sprayDiameter.asObservable();
    this.currentBucketTolerance = this.bucketTolerance.asObservable();
    this.currentBucketOutlineWidth = this.bucketOutlineWidth.asObservable();
    this.currentOutlineMode = this.outlineMode.asObservable();
    this.currentLineMode = this.lineMode.asObservable();
    this.currentCornerMode = this.cornerMode.asObservable();
  }

  public setLineWidth(lineWidth: number): void {
    this.lineWidthSource.next(lineWidth);
  }

  public setFeatherLength(featherLength: number): void {
    this.lengthFeatherSource.next(featherLength);
  }

  public setLineWidthMin(lineWidth: number): void {
    this.lineWidthMin.next(lineWidth);
  }

  public setLineWidthMax(lineWidth: number): void {
    this.lineWidthMax.next(lineWidth);
  }

  public setSize(size: number): void {
    this.sizeSource.next(size);
  }

  public setLineTexture(lineTexture: string): void {
    this.lineTextureSource.next(lineTexture);
  }

  public setOutlineMode(outlineMode: string): void {
    this.outlineMode.next(outlineMode);
  }

  public setLineMode(lineMode: string): void {
    this.lineMode.next(lineMode);
  }

  public setCornerMode(cornerMode: string): void {
    this.cornerMode.next(cornerMode);
  }

  public setStampTexture(stampTextureString: string): void {
    if (stampTextureString === STAMP1) {
      this.stampTextureSource.next(StampTextures.Stamp1);
    } else if (stampTextureString === STAMP2) {
      this.stampTextureSource.next(StampTextures.Stamp2);
    } else if (stampTextureString === STAMP3) {
      this.stampTextureSource.next(StampTextures.Stamp3);
    } else if (stampTextureString === STAMP4) {
      this.stampTextureSource.next(StampTextures.Stamp4);
    } else if (stampTextureString === STAMP5) {
      this.stampTextureSource.next(StampTextures.Stamp5);
    } else {
      this.stampTextureSource.next(StampTextures.None);
    }
  }

  public setSprayPerSecond(sprayPerSecond: number): void {
    this.sprayPerSecond.next(sprayPerSecond);
  }

  public setSprayDiameter(diameter: number): void {
    this.sprayDiameter.next(diameter);
  }

  public setColorTolerance(tolerance: number) {
    this.bucketTolerance.next(tolerance);
  }

  public setOutlineWidth(outlineWidth: number) {
    this.bucketOutlineWidth.next(outlineWidth);
  }

  public setMode(mode: string): void {
    this.modeSource.next(mode);
  }

  public setSides(sides: number): void {
    this.polygonSides.next(sides);
  }

  public setVerticesRadius(verticesRadius: string): void {
    this.verticesRadius.next(verticesRadius);
  }

  public setAngle(angle: number): void {
    this.angleSource.next(angle);
  }
}
