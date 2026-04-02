import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTest } from './modal-test';

describe('ModalTest', () => {
  let component: ModalTest;
  let fixture: ComponentFixture<ModalTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
