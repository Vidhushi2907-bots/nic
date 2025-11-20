import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropWiseStatisticsComponent } from './crop-wise-statistics.component';

describe('CropWiseStatisticsComponent', () => {
  let component: CropWiseStatisticsComponent;
  let fixture: ComponentFixture<CropWiseStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CropWiseStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CropWiseStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
