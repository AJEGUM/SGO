import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPrompt } from './config-prompt';

describe('ConfigPrompt', () => {
  let component: ConfigPrompt;
  let fixture: ComponentFixture<ConfigPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
