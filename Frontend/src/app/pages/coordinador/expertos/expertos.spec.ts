import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Expertos } from './expertos';

describe('Expertos', () => {
  let component: Expertos;
  let fixture: ComponentFixture<Expertos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expertos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Expertos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
