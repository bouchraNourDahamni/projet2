import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { NewDrawingComponent } from '../new-drawing/new-drawing.component';

@Component({
  selector: 'app-alert-response',
  templateUrl: './alert-response.component.html',
  styleUrls: ['./alert-response.component.scss'],
})
export class AlertResponseComponent {

  public message: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<AlertResponseComponent>,
    private dialog: MatDialog,
    private shortcutManager: ShortcutManagerService) {
      this.message = data;
  }

  private closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public createDrawing(): void {
    this.closeDialog();
    this.dialog.open(NewDrawingComponent, { disableClose: true });
    this.shortcutManager.shortcutBlocked = true;
  }

  @HostListener('window:keydown.enter', ['$event'])
  public confirm(): void {
    this.createDrawing();
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
