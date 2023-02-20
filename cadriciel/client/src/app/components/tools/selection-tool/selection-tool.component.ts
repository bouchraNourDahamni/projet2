import { Component } from '@angular/core';
import { TranslationControlPoints } from 'src/app/enums/translation-control-points';
import { TranslationService } from 'src/app/services/tools/selection/selection-operation/translation/translation.service';
import { ClipboardService } from '../../../services/tools/selection/selection-operation/selection/clipboard/clipboard.service';
import { SelectionService } from '../../../services/tools/selection/selection-operation/selection/selection.service';

const DEFAULT_TRANSLATE_CONTROL_POINT = TranslationControlPoints.TopLeft;

@Component({
  selector: 'app-selection-tool',
  templateUrl: './selection-tool.component.html',
  styleUrls: ['./selection-tool.component.scss'],
})
export class SelectionToolComponent {

  public clipboardIsEmpty: boolean;
  public selectionIsEmpty: boolean;
  public magIsOn: boolean;
  public translateControlPoint: string;

  constructor(
    private selection: SelectionService,
    private clipboard: ClipboardService,
    private translation: TranslationService) {
      this.translateControlPoint = DEFAULT_TRANSLATE_CONTROL_POINT;
      this.clipboard.selectionIsEmpty.subscribe((isEmpty: boolean) => {
        this.selectionIsEmpty = isEmpty;
      });
      this.clipboard.clipboardIsEmpty.subscribe((isEmpty: boolean) => {
        this.clipboardIsEmpty = isEmpty;
      });
      this.translation.isMagnetize.subscribe((isActive: boolean) => {
        this.magIsOn = isActive;
      });
  }

  public cut(): void {
    this.selection.cut();
  }

  public copy(): void {
    this.selection.copy();
  }

  public paste(): void {
    this.selection.paste();
  }

  public duplicate(): void {
    this.selection.duplicate();
  }

  public delete(): void {
    this.selection.deleteSelection();
  }

  public selectAll(): void {
    this.selection.selectAll();
  }

  public onToggleMag(): void {
    this.translation.toggleMag();
  }
  public setControlPoints(points: TranslationControlPoints): void {
    this.translation.setControlPoints(points);
  }
}
