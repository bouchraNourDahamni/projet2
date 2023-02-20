import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IRGBColor } from '../../interfaces/RGBColor';
import { ColorService } from '../../services/color/color.service';
import { OperationHandlerService } from '../../services/operation-handler/operation-handler.service';
import { ChangeBackgroundColor } from '../../services/operation-handler/operations/change-background-color/change-background-color';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { SvgManagerService } from '../../services/svg-manager/svg-manager.service';

const PALETTE_IMAGE_PATH = 'assets/img/color.jpg';
const CANVAS_CONTEXT = '2d';

const CASE_ONE_COLOR_TYPE = 'primary';
const CASE_TWO_COLOR_TYPE = 'secondary';
const CASE_THREE_COLOR_TYPE = 'background';

@Component({
  selector: 'app-color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.scss'],
})

export class ColorDialogComponent implements AfterViewInit, OnInit {
  public url: string;
  public hexValue: string;
  public colorPreview: string;
  public colbox: any;
  public colors: string[];
  public hexMinLength: number;
  public hexMaxLength: number;
  public rgbValue: IRGBColor;

  private image: any;
  private canvas: any;
  private ctx: CanvasRenderingContext2D;
  private backgroundColor: string;

  @ViewChild('canvasval', {static: false}) public canvasval: ElementRef;
  @ViewChild('colboxval', {static: false}) public colboxval: any;
  @Output() public outputColor = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<ColorDialogComponent>,
    private colorService: ColorService,
    private shortcutManager: ShortcutManagerService,
    private svgManager: SvgManagerService,
    private operationManager: OperationHandlerService) {
      this.image = new Image();
  }

  public ngAfterViewInit(): void {
    this.canvas = this.canvasval.nativeElement;
    this.ctx = this.canvas.getContext(CANVAS_CONTEXT);
    this.image.onload = (() =>
      this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height));
    this.image.src = PALETTE_IMAGE_PATH;
  }

  public ngOnInit(): void {
    this.colorService.currentColorArray.subscribe((colorArray: string[]) => {
      this.colors = colorArray;
    });
    this.colorService.currentHexValue.subscribe((hexValue: string) => {
      this.hexValue = hexValue;
      this.colorPreview = hexValue;
    });
    this.colorService.currentRgbValue.subscribe((newRgb: IRGBColor) => {
      this.rgbValue = newRgb;
    });
    this.svgManager.currentBackground.subscribe((newBackground: string) =>  {
      this.backgroundColor = newBackground;
    });
  }

  public updatePalette(event: MouseEvent): void {
    this.colorService.updatePalette(event, this.canvas, this.ctx);
  }

  public updateRgb(): void {
    this.colorService.updateRgb(this.rgbValue);
  }

  public updateHex(): void {
    this.colorService.updateHex(this.hexValue);
    this.colorPreview = this.colorService.validateHex(this.hexValue);
  }

  public selectColor(color: string): void {
    this.hexValue = color;
    this.colorPreview = color;
    this.colorService.updateHex(color);
  }

  private closeDialog(): void {
    this.shortcutManager.shortcutBlocked = false;
    this.dialogRef.close();
  }

  public saveColor(): void {
    this.chooseColorType();
    this.colorService.addRecentColor(this.colorService.validateHex(this.hexValue));
    this.closeDialog();
  }

  private chooseColorType(): void {
    const cleanHex = this.colorService.validateHex(this.hexValue);
    switch (this.colorService.chooseType) {
      case CASE_ONE_COLOR_TYPE:
        this.colorService.sendPrimaryColor(cleanHex);
        break;
      case CASE_TWO_COLOR_TYPE:
        this.colorService.sendSecondaryColor(cleanHex);
        break;
      case CASE_THREE_COLOR_TYPE:
        this.operationManager.addOperation(new ChangeBackgroundColor(this.backgroundColor, cleanHex, this.svgManager));
        this.colorService.sendBackgroundColor(this.colorService.validateHex(this.hexValue));
        this.svgManager.setBackgroundColor(this.colorService.validateHex(this.hexValue));
        break;
    }
  }
}
