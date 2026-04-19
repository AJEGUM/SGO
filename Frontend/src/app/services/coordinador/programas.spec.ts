import { TestBed } from '@angular/core/testing';

import { Programas } from './programas';

describe('Programas', () => {
  let service: Programas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Programas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
