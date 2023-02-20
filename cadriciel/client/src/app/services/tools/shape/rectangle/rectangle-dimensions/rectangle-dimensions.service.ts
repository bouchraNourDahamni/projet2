export class RectangleDimensionsService {

  public static getMin(initialNumber: number, currentNumber: number): number {
    return Math.min(initialNumber, currentNumber);
  }

  public static getWidth(initialX: number, currentX: number): number {
    return Math.abs(initialX - currentX);
  }

  public static getHeight(initialY: number, currentY: number): number {
    return Math.abs(initialY - currentY);
  }

}
