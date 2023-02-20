import { Component, OnInit } from '@angular/core';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { Tools } from './../../enums/tools';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.scss'],
})
export class PannelComponent implements OnInit {
  public tool: Tools;

  constructor(private toolData: ToolSelectorService) { }

  public ngOnInit(): void {
    this.setTool();
  }

  public setTool(): void {
    this.toolData.currentTool.subscribe((tool: Tools) => {
      this.tool = tool;
    });
  }
}
