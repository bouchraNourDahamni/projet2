import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SVGAttributes } from '../../../enums/svg-attributes';

const SCALING_GAP = 5;
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 500;
const DEFAULT_GRID_SIZE = 20;
const MIN_TRANSPARENCY = 0.2;
const GRID_LINE_WIDTH = '2';
const GRID_COLOR = 'black';
const ZERO = '0';

@Injectable({
  providedIn: 'root',
})
export class GridService {

  public anchorGrid: ElementRef;
  public workspaceWidth: number;
  public workspaceHeight: number;
  public isVisible: Observable<boolean>;
  public currentGridSize: Observable<number>;

  private gridSize: BehaviorSubject<number>;
  private isVisibleBehavior: BehaviorSubject<boolean>;
  private squareSize: number;
  private renderer: Renderer2;
  private container: SVGElement;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isVisibleBehavior = new BehaviorSubject(false);
    this.gridSize = new BehaviorSubject(DEFAULT_GRID_SIZE);
    this.isVisible = this.isVisibleBehavior.asObservable();
    this.squareSize = DEFAULT_GRID_SIZE;
    this.currentGridSize = this.gridSize.asObservable();
  }

  private setIsVisible(isVisible: boolean): void {
    this.isVisibleBehavior.next(isVisible);
  }

  public generateGrid(): void {
    this.initializeContainer();

    const linesInX = Math.floor(this.workspaceWidth / this.squareSize);
    const linesInY = Math.floor(this.workspaceHeight / this.squareSize);

    for (let i = 0; i <= linesInX; i++) {
      const line = this.renderer.createElement(SVGAttributes.Line, SVGAttributes.SVG);
      const xValue = (this.squareSize * i).toString();
      this.renderer.setAttribute(line, SVGAttributes.X1, xValue);
      this.renderer.setAttribute(line, SVGAttributes.X2, xValue);
      this.renderer.setAttribute(line, SVGAttributes.Y1, ZERO);
      this.renderer.setAttribute(line, SVGAttributes.Y2, this.workspaceHeight.toString());
      this.renderer.appendChild(this.container, line);
    }

    for (let i = 0; i <= linesInY; i++) {
      const line = this.renderer.createElement(SVGAttributes.Line, SVGAttributes.SVG);
      const yValue = (this.squareSize * i).toString();
      this.renderer.setAttribute(line, SVGAttributes.X1, ZERO);
      this.renderer.setAttribute(line, SVGAttributes.X2, this.workspaceWidth.toString());
      this.renderer.setAttribute(line, SVGAttributes.Y1, yValue);
      this.renderer.setAttribute(line, SVGAttributes.Y2, yValue);
      this.renderer.appendChild(this.container, line);
    }
  }

  private initializeContainer(): void {
    if (this.container) {
      this.renderer.removeChild(this.anchorGrid.nativeElement, this.container);
    }
    this.container = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
    this.renderer.appendChild(this.anchorGrid.nativeElement, this.container);
    this.renderer.setAttribute(this.container, SVGAttributes.Stroke, GRID_COLOR);
    this.renderer.setAttribute(this.container, SVGAttributes.StrokeWidth, GRID_LINE_WIDTH);
    if (!this.isVisibleBehavior.getValue()) {
      this.renderer.setAttribute(this.container, SVGAttributes.Display, SVGAttributes.None);
    }
  }

  public toggleGrid(): void {
    if (this.isVisibleBehavior.getValue()) {
      this.renderer.setAttribute(this.container, SVGAttributes.Display, SVGAttributes.None);
      this.setIsVisible(false);
    } else {
      this.renderer.setAttribute(this.container, SVGAttributes.Display, SVGAttributes.Inline);
      this.setIsVisible(true);
    }
  }

  public scaleGridUp(): void {
    if (this.squareSize >= MAX_GRID_SIZE) {
      return;
    }
    const remainder = this.squareSize % SCALING_GAP;
    this.squareSize += (SCALING_GAP - remainder);
    this.gridSize.next(this.squareSize);
    this.generateGrid();
  }

  public scaleGridDown(): void {
    if (this.squareSize <= MIN_GRID_SIZE) {
      return;
    }
    const remainder = this.squareSize % SCALING_GAP;
    if (remainder === 0) {
      this.squareSize -= SCALING_GAP;
    } else {
      this.squareSize -= remainder;
    }
    this.gridSize.next(this.squareSize);
    this.generateGrid();
  }

  public setGridSize(newSize: number): void {
    if (newSize > MAX_GRID_SIZE) {
      this.squareSize = MAX_GRID_SIZE;
    } else if (newSize < MIN_GRID_SIZE) {
      this.squareSize = MIN_GRID_SIZE;
    } else {
      this.squareSize = newSize;
    }
    this.gridSize.next(newSize);
    this.generateGrid();
  }

  public setTransparency(transparency: number): void {
    if (transparency < MIN_TRANSPARENCY) {
      transparency = MIN_TRANSPARENCY;
    }
    this.renderer.setAttribute(this.container, SVGAttributes.StrokeOpacity, transparency.toString());
  }

  public resetGrid(): void {
    this.squareSize = DEFAULT_GRID_SIZE;
    this.setIsVisible(false);
  }
}
