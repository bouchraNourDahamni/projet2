import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileExtensions } from 'src/app/enums/file-extensions';
import { AlertComponent } from '../../components/alert/alert.component';
import { ImageService } from '../Image/image.service';

const ALERT_VALID_FILE = 'We can\'t open that type of File in PolyDrawing,\
                          we can just open the files that you have saved using PolyDrawing.';
const TEXT_TYPE = 'text';
const A_ELEMENT = 'a';
const EMTPY_STRING = '';

@Injectable({
  providedIn: 'root',
})
export class ImageLocalService {

  private fileContent: string;
  public validSvg: boolean;
  private fileReader: FileReader;

  constructor(
    private imageService: ImageService,
    private dialog: MatDialog) {
      this.fileContent = EMTPY_STRING;
      this.validSvg = false;
      this.fileReader = new FileReader();
  }

  public saveImage(name: string): void {
    // Pris de : https://stackoverflow.com/questions/48499087/file-save-functionality-in-angular
    const file = new Blob([this.imageService.image], { type: TEXT_TYPE });
    const link = document.createElement(A_ELEMENT);
    link.href = window.URL.createObjectURL(file);
    link.download = name + FileExtensions.SVG;
    link.click();
  }

  private openImage(): void {
    this.imageService.image = this.fileContent;
    this.imageService.alertChange();
  }

  public fileUploads(file: File): void {
    this.fileReader.onload = (event) => {
      this.fileContent = this.fileReader.result as string;
    };
    this.fileReader.onerror = (event) => {
      this.fileReader.abort();
    };
    if (file !== null) {
      this.fileReader.readAsText(file);
    }
  }

  public validImageContent(): void {
    // Pris de: https://github.com/sindresorhus/is-svg/blob/master/index.js
    const regex = /^\s*(?:<\?xml[^>]*>\s*)?(?:<!doctype svg[^>]*\s*(?:\[?(?:\s*<![^>]*>\s*)*\]?)*[^>]*>\s*)?(?:<svg[^>]*>[^]*<\/svg>|<svg[^/>]*\/\s*>)\s*$/i;
    this.validSvg = regex.test(this.fileContent);
    if (this.validSvg) {
      this.openImage();
    } else {
      this.dialog.open(AlertComponent, {
        data: ALERT_VALID_FILE,
        disableClose: true,
      });
    }
  }
}
