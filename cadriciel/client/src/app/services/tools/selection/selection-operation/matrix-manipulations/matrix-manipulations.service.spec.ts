import { TestBed } from '@angular/core/testing';

import { MatrixManipulationsService } from './matrix-manipulations.service';

describe('MatrixManipulationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatrixManipulationsService = TestBed.get(MatrixManipulationsService);
    expect(service).toBeTruthy();
  });

  it('#matrixMultiply should multiply matrix', () => {
    const service: MatrixManipulationsService = TestBed.get(MatrixManipulationsService);
    const m1 = {a: 10, b: 5, c: 10, d: 0, e: 9, f: 0};
    const m2 = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    expect(service.matrixMultiply(m1, m2)).toEqual(m1);
  });

  it('#extractMatrixParam should extract transform string', () => {
    const service: MatrixManipulationsService = TestBed.get(MatrixManipulationsService);
    const transform = 'matrix(10 10 1 3 0 0)';
    expect(service.extractMatrixParam(transform)).toEqual({a: 10, b: 10, c: 1, d: 3, e: 0, f: 0});
  });

  it('#matrixToString should return a string matrix', () => {
    const service: MatrixManipulationsService = TestBed.get(MatrixManipulationsService);
    const matrix = {a: 10, b: 10, c: 1, d: 3, e: 0, f: 0};
    expect(service.matrixToString(matrix)).toEqual('matrix(10 10 1 3 0 0)');
  });
});
