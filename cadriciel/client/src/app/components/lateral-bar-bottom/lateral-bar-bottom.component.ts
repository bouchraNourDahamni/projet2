import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { SvgManagerService } from '../../services/svg-manager/svg-manager.service';
import { AlertResponseComponent } from '../alert-response/alert-response.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing.component';
import { NewDrawingComponent } from '../new-drawing/new-drawing.component';
import { OpenLocalDrawingComponent } from '../open-local-drawing/open-local-drawing.component';
import { OpenServerDrawingComponent } from '../open-server-drawing/open-server-drawing.component';
import { SaveComponent } from '../save/save.component';
import { UserGuideComponent } from '../user-guide/user-guide.component';

const DIALOG_HEIGHT = '500px';
const DIALOG_WIDTH = '800px';
const NEW_DRAWING_SHORTCUT = 'o';
const SAVE_DRAWING_SHORTCUT = 's';
const VIEW_GALLERY_SHORTCUT = 'g';
const EXPORT_DRAWING_SHORTCUT = 'e';
const NEW_DRAWING_WIDTH = '460px';
const ALERT_NEW_DRAWING = 'By creating a new drawing, you will lose unsaved modifications. \n Are you sure you want to continue?';

@Component({
  selector: 'app-lateral-bar-bottom',
  templateUrl: './lateral-bar-bottom.component.html',
  styleUrls: ['./lateral-bar-bottom.component.scss'],
})

export class LateralBarBottomComponent {

  constructor(
    private dialog: MatDialog,
    private svgManager: SvgManagerService,
    private shortcutManager: ShortcutManagerService) { }

  @HostListener('window:keydown', ['$event'])
  public openNewDrawingKeyboard(event: KeyboardEvent): void {
    if (event.ctrlKey && !this.shortcutManager.shortcutBlocked) {
      event.preventDefault();
      switch (event.key) {
        case NEW_DRAWING_SHORTCUT: {
          this.openNewDrawing();
          break;
        }
        case SAVE_DRAWING_SHORTCUT: {
          this.save();
          break;
        }
        case VIEW_GALLERY_SHORTCUT: {
          this.openDrawing();
          break;
        }
        case EXPORT_DRAWING_SHORTCUT: {
          this.exportDrawing();
          break;
        }
      }
    }
  }

  private openNewDrawing(): void {
    if (this.svgManager.hasBeenModified) {
      const dialogRef = this.dialog.open(AlertResponseComponent, {
        data: ALERT_NEW_DRAWING,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialog.open(NewDrawingComponent, {
            width: NEW_DRAWING_WIDTH,
            disableClose: true,
          });
        }
      });
    } else {
      this.dialog.open(NewDrawingComponent, {
        width: NEW_DRAWING_WIDTH,
        disableClose: true,
      });
    }
    this.shortcutManager.shortcutBlocked = true;
  }

  public openDrawing(): void {
    this.dialog.open(OpenServerDrawingComponent, { disableClose: true });
    this.shortcutManager.shortcutBlocked = true;
  }

  public openLocalDrawing(): void {
    this.dialog.open(OpenLocalDrawingComponent, { disableClose: true });
    this.shortcutManager.shortcutBlocked = true;
  }

  public save(): void {
    this.dialog.open(SaveComponent, { disableClose: true });
    this.shortcutManager.shortcutBlocked = true;
  }

  public exportDrawing(): void {
    this.dialog.open(ExportDrawingComponent, { disableClose: true });
    this.shortcutManager.shortcutBlocked = true;
  }

  public openUserGuide(): void {
    this.dialog.open(UserGuideComponent, {
      width: DIALOG_WIDTH,
      height: DIALOG_HEIGHT,
      disableClose: true});
    this.shortcutManager.shortcutBlocked = true;
  }
}
