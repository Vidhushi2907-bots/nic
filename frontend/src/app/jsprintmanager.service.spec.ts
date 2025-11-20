import { TestBed } from '@angular/core/testing';

import { JsprintmanagerService } from './jsprintmanager.service';

describe('JsprintmanagerService', () => {
  let service: JsprintmanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsprintmanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
