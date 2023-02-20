import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ITags } from 'src/app/interfaces/filter';
import { ImageServerService } from '../../services/image-server/image-server.service';
import { ImageService } from '../../services/Image/image.service';
import { SendHttpRequest } from '../../services/send-http-request/send-http-request.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
const TAG_CONTROL = 'tagControl';
const NAME_CONTROL = 'nameControl';
const TAGS_CONTROL = 'tagsControl';
const MIN_LENGHT = 3;
const MAX_LENGHT = 10;
const MAX_LENGHT_NAME = 20 ;
const EMPTY_STRING = '';

@Component({
  selector: 'app-save-drawing-dialog',
  templateUrl: './save-drawing-server-dialog.component.html',
  styleUrls: ['./save-drawing-server-dialog.component.scss'],
})
export class SaveDrawingServerDialogComponent {

  public name: string;
  public tagsControl: FormControl;
  public tagControl: FormControl;
  public nameControl: FormControl;
  public imageForm: FormGroup;
  public tagList: string[];
  public serverTags: ITags[];
  public innerHtml: string;
  public imageReturn: string;
  public tagInnerHtml: string;
  public submitted = false;

  constructor(
    private dialogRef: MatDialogRef<SaveDrawingServerDialogComponent>,
    public imageServerService: ImageServerService,
    public imageService: ImageService,
    public sendHttpRequest: SendHttpRequest,
    private shortCutManager: ShortcutManagerService) {
    this.tagList = [];
    this.sendHttpRequest.getTagList().subscribe((tagList) => {
      this.tagList = tagList;
    });
    this.imageForm = new FormGroup({
      tagsControl: new FormControl(),
      tagControl: new FormControl('', [Validators.minLength(MIN_LENGHT), Validators.maxLength( MAX_LENGHT )]),
      nameControl: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGHT), Validators.maxLength(MAX_LENGHT_NAME)]),
    });
    this.tagsControl = this.imageForm.get(TAGS_CONTROL) as FormControl;
    this.tagsControl.setValue([]);
  }

  public saveDrawingServer(): void {
    this.nameControl = this.imageForm.get(NAME_CONTROL) as FormControl;
    if (this.nameControl.valid) {
      this.imageServerService.sendImageToServer(this.nameControl.value as string, this.tagsControl.value);
      this.closeDialog();
    }
  }

  private closeDialog(): void {
    this.dialogRef.close();
    this.shortCutManager.shortcutBlocked = false;
  }

  public addTag(): void {
    this.tagControl = this.imageForm.get(TAG_CONTROL) as FormControl;
    if (!this.tagList.includes(this.tagControl.value)) {
      this.tagList.push(this.tagControl.value);
    }
    if (this.tagControl.valid) {
      const tags = new Set();
      tags.add(this.tagControl.value);
      for (const value of this.tagsControl.value) {
        tags.add(value);
      }
      this.tagsControl.setValue(Array.from(tags));
      this.tagControl.setValue(EMPTY_STRING);
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  public exit(): void {
    this.closeDialog();
  }
}
