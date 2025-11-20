import { TestBed } from '@angular/core/testing';

import { SeedRollingPlanningService } from './seed-rolling-planning.service';

describe('SeedRollingPlanningService', () => {
  let service: SeedRollingPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeedRollingPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
