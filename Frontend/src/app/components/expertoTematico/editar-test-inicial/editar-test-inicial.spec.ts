import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTestInicial } from './editar-test-inicial';

describe('EditarTestInicial', () => {
  let component: EditarTestInicial;
  let fixture: ComponentFixture<EditarTestInicial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarTestInicial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTestInicial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
