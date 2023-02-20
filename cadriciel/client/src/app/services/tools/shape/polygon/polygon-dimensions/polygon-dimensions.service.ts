import { ICoordinates } from '../../../../../interfaces/coordinates';

export class PolygonDimensionsService {

  public static getMin(initialNumber: number, currentNumber: number): number {
    return Math.min(initialNumber, currentNumber);
  }

  public static getSmallestRadius(initialCoordinates: ICoordinates, currentCoordinates: ICoordinates): number {
    return PolygonDimensionsService.getMin(PolygonDimensionsService.getRx(initialCoordinates.x,
                                                                          currentCoordinates.x),
                                           PolygonDimensionsService.getRy(initialCoordinates.y,
                                                                          currentCoordinates.y));
  }

  public static getPerimeterWidth(initialX: number, currentX: number): number {
    return Math.abs(initialX - currentX);
  }

  public static getPerimeterHeight(initialY: number, currentY: number): number {
    return Math.abs(initialY - currentY);
  }

  public static getCenterX(initialX: number, currentX: number): number {
    return Math.min(initialX, currentX) + (PolygonDimensionsService.getPerimeterWidth(initialX, currentX) / 2);
  }

  public static getCenterY(initialY: number, currentY: number): number {
    return Math.min(initialY, currentY) + (PolygonDimensionsService.getPerimeterHeight(initialY, currentY) / 2);
  }

  public static getCenter(initialCoordinates: ICoordinates, currentCoordinates: ICoordinates): ICoordinates {
    return {
      x: PolygonDimensionsService.getCenterX(initialCoordinates.x, currentCoordinates.x),
      y: PolygonDimensionsService.getCenterY(initialCoordinates.y, currentCoordinates.y),
    };
  }

  public static getRx(initialX: number, currentX: number): number {
    return Math.abs(initialX - currentX) / 2;
  }

  public static getRy(initialY: number, currentY: number): number {
    return Math.abs(initialY - currentY) / 2;
  }

  public static getPositions(center: ICoordinates, radius: number, sides: number): string[] {
    const positions: string[] = [];
    for (let i = 0; i < sides; i++) {
      positions.push((center.x + radius * Math.cos((2 * Math.PI * i / sides) - Math.PI / 2)).toString() +
                  ',' +
                 (center.y + radius * Math.sin((2 * Math.PI * i / sides) - Math.PI / 2)).toString());
    }
    return positions;
  }

  public static positionsToString(positions: string[]): string {
    return positions.join(' ');
  }
}
