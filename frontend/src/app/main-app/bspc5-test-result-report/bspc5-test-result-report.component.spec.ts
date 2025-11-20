import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bspc5TestResultReportComponent } from './bspc5-test-result-report.component';

describe('Bspc5TestResultReportComponent', () => {
  let component: Bspc5TestResultReportComponent;
  let fixture: ComponentFixture<Bspc5TestResultReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Bspc5TestResultReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bspc5TestResultReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
