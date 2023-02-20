import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { AlertResponseComponent } from '../../components/alert-response/alert-response.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { OperationHandlerService } from '../../services/operation-handler/operation-handler.service';
import { SvgManagerService } from '../../services/svg-manager/svg-manager.service';

const ALERT_WORKSPACE_CHANGE = 'You have changes in your workspace, that you haven\'t saved! If you want to abort them click on yes.';
const ALERT_VALID_FILE = 'We can\'t open that type of File in PolyDrawing, we can just open the files\
                          that you have saved using PolyDrawing.';
const TAG_NAME = 'g';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  public alreadySave: boolean;
  private svgContainer: SVGElement;
  private svgElements: SVGElement[];
  public image: string;
  public abilityToSaveImage: boolean;
  private svg: SVGElement;
  private imageWidth: number;
  private imageHeight: number;
  private imageBackground: string | null;
  public validDimension: boolean;
  public workspaceHeight: number;
  public workspaceWidth: number;
  public workspaceBackground: string;

  constructor(
    private svgManager: SvgManagerService,
    private dialog: MatDialog,
    private operationHandlerService: OperationHandlerService) {
      this.abilityToSaveImage = false;
      this.validDimension = true;
      this.alreadySave = false;
  }

  public alertChange(): void {
    if (this.svgManager.hasBeenModified && !(this.alreadySave)) {
      const dialogRef = this.dialog.open(AlertResponseComponent, {
        data: ALERT_WORKSPACE_CHANGE,
        width: '40vw',
        height: '35vh',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((userResponse) => {
        if (userResponse) {
          this.openDrawing();
        }
      });
    } else {
      this.openDrawing();
    }
    this.alreadySave = false;
  }

  private openDrawing(): void {
    this.operationHandlerService.clearOperations();
    this.svg = this.svgManager.renderer.createElement(SVGAttributes.SVG, SVGAttributes.SVG);
    this.svg.innerHTML = this.image;
    this.svgContainer = this.svgManager.renderer.createElement(SVGAttributes.SVG, SVGAttributes.SVG);
    this.svgContainer.innerHTML = (this.svg.getElementsByTagName(TAG_NAME)[1]).innerHTML;
    this.svgElements = Array.from(this.svgContainer.children) as SVGElement[];
    this.setLocalImageDimension();
    this.validateDimension();
  }

  private validateDimension(): void {
    if (this.validDimension) {
      this.svgManager.createDrawing(this.imageHeight, this.imageWidth, this.imageBackground as string);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.svgElements.length; i++) {
        this.svgManager.addElement(this.svgElements[i]);
      }
    } else {
      this.dialog.open(AlertComponent, {
        data: ALERT_VALID_FILE,
        disableClose: true,
      });
    }
  }

  private setLocalImageDimension(): void {
    const svgPerimeter: SVGElement = this.svg.firstElementChild as SVGElement;
    if (svgPerimeter.firstElementChild !== null) {
      // tslint:disable-next-line: no-non-null-assertion
      if (svgPerimeter.firstElementChild.getAttribute(SVGAttributes.Width) !== null) {
        this.validDimension = true;
        this.imageWidth = Number(svgPerimeter.firstElementChild.getAttribute(SVGAttributes.Width));
        this.imageHeight = Number(svgPerimeter.firstElementChild.getAttribute(SVGAttributes.Height));
        this.imageBackground = svgPerimeter.firstElementChild.getAttribute(SVGAttributes.Fill);
      } else {
        this.validDimension = false;
      }
    }
  }

}
