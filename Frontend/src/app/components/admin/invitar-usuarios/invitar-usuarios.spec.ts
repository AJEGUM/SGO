import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitarUsuarios } from './invitar-usuarios';

describe('InvitarUsuarios', () => {
  let component: InvitarUsuarios;
  let fixture: ComponentFixture<InvitarUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitarUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitarUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
