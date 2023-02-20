import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap';
import { ColorSketchModule } from 'ngx-color/sketch';
import { AlertResponseComponent } from './components/alert-response/alert-response.component';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app/app.component';
import { ColorDialogComponent } from './components/color-dialog/color-dialog.component';
import { ColorSelectorComponent } from './components/color-selector/color-selector.component';
import { EntryDialogComponent } from './components/entry-dialog/entry-dialog.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { LateralBarBottomComponent } from './components/lateral-bar-bottom/lateral-bar-bottom.component';
import { LateralBarTopComponent } from './components/lateral-bar-top/lateral-bar-top.component';
import { NewDrawingComponent } from './components/new-drawing/new-drawing.component';
import { OpenLocalDrawingComponent } from './components/open-local-drawing/open-local-drawing.component';
import { OpenServerDrawingComponent } from './components/open-server-drawing/open-server-drawing.component';
import { PannelComponent } from './components/pannel/pannel.component';
import { SaveDrawingLocalDialogComponent } from './components/save-drawing-local-dialog/save-drawing-local-dialog.component';
import { SaveDrawingServerDialogComponent} from './components/save-drawing-server-dialog/save-drawing-server-dialog.component';
import { SaveComponent } from './components/save/save.component';
import { AerosolToolComponent } from './components/tools/aerosol-tool/aerosol-tool.component';
import { BrushToolComponent } from './components/tools/brush-tool/brush-tool.component';
import { ColorBucketToolComponent } from './components/tools/color-bucket-tool/color-bucket-tool.component';
import { EllipseToolComponent } from './components/tools/ellipse-tool/ellipse-tool.component';
import { EraserToolComponent } from './components/tools/eraser-tool/eraser-tool.component';
import { FeatherToolComponent } from './components/tools/feather-tool/feather-tool.component';
import { GridToolComponent } from './components/tools/grid-tool/grid-tool.component';
import { LineToolComponent } from './components/tools/line-tool/line-tool.component';
import { PenToolComponent } from './components/tools/pen-tool/pen-tool.component';
import { PencilToolComponent } from './components/tools/pencil-tool/pencil-tool.component';
import { PolygonToolComponent } from './components/tools/polygon-tool/polygon-tool.component';
import { RectangleToolComponent } from './components/tools/rectangle-tool/rectangle-tool.component';
import { SelectionToolComponent } from './components/tools/selection-tool/selection-tool.component';
import { StampToolComponent } from './components/tools/stamp-tool/stamp-tool.component';
import { TextToolComponent } from './components/tools/text-tool/text-tool.component';
import { UserGuideComponent } from './components/user-guide/user-guide.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { AvailableSpaceService } from './services/available-space/available-space.service';
import { ColorService } from './services/color/color.service';
import { ImageService} from './services/Image/image.service';
import { PencilService } from './services/tools/pencil/pencil.service';

@NgModule({
  declarations: [
    AppComponent,
    LateralBarTopComponent,
    LateralBarBottomComponent,
    PannelComponent,
    EntryDialogComponent,
    ColorSelectorComponent,
    ColorDialogComponent,
    NewDrawingComponent,
    WorkspaceComponent,
    RectangleToolComponent,
    PencilToolComponent,
    BrushToolComponent,
    AlertResponseComponent,
    EllipseToolComponent,
    GridToolComponent,
    StampToolComponent,
    SaveDrawingServerDialogComponent,
    PolygonToolComponent,
    LineToolComponent,
    AlertComponent,
    OpenServerDrawingComponent,
    EraserToolComponent,
    PenToolComponent,
    SelectionToolComponent,
    TextToolComponent,
    OpenLocalDrawingComponent,
    SaveDrawingLocalDialogComponent,
    ExportDrawingComponent,
    SaveComponent,
    UserGuideComponent,
    AerosolToolComponent,
    FeatherToolComponent,
    ColorBucketToolComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ColorSketchModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    AlertModule.forRoot(),
  ],
  entryComponents: [
    ColorDialogComponent,
    NewDrawingComponent,
    EntryDialogComponent,
    AlertResponseComponent,
    SaveDrawingServerDialogComponent,
    SaveDrawingLocalDialogComponent,
    AlertComponent,
    OpenServerDrawingComponent,
    OpenLocalDrawingComponent,
    SaveComponent,
    ExportDrawingComponent,
    UserGuideComponent],
  providers: [AvailableSpaceService, ColorService , PencilService , ImageService ] ,
  bootstrap: [AppComponent],
})
export class AppModule {
}
