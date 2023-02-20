import { Injectable } from '@angular/core';
import { IColorChange } from '../../../interfaces/color-change';
import { ColorService } from '../../color/color.service';
import { AbstractToolService } from '../tool/tool.service';
import { SVGAttributes } from './../../../enums/svg-attributes';

const LEFT_BUTTON = 0;
const RIGHT_BUTTON = 2;

@Injectable({
  providedIn: 'root',
})
export class PipetteService implements AbstractToolService {

  private colorTarget: SVGElement;

  constructor(private colorService: ColorService) {
    this.colorService = colorService;
  }

  public onMouseDown(event: MouseEvent): void {
    this.colorTarget = event.target as SVGElement;
    this.checkCalledClick(event);
  }

  private checkCalledClick(event: MouseEvent): void {
    if (event.button === LEFT_BUTTON) {
      this.extractPrimaryColor(this.colorTarget);
    } else if (event.button === RIGHT_BUTTON) {
      this.extractSecondaryColor(this.colorTarget);
    }
  }

  public extractColor(element: SVGElement): IColorChange {
    const parent = element.parentElement as any as SVGElement;
    let colors = {
      oldColor: '',
      oldOpacity: 0,
      newColor: '',
      newOpacity: 0,
    };
    const parentClass = parent.classList.value;
    if (parentClass === SVGAttributes.Line || parentClass === SVGAttributes.Pen ||
      parentClass === SVGAttributes.Aerosol || parentClass === SVGAttributes.Feather) {
      colors = this.extractFromComposite(parent, element, colors);
    } else {
      colors = this.extractFromSingleElement(element, colors);
    }
    return colors;
  }

  private extractFromComposite(container: SVGElement, part: SVGElement, colors: IColorChange): IColorChange {
    colors.oldOpacity = Number(container.getAttribute(SVGAttributes.Opacity));
    if (part.tagName === SVGAttributes.Circle || part.tagName === SVGAttributes.Polygon) {
      colors.oldColor = String(part.getAttribute(SVGAttributes.Fill));
    } else {
      colors.oldColor = String(part.getAttribute(SVGAttributes.Stroke));
    }
    return colors;
  }

  private extractFromSingleElement(element: SVGElement, colors: IColorChange): IColorChange {
    if (element.getAttribute(SVGAttributes.Fill)) {
      colors.oldColor = String(element.getAttribute(SVGAttributes.Fill));
      colors.oldOpacity = Number(element.getAttribute(SVGAttributes.FillOpacity));
    } else {
      colors.oldColor = String(element.getAttribute(SVGAttributes.Stroke));
      colors.oldOpacity = Number(element.getAttribute(SVGAttributes.StrokeOpacity));
    }
    return colors;
  }

  public extractOutline(element: SVGElement): IColorChange {
    const colors = {
      oldColor: '',
      oldOpacity: 0,
      newColor: '',
      newOpacity: 0,
    };
    colors.oldColor = String(element.getAttribute(SVGAttributes.Stroke));
    colors.oldOpacity = Number(element.getAttribute(SVGAttributes.StrokeOpacity));
    return colors;
  }

  private extractPrimaryColor(target: SVGElement): void {
    const color: IColorChange = this.extractColor(target);
    this.colorService.sendPrimaryColor(color.oldColor);
    this.colorService.setFillTransparency(color.oldOpacity);
  }

  private extractSecondaryColor(target: SVGElement): void {
    const color: IColorChange = this.extractColor(target);
    this.colorService.sendSecondaryColor(color.oldColor);
    this.colorService.setOutlineTransparency(color.oldOpacity);
  }

  public cleanUp(): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

}
