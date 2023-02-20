import { Component, HostListener, OnInit } from '@angular/core';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { OperationHandlerService } from '../../services/operation-handler/operation-handler.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { Tools } from './../../enums/tools';
import { shortcuts } from './tool-shortcuts';

@Component({
  selector: 'app-lateral-bar-top',
  templateUrl: './lateral-bar-top.component.html',
  styleUrls: ['./lateral-bar-top.component.scss'],
})

export class LateralBarTopComponent implements OnInit {
  public tool: Tools;
  public canUndo: boolean;
  public canRedo: boolean;

  constructor(
    private toolData: ToolSelectorService,
    private shortcutManager: ShortcutManagerService,
    private operationHandler: OperationHandlerService) {
      this.operationHandler.canUndo.subscribe((canUndo: boolean) => {
        this.canUndo = canUndo;
      });
      this.operationHandler.canRedo.subscribe((canRedo: boolean) => {
        this.canRedo = canRedo;
      });
  }

  public ngOnInit(): void {
    this.toolData.currentTool.subscribe((tool: Tools) => {
      this.tool = tool;
    });
  }

  public undo(): void {
    this.operationHandler.undo();
  }

  public redo(): void {
    this.operationHandler.redo();
  }

  private toolSelector(tool: Tools | undefined): void {
    this.toolData.setCurrentTool(tool);
  }

  @HostListener('window:keydown', ['$event'])
  public checkKeyboardPressed(event: KeyboardEvent): void {
    if (!this.shortcutManager.shortcutBlocked  && !event.ctrlKey && shortcuts.has(event.key)) {
      this.toolSelector(shortcuts.get(event.key));
    }
  }
}
