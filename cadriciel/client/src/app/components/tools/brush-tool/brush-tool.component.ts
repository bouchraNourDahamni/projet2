import { Component } from '@angular/core';
import { ToolAttributesService } from '../../../services/tools/tool-attributes/tool-attributes.service';
import { BrushTextures } from './brush-textures';

const MIN_SLIDER_VALUE = 1;
const MAX_SLIDER_VALUE = 10;
const SLIDER_TICK_INTERVAL = 1;

@Component({
  selector: 'app-brush-tool',
  templateUrl: './brush-tool.component.html',
  styleUrls: ['./brush-tool.component.scss'],
})

export class BrushToolComponent {
  public minSliderValue: number;
  public maxSliderValue: number;
  public sliderTickInterval: number;
  public width: number;
  public lineTexture: string;

  public allTypes: BrushTextures[];

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderValue = MIN_SLIDER_VALUE;
    this.maxSliderValue = MAX_SLIDER_VALUE;
    this.sliderTickInterval = SLIDER_TICK_INTERVAL;
    this.allTypes = [BrushTextures.Texture1, BrushTextures.Texture2, BrushTextures.Texture3,
                     BrushTextures.Texture4, BrushTextures.Texture5];

    this.toolAttributes.currentLineWidth.subscribe((width: number) => {
      this.width = width;
    });
    this.toolAttributes.currentLineTexture.subscribe((lineTexture: string) => {
      this.lineTexture = lineTexture;
    });
  }

  public setLinewidth(linewidth: number): void {
    this.toolAttributes.setLineWidth(linewidth);
  }

  public setLineTexture(lineTexture: string): void {
    this.toolAttributes.setLineTexture(lineTexture);
  }
}
