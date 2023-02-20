import { Injectable } from '@angular/core';
import { ICoordinates } from '../../../../interfaces/coordinates';

@Injectable({
  providedIn: 'root',
})
export class LinePointsService {

  public static  coordinatesToString(coordinates: ICoordinates): string {
    return coordinates.x.toString() + ',' + coordinates.y.toString();
  }

  public static addCoordinates(linePoints: string[], newCoordinates: ICoordinates): void {
    const newCoordinatesString: string = LinePointsService.coordinatesToString(newCoordinates);
    linePoints.push(newCoordinatesString);
  }

  public static removeLastCoordinates(linePoints: string[]): void {
    linePoints.pop();
  }

  public static linePointsToString(linePoints: string[]): string {
    return linePoints.join(' ');
  }

  public static updateLastCoordinate(linePoints: string[], newCoordinates: ICoordinates): void {
    const lastIndex: number = (linePoints.length - 1 < 0) ? 0 : linePoints.length - 1;
    linePoints[lastIndex] = LinePointsService.coordinatesToString(newCoordinates);
  }

  public static resetLinePoints(linePoints: string[]): void {
    linePoints.length = 0;
  }

  public static closeLine(linePoints: string[]): void {
    if (linePoints.length > 0) {
      linePoints.push(linePoints[0]);
    }
  }
}
