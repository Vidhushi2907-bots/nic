import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRegisterForCertificationReportComponent } from './area-register-for-certification-report.component';

describe('AreaRegisterForCertificationReportComponent', () => {
  let component: AreaRegisterForCertificationReportComponent;
  let fixture: ComponentFixture<AreaRegisterForCertificationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaRegisterForCertificationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaRegisterForCertificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
