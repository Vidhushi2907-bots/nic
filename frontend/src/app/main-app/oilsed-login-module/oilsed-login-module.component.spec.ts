import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilsedLoginModuleComponent } from './oilsed-login-module.component';

describe('OilsedLoginModuleComponent', () => {
  let component: OilsedLoginModuleComponent;
  let fixture: ComponentFixture<OilsedLoginModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OilsedLoginModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilsedLoginModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
