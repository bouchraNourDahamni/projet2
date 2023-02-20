import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TextServiceConstants } from 'src/app/constants/text-service-constants';
import { Alignements } from '../text/alignements';
import { TextFonts } from '../text/text-fonts';

@Injectable({
  providedIn: 'root',
})
export class TextAttributesService {

  public renderer: Renderer2;
  public container: SVGElement;

  private textSize: BehaviorSubject<number>;
  private textFont: BehaviorSubject<string>;
  private textAlignement: BehaviorSubject<string>;

  public currentTextSize: Observable<number>;
  public currentTextFont: Observable<string>;
  public currentTextAlignement: Observable<string>;

  constructor() {
    this.textSize = new BehaviorSubject(TextServiceConstants.DEFAULT_SIZE);
    this.textFont = new BehaviorSubject(TextServiceConstants.DEFAULT_FONT);
    this.textAlignement = new BehaviorSubject(TextServiceConstants.DEFAULT_ALIGNEMENT);

    this.currentTextSize = this.textSize.asObservable();
    this.currentTextFont = this.textFont.asObservable();
    this.currentTextAlignement = this.textAlignement.asObservable();
  }

  public setTextFont(textFontString: string): void {
    if (textFontString === TextServiceConstants.DEFAULT_FONT) {
      this.textFont.next(TextFonts.TextFont1);
    } else if (textFontString === TextFonts.TextFont2) {
      this.textFont.next(TextFonts.TextFont2);
    } else if (textFontString === TextFonts.TextFont3) {
      this.textFont.next(TextFonts.TextFont3);
    } else if (textFontString === TextFonts.TextFont4) {
      this.textFont.next(TextFonts.TextFont4);
    } else if (textFontString === TextFonts.TextFont5) {
      this.textFont.next(TextFonts.TextFont5);
    } else {
      this.textFont.next(TextFonts.None);
    }
  }

  public setTextAlignement(textALignement: string): void {
    if (textALignement === TextServiceConstants.DEFAULT_ALIGNEMENT) {
      this.textAlignement.next(Alignements.Alignement1);
    } else if (textALignement === Alignements.Alignement2) {
      this.textAlignement.next(Alignements.Alignement2);
    } else if (textALignement === Alignements.Alignement3) {
      this.textAlignement.next(Alignements.Alignement3);
    } else {
      this.textAlignement.next(Alignements.None);
    }
  }

  public setTextSize(textSize: number): void {
    this.textSize.next(textSize);
  }
}
