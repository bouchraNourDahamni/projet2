import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { ICoordinates } from '../../interfaces/coordinates';
import { GridService } from '../tools/grid/grid.service';

const DEFAULT_WIDTH = 0;
const DEFAULT_HEIGHT = 0;
const DEFAULT_BACKGROUND = '';

@Injectable({
    providedIn: 'root',
})

export class SvgManagerService {

    public svgAnchor: ElementRef;
    public workspace: ElementRef;
    public isFirstCanvas: boolean;
    public hasBeenModified: boolean;
    public renderer: Renderer2;

    public currentWidth: Observable<number>;
    public currentHeight: Observable<number>;
    public currentBackground: Observable<string>;

    private width: BehaviorSubject<number>;
    private height: BehaviorSubject<number>;
    private background: BehaviorSubject<string>;
    private selectionRectContainer: SVGElement;
    private svgElements: SVGElement[];
    private container: SVGElement;

    constructor(
      private gridService: GridService,
      private rendererFactory: RendererFactory2) {
        this.isFirstCanvas = true;
        this.hasBeenModified = false;
        this.width = new BehaviorSubject(DEFAULT_WIDTH);
        this.height = new BehaviorSubject(DEFAULT_HEIGHT);
        this.background = new BehaviorSubject(DEFAULT_BACKGROUND);
        this.currentWidth = this.width.asObservable();
        this.currentHeight = this.height.asObservable();
        this.currentBackground = this.background.asObservable();
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.svgElements = [];
    }

    public createDrawing(height: number, width: number, backgroundColor: string): void {
      this.resetCanvas();
      this.gridService.workspaceHeight = height;
      this.gridService.workspaceWidth = width;
      this.width.next(width);
      this.height.next(height);
      this.background.next(backgroundColor);
      this.container = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
      this.renderer.appendChild(this.svgAnchor.nativeElement, this.container);
      this.gridService.generateGrid();
    }

    public setBackgroundColor(backgroundColor: string): void {
      this.background.next(backgroundColor);
    }

    private resetCanvas(): void {
      if (this.container) {
        this.renderer.removeChild(this.svgAnchor.nativeElement, this.container);
      }
      this.hasBeenModified = false;
      this.svgElements.length = 0;
      this.gridService.resetGrid();
    }

    public addElement(element: SVGElement): void {
      this.hasBeenModified = true;
      this.renderer.appendChild(this.container, element);
    }

    public getSvgElements(): SVGElement[] {
      return Array.from(this.container.children) as SVGElement[];
    }

    public getOffset(): ICoordinates {
      const offset: ICoordinates = {
          x: this.workspace.nativeElement.getBoundingClientRect().left,
          y: this.workspace.nativeElement.getBoundingClientRect().top,
      };
      console.log( 'this.workspace.nativeElement.getBoundingClientRect().left',this.workspace.nativeElement.getBoundingClientRect().left);
      console.log( 'this.workspace.nativeElement.getBoundingClientRect().top',this.workspace.nativeElement.getBoundingClientRect().top);
      return offset;
    }

    public deleteElement(element: SVGElement): void {
      if (element) {
        this.renderer.removeChild(this.container, element);
      }
    }

    public addSelectionRect(rectangle: SVGElement): void {
      if (this.selectionRectContainer) {
        this.deleteSelectionRect();
      }
      this.selectionRectContainer = this.renderer.createElement(SVGAttributes.G, SVGAttributes.SVG);
      this.renderer.appendChild(this.svgAnchor.nativeElement, this.selectionRectContainer);
      this.renderer.appendChild(this.selectionRectContainer, rectangle);
    }

    public deleteSelectionRect(): void {
      if (this.selectionRectContainer) {
        this.renderer.removeChild(this.svgAnchor.nativeElement, this.selectionRectContainer);
      }
    }

}
