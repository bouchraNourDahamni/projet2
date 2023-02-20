import { TestBed } from '@angular/core/testing';
import { RectangleServiceConstants } from 'src/app/constants/rectangle-service-constants';
import { ICoordinates } from '../../../../../interfaces/coordinates';
import { PolygonDimensionsService } from './polygon-dimensions.service';

describe('PolygonDimensionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [PolygonDimensionsService],
  }));

  it('should be created', () => {
    const service: PolygonDimensionsService = TestBed.get(PolygonDimensionsService);
    expect(service).toBeTruthy();
  });

  it('#getMin should return the smallest number', () => {
    expect(PolygonDimensionsService.getMin(-2, -0.5)).toBe(-2, '2 negative numbers');
    expect(PolygonDimensionsService.getMin(0, 2)).toBe(0, '0 and positive number');
    expect(PolygonDimensionsService.getMin(3.5, 3.6)).toBe(3.5, '2 positive decimal numbers');
  });

  it('#getSmallestRadius should return the smallest radius', () => {
    const initialCoordinates: ICoordinates = RectangleServiceConstants.INITIAL_COORDINATES;
    const currentCoordinates: ICoordinates = RectangleServiceConstants.CURRENT_COORDINATES;
    expect(PolygonDimensionsService.getSmallestRadius(initialCoordinates, currentCoordinates)).toBe(
      PolygonDimensionsService.getMin(PolygonDimensionsService.getRx(initialCoordinates.x,
      currentCoordinates.x), PolygonDimensionsService.getRy(initialCoordinates.y,
      currentCoordinates.y)));
  });

  it('#getPerimeterWidth should return the width for perimeter', () => {
    expect(PolygonDimensionsService.getPerimeterWidth(5, 16)).toBe(11);
    expect(PolygonDimensionsService.getPerimeterWidth(16, 5)).toBe(11);
  });

  it('#getPerimeterHeight should return the height for the perimeter', () => {
    expect(PolygonDimensionsService.getPerimeterHeight(-5, 16)).toBe(21);
  });

  it('#getCenterX should return the center X', () => {
    expect(PolygonDimensionsService.getCenterX(5, 15)).toBe(10);
    expect(PolygonDimensionsService.getCenterX(10, 5)).toBe(7.5);
  });

  it('#getCenterY should return the center Y', () => {
    expect(PolygonDimensionsService.getCenterY(5, 10)).toBe(7.5);
    expect(PolygonDimensionsService.getCenterY(15, 5)).toBe(10);
  });

  it('#getRx should return the radius in x', () => {
    expect(PolygonDimensionsService.getRx(5, 2)).toBe(1.5, 'initial x bigger than current x');
    expect(PolygonDimensionsService.getRx(2, 5)).toBe(1.5, 'initial x smaller than current x');
  });

  it('#getRy should return the radius in y', () => {
    expect(PolygonDimensionsService.getRy(5, 2)).toBe(1.5, 'initial y bigger than current y');
    expect(PolygonDimensionsService.getRy(2, 4)).toBe(1, 'initial y smaller than current y');
  });

  it('#getCenter should return the right center', () => {
    const initialCoordinates: ICoordinates = { x: 5, y: 15 };
    const currentCoordinates: ICoordinates = { x: 10, y: 5 };
    expect(PolygonDimensionsService.getCenter(initialCoordinates, currentCoordinates)).toEqual( { x: 7.5, y: 10 });
  });

  it('#positionsToString should respect the syntax of points', () => {
    const positions: string[] = ['0,0', '1,1'];
    expect(PolygonDimensionsService.positionsToString(positions)).toBe('0,0 1,1');
  });

  it('#getPositions should return the correct array of positions', () => {
    const center: ICoordinates = { x: 10, y: 20 };
    const radius = 10;
    const sides = 5;
    expect(PolygonDimensionsService.getPositions(center, radius, sides)).toEqual(['10,10',
                                                                                  '19.510565162951536,16.909830056250527',
                                                                                  '15.877852522924732,28.090169943749473',
                                                                                  '4.12214747707527,28.090169943749473',
                                                                                  '0.4894348370484636,16.909830056250527']);
  });

});
