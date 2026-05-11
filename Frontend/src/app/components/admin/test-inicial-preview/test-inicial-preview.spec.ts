import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInicialPreview } from './test-inicial-preview';

describe('TestInicialPreview', () => {
  let component: TestInicialPreview;
  let fixture: ComponentFixture<TestInicialPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInicialPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestInicialPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
