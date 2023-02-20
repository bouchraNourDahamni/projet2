import { Component } from '@angular/core';
import { ToolAttributesService } from 'src/app/services/tools/tool-attributes/tool-attributes.service';

const MIN_SLIDER_SPRAY_VALUE = 100;
const MAX_SLIDER_SPRAY_VALUE = 300;

const SLIDER_SPRAY_INTERVAL = 1;

const MIN_SLIDER_DIAMETER_VALUE = 20;
const MAX_SLIDER_DIAMETER_VALUE = 50;

const SLIDER_DIAMETER_INTERVAL = 1;

@Component({
  selector: 'app-aerosol-tool',
  templateUrl: './aerosol-tool.component.html',
  styleUrls: ['./aerosol-tool.component.scss'],
})
export class AerosolToolComponent {

  public minSpraySliderValue: number;
  public maxSpraySliderValue: number;
  public sliderSprayInterval: number;
  public sprayPerSecond: number;

  public minDiameterSliderValue: number;
  public maxDiameterSliderValue: number;
  public sliderDiameterInterval: number;
  public diameter: number;

  constructor(private toolAttributes: ToolAttributesService) {
    this.minSpraySliderValue = MIN_SLIDER_SPRAY_VALUE;
    this.maxSpraySliderValue = MAX_SLIDER_SPRAY_VALUE;
    this.sliderSprayInterval = SLIDER_SPRAY_INTERVAL;

    this.minDiameterSliderValue = MIN_SLIDER_DIAMETER_VALUE;
    this.maxDiameterSliderValue = MAX_SLIDER_DIAMETER_VALUE;
    this.sliderDiameterInterval = SLIDER_DIAMETER_INTERVAL;

    this.toolAttributes.currentSprayPerSecond.subscribe((sprayPerSecond: number) => {
      this.sprayPerSecond = sprayPerSecond;
    });
    this.toolAttributes.currentSprayDiameter.subscribe((diameter: number) => {
      this.diameter = diameter;
    });

  }

  public setSprayPerSecond(sprayPerSecond: number): void {
    this.toolAttributes.setSprayPerSecond(sprayPerSecond);
  }

  public setSprayDiameter(diameter: number): void {
    this.toolAttributes.setSprayDiameter(diameter);
  }
}
