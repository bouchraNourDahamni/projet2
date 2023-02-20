import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ICoordinates } from '../../../../interfaces/coordinates';
import { IPixelSurroundings } from '../../../../interfaces/pixel-surroundings';
import { IRGBColor } from '../../../../interfaces/RGBColor';
import { SurfaceCalculationService } from './surface-calculation.service';

describe('SurfaceCalculationService', () => {
  let service: SurfaceCalculationService;
  const colorA: IRGBColor = {red: 255, green: 200, blue: 0};
  const colorB: IRGBColor = {red: 240, green: 201, blue: 0};
  const dummyCoordA: ICoordinates = {x: 2, y: 3};
  const dummyCoordB: ICoordinates = {x: 4, y: 5};
  const dummyCoordArray = [dummyCoordA, dummyCoordB];
  const dummyDoubleCoordArray = [dummyCoordArray, dummyCoordArray];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurfaceCalculationService, { provide: MatDialog}],
    });
    service = TestBed.get(SurfaceCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createSurfaceObject should extract the image dimensions and go through the image-to-path routine', () => {
    const image = [[colorA, colorB, colorB, colorA],
    [colorA, colorA, colorA, colorA],
    [colorA, colorA, colorB, colorB]];
    service['outlines'] = dummyDoubleCoordArray;
    const spyExtractSurface = spyOn<any>(service, 'extractValidSurface');
    const spyTrimSurface = spyOn<any>(service, 'trimSurface');
    const spyAddOutline = spyOn<any>(service, 'addOutlineToSet');
    const spyExtractOutlines = spyOn<any>(service, 'extractOutlines');
    const spyCreateSurface = spyOn<any>(service['bucketSVG'], 'createSurface');
    service.createSurfaceObject(image, {x: 2, y: 3}, 10);
    expect(service['imageHeight']).toEqual(4);
    expect(service['imageWidth']).toEqual(3);
    expect(spyExtractSurface).toHaveBeenCalledWith(image, {x: 2, y: 3}, 10);
    expect(spyTrimSurface).toHaveBeenCalled();
    expect(spyAddOutline).toHaveBeenCalled();
    expect(spyExtractOutlines).toHaveBeenCalled();
    expect(spyCreateSurface).toHaveBeenCalledWith(dummyDoubleCoordArray);
  }) ;

  it('#initializeNullArray should create a 2D array with given dimension and initialize values to NULL', () => {
    expect(service['initializeNullArray'](2, 3)).toEqual([[null, null, null], [null, null, null]]);
  });

  it('#getNullCrossPixels should return a list of unchecked pixels surrounding a given pixel', () => {
    service['surfaceArray'] = [[null, null, null], [null, null, null], [null, null, null]];
    service['imageWidth'] = 3;
    service['imageHeight'] = 3;
    const pointArray: ICoordinates[] = [{x: 1, y: 0}, {x: 2, y: 1}, {x: 0, y: 1}, {x: 1, y: 2}];
    expect(service['getNullCrossPixels']({x: 1, y: 1})).toEqual(pointArray);
  });

  it('#getNullCrossPixels should only return pixels in bound', () => {
    service['surfaceArray'] = [[null, null, null], [null, null, null], [null, null, null]];
    service['imageWidth'] = 3;
    service['imageHeight'] = 3;
    const pointArray: ICoordinates[] = [{x: 1, y: 0}, {x: 0, y: 1}];
    expect(service['getNullCrossPixels']({x: 0, y: 0})).toEqual(pointArray);
  });

  it('#colorIsValid should return true only if colorB is in tolerance range of A', () => {
    expect(service['colorIsValid'](colorA, colorB, 10)).toBeTruthy();
    expect(service['colorIsValid'](colorA, colorB, 5)).toBeFalsy();
  });

  it('#extractValidSurface should return an array mapping the surface of the filling object', () => {
    const image = [[colorA, colorB, colorB, colorA],
    [colorA, colorA, colorA, colorA],
    [colorA, colorA, colorB, colorB],
    [colorA, colorB, colorB, colorB]];
    service['imageWidth'] = 4;
    service['imageHeight'] = 4;
    service['extractValidSurface'](image, {x: 0, y: 3}, 5);
    const expectedSurfaceA: (boolean|null)[][] = [
      [true, false, false, true],
      [true, true, true, true],
      [true, true, false, false],
      [true, false, null, null]];
    expect(service['surfaceArray']).toEqual(expectedSurfaceA);
    service['extractValidSurface'](image, {x: 0, y: 3}, 10);
    const expectedSurfaceB: (boolean|null)[][] = [
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true],
      [true, true, true, true]];
    expect(service['surfaceArray']).toEqual(expectedSurfaceB);

  });

  it('#pixelIsInBound should return if the given coordinates valid or not', () => {
    service['imageWidth'] = 3;
    service['imageHeight'] = 4;
    expect(service['pixelIsInBound']({x: 2, y: 3})).toBeTruthy();
    expect(service['pixelIsInBound']({x: 2, y: 4})).toBeFalsy();
    expect(service['pixelIsInBound']({x: -1, y: 3})).toBeFalsy();
  }) ;

  it('#getSurfaceValuesAround should give a list of the validity of each pixel around a given pixel', () => {
    service['imageWidth'] = 4;
    service['imageHeight'] = 4;
    const dummySurface: (boolean|null)[][] = [
      [true, false, false, true],
      [true, true, true, true],
      [true, true, false, false],
      [true, false, null, null]];
    service['surfaceArray'] = dummySurface;

    const expectedSurroundings: IPixelSurroundings = {
      topLeft: true,
      top: true,
      topRight: false,
      right: false,
      bottomRight: false,
      bottom: false,
      bottomLeft: false,
      left: true,
    };
    expect(service['getSurfaceValuesAround']({x: 3, y: 1})).toEqual(expectedSurroundings);
  }) ;

  it('#trimSurface should extend the excluded region by one pixel', () => {
    service['imageHeight'] = 4;
    service['imageWidth'] = 4;
    const dummySurface: (boolean|null)[][] = [
      [true, true, true, true],
      [true, true, true, true],
      [true, true, false, true],
      [true, true, true, true]];
    service['surfaceArray'] = dummySurface;
    const expectedArray: (boolean|null)[][] = [
      [false, false, false, false],
      [false, true, false, false],
      [false, false, false, false],
      [false, false, false, false]];
    service['trimSurface']();
    expect(service['surfaceArray']).toEqual(expectedArray);
  }) ;

  it('#addOutlineToSet should add all invalid pixels touch a valid one to the Set', () => {
    service['imageHeight'] = 4;
    service['imageWidth'] = 4;
    const dummySurface: (boolean|null)[][] = [
      [true, false, false, true],
      [true, true, true, true],
      [true, true, false, false],
      [true, false, null, null]];
    service['surfaceArray'] = dummySurface;
    service['allOutlinePixels'] = new Set<string>();
    const expectedSet = new Set<string>();
    expectedSet.add('0,1');
    expectedSet.add('0,2');
    expectedSet.add('2,2');
    expectedSet.add('2,3');
    expectedSet.add('3,1');
    service['addOutlineToSet']();
    expect(service['allOutlinePixels']).toEqual(expectedSet);
  }) ;

  /*
  F F F F N
  F T T T F
  F T T F N
  F T F T N
  F F N N N
  */
  it('#extractOutline should give a linear closed outline from a starting point and remove the points from the set', () => {
    const dummySet = new Set<string>();
    dummySet.add('0,0').add('0,1').add('0,2').add('0,3').add('0,4').add('1,0').add('2,0').add('3,0').add('4,1');
    dummySet.add('3,2').add('2,3').add('1,4').add('2,25').add('55,20');
    service['allOutlinePixels'] = dummySet;
    const expectedCoordinates: ICoordinates[] = [
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 3, y: 0},
      {x: 4, y: 1},
      {x: 3, y: 2},
      {x: 2, y: 3},
      {x: 1, y: 4},
      {x: 0, y: 4},
      {x: 0, y: 3},
      {x: 0, y: 2},
      {x: 0, y: 1},
      {x: 0, y: 0},
    ];
    const expectedSet = new Set<string>();
    expectedSet.add('2,25').add('55,20');
    expect(service['extractOutline']({x: 1, y: 0})).toEqual(expectedCoordinates);
    expect(service['allOutlinePixels']).toEqual(expectedSet);
  }) ;

  it('#extractOutline should return an unfinished outline if at any point the next pixel cannot be found', () => {
    const dummySet = new Set<string>();
    dummySet.add('0,0').add('0,1').add('0,2').add('0,3').add('25,42');
    service['allOutlinePixels'] = dummySet;
    const expectedCoordinates: ICoordinates[] = [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2},
      {x: 0, y: 3},
    ];
    const expectedSet = new Set<string>();
    expectedSet.add('25,42');
    expect(service['extractOutline']({x: 0, y: 0})).toEqual(expectedCoordinates);
    expect(service['allOutlinePixels']).toEqual(expectedSet);
  }) ;

  it('#getCoordinatesAround should give a list of all 8 coordinates around a given point', () => {
    const expectedCoordinates: ICoordinates[] = [
      {x: -1, y: 40},
      {x: 0, y: 40},
      {x: 1, y: 40},
      {x: 1, y: 41},
      {x: 1, y: 42},
      {x: 0, y: 42},
      {x: -1 , y: 42},
      {x: -1, y: 41},
    ];
    expect(service['getCoordinatesAround']({x: 0, y: 41})).toEqual(expectedCoordinates);
  }) ;

  it('#extractOutlines should extract all possible outlines from the outline set', () => {
    service['outlines'] = [];
    const dummySet = new Set<string>();
    dummySet.add('0,0').add('0,1').add('0,2').add('0,3').add('0,4').add('1,0').add('2,0').add('3,0').add('4,1');
    dummySet.add('3,2').add('2,3').add('1,4').add('2,25').add('2,26').add('3,27');
    service['allOutlinePixels'] = dummySet;
    const expectedCoordinatesA: ICoordinates[] = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 3, y: 0},
      {x: 4, y: 1},
      {x: 3, y: 2},
      {x: 2, y: 3},
      {x: 1, y: 4},
      {x: 0, y: 4},
      {x: 0, y: 3},
      {x: 0, y: 2},
      {x: 0, y: 1},
    ];
    const expectedCoordinatesB: ICoordinates[] = [
      {x: 2, y: 25},
      {x: 2, y: 26},
      {x: 3, y: 27},
    ];
    const expectedOutlines: ICoordinates[][] = [expectedCoordinatesA, expectedCoordinatesB];
    service['extractOutlines']();
    expect(service['outlines']).toEqual(expectedOutlines);
  }) ;

  it('#stringToCoordinates should create the correct coordinate object from a key string', () => {
    expect(service['stringToCoordinates']('3,2222')).toEqual({x: 3, y: 2222});
  }) ;

});
