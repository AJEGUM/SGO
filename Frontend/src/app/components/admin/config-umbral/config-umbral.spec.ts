import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigUmbral } from './config-umbral';

describe('ConfigUmbral', () => {
  let component: ConfigUmbral;
  let fixture: ComponentFixture<ConfigUmbral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigUmbral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigUmbral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
