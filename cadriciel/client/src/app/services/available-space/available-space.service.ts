import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const SAFETY_MARGIN = 5;

@Injectable({
  providedIn: 'root',
})

export class AvailableSpaceService {

  private heightBehavior: BehaviorSubject<number>;
  private widthBehavior: BehaviorSubject<number>;
  public readonly width: Observable<number>;
  public readonly height: Observable<number>;
  public showUserGuideBehaviour: BehaviorSubject<boolean>;
  public showUserGuide: Observable<boolean>;

  constructor() {
    this.heightBehavior = new BehaviorSubject<number>(0);
    this.widthBehavior = new BehaviorSubject<number>(0);
    this.showUserGuideBehaviour = new BehaviorSubject<boolean>(false);
    this.showUserGuide = this.showUserGuideBehaviour.asObservable();
    this.width = this.widthBehavior.asObservable();
    this.height = this.heightBehavior.asObservable();
  }

  public setHeight(height: number): void {
    this.heightBehavior.next(height - SAFETY_MARGIN);
  }

  public setWidth(width: number): void {
    this.widthBehavior.next(width - SAFETY_MARGIN);
  }

  public getHeight(): Observable<number> {
    return this.height;
  }

  public getWidth(): Observable<number> {
    return this.width;
  }
}
