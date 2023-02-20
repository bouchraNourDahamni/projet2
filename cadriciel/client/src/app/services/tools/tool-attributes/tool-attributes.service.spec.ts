import { TestBed } from '@angular/core/testing';
import { StampTextures } from '../stamp/stamp-textures';
import { ToolAttributesService } from './tool-attributes.service';

describe('ToolAttributesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('ToolAttributesService should be created', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    expect(service).toBeTruthy();
  });

  it('#setLineWidth should set line width', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const width = 10;
    service.setLineWidth(width);
    service.currentLineWidth.subscribe((lineWidth: number) => {
      expect(lineWidth).toBe(width);
    });
  });

  it('#setFeatherLength should set feather length', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const length = 10;
    service.setFeatherLength(length);
    service.currentFeatherLength.subscribe((featherLength: number) => {
      expect(featherLength).toBe(length);
    });
  });

  it('#setSprayPerSecond should set set spary per second', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const spray = 50;
    service.setSprayPerSecond(spray);
    service.currentSprayPerSecond.subscribe((sprayPerSecond: number) => {
      expect(sprayPerSecond).toBe(spray);
    });
  });

  it('#setSprayDiameter should set spray diameter', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const diameter = 40;
    service.setSprayDiameter(diameter);
    service.currentSprayDiameter.subscribe((sprayDiameter: number) => {
      expect(sprayDiameter).toBe(diameter);
    });
  });

  it('#setColorTolerance should set color tolerance', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const tolerance = 40;
    service.setColorTolerance(tolerance);
    service.currentBucketTolerance.subscribe((toleranceBucket: number) => {
      expect(toleranceBucket).toBe(tolerance);
    });
  });

  it('#setOutlineWidth should set outline width of bucket', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const width = 10;
    service.setOutlineWidth(width);
    service.currentBucketOutlineWidth.subscribe((widthBucket: number) => {
      expect(widthBucket).toBe(width);
    });
  });

  it('#setLineWidthMin should set line width', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const width = 2;
    service.setLineWidthMin(width);
    service.currentLineWidthMin.subscribe((lineWidth: number) => {
      expect(lineWidth).toBe(width);
    });
  });

  it('#setLineWidthMax should set line width', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const width = 7;
    service.setLineWidthMax(width);
    service.currentLineWidthMax.subscribe((lineWidth: number) => {
      expect(lineWidth).toBe(width);
    });
  });

  it('#setSize should set size', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const size = 2;
    service.setSize(size);
    service.currentSize.subscribe((sizeTool: number) => {
      expect(size).toBe(sizeTool);
    });
  });

  it('#setLineTexture should set line texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'texture1';
    service.setLineTexture(texture);
    service.currentLineTexture.subscribe((toolTexture: string) => {
      expect(toolTexture).toBe(texture);
    });
  });

  it('#setMode should set mode', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const mode = 'none';
    service.setMode(mode);
    service.currentMode.subscribe((toolMode: string) => {
      expect(toolMode).toBe(mode);
    });
  });

  it('#setStampTexture should set the stamp texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'stamp1';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.Stamp1);
    });
  });

  it('#setSides should set sides', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const sides = 5;
    service.setSides(sides);
    service.currentPolygonSides.subscribe((toolSide: number) => {
      expect(toolSide).toBe(sides);
    });
  });

  it('#setVerticesRadius should set vertices radius', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const vertices = '5';
    service.setVerticesRadius(vertices);
    service.currentVerticesRadius.subscribe((toolVertice: string) => {
      expect(toolVertice).toBe(vertices);
    });
  });

  it('#setAngle should set angles', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const angle = 180;
    service.setAngle(angle);
    service.currentAngle.subscribe((toolAngle: number) => {
      expect(toolAngle).toBe(angle);
    });
  });

  it('#setStampTexture should set the stamp texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'stamp2';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.Stamp2);
    });
  });

  it('#setStampTexture should set the stamp texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'stamp3';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.Stamp3);
    });
  });

  it('#setStampTexture should set the stamp texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'stamp4';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.Stamp4);
    });
  });

  it('#setStampTexture should set the stamp texture', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'stamp5';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.Stamp5);
    });
  });

  it('#setStampTexture should set the texture to none when texture is none', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const texture = 'none';
    service.setStampTexture(texture);
    service.currentStampTexture.subscribe((stampTexture: StampTextures) => {
      expect(stampTexture).toBe(StampTextures.None);
    });
  });

  it('#setOutlineMode should set the outlineMode to the given value', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const outlineMode = 'blublu';
    service.setOutlineMode(outlineMode);
    service.currentOutlineMode.subscribe((outline: string) => {
      expect(outline).toBe('blublu');
    });
  });

  it('#setLineMode should set the line mode to the given value', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const lineMode = 'gugu';
    service.setLineMode(lineMode);
    service.currentLineMode.subscribe((line: string) => {
      expect(line).toBe('gugu');
    });
  });

  it('#setCornerMode should set the corner mode to the given value', () => {
    const service: ToolAttributesService = TestBed.get(ToolAttributesService);
    const cornerMode = 'coincoin';
    service.setCornerMode(cornerMode);
    service.currentCornerMode.subscribe((corner: string) => {
      expect(corner).toBe('coincoin');
    });
  });

});
