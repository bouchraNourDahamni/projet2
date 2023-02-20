import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ColorBucketService } from './color-bucket.service';

describe('ColorBucketService', () => {
  let service: ColorBucketService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorBucketService, { provide: MatDialog}],
    });
    service = TestBed.get(ColorBucketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#setCanvasDimensions should correctly set the width and height from imageService', () => {
    service['imageService'].workspaceWidth = 33;
    service['imageService'].workspaceHeight = 88;
    const canvas: HTMLCanvasElement = service['renderer'].createElement('canvas');
    service['setCanvasDimensions'](canvas);
    expect(canvas.width).toEqual(33);
    expect(canvas.height).toEqual(88);
  });

  it('#canvas should return an HTMLCanvasElement with the workspaceWidth and Height', () => {
    service['imageService'].workspaceWidth = 33;
    service['imageService'].workspaceHeight = 88;
    expect(service['createCanvas']().width).toEqual(33);
    expect(service['createCanvas']().height).toEqual(88);
  });

  it('#updateCanvasContext should the context of a canvas', () => {
    const canvas: HTMLCanvasElement = service['renderer'].createElement('canvas');
    expect(service['updateCanvasContext'](canvas)).toEqual(canvas.getContext('2d')as CanvasRenderingContext2D);
  });

  it('#createFileSvg should return a new Blob', () => {
    const result = new Blob([service['imageService'].image], { type: 'image/svg+xml' });
    expect(service['createFileSvg']()).toEqual(result);
  });

  it('#onMouseDown should set the coordinates x and y', () => {
    const event: MouseEvent = new MouseEvent('click');
    service['svgManager'] = jasmine.createSpyObj('SVGManager', {
      getOffset: { x: 0, y: 0 },
    });
    spyOn<any>(service, 'updateCanvasColors');
    service.onMouseDown(event);
    expect(service['updateCanvasColors']).toHaveBeenCalled();
  });

  it('#updateCanvasColors should create url and upload image', () => {
    const event: MouseEvent = new MouseEvent('click');
    spyOn<any>(service, 'loadImage').and.callThrough();
    spyOn<any>(service, 'createFileSvg').and.callThrough();
    service['updateCanvasColors'](event);
    expect(service['loadImage']).toHaveBeenCalled();
    expect(service['createFileSvg']).toHaveBeenCalled();
  });

  it('#onImageLoad should load image', () => {
    const event: MouseEvent = new MouseEvent('click');
    spyOn<any>(service, 'createCanvas').and.callThrough();
    spyOn<any>(service, 'updateCanvasContext').and.callThrough();
    service['imageService'].workspaceWidth = 33;
    service['imageService'].workspaceHeight = 88;
    const newImage: HTMLImageElement = new Image();
    service['onImageLoad'](newImage, event);
    expect(service['createCanvas']).toHaveBeenCalled();
    expect(service['updateCanvasContext']).toHaveBeenCalled();
  });

  it('#onShiftDown should do nothing', () => {
    service.onShiftDown(new KeyboardEvent('shiftdown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseMove should do nothing', () => {
    service.onMouseMove(new MouseEvent('click'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseUp should do nothing', () => {
    service.onMouseUp(new MouseEvent('click'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#cleanUp should do nothing', () => {
    service.cleanUp();
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onShiftUp should do nothing', () => {
    service.onShiftUp(new KeyboardEvent('shiftup'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onEscapeDown should do nothing', () => {
    service.onEscapeDown(new KeyboardEvent('escapedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onBackspaceDown should do nothing', () => {
    service.onBackspaceDown(new KeyboardEvent('backspacedown'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onDoubleClick should do nothing', () => {
    service.onDoubleClick(new MouseEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onWritingText should do nothing', () => {
    service.onWritingText(new KeyboardEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onMouseWheel should do nothing', () => {
    service.onMouseWheel(new WheelEvent('click'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKey should do nothing', () => {
    service.onAltKey(new KeyboardEvent('click'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyDown should do nothing', () => {
    service.onAltKeyDown(new KeyboardEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

  it('#onAltKeyUp should do nothing', () => {
    service.onAltKeyUp(new KeyboardEvent('doubleclick'));
    expect(true).toBeTruthy(); // placeholder test
  });

});
