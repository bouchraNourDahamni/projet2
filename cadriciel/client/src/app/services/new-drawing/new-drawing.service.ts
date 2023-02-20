import { Injectable } from '@angular/core';

const MIN_DIMENSION = 5;
const MAX_DIMENSION = 5000;

@Injectable({
  providedIn: 'root',
})

export class NewDrawingService {

  public validateDimension(dimension: number): number {
    if (dimension < MIN_DIMENSION) {
      return MIN_DIMENSION;
    } else if (dimension > MAX_DIMENSION) {
      return MAX_DIMENSION;
    }
    return dimension;
  }
}
