import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {

  public message: string;

  constructor(
    private dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private shortcutManager: ShortcutManagerService) {
      this.message = data;
  }

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public createDrawing(): void {
    this.closeDialog();
    this.shortcutManager.shortcutBlocked = false;
  }

}
