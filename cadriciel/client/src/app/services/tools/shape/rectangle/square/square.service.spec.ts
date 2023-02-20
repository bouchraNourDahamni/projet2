import { TestBed } from '@angular/core/testing';
import { SquareService } from './square.service';

const initialX = 10;
const initialY = 20;

const currentX1 = 15;
const currentX2 = 40;

const currentY1 = 30;

const width1: number = Math.abs(initialX - currentX1); // 5
const width2: number = Math.abs(initialX - currentX2); // 30

const height1: number = Math.abs(initialY - currentY1); // 10

describe('SquareService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SquareService],
  }));

  it('should be created', async () => {
    const service: SquareService = TestBed.get(SquareService);
    expect(service).toBeTruthy();
  });

  it('#getXPosition  should return 10 when given initialX, currentX1, width1 and height1  ', () => {
    const xPosition = SquareService.getXPosition(initialX, currentX1, width1, height1);
    expect(xPosition).toBe('10', 'initialX is chosen as x position');
  });

  it('#getXPosition  should return 20 when given initialX, currentX2, width2 and height1  ', () => {
    const xPosition = SquareService.getXPosition(initialX, currentX2, width2, height1);
    expect(xPosition).toBe('20', 'x position is offset');
  });

  it('#getYPosition  should return 22.5 when given initialY, currentY1, width1 and height1  ', () => {
    const yPosition = SquareService.getYPosition(initialY, currentY1, width1, height1);
    expect(yPosition).toBe('22.5', 'y position is offset');
  });

  it('#getYPosition  should return 20 when given initialY, currentY1, width2 and height1  ', () => {
    const yPosition = SquareService.getYPosition(initialY, currentY1, width2, height1);
    expect(yPosition).toBe('20', 'initialY is chosen as y position');
  });

});
