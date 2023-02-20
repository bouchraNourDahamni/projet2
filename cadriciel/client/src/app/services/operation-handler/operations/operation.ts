export abstract class AbstractOperation {

  // tslint:disable-next-line: no-empty
  constructor() { }

  public undo(): void { return; }
  public redo(): void { return; }
}
