import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tools } from './../../../enums/tools';

@Injectable({
  providedIn: 'root',
})

export class ToolSelectorService {

  private toolSource: BehaviorSubject<Tools>;
  public currentTool: Observable<Tools>;

  constructor() {
    this.toolSource = new BehaviorSubject<Tools>(Tools.Pencil);
    this.currentTool = this.toolSource.asObservable();
  }

  public setCurrentTool(tool: Tools | undefined): void {
    if (tool) {
      this.toolSource.next(tool);
    }
  }
}
