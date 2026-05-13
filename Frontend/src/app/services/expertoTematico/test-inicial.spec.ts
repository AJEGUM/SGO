import { TestBed } from '@angular/core/testing';

import { TestInicial } from './test-inicial';

describe('TestInicial', () => {
  let service: TestInicial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestInicial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
