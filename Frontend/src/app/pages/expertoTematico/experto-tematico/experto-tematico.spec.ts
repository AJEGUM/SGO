import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertoTematico } from './experto-tematico';

describe('ExpertoTematico', () => {
  let component: ExpertoTematico;
  let fixture: ComponentFixture<ExpertoTematico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertoTematico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertoTematico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
