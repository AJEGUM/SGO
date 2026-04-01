import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { invitacionGuard } from './invitacion-guard';

describe('invitacionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => invitacionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
