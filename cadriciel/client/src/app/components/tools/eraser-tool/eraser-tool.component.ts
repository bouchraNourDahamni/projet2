import { Component } from '@angular/core';
import { EraserCursorService } from 'src/app/services/tools/eraser/eraser-cursor/eraser-cursor.service';

const MIN_SLIDER_VALUE = 5;
const MAX_SLIDER_VALUE = 25;
const SLIDER_TICK_INTERVAL = 1;

@Component({
  selector: 'app-eraser-tool',
  templateUrl: './eraser-tool.component.html',
  styleUrls: ['./eraser-tool.component.scss'],
})
export class EraserToolComponent {

  public minSliderValue: number;
  public maxSliderValue: number;
  public sliderTickInterval: number;

  constructor(private toolAttributesService: EraserCursorService) {
    this.minSliderValue = MIN_SLIDER_VALUE;
    this.maxSliderValue = MAX_SLIDER_VALUE;
    this.sliderTickInterval = SLIDER_TICK_INTERVAL;
  }

  public setSize(size: number): void {
    this.toolAttributesService.setSize(size);
  }
}
