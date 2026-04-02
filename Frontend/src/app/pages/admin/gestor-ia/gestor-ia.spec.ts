import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorIa } from './gestor-ia';

describe('GestorIa', () => {
  let component: GestorIa;
  let fixture: ComponentFixture<GestorIa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorIa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorIa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
