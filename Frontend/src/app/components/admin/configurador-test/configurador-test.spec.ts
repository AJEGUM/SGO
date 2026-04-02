import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguradorTest } from './configurador-test';

describe('ConfiguradorTest', () => {
  let component: ConfiguradorTest;
  let fixture: ComponentFixture<ConfiguradorTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguradorTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguradorTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
