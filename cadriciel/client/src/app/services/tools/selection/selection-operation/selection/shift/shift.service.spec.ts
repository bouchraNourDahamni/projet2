import { TestBed } from '@angular/core/testing';
import { ISVGRectangle } from 'src/app/interfaces/SVGRectangle';
import { ShiftService } from './shift.service';

describe('ShiftService', () => {
  let service: ShiftService;
  const dummySVGRectangle: ISVGRectangle = {x: 5, y: 6, width: 20, height: 10};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#hasSpaceToShift should return true only if a shift would keep all objects in bounds', () => {
    service['workspaceHeight'] = 30;
    service['workspaceWidth'] = 40;
    const checkA = service.hasSpaceToShift(dummySVGRectangle, 10);
    const checkB = service.hasSpaceToShift(dummySVGRectangle, 15);
    expect(checkA).toBeTruthy();
    expect(checkB).toBeFalsy();
  });

  it('#incrementPasteShift should correct the shift value if it would bring the objects out of bound, then increment for next shift',
  () => {
    spyOn(service, 'hasSpaceToShift').and.returnValue(false);
    service.pasteShift = 10;
    expect(service.incrementPasteShift(dummySVGRectangle)).toEqual(0);
    expect(service.pasteShift).toEqual(10);
    service.pasteShift = 30;
    expect(service.incrementPasteShift(dummySVGRectangle)).toEqual(10);
    expect(service.pasteShift).toEqual(20);
  });

  it('#incrementPasteShift should increment the paste shift for the next shift', () => {
    spyOn(service, 'hasSpaceToShift').and.returnValue(true);
    service.pasteShift = 30;
    expect(service.incrementPasteShift(dummySVGRectangle)).toEqual(30);
    expect(service.pasteShift).toEqual(40);
  });

  it('#incrementDuplicateShift should correct the shift value if it would bring the objects out of bound, then increment',
  () => {
    spyOn(service, 'hasSpaceToShift').and.returnValue(false);
    service.duplicateShift = 10;
    expect(service.incrementDuplicateShift(dummySVGRectangle)).toEqual(0);
    expect(service.duplicateShift).toEqual(10);
    service.duplicateShift = 40000;
    expect(service.incrementDuplicateShift(dummySVGRectangle)).toEqual(10);
    expect(service.duplicateShift).toEqual(20);
  });

  it('#incrementDuplicateShift should increment the duplicate shift for the next shift', () => {
    spyOn(service, 'hasSpaceToShift').and.returnValue(true);
    service.duplicateShift = 71;
    expect(service.incrementDuplicateShift(dummySVGRectangle)).toEqual(71);
    expect(service.duplicateShift).toEqual(81);
  });
});
