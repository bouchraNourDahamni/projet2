import { Component } from '@angular/core';
import { ToolAttributesService } from '../../../services/tools/tool-attributes/tool-attributes.service';
import { StampTextures } from './../../../services/tools/stamp/stamp-textures';

const MIN_SLIDER_WIDTH_VALUE = 0.0;
const MAX_SLIDER_WIDTH_VALUE = 1.0;
const SLIDER_WIDTH_TICK_INTERVAL = 10;
const SLIDER_ANGLE_TICK_INTERVAL = 45;
const SLIDER_TICK_INTERVAL = 0.1;

@Component({
  selector: 'app-stamp-tool',
  templateUrl: './stamp-tool.component.html',
  styleUrls: ['./stamp-tool.component.scss'],
})
export class StampToolComponent {
  public minSliderWidthValue: number;
  public maxSliderWidthValue: number;
  public sliderWidthTickInterval: number;
  public sliderAngleTickInterval: number;
  public sliderStepValue: number;
  public size: number;
  public stamp: string;

  public allTypes: string[] = [StampTextures.Stamp1, StampTextures.Stamp2, StampTextures.Stamp3,
                               StampTextures.Stamp4, StampTextures.Stamp5];

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderWidthValue = MIN_SLIDER_WIDTH_VALUE;
    this.maxSliderWidthValue = MAX_SLIDER_WIDTH_VALUE;
    this.sliderWidthTickInterval = SLIDER_WIDTH_TICK_INTERVAL;
    this.sliderAngleTickInterval = SLIDER_ANGLE_TICK_INTERVAL;
    this.sliderStepValue = SLIDER_TICK_INTERVAL;

    this.allTypes = [StampTextures.Stamp1, StampTextures.Stamp2, StampTextures.Stamp3,
                     StampTextures.Stamp4, StampTextures.Stamp5];

    this.toolAttributes.currentSize.subscribe((size: number) => {
      this.size = size;
    });
    this.toolAttributes.currentStampTexture.subscribe((stamp: string) => {
      this.stamp = stamp;
    });
  }

  public setSize(size: number): void {
    this.toolAttributes.setSize(size);
  }

  public setStampTexture(lineTexture: string): void {
    this.toolAttributes.setStampTexture(lineTexture);
  }
}
