import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractSelectionOperationService {

  constructor() { return; }

  public cleanUp(): void { return; }
  public onMouseDown(event: MouseEvent): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

}
