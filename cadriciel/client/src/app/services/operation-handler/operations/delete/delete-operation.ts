import { SvgManagerService } from '../../../svg-manager/svg-manager.service';
import { AbstractOperation } from '../operation';

export class DeleteOperation implements AbstractOperation {
    private deletedElements: SVGElement[];
    private svgManager: SvgManagerService;
    constructor(deletedElements: SVGElement[], svgManager: SvgManagerService) {
        this.deletedElements = deletedElements;
        this.svgManager = svgManager;
    }

    public undo(): void {
        for (const drawing of this.deletedElements) {
            this.svgManager.addElement(drawing);
        }
    }

    public redo(): void {
        for (const drawing of this.deletedElements) {
            this.svgManager.deleteElement(drawing);
        }
    }
}
