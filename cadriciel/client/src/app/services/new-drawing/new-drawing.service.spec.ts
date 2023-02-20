import { TestBed } from '@angular/core/testing';
import { NewDrawingService } from './new-drawing.service';

describe('NewDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewDrawingService = TestBed.get(NewDrawingService);
    expect(service).toBeTruthy();
  });

  it('#validateDimension should keep good dimension unchanged', () => {
    const service: NewDrawingService = TestBed.get(NewDrawingService);
    const dim = 40;
    expect(service.validateDimension(dim)).toBe(40);
  });

  it('#validateDimension should force dimension to MAX_DIM', () => {
    const service: NewDrawingService = TestBed.get(NewDrawingService);
    const dim = 5002;
    expect(service.validateDimension(dim)).toBe(5000);
  });

  it('#validateDimension should force dimension to MIN_DIM', () => {
    const service: NewDrawingService = TestBed.get(NewDrawingService);
    const dim = -5;
    expect(service.validateDimension(dim)).toBe(5);
  });

});
