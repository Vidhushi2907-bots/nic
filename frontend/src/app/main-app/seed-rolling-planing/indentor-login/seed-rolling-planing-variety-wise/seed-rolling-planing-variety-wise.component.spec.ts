import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedRollingPlaningVarietyWiseComponent } from './seed-rolling-planing-variety-wise.component';

describe('SeedRollingPlaningVarietyWiseComponent', () => {
  let component: SeedRollingPlaningVarietyWiseComponent;
  let fixture: ComponentFixture<SeedRollingPlaningVarietyWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedRollingPlaningVarietyWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedRollingPlaningVarietyWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
