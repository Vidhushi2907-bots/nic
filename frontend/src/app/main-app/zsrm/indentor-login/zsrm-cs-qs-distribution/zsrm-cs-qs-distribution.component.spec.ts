import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsrmCsQsDistributionComponent } from './zsrm-cs-qs-distribution.component';

describe('ZsrmCsQsDistributionComponent', () => {
  let component: ZsrmCsQsDistributionComponent;
  let fixture: ComponentFixture<ZsrmCsQsDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZsrmCsQsDistributionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZsrmCsQsDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
