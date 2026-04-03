import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionExpertos } from './gestion-expertos';

describe('GestionExpertos', () => {
  let component: GestionExpertos;
  let fixture: ComponentFixture<GestionExpertos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionExpertos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionExpertos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
