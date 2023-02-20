import { Injectable, Renderer2} from '@angular/core';
import { Tools } from 'src/app/enums/tools';
import { ITransformMatrix } from 'src/app/interfaces/transform-matrix';
import { SVGAttributes } from '../../../enums/svg-attributes';
import { ICoordinates } from '../../../interfaces/coordinates';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../operation-handler/operations/add-object/add-object-operation';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { MatrixManipulationsService } from '../selection/selection-operation/matrix-manipulations/matrix-manipulations.service';
import { ToolAttributesService } from '../tool-attributes/tool-attributes.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { AbstractToolService } from '../tool/tool.service';
import { StampTextures } from './stamp-textures';

const SMALL_ANGLE_RADIANS = 0.0174533;
const LARGE_ANGLE_RADIANS = 0.261799;
const DECIMALS = 3;
const INITIAL_COORDINATES: ICoordinates = {
  x: -1,
  y: -1,
};

@Injectable({
  providedIn: 'root',
})

export class StampService implements AbstractToolService {

  private renderer: Renderer2;
  private newStamp: SVGElement;
  private stampPreview: SVGElement;
  private stampBoundingRect: ClientRect;
  private size: number;
  private stampTexture: StampTextures;
  private angle: number;
  private color: string;
  private fillTransparency: number;
  private previewIsShowing: boolean;
  private currentMouseCoordinates: ICoordinates;
  private altKeyPressed: boolean;

  constructor(
    private svgManager: SvgManagerService,
    private toolAttributesService: ToolAttributesService,
    private toolSelector: ToolSelectorService,
    private colorService: ColorService,
    private operationHandler: OperationHandlerService,
    private matrixManipulations: MatrixManipulationsService) {
      this.renderer = svgManager.renderer;
      this.stampTexture = StampTextures.Stamp1;
      this.previewIsShowing = false;
      this.currentMouseCoordinates = INITIAL_COORDINATES;
      this.toolAttributesService.currentStampTexture.subscribe((texture: StampTextures) => {
        this.stampTexture = texture;
        this.svgManager.deleteElement(this.stampPreview);
        this.updateStampImage();
      });
      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
        this.updateStampColor();
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
        this.updateStampColor();
      });
      this.toolAttributesService.currentSize.subscribe((size: number) => {
        this.size = size;
        this.updateStampTransformation();
      });
      this.toolAttributesService.currentAngle.subscribe((angle: number) => {
        this.angle = angle;
        this.updatePreview();
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
      this.altKeyPressed = false;
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Stamp) {
      this.cleanUp();
    }
  }

  private updateStampTransformation(): void {
    if (this.previewIsShowing) {
      this.setStampImage(this.stampPreview);
      this.setTransformation(this.stampPreview);
    }
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.stampTexture !== StampTextures.None) {
      this.setMouseCoordinate(event);
      this.newStamp = this.renderer.createElement(SVGAttributes.Path, SVGAttributes.SVG);
      this.svgManager.addElement(this.newStamp);
      this.setStampImage(this.newStamp);
      this.setAllStampAttributes(this.newStamp);
      this.operationHandler.addOperation(new AddObjectOperation(this.newStamp, this.svgManager));
    }
  }

  public onMouseMove(event: MouseEvent): void {
    this.setMouseCoordinate(event);
    if (!this.previewIsShowing) {
      this.stampPreview = this.renderer.createElement(SVGAttributes.Path, SVGAttributes.SVG);
      this.svgManager.addElement(this.stampPreview);
      this.setStampImage(this.stampPreview);
      this.previewIsShowing = true;
    }
    this.setAllStampAttributes(this.stampPreview);
  }

  private updatePreview(): void {
    if (this.previewIsShowing) {
      this.setTransformation(this.stampPreview);
    }
  }

  public onMouseWheel(event: WheelEvent): void {
    event.preventDefault();
    // event.deltaY < 0 ==> scrolling up
    if (event.deltaY < 0) {
      this.angle = ((this.altKeyPressed) ? this.angle + SMALL_ANGLE_RADIANS : this.angle + LARGE_ANGLE_RADIANS);
    } else {
      this.angle = ((this.altKeyPressed) ? this.angle - SMALL_ANGLE_RADIANS : this.angle - LARGE_ANGLE_RADIANS);
    }
    if (this.previewIsShowing) {
      this.setAllStampAttributes(this.stampPreview);
    }
  }

  public onAltKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = true;
    }
  }

  private updateStampImage(): void {
    if (this.previewIsShowing) {
      this.stampPreview = this.renderer.createElement(SVGAttributes.Path, SVGAttributes.SVG);
      this.svgManager.addElement(this.stampPreview);
      this.setStampImage(this.stampPreview);
      // this.setStampImage(this.stampPreview);
    }
  }

  public onAltKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    if (!event.repeat) {
      this.altKeyPressed = false;
    }
  }

  public cleanUp(): void {
    this.svgManager.deleteElement(this.stampPreview);
    this.previewIsShowing = false;
  }

  private updateStampColor(): void {
    if (this.previewIsShowing) {
      this.setColor(this.stampPreview);
    }
  }

  private setMouseCoordinate(event: MouseEvent): void {
    this.currentMouseCoordinates = {x: event.clientX - this.svgManager.getOffset().x, y: event.clientY - this.svgManager.getOffset().y};
  }

  private setStampImage(stamp: SVGElement): void {
    this.renderer.setAttribute(stamp, SVGAttributes.DPath, this.stampTexture);
    this.stampBoundingRect = stamp.getBoundingClientRect();
  }

  private setColor(stamp: SVGElement): void {
    this.renderer.setAttribute(stamp, SVGAttributes.Fill, this.color);
    this.renderer.setAttribute(stamp, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  private findCenter(): ICoordinates {
    const topLeft: ICoordinates = {
      x: this.stampBoundingRect.left - this.svgManager.getOffset().x,
      y: this.stampBoundingRect.top - this.svgManager.getOffset().y,
    };
    const bottomRight: ICoordinates = {
      x: this.stampBoundingRect.right - this.svgManager.getOffset().x,
      y: this.stampBoundingRect.bottom - this.svgManager.getOffset().y,
    };
    return {x: (bottomRight.x - topLeft.x) / 2 * this.size, y: (bottomRight.y - topLeft.y) / 2 * this.size};
  }

  private getMatrixRotate(center: ICoordinates): ITransformMatrix {
    // taken from https://www.euclideanspace.com/maths/geometry/affine/aroundPoint/matrix2d/index.htm
    const cos = Math.cos(this.angle) % (2 * Math.PI);
    const sin = Math.sin(this.angle) % (2 * Math.PI);
    return {a: Number(cos.toFixed(DECIMALS)), b: Number(sin.toFixed(DECIMALS)),
            c: Number(-sin.toFixed(DECIMALS)), d: Number(cos.toFixed(DECIMALS)),
            e: Number((center.x - cos * center.x + sin * center.y).toFixed(DECIMALS)),
            f: Number((center.y - sin * center.x - cos * center.y).toFixed(DECIMALS))};
  }

  private setTransformation(stamp: SVGElement): void {
    const centerTranslate = {x: this.currentMouseCoordinates.x - this.findCenter().x,
                             y: this.currentMouseCoordinates.y - this.findCenter().y};
    const translateMatrix = {a: 1, b: 0, c: 0, d: 1, e: centerTranslate.x, f: centerTranslate.y};
    const scalingMatrix = {a: this.size, b: 0, c: 0, d: this.size, e: 0, f: 0};
    const rotationMatrix = this.getMatrixRotate({x: this.currentMouseCoordinates.x, y: this.currentMouseCoordinates.y});
    const intermediateMatrix = this.matrixManipulations.matrixMultiply(translateMatrix, scalingMatrix);
    const finalMatrix: ITransformMatrix = this.matrixManipulations.matrixMultiply(rotationMatrix, intermediateMatrix);
    this.renderer.setAttribute(stamp, SVGAttributes.Transform, this.matrixManipulations.matrixToString(finalMatrix));
  }

  private setAllStampAttributes(stamp: SVGElement): void {
    this.setColor(stamp);
    this.setTransformation(stamp);
  }

  public onMouseUp(): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

}
