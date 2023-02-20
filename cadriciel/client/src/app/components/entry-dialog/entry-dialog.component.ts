import { Component, HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { EntryDialogService } from './../../services/entry-dialog/entry-dialog.service';

@Component({
  selector: 'app-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['./entry-dialog.component.scss'],
})

export class EntryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EntryDialogComponent>,
    private shortcutManager: ShortcutManagerService,
    private entryDialogService: EntryDialogService) { }

  public changeValue(): void {
    this.entryDialogService.changeValue();
  }

  public saveData(): void {
    this.entryDialogService.saveData();
  }

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
