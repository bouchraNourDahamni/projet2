import { Component } from '@angular/core';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';
import { ShapeModes } from './../../../enums/shape-modes';
import { ShapeOutlines } from './../../../enums/shape-outlines';

const MIN_SLIDER_LINEWIDTH_VALUE = 1;
const MAX_SLIDER_LINEWIDTH_VALUE = 10;
const SLIDER_TICK_LINEWIDTH_INTERVAL = 1;

const MIN_SLIDER_SIDES_VALUE = 3;
const MAX_SLIDER_SIDES_VALUE = 12;
const SLIDER_TICK_SIDES_INTERVAL = 1;

@Component({
  selector: 'app-polygon-tool',
  templateUrl: './polygon-tool.component.html',
  styleUrls: ['./polygon-tool.component.scss'],
})
export class PolygonToolComponent {
  public minSliderLinewidthValue: number;
  public maxSliderLinewidthValue: number;
  public sliderTickLinewidthInterval: number;
  public minSliderSidesValue: number;
  public maxSliderSidesValue: number;
  public sliderTickSidesInterval: number;
  public width: number;

  public allTypes: ShapeOutlines[];
  public allModes: ShapeModes[];

  public activeType: string;
  public activeMode: string;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderLinewidthValue = MIN_SLIDER_LINEWIDTH_VALUE;
    this.maxSliderLinewidthValue = MAX_SLIDER_LINEWIDTH_VALUE;
    this.sliderTickLinewidthInterval = SLIDER_TICK_LINEWIDTH_INTERVAL;
    this.minSliderSidesValue = MIN_SLIDER_SIDES_VALUE;
    this.maxSliderSidesValue = MAX_SLIDER_SIDES_VALUE;
    this.sliderTickSidesInterval = SLIDER_TICK_SIDES_INTERVAL;
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
    this.toolAttributes.setOutlineMode(lineTexture);
  }

  public setMode(mode: string): void {
    this.toolAttributes.setMode(mode);
  }

  public setSides(side: number): void {
    this.toolAttributes.setSides(side);
  }
}
