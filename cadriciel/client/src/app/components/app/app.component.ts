import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { AvailableSpaceService } from '../../services/available-space/available-space.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { EntryDialogComponent } from '../entry-dialog/entry-dialog.component';
import { EntryDialogService } from './../../services/entry-dialog/entry-dialog.service';

const DIALOG_WIDTH = '550px';
const CHECKED_VALUE = 'checkedValue';
const NOT_CHECKED = 'notChecked';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  public result: string | null;
  public message: BehaviorSubject<string>;
  public openUserGuide: boolean;
  public showHtmlDiv: boolean ;

  constructor(
    private dimensionService: AvailableSpaceService,
    private dialog: MatDialog,
    private shortcutManager: ShortcutManagerService,
    private entryDialogService: EntryDialogService) {
      this.result =  window.localStorage.getItem(CHECKED_VALUE);
      if (this.result === null ) {
        this.result = NOT_CHECKED;
      }
      this.openUserGuide = false ;
      this.showHtmlDiv = true ;
  }

  @ViewChild('workspace', {static: false}) public elementView: ElementRef;
  public ngAfterViewInit(): void {
    this.showUserguide();
    this.dimensionService.setHeight(this.elementView.nativeElement.offsetHeight);
    this.dimensionService.setWidth(this.elementView.nativeElement.offsetWidth);
    if (this.result === NOT_CHECKED) {
      this.openDialog();
    }
  }

  public openDialog(): void {
    this.dialog.open(EntryDialogComponent , {
      width: DIALOG_WIDTH,
      disableClose: true,
    });
    this.result = this.entryDialogService.checked;
    this.shortcutManager.shortcutBlocked = true;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.dimensionService.setHeight(this.elementView.nativeElement.offsetHeight);
    console.log('this is the height ' , this.elementView.nativeElement.offsetHeight);
    console.log('this is the height ' , this.elementView.nativeElement.offsetWidth);
    this.dimensionService.setWidth(this.elementView.nativeElement.offsetWidth);
  }

  public showUserguide(): void {
   this.dimensionService.showUserGuide.subscribe((showUserGuide) => {
     if (showUserGuide) {
     this.openUserGuide = showUserGuide;
     this.showHtmlDiv = false ;
     this.showHtmlDiv = false ;
     } else {
       this.showHtmlDiv = true ;
       this.showHtmlDiv = true ;
       this.openUserGuide = showUserGuide;
     }
   });
  }
}
