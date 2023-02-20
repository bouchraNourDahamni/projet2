import { Component } from '@angular/core';
import { FormControl , FormGroup} from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { FileExtensions } from 'src/app/enums/file-extensions';
import { ExportDrawingService } from 'src/app/services/export-drawing/export-drawing.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
  public imageForm: FormGroup;
  public nameControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<ExportDrawingComponent>,
    private exportDrawingService: ExportDrawingService,
    private shortcutManager: ShortcutManagerService) {}

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public exportImage(imageName: string, format: FileExtensions): void {
    this.exportDrawingService.exportImage(imageName, format);
    this.closeDialog();
  }
}
