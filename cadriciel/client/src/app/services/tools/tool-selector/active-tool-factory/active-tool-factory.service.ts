import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrushTextures } from '../../../../components/tools/brush-tool/brush-textures';
import { Tools } from '../../../../enums/tools';
import { AerosolService } from '../../aerosol/aerosol.service';
import { ColorApplicatorService } from '../../color-applicator/color-applicator.service';
import { ColorBucketService } from '../../color-bucket/color-bucket.service';
import { EraserService } from '../../eraser/eraser.service';
import { FeatherService } from '../../feather/feather.service';
import { LineService } from '../../line/line.service';
import { PenService } from '../../pen/pen.service';
import { PencilService } from '../../pencil/pencil.service';
import { PipetteService } from '../../pipette/pipette.service';
import { SelectionManagerService } from '../../selection/selection-manager/selection-manager.service';
import { EllipseService } from '../../shape/ellipse/ellipse.service';
import { PolygonService } from '../../shape/polygon/polygon.service';
import { RectangleService } from '../../shape/rectangle/rectangle.service';
import { StampService } from '../../stamp/stamp.service';
import { TextService } from '../../text/text.service';
import { ToolAttributesService } from '../../tool-attributes/tool-attributes.service';
import { AbstractToolService } from '../../tool/tool.service';
import { ToolSelectorService } from '../tool-selector.service';

const PENCIL_INITIAL_TEXTURE = 'none';

@Injectable({
  providedIn: 'root',
})
export class ActiveToolFactoryService {

  private toolSourceService: BehaviorSubject<AbstractToolService>;
  public currentToolService: Observable<AbstractToolService>;

  constructor(
    private toolSelector: ToolSelectorService,
    private aerosolTool: AerosolService,
    private pencilTool: PencilService,
    private rectangleTool: RectangleService,
    private colorApplicator: ColorApplicatorService,
    private ellipseTool: EllipseService,
    private lineTool: LineService,
    private polygonTool: PolygonService,
    private stampTool: StampService,
    private pipetteTool: PipetteService,
    private selectionTool: SelectionManagerService,
    private eraserTool: EraserService,
    private penTool: PenService,
    private featherTool: FeatherService,
    private textTool: TextService,
    private colorBucketTool: ColorBucketService,
    private toolAttributesService: ToolAttributesService) {
      this.toolSourceService = new BehaviorSubject<AbstractToolService>(this.pencilTool);
      this.currentToolService = this.toolSourceService.asObservable();
      this.toolSelector.currentTool.subscribe((newTool: Tools) => {
        this.setNewTool(newTool);
      });
  }

  private setNewTool(tool: Tools) {
    switch (tool) {
      case Tools.Pencil:
        this.toolSourceService.next(this.pencilTool);
        this.toolAttributesService.setLineTexture(PENCIL_INITIAL_TEXTURE);
        break;
      case Tools.Brush:
        this.toolSourceService.next(this.pencilTool);
        this.toolAttributesService.setLineTexture(BrushTextures.Texture1);
        break;
      case Tools.Rectangle:
        this.toolSourceService.next(this.rectangleTool);
        break;
      case Tools.Ellipse:
        this.toolSourceService.next(this.ellipseTool);
        break;
      case Tools.Polygon:
        this.toolSourceService.next(this.polygonTool);
        break;
      case Tools.ColorApplicator:
        this.toolSourceService.next(this.colorApplicator);
        break;
      case Tools.Line:
        this.toolSourceService.next(this.lineTool);
        break;
      case Tools.Stamp:
        this.toolSourceService.next(this.stampTool);
        break;
      case Tools.Pipette:
        this.toolSourceService.next(this.pipetteTool);
        break;
      case Tools.Selection:
        this.toolSourceService.next(this.selectionTool);
        break;
      case Tools.Eraser:
        this.toolSourceService.next(this.eraserTool);
        break;
      case Tools.Pen:
        this.toolSourceService.next(this.penTool);
        break;
      case Tools.Text:
        this.toolSourceService.next(this.textTool);
        break;
      case Tools.Aerosol:
        this.toolSourceService.next(this.aerosolTool);
        break;
      case Tools.Feather:
        this.toolSourceService.next(this.featherTool);
        break;
      case Tools.ColorBucket:
        this.toolSourceService.next(this.colorBucketTool);
        break;
      default:
        this.toolSourceService.next(this.pencilTool);
    }
  }
}
