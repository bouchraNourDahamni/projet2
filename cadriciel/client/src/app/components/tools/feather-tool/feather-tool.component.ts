import { Component } from '@angular/core';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';

const MIN_SLIDER_LENGTH_VALUE = 1;
const MAX_SLIDER_LENGTH_VALUE = 10;
const SLIDER_LENGTH_TICK_INTERVAL = 1;
const SLIDER_ANGLE_STEP = 0.1;
const MIN_SLIDER_ANGLE_VALUE = 0;
const MAX_SLIDER_ANGLE_VALUE = 360;
const SLIDER_ANGLE_TICK_INTERVAL = 45;

@Component({
  selector: 'app-feather-tool',
  templateUrl: './feather-tool.component.html',
  styleUrls: ['./feather-tool.component.scss'],
})
export class FeatherToolComponent {

  public minLengthSliderValue: number;
  public maxLengthSliderValue: number;
  public sliderTickInterval: number;
  public length: number;

  public minScaleSliderValue: number;
  public maxScaleSliderValue: number;
  public sliderAngleTickInterval: number;
  public sliderAngleStep: number;
  public angle: number;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minLengthSliderValue = MIN_SLIDER_LENGTH_VALUE;
    this.maxLengthSliderValue = MAX_SLIDER_LENGTH_VALUE;
    this.sliderTickInterval = SLIDER_LENGTH_TICK_INTERVAL;

    this.minScaleSliderValue = MIN_SLIDER_ANGLE_VALUE;
    this.maxScaleSliderValue = MAX_SLIDER_ANGLE_VALUE;
    this.sliderAngleTickInterval = SLIDER_ANGLE_TICK_INTERVAL;
    this.sliderAngleStep = SLIDER_ANGLE_STEP;

    this.toolAttributes.currentFeatherLength.subscribe((length: number) => {
      this.length = length;
    });
    this.toolAttributes.currentAngle.subscribe((angle: number) => {
      this.angle = angle;
    });
  }

  public setFeatherLength(featherLength: number): void {
    this.toolAttributes.setFeatherLength(featherLength);
  }

  public setAngle(angle: number): void {
    this.toolAttributes.setAngle(angle);
  }

}
