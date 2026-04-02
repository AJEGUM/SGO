import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletarRegistro } from './completar-registro';

describe('CompletarRegistro', () => {
  let component: CompletarRegistro;
  let fixture: ComponentFixture<CompletarRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletarRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletarRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
