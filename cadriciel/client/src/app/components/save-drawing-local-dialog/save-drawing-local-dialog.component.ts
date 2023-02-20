import { Component, HostListener } from '@angular/core';
import { FormControl , FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ImageLocalService } from '../../services/image-local/image-local.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
const NAME_CONTROL = 'nameControl';
const EMPTY_STRING = '';

@Component({
  selector: 'app-save-drawing-local',
  templateUrl: './save-drawing-local-dialog.component.html',
  styleUrls: ['./save-drawing-local-dialog.component.scss'],
})
export class SaveDrawingLocalDialogComponent {

  public imageForm: FormGroup;
  public nameControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<SaveDrawingLocalDialogComponent>,
    private imageLocalService: ImageLocalService,
    private shortcutManager: ShortcutManagerService) {
      this.imageForm = new FormGroup({
        nameControl: new FormControl(EMPTY_STRING, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      });
    }

  private closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public saveDrawingLocal(): void {
    this.nameControl = this.imageForm.get(NAME_CONTROL) as FormControl;
    if (this.nameControl.valid) {
      this.imageLocalService.saveImage(this.nameControl.value);
      this.closeDialog();
    }
  }
  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
