import { TestBed } from '@angular/core/testing';
import { EntryDialogService } from './entry-dialog.service';

const service: EntryDialogService = TestBed.get(EntryDialogService);

describe('EntryDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a dialog', () => {
    expect(service).toBeTruthy();
  });

  it('#changeValue() should toggle "checked" ', () => {
    expect(service.checked).toBe('notChecked', 'off at first');
    service.changeValue();
    expect(service.checked).toBe('checked', 'on after checked');
    service.changeValue();
    expect(service.checked).toBe('notChecked', 'off after second click');
  });
});
