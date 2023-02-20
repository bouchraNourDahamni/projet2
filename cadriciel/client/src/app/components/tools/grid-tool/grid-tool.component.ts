import { Component, OnInit } from '@angular/core';
import { GridService } from 'src/app/services/tools/grid/grid.service';

const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 500;
const SLIDER_TICK_INTERVAL = 0.5;
const MIN_TRANSPARENCY = 0.2;
const MAX_TRANSPARENCY = 1;
const SLIDER_TICK_INTERVAL_TRANSPARENCY = 0.1;

@Component({
  selector: 'app-grid-tool',
  templateUrl: './grid-tool.component.html',
  styleUrls: ['./grid-tool.component.scss'],
})

export class GridToolComponent implements OnInit {

  public gridIsVisible: boolean;
  public minSliderValue: number;
  public maxSliderValue: number;
  public sliderTickInterval: number;
  public sliderTickIntervalTransparency: number;
  public minSliderValueTrasparency: number;
  public maxSliderValueTransparency: number;
  public sliderStepValue: number;
  public grid: number;

  constructor(private gridService: GridService) {
    this.minSliderValue = MIN_GRID_SIZE;
    this.maxSliderValue = MAX_GRID_SIZE;
    this.sliderTickInterval = SLIDER_TICK_INTERVAL;
    this.maxSliderValueTransparency = MAX_TRANSPARENCY;
    this.minSliderValueTrasparency = MIN_TRANSPARENCY;
    this.sliderTickIntervalTransparency = SLIDER_TICK_INTERVAL_TRANSPARENCY;
    this.sliderStepValue = SLIDER_TICK_INTERVAL_TRANSPARENCY;
  }

  public ngOnInit(): void {
    this.gridService.isVisible.subscribe((isVisible: boolean) => {
      this.gridIsVisible = isVisible;
    });
    this.gridService.currentGridSize.subscribe((gridSize: number) => {
      this.grid = gridSize;
    });
  }

  public onToggleGrid(): void {
    this.gridService.toggleGrid();
  }

  public setSize(size: number): void {
    this.gridService.setGridSize(size);
  }

  public setTransparency(transparency: number): void {
    this.gridService.setTransparency(transparency);
  }

}
