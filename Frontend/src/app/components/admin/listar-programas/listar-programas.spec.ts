import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProgramas } from './listar-programas';

describe('ListarProgramas', () => {
  let component: ListarProgramas;
  let fixture: ComponentFixture<ListarProgramas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarProgramas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProgramas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
