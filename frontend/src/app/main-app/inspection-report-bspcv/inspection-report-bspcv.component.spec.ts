import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionReportBspcvComponent } from './inspection-report-bspcv.component';

describe('InspectionReportBspcvComponent', () => {
  let component: InspectionReportBspcvComponent;
  let fixture: ComponentFixture<InspectionReportBspcvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionReportBspcvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectionReportBspcvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
