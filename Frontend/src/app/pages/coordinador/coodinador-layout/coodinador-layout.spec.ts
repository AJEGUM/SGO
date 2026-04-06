import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoodinadorLayout } from './coodinador-layout';

describe('CoodinadorLayout', () => {
  let component: CoodinadorLayout;
  let fixture: ComponentFixture<CoodinadorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoodinadorLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoodinadorLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
