export class SquareService {

  public static getXPosition(initialX: number, currentX: number, width: number, height: number): string {
    let xPosition: number = Math.min(initialX, currentX);
    if (height < width) {
      xPosition = Math.min(initialX, currentX) + Math.abs((width - height) / 2);

    }
    return xPosition.toString();
  }

  public static getYPosition(initialY: number, currentY: number, width: number, height: number): string {
    let yPosition: number = Math.min(initialY, currentY);
    if (width < height) {
      yPosition = Math.min(initialY, currentY) + Math.abs((width - height) / 2);
    }
    return yPosition.toString();
  }
}
