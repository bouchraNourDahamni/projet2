import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { IEraserCursorAttributes } from 'src/app/interfaces/eraser-cursor';
import { EraserCursorService } from 'src/app/services/tools/eraser/eraser-cursor/eraser-cursor.service';
import { ImageService } from '../../services/Image/image.service';
import { OperationHandlerService } from '../../services/operation-handler/operation-handler.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { SvgManagerService } from '../../services/svg-manager/svg-manager.service';
import { ColorBucketSvgService } from '../../services/tools/color-bucket/color-bucket-svg/color-bucket-svg.service';
import { GridService } from '../../services/tools/grid/grid.service';
import { SelectionService } from '../../services/tools/selection/selection-operation/selection/selection.service';
import { TranslationService } from '../../services/tools/selection/selection-operation/translation/translation.service';
import { ActiveToolFactoryService } from '../../services/tools/tool-selector/active-tool-factory/active-tool-factory.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { AbstractToolService } from '../../services/tools/tool/tool.service';
import { Tools } from './../../enums/tools';

const DEFAULT_BACKGROUND = '#ffffff';
const DEFAULT_COLOR = ' ';

const TOGGLE_GRID_KEY = 'g';
const TOGGLE_MAGNETISM = 'm';
const SCALE_UP_GRID_KEY = '+';
const SCALE_DOWN_GRID_KEY = '-';
const DEFAULT_ERASER_BORDER_COLOR = 'transparent';
const ERASER_BLACK_BORDER_COLOR = 'black';
const ERASER_VISIBLE = 'visible';
const ERASER_HIDDEN = 'hidden';

const CUT_SHORTCUT = 'x';
const COPY_SHORTCUT = 'c';
const PASTE_SHORTCUT = 'v';
const DUPLICATE_SHORTCUT = 'd';
const DELETE_SHORTCUT = 'Delete';
const SELECT_ALL_SHORTCUT = 'a';
const UNDO_SHORTCUT = 'KeyZ';
const SHIFT_LEFT = 'ShiftLeft';
const ALT_LEFT = 'AltLeft';

const PX = 'px';
const ZERO_PX = '0px';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})

export class WorkspaceComponent implements OnInit, AfterViewInit {
  public isWaiting: boolean;

  public primaryColor: string;
  public secondaryColor: string;
  public safeHTML: SafeHtml;
  public background: string;
  private toolSelected: Tools;

  public eraserBorderColor: string;
  public eraserLeft: string;
  public eraserTop: string;
  public eraserMarginLeft: string;
  public eraserMarginTop: string;
  public eraserWidth: string;
  public eraserHeight: string;
  public eraserVisibility: string;
  private eraserCursorAttributes: IEraserCursorAttributes;

  private activeTool: AbstractToolService;

  @Input() public workspaceWidth: number;
  @Input() public workspaceHeight: number;
  @ViewChild('myWorkspace', { static: true }) private workSpaceRef: ElementRef;
  @ViewChild('anchorSVG', { static: false }) private anchorSVG: ElementRef;
  @ViewChild('anchorGrid', { static: false }) private anchorGrid: ElementRef;

  constructor(
    private svgManager: SvgManagerService,
    private toolSelector: ToolSelectorService,
    private activeToolFactory: ActiveToolFactoryService,
    private imageService: ImageService,
    private shortcutManager: ShortcutManagerService,
    private gridService: GridService,
    private eraserCursorService: EraserCursorService,
    private selectionService: SelectionService,
    private operationHandler: OperationHandlerService,
    private translationService: TranslationService,
    private bucketService: ColorBucketSvgService) {
      this.background = DEFAULT_BACKGROUND;
      this.primaryColor = DEFAULT_COLOR;
      this.secondaryColor = DEFAULT_COLOR;
      this.eraserBorderColor = DEFAULT_ERASER_BORDER_COLOR;
      this.isWaiting = false;
  }

  public ngOnInit(): void {
    this.activeToolFactory.currentToolService.subscribe((currentToolService: AbstractToolService) => {
      this.activeTool = currentToolService;
    });
    this.toolSelector.currentTool.subscribe((currentTool: Tools) => {
      this.toolSelected = currentTool;
      this.setEraserCursor();
    });
    this.svgManager.currentWidth.subscribe((workspaceWidth: number) => {
      this.workspaceWidth = workspaceWidth;
      this.sendImageToService();
    });
    this.svgManager.currentHeight.subscribe((workspaceHeight: number) => {
      this.workspaceHeight = workspaceHeight;
      this.sendImageToService();
    });
    this.svgManager.currentBackground.subscribe((background: string) => {
      this.background = background;
      this.sendImageToService();
    });
    this.eraserCursorService.currentEraserCursorAttributes.subscribe((attributes: IEraserCursorAttributes) => {
      this.eraserCursorAttributes = attributes;
    });
    this.bucketService.isProcessing.subscribe((isProcessing: boolean) => {
      this.isWaiting = isProcessing;
    });
  }

  public ngAfterViewInit(): void {
    this.svgManager.svgAnchor = this.anchorSVG;
    this.svgManager.workspace = this.workSpaceRef;
    this.gridService.anchorGrid = this.anchorGrid;
  }

  public sendImageToService(): void {
    this.imageService.image = this.workSpaceRef.nativeElement.innerHTML;
    this.imageService.workspaceHeight = this.workspaceHeight;
    this.imageService.workspaceWidth = this.workspaceWidth;
    this.imageService.workspaceBackground = this.background;
  }

  public setEraserCursor(): void {
    if (this.toolSelected === Tools.Eraser) {
      this.eraserBorderColor = ERASER_BLACK_BORDER_COLOR;
      this.eraserLeft = this.eraserCursorAttributes.left + PX;
      this.eraserTop = this.eraserCursorAttributes.top + PX;
      this.eraserMarginLeft = this.eraserCursorAttributes.marginLeft + PX;
      this.eraserMarginTop = this.eraserCursorAttributes.marginTop + PX;
      this.eraserWidth = this.eraserCursorAttributes.width + PX;
      this.eraserHeight = this.eraserCursorAttributes.height + PX;
      this.eraserVisibility = ERASER_VISIBLE;
    } else {
      this.eraserBorderColor = DEFAULT_ERASER_BORDER_COLOR;
      this.eraserBorderColor = this.background;
      this.eraserWidth = ZERO_PX;
      this.eraserHeight = ZERO_PX;
      this.eraserVisibility = ERASER_HIDDEN;
    }
  }

  public onMouseDown(event: MouseEvent): void {
    this.activeTool.onMouseDown(event);
  }

  public onMouseUp(event: MouseEvent): void {
    this.activeTool.onMouseUp(event);
    this.sendImageToService();
  }

  public onMouseMove(event: MouseEvent): void {
    this.activeTool.onMouseMove(event);
    this.setEraserCursor();
    this.sendImageToService();
  }

  @HostListener('window:keypress', ['$event'])
  public onPress(event: KeyboardEvent): void {
    if (!this.shortcutManager.shortcutBlocked) {
      if (event.key === TOGGLE_GRID_KEY) {
        this.gridService.toggleGrid();
      }
      if (event.key === TOGGLE_MAGNETISM) {
        this.translationService.toggleMag();
      }
      if (event.key === SCALE_UP_GRID_KEY) {
        this.gridService.scaleGridUp();
      }
      if (event.key === SCALE_DOWN_GRID_KEY) {
        this.gridService.scaleGridDown();
      }
    }
    this.activeTool.onWritingText(event);
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if (event.code === SHIFT_LEFT) {
      this.activeTool.onShiftDown(event);
    }
    if (event.code === ALT_LEFT) {
      this.activeTool.onAltKeyDown(event);
    }
    if (!this.shortcutManager.shortcutBlocked) {
      if (event.key === DELETE_SHORTCUT) {
        this.selectionService.deleteSelection();
      }
      if (event.ctrlKey) {
        if (event.key === CUT_SHORTCUT) {
          this.selectionService.cut();
        }
        if (event.key === COPY_SHORTCUT) {
          this.selectionService.copy();
        }
        if (event.key === PASTE_SHORTCUT) {
          this.selectionService.paste();
          this.toolSelector.setCurrentTool(Tools.Selection);
        }
        if (event.key === DUPLICATE_SHORTCUT) {
          this.selectionService.duplicate();
        }
        if (event.key === SELECT_ALL_SHORTCUT) {
          this.selectionService.selectAll();
          this.toolSelector.setCurrentTool(Tools.Selection);
        }
        if (event.code === UNDO_SHORTCUT) {
          if (event.shiftKey) {
            this.operationHandler.redo();
          } else {
            this.operationHandler.undo();
          }
        }
      }
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  public onEscapeDown(event: KeyboardEvent): void {
    this.activeTool.onEscapeDown(event);
  }

  @HostListener('window:keydown.backspace', ['$event'])
  public onBackSpaceDown(event: KeyboardEvent): void {
    this.activeTool.onBackspaceDown(event);
  }

  public onDoubleClick(event: MouseEvent): void {
    this.activeTool.onDoubleClick(event);
  }

  @HostListener('contextmenu', ['$event'])
  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  @HostListener('window:keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.code === SHIFT_LEFT) {
      this.activeTool.onShiftUp(event);
    }
    if (event.code === ALT_LEFT) {
      this.activeTool.onAltKeyUp(event);
    }
  }

  public onMouseWheel(event: WheelEvent): void {
    this.activeTool.onMouseWheel(event);
  }
}
