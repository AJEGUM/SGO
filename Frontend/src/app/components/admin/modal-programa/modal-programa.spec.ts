import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrograma } from './modal-programa';

describe('ModalPrograma', () => {
  let component: ModalPrograma;
  let fixture: ComponentFixture<ModalPrograma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPrograma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPrograma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
