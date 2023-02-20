import { Component } from '@angular/core';
import { ToolAttributesService } from '../../../services/tools/tool-attributes/tool-attributes.service';

const MIN_SLIDER_VALUE = 1;
const MAX_SLIDER_VALUE = 10;
const SLIDER_TICK_INTERVAL = 1;

@Component({
  selector: 'app-pencil-tool',
  templateUrl: './pencil-tool.component.html',
  styleUrls: ['./pencil-tool.component.scss'],
})

export class PencilToolComponent {
  public minSliderValue: number;
  public maxSliderValue: number;
  public sliderTickInterval: number;
  public width: number;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderValue = MIN_SLIDER_VALUE;
    this.maxSliderValue = MAX_SLIDER_VALUE;
    this.sliderTickInterval = SLIDER_TICK_INTERVAL;
    this.toolAttributes.currentLineWidth.subscribe((width: number) => {
      this.width = width;
    });
  }

  public setLinewidth(linewidth: number): void {
    this.toolAttributes.setLineWidth(linewidth);
  }
}
