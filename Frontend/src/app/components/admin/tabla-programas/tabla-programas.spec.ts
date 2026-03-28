import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaProgramas } from './tabla-programas';

describe('TablaProgramas', () => {
  let component: TablaProgramas;
  let fixture: ComponentFixture<TablaProgramas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaProgramas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaProgramas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
