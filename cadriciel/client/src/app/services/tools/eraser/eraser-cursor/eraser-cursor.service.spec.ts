import { TestBed } from '@angular/core/testing';
import { IEraserCursorAttributes } from 'src/app/interfaces/eraser-cursor';
import { EraserCursorService } from './eraser-cursor.service';

describe('EraserCursorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EraserCursorService = TestBed.get(EraserCursorService);
    expect(service).toBeTruthy();
  });

  it('#setEraserCursorAttributes should set the attributes', () => {
    const service: EraserCursorService = TestBed.get(EraserCursorService);
    const cursor: IEraserCursorAttributes = {left: 45, top: 36, marginLeft: 10, marginTop: 10, width: 100, height: 100 };
    service.setEraserCursorAttributes(cursor);
    service.currentEraserCursorAttributes.subscribe((eraserCursor: IEraserCursorAttributes) => {
      expect(eraserCursor).toBe(cursor);
    });
  });

  it('#setSize should set the size', () => {
    const service: EraserCursorService = TestBed.get(EraserCursorService);
    const size = 10;
    service.setSize(size);
    service.currentSize.subscribe((toolSize: number) => {
      expect(toolSize).toBe(size);
    });
  });
});
