import { Injectable } from '@angular/core';
import { CheckFlags } from './check-flags';

const CHECKED_VALUE = 'checkedValue';

@Injectable({
  providedIn: 'root',
})
export class EntryDialogService {
  public checked: CheckFlags;

  constructor() {
    this.checked = CheckFlags.NotChecked;
  }

  public changeValue(): void {
    this.checked = (this.checked === CheckFlags.NotChecked) ? CheckFlags.Checked : CheckFlags.NotChecked;
    this.saveData();
  }

  public saveData(): void {
    window.localStorage.setItem(CHECKED_VALUE, this.checked);
  }
}
