import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColorServiceConstants } from 'src/app/constants/color-service-constants';
import { IRGBColor } from '../../interfaces/RGBColor';

@Injectable({
  providedIn: 'root',
})
export class ColorService {

  public chooseType: string;
  private primary: BehaviorSubject<string>;
  private secondary: BehaviorSubject<string>;
  private background: BehaviorSubject<string>;
  private colorArray: BehaviorSubject<string[]>;
  public rgbValue: BehaviorSubject<IRGBColor>;
  public hexValue: BehaviorSubject<string>;
  private fillTransparency: BehaviorSubject<number>;
  private outlineTransparency: BehaviorSubject<number>;

  public currentPrimaryColor: Observable<string>;
  public currentSecondaryColor: Observable<string>;
  public currentBackground: Observable<string>;
  public currentColorArray: Observable<string[]>;
  public currentRgbValue: Observable<IRGBColor>;
  public currentHexValue: Observable<string>;
  public currentFill: Observable<number>;
  public currentOutline: Observable<number>;

  constructor() {
    this.primary = new BehaviorSubject(ColorServiceConstants.DEFAULT_PRIMARY);
    this.secondary = new BehaviorSubject(ColorServiceConstants.DEFAULT_SECONDARY);
    this.background = new BehaviorSubject(ColorServiceConstants.DEFAULT_BACKGROUND);
    this.colorArray = new BehaviorSubject<string[]>(this.generateRecentColors());
    this.rgbValue = new BehaviorSubject(ColorServiceConstants.DEFAULT_RGBCOLORS);
    this.hexValue = new BehaviorSubject(ColorServiceConstants.DEFAULT_PRIMARY);
    this.fillTransparency = new BehaviorSubject(ColorServiceConstants.DEFAULT_TRANSPARENCY);
    this.outlineTransparency = new BehaviorSubject (ColorServiceConstants.DEFAULT_TRANSPARENCY);

    this.currentPrimaryColor = this.primary.asObservable();
    this.currentSecondaryColor = this.secondary.asObservable();
    this.currentBackground = this.background.asObservable();
    this.currentColorArray = this.colorArray.asObservable();
    this.currentRgbValue = this.rgbValue.asObservable();
    this.currentHexValue = this.hexValue.asObservable();
    this.currentFill = this.fillTransparency.asObservable();
    this.currentOutline = this.outlineTransparency.asObservable();
  }

  private generateRecentColors(): string[] {
    const recentColors: string[] = [];
    recentColors.push(ColorServiceConstants.DEFAULT_PRIMARY);
    recentColors.push(ColorServiceConstants.DEFAULT_SECONDARY);
    for (let i = 0; i <= ColorServiceConstants.GREY_FILLING_INDEX; i++) {
      recentColors.push(ColorServiceConstants.BLANK_RECENT);
    }
    return recentColors;
  }

  public sendPrimaryColor(primary: string): void {
    this.primary.next(primary);
  }

  public sendSecondaryColor(secondary: string): void {
    this.secondary.next(secondary);
  }

  public sendBackgroundColor(background: string): void {
    this.background.next(background);
  }

  public sendColorArray(colorArray: string[]): void {
    this.colorArray.next(colorArray);
  }

  public swapColors(primary: string, secondary: string): void {
    this.sendPrimaryColor(secondary);
    this.sendSecondaryColor(primary);
  }

  public addRecentColor(hexValue: string): void {
    const colorArray = this.colorArray.getValue();
    const hexIndex = colorArray.indexOf(hexValue);
    for (let i = (hexIndex > -1) ? hexIndex : ColorServiceConstants.MAX_INDEX_COLOR_ARRAY; i > 0; i--) {
      colorArray[i] = colorArray[i - 1];
    }
    colorArray[0] = hexValue;
    this.colorArray.next(colorArray);
  }

  public setDefaultBackground(): void {
    this.hexValue.next(ColorServiceConstants.DEFAULT_BACKGROUND);
    this.rgbValue.next(this.hexToRgb(ColorServiceConstants.DEFAULT_BACKGROUND));
  }

  public updatePalette(event: MouseEvent, canvas: any, ctx: CanvasRenderingContext2D): void {
    const boundingRect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const offsetY = event.clientY - boundingRect.top;
    const px = ctx.getImageData(offsetX, offsetY, ColorServiceConstants.PIXEL_DIMENSION, ColorServiceConstants.PIXEL_DIMENSION);
    const dataArray = px.data;
    const rgb: IRGBColor = {red: dataArray[0], green: dataArray[1], blue: dataArray[2]};
    this.rgbValue.next(rgb);
    this.hexValue.next(this.rgbToHex(rgb));
  }

  public updateRgb(newRgb: IRGBColor): void {
    newRgb = this.validateRgb(newRgb);
    this.hexValue.next(this.rgbToHex(newRgb));
  }

  public updateHex(newHex: string): void {
    newHex = this.validateHex(newHex);
    this.rgbValue.next(this.hexToRgb(newHex));
  }

  public rgbToHex(rgb: IRGBColor): string {
    return '#' + (
      // tslint:disable-next-line: no-bitwise
      (ColorServiceConstants.BUFFER_VALUE << ColorServiceConstants.SETUP_SHIFT) +
      // tslint:disable-next-line: no-bitwise
      (rgb.red << ColorServiceConstants.RED_SHIFT) +
      // tslint:disable-next-line: no-bitwise
      (rgb.green << ColorServiceConstants.GREEN_SHIFT) + rgb.blue).toString(ColorServiceConstants.HEX_BASE)
      .slice(ColorServiceConstants.HEX_RED_POSITION);
  }

  private hexToRgb(hex: string): IRGBColor {
    const rgb: IRGBColor = {red: ColorServiceConstants.MIN_RGB, green: ColorServiceConstants.MIN_RGB, blue: ColorServiceConstants.MIN_RGB};
    rgb.red = parseInt(hex.slice(ColorServiceConstants.HEX_RED_POSITION, ColorServiceConstants.HEX_GREEN_POSITION),
                      ColorServiceConstants.HEX_BASE);
    rgb.green = parseInt(hex.slice(ColorServiceConstants.HEX_GREEN_POSITION, ColorServiceConstants.HEX_BLUE_POSITION),
                      ColorServiceConstants.HEX_BASE);
    rgb.blue = parseInt(hex.slice(ColorServiceConstants.HEX_BLUE_POSITION), ColorServiceConstants.HEX_BASE);
    return rgb;
  }

  private validateRgb(testedRgb: IRGBColor): IRGBColor {
    const rgb: IRGBColor = {red: testedRgb.red, green: testedRgb.green, blue: testedRgb.blue};
    rgb.red = Math.floor(rgb.red);
    rgb.blue = Math.floor(rgb.blue);
    rgb.green = Math.floor(rgb.green);

    rgb.red = this.validateColors(rgb.red);
    rgb.green = this.validateColors(rgb.green);
    rgb.blue = this.validateColors(rgb.blue);

    return rgb;
  }

  private validateColors(rgbColor: number): number {
    if (rgbColor < ColorServiceConstants.MIN_RGB) {
      rgbColor = ColorServiceConstants.MIN_RGB;
    } else if (rgbColor > ColorServiceConstants.MAX_RGB) {
      rgbColor = ColorServiceConstants.MAX_RGB;
    }

    return rgbColor;
  }
  public validateHex(hex: string): string {
    if (/^#([A-Fa-f0-9]{0,5})$/.test(hex)) {
      const padding = ColorServiceConstants.HEX_LENGHT - hex.length;
      for (let i = 0; i < padding; i++) {
        hex += '0';
      }
    }
    return (/^#([A-Fa-f0-9]{6})$/.test(hex)) ? hex : ColorServiceConstants.DEFAULT_HEX;
  }

  public setFillTransparency(fillTransparency: number): void {
   this.fillTransparency.next(fillTransparency);
  }

  public setOutlineTransparency(outlineTransparency: number): void {
    this.outlineTransparency.next(outlineTransparency);
  }
}
