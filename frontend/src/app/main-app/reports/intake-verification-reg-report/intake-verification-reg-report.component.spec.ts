import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeVerificationRegReportComponent } from './intake-verification-reg-report.component';

describe('IntakeVerificationRegReportComponent', () => {
  let component: IntakeVerificationRegReportComponent;
  let fixture: ComponentFixture<IntakeVerificationRegReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeVerificationRegReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntakeVerificationRegReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
