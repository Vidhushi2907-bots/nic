import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarietyReportListComponent } from './variety-report-list.component';

describe('VarietyReportListComponent', () => {
  let component: VarietyReportListComponent;
  let fixture: ComponentFixture<VarietyReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VarietyReportListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VarietyReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
