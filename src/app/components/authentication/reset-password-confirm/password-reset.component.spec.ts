import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordConfirmComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  let component: ResetPasswordConfirmComponent;
  let fixture: ComponentFixture<ResetPasswordConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
