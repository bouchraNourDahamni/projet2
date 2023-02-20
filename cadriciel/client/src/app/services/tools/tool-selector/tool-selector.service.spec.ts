import { TestBed } from '@angular/core/testing';
import { Tools } from './../../../enums/tools';
import { ToolSelectorService } from './tool-selector.service';

describe('ToolSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('ToolSelectorService should be created', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    expect(service).toBeTruthy();
  });

  it ('#setCurrentTool should not set current tool when given an undefined var', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool1 = Tools.Pencil;
    service.setCurrentTool(tool1);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool1);
    });

    // tslint:disable-next-line: prefer-const
    let tool2: undefined;
    service.setCurrentTool(tool2);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool1);
    });
  });

  it ('#setCurrentTool should set Brush tool when given Brush', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Rectangle tool when given Rectangle', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Ellipse tool when given Ellipse', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Polygon tool when given Polygon', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set ColorApplicator tool when given ColorApplicator', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Line tool when given Line', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Stamp tool when given Stamp', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Pipette tool when given Pipette', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Selection tool when given Selection', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Eraser tool when given Eraser', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Pen tool when given Pen', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });

  it ('#setCurrentTool should set Text tool when given Text', () => {
    const service: ToolSelectorService = TestBed.get(ToolSelectorService);
    const tool = Tools.Pencil;
    service.setCurrentTool(tool);
    service.currentTool.subscribe((toolSelected: string) => {
      expect(toolSelected).toBe(tool);
    });
  });
});
