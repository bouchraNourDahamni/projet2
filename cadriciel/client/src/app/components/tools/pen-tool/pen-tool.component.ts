import { Component } from '@angular/core';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';

const MIN_SLIDER_LINEWIDTH_MIN_VALUE = 1;
const MAX_SLIDER_LINEWIDTH_MIN_VALUE = 5;
const SLIDER_TICK_LINEWIDTH_MIN_INTERVAL = 1;

const MIN_SLIDER_LINEWIDTH_MAX_VALUE = 6;
const MAX_SLIDER_LINEWIDTH_MAX_VALUE = 10;
const SLIDER_TICK_LINEWIDTH_MAX_INTERVAL = 1;

@Component({
  selector: 'app-pen-tool',
  templateUrl: './pen-tool.component.html',
  styleUrls: ['./pen-tool.component.scss'],
})
export class PenToolComponent {

  public minSliderLinewidthMinValue: number;
  public maxSliderLinewidthMinValue: number;
  public sliderTickLinewidthMinInterval: number;
  public width: number;

  public minSliderLinewidthMaxValue: number;
  public maxSliderLinewidthMaxValue: number;
  public sliderTickLinewidthMaxInterval: number;
  public line: number;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderLinewidthMinValue = MIN_SLIDER_LINEWIDTH_MIN_VALUE;
    this.maxSliderLinewidthMinValue = MAX_SLIDER_LINEWIDTH_MIN_VALUE;
    this.sliderTickLinewidthMinInterval = SLIDER_TICK_LINEWIDTH_MIN_INTERVAL;

    this.minSliderLinewidthMaxValue = MIN_SLIDER_LINEWIDTH_MAX_VALUE;
    this.maxSliderLinewidthMaxValue = MAX_SLIDER_LINEWIDTH_MAX_VALUE;
    this.sliderTickLinewidthMaxInterval = SLIDER_TICK_LINEWIDTH_MAX_INTERVAL;

    this.toolAttributes.currentLineWidthMax.subscribe((lineWidthMax: number) => {
      this.line = lineWidthMax;
    });
    this.toolAttributes.currentLineWidthMin.subscribe((lineWidthMin: number) => {
      this.width = lineWidthMin;
    });
  }

  public setLineWidthMin(linewidthMin: number): void {
    this.toolAttributes.setLineWidthMin(linewidthMin);
  }

  public setLineWidthMax(linewidthMax: number): void {
    this.toolAttributes.setLineWidthMax(linewidthMax);
  }
}
