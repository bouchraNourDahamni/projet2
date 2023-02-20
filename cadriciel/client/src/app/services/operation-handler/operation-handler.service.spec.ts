import { TestBed } from '@angular/core/testing';
import { OperationHandlerService } from './operation-handler.service';
import { AbstractOperation} from './operations/operation';

describe('OperationHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  class MockOperation implements AbstractOperation {
    // tslint:disable-next-line: no-empty
    constructor() {}
    public undo(): void { return; }
    public redo(): void { return; }
  }

  it('should be created', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    expect(service).toBeTruthy();
  });

  it('#undo should do nothing if canUndo is false', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    spyOn<any>(service, 'updateObservables').and.callThrough();
    service.undo();
    expect(service['updateObservables']).not.toHaveBeenCalled();
  });

  it('#undo should call operations.undo and decrease the operationIndex if canUndo is true', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    service['lastOperationIndex'] = 1;
    service['updateObservables']();
    const operation1 = new MockOperation();
    const operation2 = new MockOperation();
    service['operations'] = [operation1, operation2];
    spyOn<any>(service['operations'][1], 'undo').and.callThrough();
    service.undo();
    expect(service['operations'][1]['undo']).toHaveBeenCalled();
    expect(service['lastOperationIndex']).toEqual(0);
  });

  it('#redo should do nothing if canRedo is false', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    spyOn<any>(service, 'updateObservables').and.callThrough();
    service.redo();
    expect(service['updateObservables']).not.toHaveBeenCalled();
  });

  it('#undo should call operations.undo and increase the operationIndex if canRedo is true', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    service['lastOperationIndex'] = 0;
    const operation1 = new MockOperation();
    const operation2 = new MockOperation();
    service['operations'] = [operation1, operation2];
    service['updateObservables']();
    spyOn<any>(service['operations'][1], 'redo').and.callThrough();
    service.redo();
    expect(service['operations'][1]['redo']).toHaveBeenCalled();
    expect(service['lastOperationIndex']).toEqual(1);
  });

  it('#addOperation should call updateObservables, push new operation and increase the operationIndex ', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    spyOn<any>(service, 'updateObservables').and.callThrough();
    const operation = new MockOperation();
    spyOn<any>(service['operations'], 'slice').and.returnValue([]);
    service['addOperation'](operation);
    expect(service['lastOperationIndex']).toEqual(0);
    expect(service['updateObservables']).toHaveBeenCalled();
    expect(service['operations']).toEqual([operation]);
  });

  it('#clearOperations should reset everything', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    spyOn<any>(service, 'updateObservables').and.callThrough();
    const operation = new MockOperation();
    service['operations'] = [operation];
    service['lastOperationIndex'] = 1;
    service['clearOperations']();
    expect(service['updateObservables']).toHaveBeenCalled();
    expect(service['operations']).toEqual([]);
    expect(service['lastOperationIndex']).toEqual(-1);
  });

  it('#updateObservables should update the booleans', () => {
    const service: OperationHandlerService = TestBed.get(OperationHandlerService);
    const operation1 = new MockOperation();
    const operation2 = new MockOperation();
    service['operations'] = [operation1, operation2];
    service['lastOperationIndex'] = 0;
    service['updateObservables']();
    service.canUndo.subscribe((bool: boolean) => {
      expect(bool).toBeTruthy();
    });
    service.canRedo.subscribe((bool: boolean) => {
      expect(bool).toBeTruthy();
    });
  });

});
