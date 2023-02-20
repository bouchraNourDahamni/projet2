import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { FileExtensions } from 'src/app/enums/file-extensions';
import { ImageService } from '../Image/image.service';
import { ExportDrawingService } from './export-drawing.service';
import { IFileInfo } from './fileInfo';

const STRING_SVG_TEST = '<svg _ngcontent-cfi-c5="" ng-attr-x="0" ng-attr-y="0"\
                        xmlns="http://www.w3.org/2000/svg" width="2" height="2"\
                        fill="#000000"><rect _ngcontent-cfi-c5="" class="SVGBackground"\
                        fill-opacity="1" ng-attr-x="0" ng-attr-y="0" fill="#000000" width="2" height="2"></rect></svg>';
const matDialogMock = {
  // tslint:disable-next-line: no-empty
  open: () => {},
};

describe('ExportDrawingService', () => {
  let exportDrawingService: ExportDrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    providers: [ ImageService, {provide: MatDialog, useValue: matDialogMock}, HttpClient, HttpHandler ],
    });

    exportDrawingService = TestBed.get(ExportDrawingService);
    exportDrawingService['imageService'] = TestBed.get(ImageService);
  }));

  it('should be created', () => {
    expect(exportDrawingService).toBeTruthy();
  });

  it('#setCanvasDimensions should correctly set the width and height from imageService', () => {
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    const canvas: HTMLCanvasElement = exportDrawingService.renderer.createElement('canvas');
    exportDrawingService['setCanvasDimensions'](canvas);
    expect(canvas.width).toEqual(33);
    expect(canvas.height).toEqual(88);

  });

  it('#canvas should return an HTMLCanvasElement with the workspaceWidth and Height', () => {
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    expect(exportDrawingService['canvas']().width).toEqual(33);
    expect(exportDrawingService['canvas']().height).toEqual(88);
  });

  it('#imageType(FileExtensions.JPEG) should return "image/jpeg" ', () => {
    expect(exportDrawingService['imageType'](FileExtensions.JPEG)).toEqual('image/jpeg');
  });

  it('#imageType(FileExtensions.PNG) should return "image/png" ', () => {
    expect(exportDrawingService['imageType'](FileExtensions.PNG)).toEqual('image/png');
  });

  it('#exportImage should not download a file if abilityToSaveImage == false', () => {
    exportDrawingService['imageService'].abilityToSaveImage = false;
    spyOn<any>(exportDrawingService, 'triggerDownload').and.callThrough();
    exportDrawingService.exportImage('should-not-be-downloaded', FileExtensions.SVG);
    expect(exportDrawingService['triggerDownload']).not.toHaveBeenCalled();
  });

  it('#exportImage should download a svg file', () => {
    exportDrawingService['imageService'].abilityToSaveImage = true;
    spyOn<any>(exportDrawingService, 'triggerDownload').and.callThrough();
    exportDrawingService.exportImage('testSvg', FileExtensions.SVG);
    expect(exportDrawingService['triggerDownload']).toHaveBeenCalledWith(jasmine.any(String), 'testSvg', FileExtensions.SVG);
  });

  it('#exportImage should go through the PNG, JPEG and BMP case', () => {
    spyOn(exportDrawingService, 'exportImage').and.callThrough();
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    exportDrawingService['imageService'].abilityToSaveImage = true;
    exportDrawingService.exportImage('testPng', FileExtensions.PNG);
    exportDrawingService.exportImage('testJpeg', FileExtensions.JPEG);
    exportDrawingService.exportImage('testBmp', FileExtensions.BMP);

    expect(exportDrawingService.exportImage).toHaveBeenCalledWith('testPng', FileExtensions.PNG);
    expect(exportDrawingService.exportImage).toHaveBeenCalledWith('testJpeg', FileExtensions.JPEG);
    expect(exportDrawingService.exportImage).toHaveBeenCalledWith('testBmp', FileExtensions.BMP);
  });

  it('#onImageLoad should create a canvas and trigger download JPEG', () => {
    spyOn<any>(exportDrawingService, 'triggerDownload').and.callThrough();
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    const blob: Blob = new Blob([STRING_SVG_TEST], { type: 'image/svg+xml' });
    const domURL = window.URL || (window as any).webkitURL || window;
    const url: string = domURL.createObjectURL(blob);
    const newImage: HTMLImageElement = new Image();
    const fileInfo: IFileInfo = {fileName: 'onImageLoadTest', fileExtension: FileExtensions.JPEG};
    exportDrawingService['onImageLoad'](newImage, domURL, url, fileInfo);
    expect(exportDrawingService['triggerDownload']).toHaveBeenCalledWith(jasmine.any(String), 'onImageLoadTest', FileExtensions.JPEG);
  });

  it('#onImageLoad should create a canvas and trigger download PNG', () => {
    spyOn<any>(exportDrawingService, 'triggerDownload').and.callThrough();
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    const blob: Blob = new Blob([STRING_SVG_TEST], { type: 'image/svg+xml' });
    const domURL = window.URL || (window as any).webkitURL || window;
    const url: string = domURL.createObjectURL(blob);
    const newImage: HTMLImageElement = new Image();
    const fileInfo: IFileInfo = {fileName: 'onImageLoadTest', fileExtension: FileExtensions.PNG};
    exportDrawingService['onImageLoad'](newImage, domURL, url, fileInfo);
    expect(exportDrawingService['triggerDownload']).toHaveBeenCalledWith(jasmine.any(String), 'onImageLoadTest', FileExtensions.PNG);
  });

  it('#onImageLoad should create a canvas and trigger download BMP', () => {
    spyOn<any>(exportDrawingService, 'triggerDownload').and.callThrough();
    exportDrawingService['imageService'].workspaceWidth = 33;
    exportDrawingService['imageService'].workspaceHeight = 88;
    const blob: Blob = new Blob([STRING_SVG_TEST], { type: 'image/svg+xml' });
    const domURL = window.URL || (window as any).webkitURL || window;
    const url: string = domURL.createObjectURL(blob);
    const newImage: HTMLImageElement = new Image();
    const fileInfo: IFileInfo = {fileName: 'onImageLoadTest', fileExtension: FileExtensions.BMP};
    exportDrawingService['onImageLoad'](newImage, domURL, url, fileInfo);
    expect(exportDrawingService['triggerDownload']).toHaveBeenCalledWith(jasmine.any(String), 'onImageLoadTest', FileExtensions.BMP);
  });

});
