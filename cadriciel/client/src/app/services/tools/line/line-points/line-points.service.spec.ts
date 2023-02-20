import { TestBed } from '@angular/core/testing';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { LinePointsService } from './line-points.service';

describe('LinePointsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: LinePointsService = TestBed.get(LinePointsService);
    expect(service).toBeTruthy();
  });

  it('#addCoordinates should correctly add the new coordinates', () => {
    const linePoints: string[] = ['0,0', '1,1'];
    const newCoordinates: ICoordinates = {x: 2,
                                         y: 2};
    LinePointsService.addCoordinates(linePoints, newCoordinates);
    expect(linePoints[2]).toBe('2,2', 'new coordinates in array');
  });

  it('#removeLastCoordinates should correctly remove the most recent coordinates', () => {
    const linePoints: string[] = ['0,0', '1,1'];

    LinePointsService.removeLastCoordinates(linePoints);
    expect(linePoints[1]).toBeUndefined();
  });

  it('#linePointsToString should respect the syntax of polyLine', () => {
    const linePoints: string[] = ['0,0', '1,1'];

    expect(LinePointsService.linePointsToString(linePoints)).toBe('0,0 1,1');
  });

  it('#linePointsToString should return an empty string if array is empty', () => {
    const linePoints: string[] = [];

    expect(LinePointsService.linePointsToString(linePoints)).toBe('');
  });

  it('#updateLastCoordinate should change the last coordinates', () => {
    const array: string[] = ['0,0', '1,1'];
    const coordinates: ICoordinates = {
      x: 2,
      y: 3,
    };
    LinePointsService.updateLastCoordinate(array, coordinates);
    expect(array[1]).toBe('2,3');
  });

  it('#updateLastCoordinate should add a coordinates if the array is empty', () => {
    const array: string[] = [];
    const coordinates: ICoordinates = {
      x: 2,
      y: 3,
    };
    LinePointsService.updateLastCoordinate(array, coordinates);
    expect(array[0]).toBe('2,3');
  });

  it('#resetLinePoints should correctly reset the array', () => {
    const array: string[] = ['0,0', '1,1'];
    LinePointsService.resetLinePoints(array);
    expect(array[0]).toBeUndefined();
  });

  it('#closeLine should add a point if the array isnt empty', () => {
    const array: string[] = ['0,0', '1,1', '2,2'];

    LinePointsService.closeLine(array);
    expect(array[3]).toBe('0,0');
  });

  it('#closeLine should not add a point if the array is empty', () => {
    const array: string[] = [];

    LinePointsService.closeLine(array);
    expect(array[0]).toBeUndefined();
  });
});
