import { TestBed } from '@angular/core/testing';
import { IRGBColor } from '../../interfaces/RGBColor';
import { ColorService } from './color.service';

let service: ColorService;

describe('ColorServiceA', () => {

  beforeEach(() => { service = TestBed.get(ColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('#generateRecentColors should build and array with default values and pad it with grey', () => {
    const colorArray = ['#000000', '#0000ff', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb'];
    expect(service['generateRecentColors']()).toEqual(colorArray);
  });

  it ('#sendPrimaryColor should set secondary color when given a string', () => {
    const color = '#fff000';
    service.sendPrimaryColor(color);
    service.currentPrimaryColor.subscribe(async (primaryColor: string) => {
      expect(primaryColor).toBe(color);
    });
  });

  it ('#sendSecondaryColor should set secondary color when given a string', () => {
    const color = '#fffaaa';
    service.sendSecondaryColor(color);
    service.currentSecondaryColor.subscribe(async (secondaryColor: string) => {
      expect(secondaryColor).toBe(color);
    });
  });

  it ('#sendBackgroundColor should set background color when given a string', () => {
    const color = '#fffddd';
    service.sendBackgroundColor(color);
    service.currentBackground.subscribe((backgroundColor: string) => {
      expect(backgroundColor).toBe(color);
    });
  });

  it ('#sendColorArray should set color array when given an array of strings', () => {
    const color: string[] = ['#000000', '#ffffff'];
    service.sendColorArray(color);
    service.currentColorArray.subscribe((colorArray: string[]) => {
      expect(colorArray).toBe(color);
    });
  });

  it('#swapColors should swap colors', () => {
    const primary = '#000000';
    const secondary = '#ffffff';
    service.swapColors(primary, secondary);
    service.currentPrimaryColor.subscribe((primaryColor: string) => {
      expect(primaryColor).toBe(secondary);
    });
    service.currentSecondaryColor.subscribe((secondaryColor: string) => {
      expect(secondaryColor).toBe(primary);
    });
  });

  it('#addRecentColor should shift recent colors to the right when a new one is added', () => {
    const colorArrayRef = ['#123123', '#aaaaaa', '#000000', '#0000ff', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb'];
    let colorArray: string[] = [];
    service.currentColorArray.subscribe((newColorArray: string[]) => {
      colorArray = newColorArray;
    });
    service.addRecentColor('#aaaaaa');
    service.addRecentColor('#123123');
    expect(colorArray).toEqual(colorArrayRef);
  });

  it('#addRecentColor should put in first position a color already in Recent Colors', () => {
    const colorArrayRef = ['#434343', '#123123', '#000000',  '#0000ff', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb'];
    let colorArray: string[] = [];
    service.currentColorArray.subscribe((newColorArray: string[]) => {
      colorArray = newColorArray;
    });
    service.addRecentColor('#434343');
    service.addRecentColor('#123123');
    service.addRecentColor('#434343');
    expect(colorArray).toEqual(colorArrayRef);
  });

  it('#updateRgb should validate the rgb and push its hex equivalent to the observable', () => {
    const rgb: IRGBColor = {red: 25, green: 276, blue: -15};
    const hex = '#19ff00';
    service.updateRgb(rgb);
    service.currentHexValue.subscribe((newHex: string) => {
      expect(newHex).toEqual(hex);
    });
  });

  it('#updateHex should validate the hex and push its Rgb equivalent to the observable', () => {
    const hex = '#19ff';
    const rgb: IRGBColor = {red: 25, green: 255, blue: 0};
    service.updateHex(hex);
    service.currentRgbValue.subscribe((newRgb: IRGBColor) => {
      expect(newRgb).toEqual(rgb);
    });
  });

  it('#setDefaultBackground should put back hexValue and RGBValue to default (white)', () => {
    const hexA = '#123123';
    const rgbA: IRGBColor = {red: 18, green: 49, blue: 35};
    const defaultHex = '#ffffff';
    const rgbB: IRGBColor = {red: 25, green: 123, blue: 15};
    const hexB = '#197b0f';
    const defaultRgb: IRGBColor = {red: 255, green: 255, blue: 255};
    let newHexValue = '';
    let newRgbValue: IRGBColor = {red: 0, green: 0, blue: 0};
    service.updateHex(hexA);
    service.updateRgb(rgbB);
    service.currentHexValue.subscribe((newHex: string) => {
      newHexValue = newHex;
    });
    service.currentRgbValue.subscribe((newRgb: IRGBColor) => {
      newRgbValue = newRgb;
    });
    expect(newHexValue).toEqual(hexB);
    expect(newRgbValue).toEqual(rgbA);
    service.setDefaultBackground();
    expect(newHexValue).toEqual(defaultHex);
    expect(newRgbValue).toEqual(defaultRgb);
  });

  it('#rgbToHex should properly convert an RGB object to a hex string', () => {
    const rgbColor: IRGBColor = {red: 50, green: 100, blue: 255};
    const hex = '#3264ff';
    expect(service['rgbToHex'](rgbColor)).toEqual(hex);
  });

  it('#hexToRgb should properly convert a hex string to an RGB object', () => {
    const hex = '#3264ff';
    const rgbColor: IRGBColor = {red: 50, green: 100, blue: 255};
    expect(service['hexToRgb'](hex)).toEqual(rgbColor);
  });

  it('#validateRGB should return a valid RGB if any color value is out of bound', () => {
    const negativeRgb: IRGBColor = {red: -40, green: -300000, blue: -1 };
    const validRgbMin: IRGBColor = {red: 0, green: 0, blue: 0};
    expect(service['validateRgb'](negativeRgb)).toEqual(validRgbMin);

    const bigRgb: IRGBColor = {red: 256, green: 300000, blue: 456};
    const validRgbMax: IRGBColor = {red: 255, green: 255, blue: 255};
    expect(service['validateRgb'](bigRgb)).toEqual(validRgbMax);

    const validRgb: IRGBColor = {red: 255, green: 0, blue: 123};
    expect(service['validateRgb'](validRgb)).toEqual(validRgb);
  });

  it('#valideHex should pad with 0 if hex is too short', () => {
    const shortHexA = '#';
    const shortHexB = '#1';
    const paddedHexA = '#000000';
    const paddedHexB = '#100000';
    expect(service.validateHex(shortHexA)).toEqual(paddedHexA);
    expect(service.validateHex(shortHexB)).toEqual(paddedHexB);
  });

  it('#valideHex should send white if string is not a hex', () => {
    const validHex = '#123123';
    const invalidHex = 'fml';
    const defaultHex = '#ffffff';
    expect(service.validateHex(validHex)).toEqual(validHex);
    expect(service.validateHex(invalidHex)).toEqual(defaultHex);
  });

  it ('#setFillTransparency should set fill transparency when given a number', () => {
    const transparency = 50;
    service.setFillTransparency(transparency);
    service.currentFill.subscribe(async (fillTransparency: number) => {
      expect(fillTransparency).toBe(transparency);
    });
  });

  it ('#setOutlineTransparency should set outline transparency when given a number', () => {
    const transparency = 50;
    service.setOutlineTransparency(transparency);
    service.currentOutline.subscribe(async (outlineTransparency: number) => {
      expect(outlineTransparency).toBe(transparency);
    });
  });

  it('#updatePalette should call next of rgbValue and hexValue', () => {
    spyOn<any>(service['rgbValue'], 'next').and.callThrough();
    spyOn<any>(service['hexValue'], 'next').and.callThrough();
    const event: MouseEvent = new MouseEvent('mousedown', {clientX: 100, clientY: 100});
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = (canvas.getContext('2d') as CanvasRenderingContext2D);
    service.updatePalette(event, canvas, ctx);
    expect(service['rgbValue'].next).toHaveBeenCalled();
    expect(service['hexValue'].next).toHaveBeenCalled();
  });

});
