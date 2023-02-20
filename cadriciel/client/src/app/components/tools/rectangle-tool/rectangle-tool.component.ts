import { Component } from '@angular/core';
import { ToolAttributesService } from '../../../services/tools/tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../enums/shape-modes';
import { ShapeOutlines } from './../../../enums/shape-outlines';

const MIN_SLIDER_VALUE = 1;
const MAX_SLIDER_VALUE = 10;
const SLIDER_TICK_INTERVAL = 1;

@Component({
  selector: 'app-rectangle-tool',
  templateUrl: './rectangle-tool.component.html',
  styleUrls: ['./rectangle-tool.component.scss'],
})

export class RectangleToolComponent {
  public minSliderValue: number;
  public maxSliderValue: number;
  public sliderTickInterval: number;
  public width: number;
  public activeType: string;
  public activeMode: string;

  public allTypes: ShapeOutlines[];
  public allModes: ShapeModes[];

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderValue = MIN_SLIDER_VALUE;
    this.maxSliderValue = MAX_SLIDER_VALUE;
    this.sliderTickInterval = SLIDER_TICK_INTERVAL;

    this.allTypes = [ShapeOutlines.Default, ShapeOutlines.Round, ShapeOutlines.Dash];
    this.allModes = [ShapeModes.Outline, ShapeModes.Full, ShapeModes.Both];
    this.toolAttributes.currentLineWidth.subscribe((width: number) => {
      this.width = width;
    });

    this.toolAttributes.currentOutlineMode.subscribe((newTexture: string) => {
      this.activeType = newTexture;
    });
    this.toolAttributes.currentMode.subscribe((newMode: string) => {
      this.activeMode = newMode;
    });
  }

  public setLinewidth(linewidth: number): void {
    this.toolAttributes.setLineWidth(linewidth);
  }

  public setLineTexture(lineTexture: string): void {
    this.toolAttributes.setLineTexture(lineTexture);
  }

  public setMode(mode: string): void {
    this.toolAttributes.setMode(mode);
  }
}
