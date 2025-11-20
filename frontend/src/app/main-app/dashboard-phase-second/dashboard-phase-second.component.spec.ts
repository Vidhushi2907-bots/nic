import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPhaseSecondComponent } from './dashboard-phase-second.component';

describe('DashboardPhaseSecondComponent', () => {
  let component: DashboardPhaseSecondComponent;
  let fixture: ComponentFixture<DashboardPhaseSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPhaseSecondComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPhaseSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
