import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractOperation } from './operations/operation';

const DEFAULT_LAST_OPERATION_INDEX = -1;

@Injectable({
  providedIn: 'root',
})
export class OperationHandlerService {

  public canUndo: Observable<boolean>;
  public canRedo: Observable<boolean>;

  private canUndoBehavior: BehaviorSubject<boolean>;
  private canRedoBehavior: BehaviorSubject<boolean>;
  private operations: AbstractOperation[];
  private lastOperationIndex: number;

  constructor() {
    this.canUndoBehavior = new BehaviorSubject(false);
    this.canRedoBehavior = new BehaviorSubject(false);
    this.canUndo = this.canUndoBehavior.asObservable();
    this.canRedo = this.canRedoBehavior.asObservable();
    this.operations = [];
    this.lastOperationIndex = DEFAULT_LAST_OPERATION_INDEX;
  }

  public undo(): void {
    if (this.canUndoBehavior.value) {
      this.operations[this.lastOperationIndex].undo();
      this.lastOperationIndex--;
      this.updateObservables();
    }
  }

  public redo(): void {
    if (this.canRedoBehavior.value) {
      this.lastOperationIndex++;
      this.operations[this.lastOperationIndex].redo();
      this.updateObservables();
    }
  }

  public addOperation(operation: AbstractOperation): void {
    this.lastOperationIndex++;
    this.operations = this.operations.slice(0, this.lastOperationIndex);
    this.operations.push(operation);
    this.updateObservables();
  }

  public clearOperations(): void {
    this.operations = [];
    this.lastOperationIndex = DEFAULT_LAST_OPERATION_INDEX;
    this.updateObservables();
  }

  private updateObservables(): void {
    this.canUndoBehavior.next(this.lastOperationIndex >= 0);
    this.canRedoBehavior.next(this.lastOperationIndex < this.operations.length - 1);
  }
}
