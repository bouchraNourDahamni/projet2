import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertComponent } from '../../components/alert/alert.component';
import { IImageDelete } from '../../interfaces/image-delete';
import { ISVGImage } from '../../interfaces/SVGImage';

const DEFAULT_IMAGE = '';
const DEFAULT_IMAGE_NAME = '';
const Q = 'q';
const TEXT = 'text';
const SEMICOLON = ';';
const DEFAULT_IMAGE_TAG = ['tag', 'tag2'];
const ALERT = 'Can\'t connect to server!';
const URL_LOCAL_HOST_IMAGE = 'http://localhost:3000/api/image';
const URL_LOCAL_HOST_FILTER = 'http://localhost:3000/api/image/filter';
const URL_LOCAL_HOST_TAGS = 'http://localhost:3000/api/image/tags';
const URL_DELETE = 'http://localhost:3000/api/image/delete';
const DATA_BASE_URL = 'https://imagesbucketpolydessin.s3.ca-central-1.amazonaws.com/';

@Injectable({
  providedIn: 'root',
})

export class SendHttpRequest {
  private imageSvg: ISVGImage = { image: DEFAULT_IMAGE, imageName: DEFAULT_IMAGE_NAME, imageTags: DEFAULT_IMAGE_TAG };
  public imageToDelete: IImageDelete = { imageName: DEFAULT_IMAGE_NAME };
  constructor(private httpClient: HttpClient , private dialog: MatDialog) {}

  public sendHTML(image: string, name: string, tag: string[]): Observable<ISVGImage> {
    this.imageSvg.image = image;
    this.imageSvg.imageName = name;
    this.imageSvg.imageTags = tag;
    return this.httpClient.post<ISVGImage>(URL_LOCAL_HOST_IMAGE, this.imageSvg).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

  public fetchDrawing(): Observable<ISVGImage[]> {
    return this.httpClient.get<ISVGImage[]>(URL_LOCAL_HOST_IMAGE).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

  public sendFilterChoice(filterName: string[]): Observable<ISVGImage[]> {
    let params = new HttpParams();
    params = params.append(Q, filterName.join(SEMICOLON));
    return this.httpClient.get<ISVGImage[]>(URL_LOCAL_HOST_FILTER, {
      // tslint:disable-next-line: object-literal-shorthand
      params: params,
    }).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

  public getTagList(): Observable<string[]> {
    return this.httpClient.get<string[]>(URL_LOCAL_HOST_TAGS).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

  private alertUser(): void {
    this.dialog.open(AlertComponent, {
      data: ALERT,
      disableClose: true,
    });
  }

  public getImageFromCloud(key: string): Observable<string> {
    const url: string = DATA_BASE_URL + key;
    return this.httpClient.get(url, { responseType: TEXT }).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

  public deleteDrawing(imageName: string): Observable<IImageDelete> {
    this.imageToDelete.imageName = imageName;
    return this.httpClient.post<IImageDelete>(URL_DELETE, this.imageToDelete).pipe(catchError((error) => {
      this.alertUser();
      return throwError(error.message);
    }));
  }

}
