import { Component } from '@angular/core';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';
import { LineModes } from './../../../services/tools/line/line-modes';
import { LineOutlines } from './../../../services/tools/line/line-outlines';

const MIN_SLIDER_LINEWIDTH_VALUE = 1;
const MAX_SLIDER_LINEWIDTH_VALUE = 10;
const SLIDER_TICK_LINEWIDTH_INTERVAL = 1;

const MIN_SLIDER_VERTICES_VALUE = 5;
const MAX_SLIDER_VERTICES_VALUE = 50;
const SLIDER_TICK_VERTICES_INTERVAL = 1;

@Component({
  selector: 'app-line-tool',
  templateUrl: './line-tool.component.html',
  styleUrls: ['./line-tool.component.scss'],
})
export class LineToolComponent {
  public minSliderLinewidthValue: number;
  public maxSliderLinewidthValue: number;
  public sliderTickLinewidthInterval: number;

  public minSliderVerticesValue: number;
  public maxSliderVerticesValue: number;
  public sliderTickVerticesInterval: number;
  public width: number;

  public allTypes: LineOutlines[];
  public allModes: LineModes[];
  public lineMode: string;

  public currentMode: string;
  public cornerMode: string;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSliderLinewidthValue = MIN_SLIDER_LINEWIDTH_VALUE;
    this.maxSliderLinewidthValue = MAX_SLIDER_LINEWIDTH_VALUE;
    this.sliderTickLinewidthInterval = SLIDER_TICK_LINEWIDTH_INTERVAL;

    this.minSliderVerticesValue = MIN_SLIDER_VERTICES_VALUE;
    this.maxSliderVerticesValue = MAX_SLIDER_VERTICES_VALUE;
    this.sliderTickVerticesInterval = SLIDER_TICK_VERTICES_INTERVAL;

    this.allTypes = [LineOutlines.Full, LineOutlines.Dot, LineOutlines.Dash];
    this.allModes = [LineModes.Sharp, LineModes.Round, LineModes.Vertice];

    this.toolAttributes.currentLineWidth.subscribe((width: number) => {
      this.width = width;
    });

    this.toolAttributes.currentLineMode.subscribe((line: string) => {
      this.lineMode = line;
    });

    this.toolAttributes.currentCornerMode.subscribe((corner: string) => {
      this.cornerMode = corner;
    });
  }

  public setLinewidth(linewidth: number): void {
    this.toolAttributes.setLineWidth(linewidth);
  }

  public setLineTexture(lineMode: string): void {
    this.toolAttributes.setLineMode(lineMode);
  }

  public setMode(mode: string): void {
    this.toolAttributes.setCornerMode(mode);
    this.currentMode = mode;
  }

  public setVertexRadius(vertexRadius: string): void {
    this.toolAttributes.setVerticesRadius(vertexRadius);
  }
}
