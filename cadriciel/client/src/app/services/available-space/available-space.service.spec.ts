import { TestBed } from '@angular/core/testing';
import { AvailableSpaceService } from './available-space.service';

const SAFETY_MARGIN = 5;

describe('AvailableSpaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('AvailableSpaceService should be created', () => {
    const service: AvailableSpaceService = TestBed.get(AvailableSpaceService);
    expect(service).toBeTruthy();
  });

  it('#setHeight should set the space heigth', () => {
    const service: AvailableSpaceService = TestBed.get(AvailableSpaceService);
    const height = 100;
    service.setHeight(height);
    service.height.subscribe((spaceHeight: number) => {
      expect(spaceHeight + SAFETY_MARGIN).toBe(height);
    });
  });

  it('#setWidth should set the space width', () => {
    const service: AvailableSpaceService = TestBed.get(AvailableSpaceService);
    const width = 100;
    service.setWidth(width);
    service.width.subscribe((spaceWidth: number) => {
      expect(spaceWidth + SAFETY_MARGIN).toBe(width);
    });
  });

  it('#getHeight should get the space heigth', () => {
    const service: AvailableSpaceService = TestBed.get(AvailableSpaceService);
    expect(service.getHeight()).toBe(service.height);
  });

  it('#getWidth should get the space width', () => {
    const service: AvailableSpaceService = TestBed.get(AvailableSpaceService);
    expect(service.getWidth()).toBe(service.width);
  });
});
