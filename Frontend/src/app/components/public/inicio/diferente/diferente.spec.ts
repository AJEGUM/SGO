import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Diferente } from './diferente';

describe('Diferente', () => {
  let component: Diferente;
  let fixture: ComponentFixture<Diferente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Diferente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Diferente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
