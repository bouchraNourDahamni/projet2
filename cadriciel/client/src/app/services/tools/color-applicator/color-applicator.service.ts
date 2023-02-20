import { Injectable } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { ChangeFillColorOperation } from '../../operation-handler/operations/change-fill-color/change-fill-color-operation';
import { ChangeOutlineColorOperation } from '../../operation-handler/operations/change-outline-color/change-outline-color-operation';
import { PipetteService } from '../../tools/pipette/pipette.service';
import { AbstractToolService } from '../../tools/tool/tool.service';
import { SVGAttributes } from './../../../enums/svg-attributes';
import { ChangeColorService } from './change-color/change-color.service';

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;
const BACKGROUND = 'SVGBackground';
const FEATHER_CLASS = 'feather';
const BUCKET_CLASS = 'bucket';

@Injectable({
  providedIn: 'root',
})

export class ColorApplicatorService implements AbstractToolService {
  private primaryColor: string;
  private primaryOpacity: number;
  private secondaryColor: string;
  private secondaryOpacity: number;

  constructor(
    private colorService: ColorService,
    private changeColorService: ChangeColorService,
    private operationHandler: OperationHandlerService,
    private pipette: PipetteService) {
      this.subscribeColors();
  }

  public onMouseDown(event: MouseEvent): void {
    const colorTarget = event.target as SVGElement;
    if (event.button === LEFT_BUTTON) {
      this.changePrimary(colorTarget);
    } else if (event.button === RIGHT_BUTTON && this.hasOutline(colorTarget)) {
      this.changeSecondary(colorTarget);
    }
  }

  private subscribeColors(): void {
    this.colorService.currentPrimaryColor.subscribe((primaryColor: string) => {
      this.primaryColor = primaryColor;
    });
    this.colorService.currentSecondaryColor.subscribe((secondaryColor: string) => {
      this.secondaryColor = secondaryColor;
    });
    this.colorService.currentFill.subscribe((fillOpacity: number) => {
      this.primaryOpacity = fillOpacity;
    });
    this.colorService.currentOutline.subscribe((outlineOpacity: number) => {
      this.secondaryOpacity = outlineOpacity;
    });
  }

  private changePrimary(target: SVGElement): void {
    const colors = this.pipette.extractColor(target);
    colors.newColor = this.primaryColor;
    colors.newOpacity = this.primaryOpacity;
    this.operationHandler.addOperation(new ChangeFillColorOperation(target, colors, this.changeColorService));
    this.changeColorService.changeColor(target, this.primaryColor, this.primaryOpacity);
  }

  private changeSecondary(target: SVGElement): void {
    const colors = this.pipette.extractOutline(target);
    colors.newColor = this.secondaryColor;
    colors.newOpacity = this.secondaryOpacity;
    this.operationHandler.addOperation(new ChangeOutlineColorOperation(target, colors, this.changeColorService));
    this.changeColorService.changeOutlineColor(target, this.secondaryColor, this.secondaryOpacity);
  }

  private hasOutline(target: SVGElement): boolean {
    const parentClass = (target.parentElement as any as SVGElement).classList.value;
    const svgClass = target.classList.value;
    if (svgClass === BACKGROUND || parentClass === FEATHER_CLASS) {
      return false;
    }
    const svgTag = target.tagName;
    return (
      svgTag === SVGAttributes.Rect ||
      svgTag === SVGAttributes.Ellipse ||
      svgTag === SVGAttributes.Polygon ||
      svgClass === BUCKET_CLASS);
  }

  public cleanUp(): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }
}
