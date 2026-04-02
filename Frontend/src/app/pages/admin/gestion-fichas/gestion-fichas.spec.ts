import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFichas } from './gestion-fichas';

describe('GestionFichas', () => {
  let component: GestionFichas;
  let fixture: ComponentFixture<GestionFichas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFichas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFichas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
