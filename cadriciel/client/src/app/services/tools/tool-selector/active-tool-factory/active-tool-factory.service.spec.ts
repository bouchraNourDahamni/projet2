import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { Tools } from 'src/app/enums/tools';
import { ImageService } from 'src/app/services/Image/image.service';
import { AbstractToolService } from '../../tool/tool.service';
import { ActiveToolFactoryService } from './active-tool-factory.service';

const matDialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('ActiveToolFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ImageService, {provide: MatDialog, useValue: matDialogMock} ],
    });
  });

  it('ActiveToolFactory should be created', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    expect(service).toBeTruthy();
  });

  it('#setNewTool should set a tool to pencil', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Pencil;
    service['setNewTool'](tool);
    service['toolSelector'].currentTool.subscribe((newTool: Tools) => {
      expect(newTool).toBe(tool);
    });
  });

  it('#setNewTool should set a toolSourceService to pencilService when given Pencil', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Pencil;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['pencilTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to toolService when given brush', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Brush;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['pencilTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to rectangleService when given rectangle', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Rectangle;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['rectangleTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to ellipseService when given ellipse', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Ellipse;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['ellipseTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to polygonService when given polygon', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Polygon;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['polygonTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to colorApplicatorService when given colorApplicator', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.ColorApplicator;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['colorApplicator']);
    });
  });

  it('#setNewTool should set a toolSourceService to lineService when given Line', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Line;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['lineTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to stampService when given stamp', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Stamp;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['stampTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to pipetteService when given pipette', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Pipette;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['pipetteTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to selectionService when given selection', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Selection;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['selectionTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to eraserService when given eraser', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Eraser;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['eraserTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to penService when given pen', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Pen;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['penTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to textService when given text', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Text;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['textTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to aerosolService when given aerosol', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Aerosol;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['aerosolTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to featherService when given feather', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.Feather;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['featherTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to penService when given nothing valid', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = 'dummy' as Tools;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['pencilTool']);
    });
  });

  it('#setNewTool should set a toolSourceService to penService when given nothing valid', () => {
    const service: ActiveToolFactoryService = TestBed.get(ActiveToolFactoryService);
    const tool = Tools.ColorBucket;
    service['setNewTool'](tool);
    service.currentToolService.subscribe((newTool: AbstractToolService) => {
      expect(newTool).toBe(service['colorBucketTool']);
    });
  });
});
