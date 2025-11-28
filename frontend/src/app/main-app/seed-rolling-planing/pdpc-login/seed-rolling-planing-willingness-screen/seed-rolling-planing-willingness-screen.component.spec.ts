import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedRollingPlaningWillingnessScreenComponent } from './seed-rolling-planing-willingness-screen.component';

describe('SeedRollingPlaningWillingnessScreenComponent', () => {
  let component: SeedRollingPlaningWillingnessScreenComponent;
  let fixture: ComponentFixture<SeedRollingPlaningWillingnessScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeedRollingPlaningWillingnessScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedRollingPlaningWillingnessScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
