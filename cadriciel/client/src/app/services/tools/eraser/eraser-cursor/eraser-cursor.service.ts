import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IEraserCursorAttributes } from './../../../../interfaces/eraser-cursor';

const DEFAULT_CURSOR_ATTRIBUTES: IEraserCursorAttributes = {left: 0, top: 0, marginLeft: 0, marginTop: 0, width: 0, height: 0 };
const DEFAULT_SIZE = 5;

@Injectable({
  providedIn: 'root',
})
export class EraserCursorService {

  private eraserCursorAttributesSource: BehaviorSubject<IEraserCursorAttributes>;
  private sizeSource: BehaviorSubject<number>;
  public currentEraserCursorAttributes: Observable<IEraserCursorAttributes>;
  public currentSize: Observable<number>;

  constructor() {
    this.eraserCursorAttributesSource = new BehaviorSubject(DEFAULT_CURSOR_ATTRIBUTES);
    this.sizeSource = new BehaviorSubject(DEFAULT_SIZE);
    this.currentEraserCursorAttributes = this.eraserCursorAttributesSource.asObservable();
    this.currentSize = this.sizeSource.asObservable();
  }

  public setEraserCursorAttributes(attributes: IEraserCursorAttributes): void {
    this.eraserCursorAttributesSource.next(attributes);
  }

  public setSize(size: number): void {
    this.sizeSource.next(size);
  }
}
