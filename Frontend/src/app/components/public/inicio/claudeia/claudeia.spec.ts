import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Claudeia } from './claudeia';

describe('Claudeia', () => {
  let component: Claudeia;
  let fixture: ComponentFixture<Claudeia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Claudeia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Claudeia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
