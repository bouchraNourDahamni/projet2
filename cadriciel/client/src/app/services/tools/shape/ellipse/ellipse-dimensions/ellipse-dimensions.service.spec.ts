import { TestBed } from '@angular/core/testing';
import { RectangleServiceConstants } from 'src/app/constants/rectangle-service-constants';
import { ICoordinates } from '../../../../../interfaces/coordinates';
import { EllipseDimensionsService } from './ellipse-dimensions.service';

describe('EllipseDimensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [EllipseDimensionsService],
  }));

  it('should be created', () => {
    const service: EllipseDimensionsService = TestBed.get(EllipseDimensionsService);
    expect(service).toBeTruthy();
  });

  it('#getMin should return the smallest number', () => {
    expect(EllipseDimensionsService.getMin(-2, -0.5)).toBe(-2, '2 negative numbers');
    expect(EllipseDimensionsService.getMin(0, 2)).toBe(0, '0 and positive number');
    expect(EllipseDimensionsService.getMin(3.5, 3.6)).toBe(3.5, '2 positive decimal numbers');
  });

  it('#getSmallestRadius should return the smallest radius', () => {
    const initialCoordinates: ICoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
    const currentCoordinates: ICoordinates = RectangleServiceConstants.CURRENT_COORDINATES;
    expect(EllipseDimensionsService.getSmallestRadius(initialCoordinates, currentCoordinates)).toBe(
      EllipseDimensionsService.getMin(EllipseDimensionsService.getRx(initialCoordinates.x,
      currentCoordinates.x), EllipseDimensionsService.getRy(initialCoordinates.y,
      currentCoordinates.y)));
  });

  it('#getPerimeterWidth should return the width for perimeter', () => {
    expect(EllipseDimensionsService.getPerimeterWidth(5, 16)).toBe(11);
    expect(EllipseDimensionsService.getPerimeterWidth(16, 5)).toBe(11);
  });

  it('#getPerimeterHeight should return the height for the perimeter', () => {
    expect(EllipseDimensionsService.getPerimeterHeight(-5, 16)).toBe(21);
  });

  it('#getCurrentX should return the current X', () => {
    expect(EllipseDimensionsService.getCenterX(5, 16, 10)).toBe(10);
    expect(EllipseDimensionsService.getCenterX(16, 5, 5)).toBe(7.5);
  });

  it('#getCurrentY should return the current Y', () => {
    expect(EllipseDimensionsService.getCenterY(5, 16, 10)).toBe(10);
    expect(EllipseDimensionsService.getCenterY(16, 5, 5)).toBe(7.5);
  });

  it('#getRx should return the radius in x', () => {
    expect(EllipseDimensionsService.getRx(5, 2)).toBe(1.5, 'initial x bigger than current x');
    expect(EllipseDimensionsService.getRx(2, 5)).toBe(1.5, 'initial x smaller than current x');
  });

  it('#getRy should return the radius in y', () => {
    expect(EllipseDimensionsService.getRy(5, 2)).toBe(1.5, 'initial y bigger than current y');
    expect(EllipseDimensionsService.getRy(2, 4)).toBe(1, 'initial y smaller than current y');
  });

});
