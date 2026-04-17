import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCurricularProgramas } from './detalle-curricular-programas';

describe('DetalleCurricularProgramas', () => {
  let component: DetalleCurricularProgramas;
  let fixture: ComponentFixture<DetalleCurricularProgramas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCurricularProgramas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCurricularProgramas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
