import { Component } from '@angular/core';
import { ShapeModes } from 'src/app/enums/shape-modes';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';

const MIN_SLIDER_TOLERANCE_VALUE = 0;
const MAX_SLIDER_TOLERANCE_VALUE = 100;
const SLIDER_TICK_INTERVAL = 1;
const MIN_SLIDER_OUTLINE_VALUE = 1;
const MAX_SLIDER_OUTLINE_VALUE = 10;

@Component({
  selector: 'app-color-bucket-tool',
  templateUrl: './color-bucket-tool.component.html',
  styleUrls: ['./color-bucket-tool.component.css'],
})
export class ColorBucketToolComponent {

  public minSliderToleranceValue = MIN_SLIDER_TOLERANCE_VALUE;
  public maxSliderToleranceValue = MAX_SLIDER_TOLERANCE_VALUE;
  public sliderTickInterval = SLIDER_TICK_INTERVAL;
  public tolerance: number;
  public activeMode: string;

  public minSliderOutlineValue = MIN_SLIDER_OUTLINE_VALUE;
  public maxSliderOutlineValue = MAX_SLIDER_OUTLINE_VALUE;
  public width: number;

  public allModes: ShapeModes[];

  constructor(private toolAttributes: ToolAttributesService) {
    this.allModes = [ShapeModes.Outline, ShapeModes.Full, ShapeModes.Both];
    this.toolAttributes.currentMode.subscribe((newMode: string) => {
      this.activeMode = newMode;
    });
  }

  public setMode(mode: string): void {
    this.toolAttributes.setMode(mode);
  }

  public setColorTolerance(toleranceSlider: number): void {
    this.toolAttributes.setColorTolerance(toleranceSlider);
  }

  public setOutlineWidth(outlineWidthSlider: number): void {
    this.toolAttributes.setOutlineWidth(outlineWidthSlider);
  }

}
