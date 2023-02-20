import { TestBed } from '@angular/core/testing';
import { Alignements } from '../text/alignements';
import { TextFonts } from '../text/text-fonts';
import { TextAttributesService } from './text-attributes.service';

describe('TextAttributesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('textAttributesService should be created', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    expect(service).toBeTruthy();
  });

  it('#setTextSize should set text size', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const size = 10;
    service.setTextSize(size);
    service.currentTextSize.subscribe((textSize: number) => {
      expect(textSize).toBe(size);
    });
  });

  it('#setTextAlignement should set text alignement', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const alignement = 'left';
    service.setTextAlignement(alignement);
    service.currentTextAlignement.subscribe((textAlignement: Alignements) => {
      expect(textAlignement).toBe(Alignements.Alignement1);
    });
  });

  it('#setTextAlignement should set text alignement', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const alignement = 'end';
    service.setTextAlignement(alignement);
    service.currentTextAlignement.subscribe((textAlignement: Alignements) => {
      expect(textAlignement).toBe(Alignements.Alignement3);
    });
  });

  it('#setTextAlignement should set text alignement', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const alignement = 'middle';
    service.setTextAlignement(alignement);
    service.currentTextAlignement.subscribe((textAlignement: Alignements) => {
      expect(textAlignement).toBe(Alignements.Alignement2);
    });
  });

  it('#setTextAlignement should set text alignement', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const alignement = 'none';
    service.setTextAlignement(alignement);
    service.currentTextAlignement.subscribe((textAlignement: Alignements) => {
      expect(textAlignement).toBe(Alignements.None);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'Lato';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.TextFont1);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'Oswald';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.TextFont2);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'Raleway';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.TextFont3);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'Roboto';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.TextFont4);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'Gamja Flower';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.TextFont5);
    });
  });

  it('#setTextFont should set text font', () => {
    const service: TextAttributesService = TestBed.get(TextAttributesService);
    const font = 'none';
    service.setTextFont(font);
    service.currentTextFont.subscribe((textFont: TextFonts) => {
      expect(textFont).toBe(TextFonts.None);
    });
  });

});
