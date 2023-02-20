import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShortcutManagerService {

  public shortcutBlocked: boolean;

  constructor() {
    this.shortcutBlocked = false;
  }
}
