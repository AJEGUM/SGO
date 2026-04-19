import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSemillaComponent } from './crear-semilla-component';

describe('CrearSemillaComponent', () => {
  let component: CrearSemillaComponent;
  let fixture: ComponentFixture<CrearSemillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSemillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSemillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
