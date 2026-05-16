import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTest } from './visualizar-test';

describe('VisualizarTest', () => {
  let component: VisualizarTest;
  let fixture: ComponentFixture<VisualizarTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
