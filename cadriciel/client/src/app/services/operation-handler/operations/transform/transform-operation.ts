import { Renderer2 } from '@angular/core';
import { SVGAttributes } from '../../../../enums/svg-attributes';
import { SelectionService } from '../../../tools/selection/selection-operation/selection/selection.service';
import { AbstractOperation } from '../operation';

export class TransformOperation implements AbstractOperation {

    private modifiedDrawings: SVGElement[];
    private oldTransforms: string[];
    private newTransforms: string[];
    private renderer: Renderer2;
    private selectionService: SelectionService;

    constructor(
        modifiedDrawings: SVGElement[],
        oldTransforms: string[],
        newTransforms: string[],
        renderer: Renderer2,
        selectionService: SelectionService) {
            this.modifiedDrawings = modifiedDrawings;
            this.oldTransforms = oldTransforms;
            this.newTransforms = newTransforms;
            this.renderer = renderer;
            this.selectionService = selectionService;
    }

    public undo() {
        for (let i = 0; i < this.modifiedDrawings.length; i++) {
            this.renderer.setAttribute(this.modifiedDrawings[i], SVGAttributes.Transform, this.oldTransforms[i]);
        }
        this.selectionService.clearSelection();
    }

    public redo() {
        for (let i = 0; i < this.modifiedDrawings.length; i++) {
            this.renderer.setAttribute(this.modifiedDrawings[i], SVGAttributes.Transform, this.newTransforms[i]);
        }
        this.selectionService.clearSelection();
    }
}
