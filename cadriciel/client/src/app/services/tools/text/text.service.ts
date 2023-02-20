import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TextServiceConstants } from 'src/app/constants/text-service-constants';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { Tools } from 'src/app/enums/tools';
import { ColorService } from '../../color/color.service';
import { OperationHandlerService } from '../../operation-handler/operation-handler.service';
import { AddObjectOperation } from '../../operation-handler/operations/add-object/add-object-operation';
import { ShortcutManagerService } from '../../shortcut-manager/shortcut-manager.service';
import { SvgManagerService } from '../../svg-manager/svg-manager.service';
import { TextAttributesService } from '../text-attributes/text-attributes.service';
import { ToolSelectorService } from '../tool-selector/tool-selector.service';
import { AbstractToolService } from '../tool/tool.service';

@Injectable({
  providedIn: 'root',
})
export class TextService implements AbstractToolService {

  public newTextOutline: SVGElement;

  private renderer: Renderer2;
  private textIsWriting: boolean;

  private newText: SVGElement;
  private newTextSpan: SVGElement;
  private color: string;
  private fillTransparency: number;
  private textSize: number;
  private textFont: string;
  private textFontStyle: string;
  private textWeight: string;
  private userInput: string;
  private textAlignement: string;
  private userInputs: SVGElement[];
  private textContents: string[];

  private newX: number;
  private newY: number;

  public isBold: Observable<boolean>;
  public isItalic: Observable<boolean>;
  private isBoldBehavior: BehaviorSubject<boolean>;
  private isItalicBehavior: BehaviorSubject<boolean>;

  constructor(
    private svgManager: SvgManagerService,
    private textAttributeService: TextAttributesService,
    private colorService: ColorService,
    private toolSelector: ToolSelectorService,
    private shortcutManager: ShortcutManagerService,
    private operationHandler: OperationHandlerService) {
      this.isBoldBehavior = new BehaviorSubject(false);
      this.isItalicBehavior = new BehaviorSubject(false);
      this.isBold = this.isBoldBehavior.asObservable();
      this.isItalic = this.isItalicBehavior.asObservable();
      this.renderer = svgManager.renderer;
      this.textIsWriting = false;
      this.textSize = TextServiceConstants.DEFAULT_SIZE;
      this.textFont = TextServiceConstants.DEFAULT_FONT;
      this.userInput = TextServiceConstants.DEFAULT_STRING_INPUT;
      this.textAlignement = TextServiceConstants.DEFAULT_ALIGNEMENT;
      this.userInputs = [];
      this.textContents = [];

      this.colorService.currentPrimaryColor.subscribe((primary: string) => {
        this.color = primary;
        this.validateTextColor();
      });
      this.colorService.currentFill.subscribe((fillTransparency: number) => {
        this.fillTransparency = fillTransparency;
        this.validateTextColor();
      });
      this.textAttributeService.currentTextAlignement.subscribe((textAlignement: string) => {
        this.textAlignement = textAlignement;
        this.validateTextAlignement(this.textAlignement);
      });
      this.textAttributeService.currentTextFont.subscribe((font: string) => {
        this.textFont = font;
        this.validateTextFont(this.textFont);
      });
      this.textAttributeService.currentTextSize.subscribe((size: number) => {
        this.textSize = size;
        this.validateTextSize(this.textSize);
      });
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.validateSelectedTool(newTool);
      });
  }

  private validateTextColor(): void {
    if (this.textIsWriting) {
      this.setTextColor();
    }
  }

  private validateSelectedTool(newTool: Tools): void {
    if (newTool !== Tools.Text) {
      this.cleanUp();
    }
  }

  public setIsBold(isBold: boolean): void {
    this.isBoldBehavior.next(isBold);
  }

  public setIsItalic(isItalic: boolean): void {
    this.isItalicBehavior.next(isItalic);
  }

  private validateTextAlignement(textAlignement: string): void {
    if (this.textIsWriting) {
      this.setTextAlignement(textAlignement);
    }
  }

  public activateBold(): void {
    if (this.textIsWriting) {
      if (this.isBoldBehavior.getValue()) {
        this.textWeight = TextServiceConstants.DEFAULT_WEIGHT;
        this.renderer.setAttribute(this.newText, SVGAttributes.FontWeight, TextServiceConstants.DEFAULT_WEIGHT);
        this.setIsBold(false);
      } else {
        this.textWeight = TextServiceConstants.TEXT_WEIGHT;
        this.renderer.setAttribute(this.newText, SVGAttributes.FontWeight, TextServiceConstants.TEXT_WEIGHT);
        this.setIsBold(true);
      }
    } else {
      if (this.isBoldBehavior.getValue()) {
        this.textWeight = TextServiceConstants.DEFAULT_WEIGHT;
        this.setIsBold(false);
      } else {
        this.textWeight = TextServiceConstants.TEXT_WEIGHT;
        this.setIsBold(true);
      }
    }
  }

  private validateTextSize(textSize: number): void {
    if (this.textIsWriting) {
      this.setTextSize(this.textSize);
    }
  }

  public activateItalic(): void {
    if (this.textIsWriting) {
      if (this.isItalicBehavior.getValue()) {
        this.textFontStyle = TextServiceConstants.DEFAULT_STYLE;
        this.renderer.setAttribute(this.newText, SVGAttributes.FontStyle, TextServiceConstants.DEFAULT_STYLE);
        this.setIsItalic(false);
      } else {
        this.textFontStyle = TextServiceConstants.TEXT_STYLE;
        this.renderer.setAttribute(this.newText, SVGAttributes.FontStyle, TextServiceConstants.TEXT_STYLE);
        this.setIsItalic(true);
      }
    } else {
      if (this.isItalicBehavior.getValue()) {
        this.textFontStyle = TextServiceConstants.DEFAULT_STYLE;
        this.setIsItalic(false);
      } else {
        this.textFontStyle = TextServiceConstants.TEXT_STYLE;
        this.setIsItalic(true);
    }
  }
}
  public removeTextBox(): void {
    if (this.textIsWriting) {
      this.operationHandler.addOperation(new AddObjectOperation(this.newText, this.svgManager));
      this.shortcutManager.shortcutBlocked = false;
      this.renderer.setAttribute(this.newText, SVGAttributes.Style, TextServiceConstants.NO_OUTLINE);
      this.textIsWriting = false;
    }
  }

  public onMouseDown(event: MouseEvent): void {
    this.updatePositions(event);
    if (!this.textIsWriting) {
      this.createText();
    }  else {
      this.removeTextBox();
    }
  }

  private validateTextFont(textFont: string): void {
    if (this.textIsWriting) {
      this.setTextFont(textFont);
    }
  }

  private createText(): void {
    this.textContents = [];
    this.userInputs = [];
    this.textIsWriting = true;
    this.shortcutManager.shortcutBlocked = true;
    this.createTextElement();
    this.createTextSpanElement();
    this.newTextSpan.textContent = TextServiceConstants.DEFAULT_TEXT;
  }

  private updatePositions(event: MouseEvent): void {
    this.newX = event.clientX - this.svgManager.getOffset().x;
    this.newY = event.clientY - this.svgManager.getOffset().y;
  }

  private createTextElement(): void {
    this.newText = this.renderer.createElement(SVGAttributes.Text, SVGAttributes.SVG);
    this.svgManager.addElement(this.newText);
    this.renderer.setAttribute(this.newText, SVGAttributes.X, this.newX.toString());
    this.renderer.setAttribute(this.newText, SVGAttributes.Y, this.newY.toString());
    this.renderer.setAttribute(this.newText, SVGAttributes.Style, TextServiceConstants.DASHED_OUTILINE);
    this.setTextAlignement(this.textAlignement);
    this.setTextWeight(this.textWeight);
  }

  private createTextSpanElement(): void {
    this.newTextSpan = this.renderer.createElement(SVGAttributes.Tspan, SVGAttributes.SVG);
    this.renderer.setAttribute(this.newTextSpan, SVGAttributes.DY, TextServiceConstants.TSPAN_HEIGHT);
    this.renderer.setAttribute(this.newTextSpan, SVGAttributes.X, this.newX.toString());
    this.updateStylingAttributes();
    this.renderer.appendChild(this.newText, this.newTextSpan);
  }

  private updateStylingAttributes(): void {
    this.setTextFont(this.textFont);
    this.setTextSize(this.textSize);
    this.setTextFontStyle(this.textFontStyle);
    this.setTextColor();
  }

  private setTextColor(): void {
    this.renderer.setAttribute(this.newTextSpan, SVGAttributes.Fill, this.color);
    this.renderer.setAttribute(this.newTextSpan, SVGAttributes.FillOpacity, this.fillTransparency.toString());
  }

  private setTextFont(font: string): void {
    if (font === TextServiceConstants.DEFAULT_FONT) {
      this.renderer.setAttribute(this.newTextSpan, SVGAttributes.Style,
                                TextServiceConstants.FONT_FAMILY  + TextServiceConstants.DEFAULT_FONT);
    } else {
      this.renderer.setAttribute(this.newTextSpan, SVGAttributes.Style, TextServiceConstants.FONT_FAMILY + this.textFont);
    }
  }

  private setTextSize(size: number): void {
    if (size === TextServiceConstants.DEFAULT_SIZE) {
      this.renderer.setAttribute(this.newText, SVGAttributes.Size, TextServiceConstants.DEFAULT_SIZE.toString());
    } else {
      this.renderer.setAttribute(this.newText, SVGAttributes.Size, this.textSize.toString());
    }
  }

  private setTextFontStyle(textFontStyle: string): void {
    if (textFontStyle === TextServiceConstants.DEFAULT_STYLE) {
      this.renderer.setAttribute(this.newTextSpan, SVGAttributes.FontStyle, TextServiceConstants.DEFAULT_STYLE);
    } else {
      this.renderer.setAttribute(this.newTextSpan, SVGAttributes.FontStyle, this.textFontStyle);
    }
  }

  private setTextWeight(textWeight: string): void {
    if (textWeight === TextServiceConstants.DEFAULT_WEIGHT) {
      this.renderer.setAttribute(this.newText, SVGAttributes.FontWeight, TextServiceConstants.DEFAULT_WEIGHT);
    } else {
      this.renderer.setAttribute(this.newText, SVGAttributes.FontWeight, this.textWeight);
    }
  }

  private setTextAlignement(alignement: string): void {
    if (alignement === TextServiceConstants.DEFAULT_ALIGNEMENT) {
      this.renderer.setAttribute(this.newText, SVGAttributes.TextAnchor, TextServiceConstants.DEFAULT_ALIGNEMENT);
    } else {
      this.renderer.setAttribute(this.newText, SVGAttributes.TextAnchor, this.textAlignement);
    }
  }

  private isNewText(): boolean {
    return this.newTextSpan.textContent === TextServiceConstants.DEFAULT_TEXT;
  }

  public cleanUp(): void {
    this.removeTextBox();
    this.textIsWriting = false;
  }

  public onWritingText(event: KeyboardEvent): void {
    if (this.textIsWriting) {
      if (event.key === TextServiceConstants.ENTER_KEY_CODE) {
        this.textContents.push(this.newTextSpan.textContent as string);
        this.userInputs.push(this.newTextSpan);
        (this.userInput as string).split(TextServiceConstants.END_LINE);
        this.createTextSpanElement();
      } else {
        if (this.isNewText()) {
          this.newTextSpan.textContent = '';
        }
        this.newTextSpan.textContent += event.key;
      }
    }
  }

  public onBackspaceDown(event: KeyboardEvent): void {
    if (this.textIsWriting) {
      this.removeLastCharacter();
    }
  }

  private removeLastCharacter(): void {
    this.newTextSpan.textContent = (this.newTextSpan.textContent as string).substring(TextServiceConstants.INPUT_START_POINT,
      (this.newTextSpan.textContent as string).length - TextServiceConstants.LAST_ELEMENT);
    this.deleteTextSpans(this.newTextSpan.textContent);
  }

  private deleteTextSpans(text: string): void {
    if (text.length === 0 && this.userInputs.length !== 0 ) {
      // tslint:disable-next-line: no-non-null-assertion
      this.newTextSpan = this.userInputs.pop()!;
      this.newTextSpan.textContent = this.textContents.pop() || '';
    }
  }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }
}
