import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigIntentosTest } from './config-intentos-test';

describe('ConfigIntentosTest', () => {
  let component: ConfigIntentosTest;
  let fixture: ComponentFixture<ConfigIntentosTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigIntentosTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigIntentosTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
