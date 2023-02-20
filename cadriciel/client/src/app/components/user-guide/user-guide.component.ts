import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
})
export class UserGuideComponent {

  constructor(private dialogRef: MatDialogRef<ExportDrawingComponent>,
              private shortcutManager: ShortcutManagerService) { }

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public closeUserGuide(): void {
    this.closeDialog();
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
