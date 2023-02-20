import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColorService } from '../../services/color/color.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ColorDialogComponent } from '../color-dialog/color-dialog.component';

const PRIMARY_COLOR_TYPE = 'primary';
const SECONDARY_COLOR_TYPE = 'secondary';
const BACKGROUND_COLOR_TYPE = 'background';
const MIN_SLIDER_OUTLINE_VALUE = 0;
const MAX_SLIDER_OUTLINE_VALUE = 100;
const MIN_SLIDER_FILL_VALUE = 0;
const MAX_SLIDER_FILL_VALUE = 100;
const SLIDER_TICK_OUTLINE_INTERVAL = 1;
const SLIDER_TICK_FILL_INTERVAL = 1;
const PERCENT_DIVIDER = 100;

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
})

export class ColorSelectorComponent implements OnInit {

  public primaryOpacity: number;
  public secondaryOpacity: number;
  public background: string;

  public minSliderFillTransparencyValue: number;
  public maxSliderFillTransparencyValue: number;
  public sliderTickFillTransparencyInterval: number;

  public minSliderOutlineTransparencyValue: number;
  public maxSliderOutlineTransparencyValue: number;
  public sliderTickOutlineTransparencyInterval: number;

  private primary: string;
  private secondary: string;

  constructor(
    private dialog: MatDialog,
    private colorService: ColorService,
    private shortcutManager: ShortcutManagerService) {
      this.maxSliderFillTransparencyValue = MAX_SLIDER_FILL_VALUE;
      this.minSliderFillTransparencyValue = MIN_SLIDER_FILL_VALUE;
      this.maxSliderOutlineTransparencyValue = MAX_SLIDER_OUTLINE_VALUE;
      this.minSliderOutlineTransparencyValue = MIN_SLIDER_OUTLINE_VALUE;
      this.sliderTickFillTransparencyInterval = SLIDER_TICK_FILL_INTERVAL;
      this.sliderTickOutlineTransparencyInterval = SLIDER_TICK_OUTLINE_INTERVAL;
   }

  public ngOnInit(): void {
    this.colorService.currentPrimaryColor.subscribe((selectedPrimaryColor: string) => {
      this.primary = selectedPrimaryColor;
    });
    this.colorService.currentSecondaryColor.subscribe((selectedSecondaryColor: string) => {
      this.secondary = selectedSecondaryColor;
    });
    this.colorService.currentBackground.subscribe((selectedColor: string) => {
      this.background = selectedColor;
    });
    this.colorService.currentFill.subscribe((fillOpacity: number) => {
      this.primaryOpacity = Math.round(fillOpacity * PERCENT_DIVIDER);
    });
    this.colorService.currentOutline.subscribe((outlineOpacity: number) => {
      this.secondaryOpacity = Math.round(outlineOpacity * PERCENT_DIVIDER);
    });
  }

  private openDialog(): void {
    this.shortcutManager.shortcutBlocked = true;
    this.dialog.open(ColorDialogComponent, { disableClose: true });
  }

  public openPrimaryColorModifier(): void {
    this.colorService.chooseType = PRIMARY_COLOR_TYPE;
    this.openDialog();
  }

  public openSecondaryColorModifier(): void {
    this.colorService.chooseType = SECONDARY_COLOR_TYPE;
    this.openDialog();
  }

  public openBackgroundColorModifier(): void {
    this.colorService.chooseType = BACKGROUND_COLOR_TYPE;
    this.openDialog();
  }

  public swapColors(): void {
    this.colorService.swapColors(this.primary, this.secondary);
  }

  public setFillTransparency(transparency: number): void {
    this.colorService.setFillTransparency(transparency / PERCENT_DIVIDER);
  }

  public setOutlineTransparency(transparency: number): void {
    this.colorService.setOutlineTransparency(transparency / PERCENT_DIVIDER);
  }
}
