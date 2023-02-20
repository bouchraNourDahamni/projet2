import { Injectable } from '@angular/core';

@Injectable()
export abstract class AbstractToolService {
  public onMouseDown(event: MouseEvent): void { return; }

  public onMouseUp(event: MouseEvent): void { return; }

  public onMouseMove(event: MouseEvent): void { return; }

  public onMouseWheel(event: WheelEvent): void { return; }

  public onAltKeyDown(event: KeyboardEvent): void { return; }

  public onAltKeyUp(event: KeyboardEvent): void { return; }

  public onShiftDown(event: KeyboardEvent): void { return; }

  public onShiftUp(event: KeyboardEvent): void { return; }

  public onEscapeDown(event: KeyboardEvent): void { return; }

  public onBackspaceDown(event: KeyboardEvent): void { return; }

  public onDoubleClick(event: MouseEvent): void { return; }

  public onWritingText(event: KeyboardEvent): void { return; }

  public cleanUp(): void { return; }
}
