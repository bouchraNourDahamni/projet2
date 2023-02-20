import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { IRGBColor } from '../../interfaces/RGBColor';
import { AvailableSpaceService } from '../../services/available-space/available-space.service';
import { ColorService } from '../../services/color/color.service';
import { NewDrawingService } from '../../services/new-drawing/new-drawing.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { SvgManagerService } from '../../services/svg-manager/svg-manager.service';

const PALETTE_IMAGE_PATH = 'assets/img/color.jpg';
const CANVAS_CONTEXT = '2d';

@Component({
  selector: 'app-new-drawing',
  templateUrl: './new-drawing.component.html',
  styleUrls: ['./new-drawing.component.scss'],
})

export class NewDrawingComponent implements OnInit, AfterViewInit {

  public displays: boolean[];
  public url: string;
  public displayData: boolean;
  public displayCol: boolean;
  public colbox: any;
  public colors: string[];
  public hexMinLength: number;
  public hexMaxLength: number;
  public colorPreview: string;
  public height: number;
  public width: number;
  public hexValue: string;
  public rgbValue: IRGBColor;

  private image: any;
  private subH: Subscription;
  private subW: Subscription;
  private canvas: any;
  private ctx: CanvasRenderingContext2D;

  @ViewChild('canvasval', {static: false}) public canvasval: ElementRef;
  @ViewChild('colboxval', {static: false}) public colboxval: any;
  @Output() public outputColor = new EventEmitter();

  constructor(
    private dialogRef: MatDialogRef<NewDrawingComponent>,
    private availableSpace: AvailableSpaceService,
    private svgManager: SvgManagerService,
    private newDrawingService: NewDrawingService,
    private shortcutManager: ShortcutManagerService,
    private colorService: ColorService ) {
      this.image = new Image();
      this.displayData = true;
      this.displayCol = true;
      this.displays = [false, false, false];
  }

  public ngOnInit(): void {
    this.subH = this.availableSpace.getHeight().subscribe((newHeight: number) => {
      this.height = newHeight;
    });
    this.subW = this.availableSpace.getWidth().subscribe((newWidth: number) => {
      this.width = newWidth;
    });
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
    this.colorService.setDefaultBackground();
  }

  public ngAfterViewInit(): void {
    this.canvas = this.canvasval.nativeElement;
    this.ctx = this.canvas.getContext(CANVAS_CONTEXT);
    this.image.onload = (() =>
      this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height));
    this.image.src = PALETTE_IMAGE_PATH;
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

  private unsubDim(): void {
    this.subH.unsubscribe();
    this.subW.unsubscribe();
  }

  private closeDialog(): void {
    this.dialogRef.close();
    this.unsubDim();
    this.shortcutManager.shortcutBlocked = false;
  }

  public createDrawing(): void {
    this.svgManager.createDrawing(
      this.newDrawingService.validateDimension(this.height),
      this.newDrawingService.validateDimension(this.width),
      this.colorService.validateHex(this.hexValue));
    this.closeDialog();
  }

  @HostListener('window:keydown.enter', ['$event'])
  public confirm(): void {
    this.createDrawing();
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }

}
