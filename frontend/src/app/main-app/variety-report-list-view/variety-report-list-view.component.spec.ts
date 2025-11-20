import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyReportListViewComponent } from './variety-report-list-view.component';

describe('VarietyReportListViewComponent', () => {
  let component: VarietyReportListViewComponent;
  let fixture: ComponentFixture<VarietyReportListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyReportListViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyReportListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
