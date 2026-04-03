import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorTest } from './visualizador-test';

describe('VisualizadorTest', () => {
  let component: VisualizadorTest;
  let fixture: ComponentFixture<VisualizadorTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizadorTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizadorTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
