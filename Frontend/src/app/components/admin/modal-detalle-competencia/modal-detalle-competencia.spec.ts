import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleCompetencia } from './modal-detalle-competencia';

describe('ModalDetalleCompetencia', () => {
  let component: ModalDetalleCompetencia;
  let fixture: ComponentFixture<ModalDetalleCompetencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleCompetencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleCompetencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
