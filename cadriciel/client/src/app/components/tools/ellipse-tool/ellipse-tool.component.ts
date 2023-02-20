import { Component } from '@angular/core';
import { ToolAttributesService } from '../../../services/tools/tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../enums/shape-modes';
import { ShapeOutlines } from './../../../enums/shape-outlines';

const MIN_SLIDER_VALUE = 1;
const MAX_SLIDER_VALUE = 10;
const SLIDER_TICK_INTERVAL = 1;

@Component({
  selector: 'app-ellipse-tool',
  templateUrl: './ellipse-tool.component.html',
  styleUrls: ['./ellipse-tool.component.scss'],
})
export class EllipseToolComponent {
  public minSliderValue = MIN_SLIDER_VALUE;
  public maxSliderValue = MAX_SLIDER_VALUE;
  public sliderTickInterval = SLIDER_TICK_INTERVAL;
  public width: number;

  public allTypes: ShapeOutlines[];
  public allModes: ShapeModes[];
  public activeType: string;
  public activeMode: string;

  constructor(private toolAttributes: ToolAttributesService) {
    this.allTypes = [ShapeOutlines.Default, ShapeOutlines.Dash];
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
