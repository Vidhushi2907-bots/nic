import { TestBed } from '@angular/core/testing';

import { ZsrmServiceService } from './zsrm-service.service';

describe('ZsrmServiceService', () => {
  let service: ZsrmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZsrmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
