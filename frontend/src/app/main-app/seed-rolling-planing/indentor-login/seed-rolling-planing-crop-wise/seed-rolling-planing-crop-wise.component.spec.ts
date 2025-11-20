import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedRollingPlaningCropWiseComponent } from './seed-rolling-planing-crop-wise.component';

describe('SeedRollingPlaningCropWiseComponent', () => {
  let component: SeedRollingPlaningCropWiseComponent;
  let fixture: ComponentFixture<SeedRollingPlaningCropWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedRollingPlaningCropWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedRollingPlaningCropWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
