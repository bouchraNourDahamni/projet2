import { ICoordinates } from '../../../../../interfaces/coordinates';

export class EllipseDimensionsService {

  public static getMin(initialNumber: number, currentNumber: number): number {
    return Math.min(initialNumber, currentNumber);
  }

  public static getSmallestRadius(initialCoordinates: ICoordinates, currentCoordinates: ICoordinates): number {
    return EllipseDimensionsService.getMin(EllipseDimensionsService.getRx(initialCoordinates.x,
                                                                          currentCoordinates.x),
                                           EllipseDimensionsService.getRy(initialCoordinates.y,
                                                                          currentCoordinates.y));
  }

  public static getPerimeterWidth(initialX: number, currentX: number): number {
    return Math.abs(initialX - currentX);
  }

  public static getPerimeterHeight(initialY: number, currentY: number): number {
    return Math.abs(initialY - currentY);
  }

  public static getCenterX(initialX: number, currentX: number, perimeterWidth: number): number {
    return Math.min(initialX, currentX) + (perimeterWidth / 2);
  }

  public static getCenterY(initialY: number, currentY: number, perimeterHeight: number): number {
    return Math.min(initialY, currentY) + (perimeterHeight / 2);
  }

  public static getRx(initialX: number, currentX: number): number {
    return Math.abs(initialX - currentX) / 2;
  }

  public static getRy(initialY: number, currentY: number): number {
    return Math.abs(initialY - currentY) / 2;
  }
}
