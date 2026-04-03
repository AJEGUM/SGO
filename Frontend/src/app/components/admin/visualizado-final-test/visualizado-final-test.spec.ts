import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadoFinalTest } from './visualizado-final-test';

describe('VisualizadoFinalTest', () => {
  let component: VisualizadoFinalTest;
  let fixture: ComponentFixture<VisualizadoFinalTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizadoFinalTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizadoFinalTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
