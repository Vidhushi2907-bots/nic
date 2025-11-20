import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulsesseedLoginModuleComponent } from './pulsesseed-login-module.component';

describe('PulsesseedLoginModuleComponent', () => {
  let component: PulsesseedLoginModuleComponent;
  let fixture: ComponentFixture<PulsesseedLoginModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PulsesseedLoginModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulsesseedLoginModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
