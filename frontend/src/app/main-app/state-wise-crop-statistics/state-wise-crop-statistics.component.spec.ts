import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateWiseCropStatisticsComponent } from './state-wise-crop-statistics.component';

describe('StateWiseCropStatisticsComponent', () => {
  let component: StateWiseCropStatisticsComponent;
  let fixture: ComponentFixture<StateWiseCropStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateWiseCropStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateWiseCropStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
