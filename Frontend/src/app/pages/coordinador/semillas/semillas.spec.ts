import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Semillas } from './semillas';

describe('Semillas', () => {
  let component: Semillas;
  let fixture: ComponentFixture<Semillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Semillas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Semillas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
