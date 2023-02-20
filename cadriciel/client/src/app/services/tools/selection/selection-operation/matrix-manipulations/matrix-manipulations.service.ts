import { Injectable } from '@angular/core';
import { ITransformMatrix } from 'src/app/interfaces/transform-matrix';

const NUMBER_REGEX: RegExp = /-?[0-9]+(\.[0-9]*)?/g;
const DECIMALS = 3;
const MATRIX = 'matrix(';
const CLOSED_PARENTHESIS = ')';

@Injectable({
  providedIn: 'root',
})
export class MatrixManipulationsService {

  constructor() { return; }

  public matrixMultiply(m1: ITransformMatrix, m2: ITransformMatrix): ITransformMatrix {
    const product: ITransformMatrix = {
      a: Number((m1.a * m2.a + m1.c * m2.b).toFixed(DECIMALS)),
      b: Number((m1.b * m2.a + m1.d * m2.b).toFixed(DECIMALS)),
      c: Number((m1.a * m2.c + m1.c * m2.d).toFixed(DECIMALS)),
      d: Number((m1.b * m2.c + m1.d * m2.d).toFixed(DECIMALS)),
      e: Number((m1.a * m2.e + m1.c * m2.f + m1.e).toFixed(DECIMALS)),
      f: Number((m1.b * m2.e + m1.d * m2.f + m1.f).toFixed(DECIMALS)),
    };
    return product;
  }

  public extractMatrixParam(transform: string): ITransformMatrix {
    const n = transform.match(NUMBER_REGEX) as string[];
    const params = {a: Number(n[0]), b: Number(n[1]), c: Number(n[2]), d: Number(n[3]), e: Number(n[4]), f: Number(n[5])};
    return params;
  }

  public matrixToString(matrix: ITransformMatrix): string {
    return MATRIX + matrix.a + ' ' + matrix.b + ' ' + matrix.c + ' ' + matrix.d + ' ' + matrix.e + ' ' + matrix.f + CLOSED_PARENTHESIS;
  }
}
