import { Component, HostListener, OnInit } from '@angular/core';
import { TextAttributesService } from 'src/app/services/tools/text-attributes/text-attributes.service';
import { Alignements } from 'src/app/services/tools/text/alignements';
import { TextFonts } from 'src/app/services/tools/text/text-fonts';
import { TextService } from 'src/app/services/tools/text/text.service';

const MIN_SLIDER_TEXTSIZE_VALUE = 1;
const MAX_SLIDER_TEXTSIZE_VALUE = 20;
const SLIDER_TICK_TEXTSIZE_INTERVAL = 1;

@Component({
  selector: 'app-text-tool',
  templateUrl: './text-tool.component.html',
  styleUrls: ['./text-tool.component.scss'],
})
export class TextToolComponent implements OnInit {

  public minSliderTextSizeValue: number;
  public maxSliderTextSizeValue: number;
  public sliderTickTextSizeInterval: number;
  public isBold: boolean;
  public isItalic: boolean;

  public allFonts: string[] = [TextFonts.TextFont1, TextFonts.TextFont2, TextFonts.TextFont3,
                                TextFonts.TextFont4, TextFonts.TextFont5];
  public allAlignements: string[] = [Alignements.Alignement1, Alignements.Alignement2, Alignements.Alignement3];

  constructor(
    private textAttributes: TextAttributesService,
    private textService: TextService) {
      this.allFonts = [TextFonts.TextFont1, TextFonts.TextFont2, TextFonts.TextFont3,
                      TextFonts.TextFont4, TextFonts.TextFont5];
      this.allAlignements = [Alignements.Alignement1, Alignements.Alignement2, Alignements.Alignement3];
      this.minSliderTextSizeValue = MIN_SLIDER_TEXTSIZE_VALUE;
      this.maxSliderTextSizeValue = MAX_SLIDER_TEXTSIZE_VALUE;
      this.sliderTickTextSizeInterval = SLIDER_TICK_TEXTSIZE_INTERVAL;
      this.isBold = false;
      this.isItalic = false;
   }

   public ngOnInit(): void {
    this.textService.isBold.subscribe((isBold: boolean) => {
      this.isBold = isBold;
    });
    this.textService.isItalic.subscribe((isItalic: boolean) => {
      this.isItalic = isItalic;
    });
  }

  public activateBold(): void {
    this.textService.activateBold();
  }

  public activateItalic(): void {
    this.textService.activateItalic();
  }

  public setFont(textFont: string): void {
    this.textAttributes.setTextFont(textFont);
  }

  public setSize(textSize: number): void {
    this.textAttributes.setTextSize(textSize);
  }

  public setTextAlignement(textAlignement: string): void {
    this.textAttributes.setTextAlignement(textAlignement);
  }

  @HostListener('window:keydown.control.b', ['$event'])
  public onControlB(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.activateBold();
  }

  @HostListener('window:keydown.control.i', ['$event'])
  public onControlI(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.activateItalic();
  }
}
