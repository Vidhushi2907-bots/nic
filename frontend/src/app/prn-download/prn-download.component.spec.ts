import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrnDownloadComponent } from './prn-download.component';

describe('PrnDownloadComponent', () => {
  let component: PrnDownloadComponent;
  let fixture: ComponentFixture<PrnDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrnDownloadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
