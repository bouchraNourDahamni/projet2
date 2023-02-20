import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ImageService } from 'src/app/services/Image/image.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { IImageDelete } from '../../interfaces/image-delete';
import { ISVGImage } from '../../interfaces/SVGImage';
import { ImageServerService } from '../../services/image-server/image-server.service';
import { SendHttpRequest } from '../../services/send-http-request/send-http-request.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
const ALERT_IMAGE_TAG = 'We can\'t find prictures with that tag!';
const EMPTY_ARRAY = 0;
const IMAGE_DELETED = 'you image was deleted succefuly ';
const TAG_CONTROL = 'tagControl';
const TAGS_CONTROL = 'tagsControl';
const EMPTY_STRING = '';

@Component({
  selector: 'app-open-server-drawing',
  templateUrl: './open-server-drawing.component.html',
  styleUrls: ['./open-server-drawing.component.scss'],
})
export class OpenServerDrawingComponent implements OnInit {

  public filterChoice: string;
  public imageTagRefs: ElementRef[];
  public loading: boolean;
  private svgImageGet: ISVGImage;
  private dialog: MatDialog;
  public drawingToRenderer: ISVGImage[];
  public tagForm: FormGroup;
  private tagControl: FormControl;
  public tagList: string[];
  public tagsControl: FormControl;

  constructor(
    private dialogRef: MatDialogRef<OpenServerDrawingComponent>,
    public sendHttpRequest: SendHttpRequest,
    private imageService: ImageService,
    private shortcutManager: ShortcutManagerService,
    private imageServerService: ImageServerService) {
    this.drawingToRenderer = [];
    this.tagList = [];
    this.loading = true;
    this.tagForm = new FormGroup({
      tagControl: new FormControl(EMPTY_STRING, [Validators.minLength(3), Validators.maxLength(10)]),
      tagsControl: new FormControl(),
    });
    this.tagsControl = this.tagForm.get(TAGS_CONTROL) as FormControl;
    this.tagsControl.setValue([]);
  }

  public ngOnInit(): void {
    this.fetchDrawing();
  }

  public fetchDrawing(): void {
    this.sendHttpRequest.fetchDrawing().subscribe((imageReceivedArray: ISVGImage[]) => {
      if (imageReceivedArray.length !== EMPTY_ARRAY) {
        this.loading = false;
        this.imageServerService.imagesReceived = imageReceivedArray;
        this.imageServerService.rendererImagesServer();
        this.drawingToRenderer = this.imageServerService.drawingToRenderer;
      }
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
    this.shortcutManager.shortcutBlocked = false;
  }

  public deleteDrawing(): void {
    this.sendHttpRequest.deleteDrawing(this.svgImageGet.imageName).subscribe((data: IImageDelete) => {
      this.dialog.open(AlertComponent, {
        data: IMAGE_DELETED,
      });
      this.imageServerService.resetDrawings();
      this.fetchDrawing();
    });
  }

  public openDrawing(): void {
    this.imageService.image = this.svgImageGet.image;
    this.imageService.alertChange();
    this.closeDialog();
  }

  public sendFilterChoice(): void {
    this.sendHttpRequest.sendFilterChoice(this.tagsControl.value).subscribe((imageReceived) => {
      if (imageReceived.length === EMPTY_ARRAY) {
        this.dialog.open(AlertComponent, {
          data: ALERT_IMAGE_TAG,
          disableClose: true,
        });
      }
      this.imageServerService.resetDrawings();
      this.imageServerService.imagesReceived = imageReceived;
      this.imageServerService.rendererImagesServer();
      this.drawingToRenderer = this.imageServerService.drawingToRenderer;
    });
  }

  public unfilter(): void {
    this.fetchDrawing();
  }

  public getImage(i: ISVGImage): void {
    this.svgImageGet = i;
  }

  public addTag(): void {
    this.tagControl = this.tagForm.get(TAG_CONTROL) as FormControl;
    if (this.tagControl.valid) {
      if (!this.tagList.includes(this.tagControl.value)) {
        this.tagList.push(this.tagControl.value);
      }
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
