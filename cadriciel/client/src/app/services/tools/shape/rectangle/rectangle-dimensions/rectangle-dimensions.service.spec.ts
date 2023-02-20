import { TestBed } from '@angular/core/testing';
import { RectangleDimensionsService } from './rectangle-dimensions.service';

describe('RectangleDimensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [RectangleDimensionsService],
  }));

  it('should be created', () => {
    const service: RectangleDimensionsService = TestBed.get(RectangleDimensionsService);
    expect(service).toBeTruthy();
  });

  it('#getMin should return the smallest number', () => {
    expect(RectangleDimensionsService.getMin(-2, -0.5)).toBe(-2, '2 negative numbers');
    expect(RectangleDimensionsService.getMin(0, 2)).toBe(0, '0 and positive number');
    expect(RectangleDimensionsService.getMin(3.5, 3.6)).toBe(3.5, '2 positive decimal numbers');
  });

  it('#getWidth should return the expectedWidth', () => {
    const initialX = -2.5;
    const currentX = 3;
    const expectedWidth = 5.5;
    expect(RectangleDimensionsService.getWidth(initialX, currentX)).toBe(expectedWidth);
  });

  it('#getHeight should return the expectedHeight', () => {
    const initialY = 10;
    const currentY = 900;
    const expectedHeight = 890;
    expect(RectangleDimensionsService.getHeight(initialY, currentY)).toBe(expectedHeight);
  });
});
