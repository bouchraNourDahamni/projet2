import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { SaveDrawingLocalDialogComponent } from '../save-drawing-local-dialog/save-drawing-local-dialog.component';
import { SaveDrawingServerDialogComponent } from '../save-drawing-server-dialog/save-drawing-server-dialog.component';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss'],
})
export class SaveComponent {

  constructor(
    private dialogRef: MatDialogRef<SaveComponent>,
    private dialog: MatDialog,
    private shortCutManager: ShortcutManagerService) { }

  public closeDialog() {
    this.dialogRef.close();
    this.shortCutManager.shortcutBlocked = false;
  }

  public openSaveServer(): void {
    this.closeDialog();
    this.dialog.open(SaveDrawingServerDialogComponent, { disableClose: true });
    this.shortCutManager.shortcutBlocked = true;
  }

  public openSaveLocal(): void {
    this.closeDialog();
    this.dialog.open(SaveDrawingLocalDialogComponent, { disableClose: true });
    this.shortCutManager.shortcutBlocked = true;
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
