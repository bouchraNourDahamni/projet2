import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ImageLocalService } from '../../services/image-local/image-local.service';
import { ImageService } from '../../services/Image/image.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';

@Component({
  selector: 'app-open-local-drawing',
  templateUrl: './open-local-drawing.component.html',
  styleUrls: ['./open-local-drawing.component.scss'],
})
export class OpenLocalDrawingComponent {

  constructor(
    private dialogRef: MatDialogRef<OpenLocalDrawingComponent>,
    public imageLocalService: ImageLocalService,
    public imageService: ImageService,
    private shortcutManager: ShortcutManagerService) { }

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public filesUploads(files: FileList): void {
    this.imageLocalService.fileUploads(files.item(0) as File);
  }

  public openLocalDrawing(): void {
    this.imageLocalService.validImageContent();
    if (this.imageLocalService.validSvg && this.imageService.validDimension) {
      this.closeDialog();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
